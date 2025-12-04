import './style.css'
import { supabase } from './lib/supabase.js'

// --- Routing & Initialization ---

const path = window.location.pathname

async function init() {
  if (path.includes('org-auth.html')) {
    handleAuth()
  } else {
    // Protect other routes
    if (path !== '/' && !path.includes('index.html')) {
      await checkAuth()
    }

    if (path.includes('dashboard.html')) {
      await renderDashboard()
    } else if (path.includes('team-management.html')) {
      await renderTeam()
    } else if (path.includes('template-form.html')) {
      await handleTemplateForm()
    } else if (path.includes('session-form.html')) {
      await handleSessionForm()
    } else if (path === '/' || path.includes('index.html')) {
      await renderPublicSessions()
    }
  }
}

init()

// --- Auth Functions ---

async function checkAuth() {
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) {
    window.location.href = 'org-auth.html'
  }
}

async function handleAuth() {
  const signinForm = document.getElementById('signin-form-el')
  const signupForm = document.getElementById('signup-form-el')

  if (signinForm) {
    signinForm.addEventListener('submit', async (e) => {
      e.preventDefault()
      const email = document.getElementById('signin-email').value
      const password = document.getElementById('signin-password').value

      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) alert('Error signing in: ' + error.message)
      else window.location.href = 'dashboard.html'
    })
  }

  if (signupForm) {
    signupForm.addEventListener('submit', async (e) => {
      e.preventDefault()
      const email = document.getElementById('signup-email').value
      const password = document.getElementById('signup-password').value
      const orgName = document.getElementById('signup-org-name').value
      const website = document.getElementById('signup-website').value
      const city = document.getElementById('signup-city').value
      const state = document.getElementById('signup-state').value
      const country = document.getElementById('signup-country').value

      // 1. Sign Up User
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password
      })

      if (authError) {
        alert('Error signing up: ' + authError.message)
        return
      }

      // 2. Create Organization
      const { data: org, error: orgError } = await supabase
        .from('organisations')
        .insert([{
          name: orgName,
          website,
          city,
          state,
          country,
          email // Contact email same as admin email for now
        }])
        .select()
        .single()

      if (orgError) {
        alert('Error creating organization: ' + orgError.message)
        return
      }

      // 3. Create User Record (in public.users table)
      const { error: userError } = await supabase
        .from('users')
        .insert([{
          email,
          password_hash: 'managed_by_supabase_auth', // Placeholder
          full_name: orgName + ' Admin' // Placeholder
        }])
        .select()
        .single()

      // Note: Ideally we'd get the user ID from the public.users table insert, 
      // but we need to link the Supabase Auth ID to our public.users table.
      // For this wireframe, we'll assume the public.users table is for app-specific user data.
      // We need to fetch the user we just created to get its ID.
      const { data: newUser } = await supabase.from('users').select('id').eq('email', email).single()

      if (newUser) {
        // 4. Link User to Org as Admin
        const { error: memberError } = await supabase
          .from('org_members')
          .insert([{
            user_id: newUser.id,
            org_id: org.id,
            role: 'admin'
          }])

        if (memberError) console.error('Error linking member:', memberError)
      }

      alert('Registration successful! Please sign in.')
      window.location.reload()
    })
  }
}

async function signOut() {
  await supabase.auth.signOut()
  window.location.href = 'org-auth.html'
}

// Expose signOut to window for the button in header
window.signOut = signOut

// --- Helper: Get Current User's Org ---

async function getCurrentOrgId() {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  // Find the user in our public.users table
  const { data: publicUser } = await supabase.from('users').select('id').eq('email', user.email).single()

  if (publicUser) {
    const { data: member } = await supabase
      .from('org_members')
      .select('org_id')
      .eq('user_id', publicUser.id)
      .single()
    return member?.org_id
  }
  return null
}


// --- Dashboard Functions ---

async function renderDashboard() {
  const templatesList = document.getElementById('templates-list')
  const sessionsList = document.getElementById('sessions-list')
  const orgId = await getCurrentOrgId()

  if (!orgId) {
    if (templatesList) templatesList.innerHTML = '<p>No organization found.</p>'
    if (sessionsList) sessionsList.innerHTML = '<p>No organization found.</p>'
    return
  }

  if (templatesList) {
    const { data: templates, error } = await supabase
      .from('templates')
      .select('*')
      .eq('org_id', orgId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching templates:', error)
      templatesList.innerHTML = '<p>Error loading templates.</p>'
    } else if (templates.length === 0) {
      templatesList.innerHTML = '<p>No templates found.</p>'
    } else {
      templatesList.innerHTML = templates.map(t => `
        <div class="list-item">
            <div>
                <h3>${t.name}</h3>
                <p>${t.tickets_per_period} Tickets, ${t.num_periods} Periods</p>
            </div>
            <div class="list-item-actions">
                <a href="template-form.html?id=${t.id}" class="icon-btn" aria-label="Edit">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                </a>
                <button class="icon-btn delete" onclick="deleteTemplate(${t.id})" aria-label="Delete">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                </button>
            </div>
        </div>
      `).join('')
    }
  }

  if (sessionsList) {
    // We need to filter sessions by templates belonging to this org
    // Or we can join templates and filter
    const { data: sessions, error } = await supabase
      .from('sessions')
      .select('*, templates!inner(name, org_id)')
      .eq('templates.org_id', orgId)
      .order('date', { ascending: true })

    if (error) {
      console.error('Error fetching sessions:', error)
      sessionsList.innerHTML = '<p>Error loading sessions.</p>'
    } else if (sessions.length === 0) {
      sessionsList.innerHTML = '<p>No scheduled sessions.</p>'
    } else {
      sessionsList.innerHTML = sessions.map(s => `
        <div class="list-item">
            <div>
                <h3>${s.date}</h3>
                <p>${s.templates?.name || 'Unknown Template'} 
                   <span style="color: var(--color-primary-light); font-weight: bold; margin-left: 0.5rem;">${s.status}</span>
                </p>
            </div>
            <div class="list-item-actions">
                <a href="session-form.html?id=${s.id}" class="icon-btn" aria-label="Edit">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                </a>
                <button class="icon-btn delete" onclick="deleteSession(${s.id})" aria-label="Delete">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                </button>
            </div>
        </div>
      `).join('')
    }
  }

  // Update Sign Out link
  const signOutBtn = document.querySelector('a[href="index.html"].btn-secondary')
  if (signOutBtn && signOutBtn.textContent === 'Sign Out') {
    signOutBtn.href = "#"
    signOutBtn.onclick = (e) => {
      e.preventDefault()
      signOut()
    }
  }
}

window.deleteTemplate = async (id) => {
  if (!confirm('Are you sure you want to delete this template?')) return
  const { error } = await supabase.from('templates').delete().eq('id', id)
  if (error) alert('Error deleting template: ' + error.message)
  else renderDashboard()
}

window.deleteSession = async (id) => {
  if (!confirm('Are you sure you want to delete this session?')) return
  const { error } = await supabase.from('sessions').delete().eq('id', id)
  if (error) alert('Error deleting session: ' + error.message)
  else renderDashboard()
}

// --- Team Management Functions ---

async function renderTeam() {
  const invitationsList = document.getElementById('invitations-list')
  const orgId = await getCurrentOrgId()

  if (invitationsList && orgId) {
    const { data: invitations, error } = await supabase
      .from('invitations')
      .select('*')
      .eq('org_id', orgId)

    if (error) {
      console.error('Error fetching invitations:', error)
    } else {
      invitationsList.innerHTML = invitations.map(i => `
            <div class="list-item">
                <div>
                    <p><strong>${i.email}</strong></p>
                    <p class="text-secondary">Role: ${i.role}</p>
                </div>
                <div style="display: flex; align-items: center; gap: 1rem;">
                    <span class="badge badge-pending">Pending</span>
                    <button class="icon-btn delete" onclick="deleteInvitation(${i.id})" aria-label="Revoke">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                    </button>
                </div>
            </div>
        `).join('')
    }
  }
}

window.deleteInvitation = async (id) => {
  if (!confirm('Revoke this invitation?')) return
  const { error } = await supabase.from('invitations').delete().eq('id', id)
  if (error) alert('Error revoking invitation: ' + error.message)
  else renderTeam()
}

window.sendInvitation = async (event) => {
  event.preventDefault()
  const email = document.getElementById('invite-email').value
  const role = document.getElementById('invite-role').value
  const orgId = await getCurrentOrgId()

  if (!orgId) {
    alert('Organization not found.')
    return
  }

  const { error } = await supabase.from('invitations').insert([{
    org_id: orgId,
    email,
    role,
    token: Math.random().toString(36).substring(7), // Mock token
    expires_at: new Date(Date.now() + 86400000).toISOString() // 24 hours
  }])

  if (error) {
    alert('Error sending invitation: ' + error.message)
  } else {
    alert('Invitation sent!')
    window.closeModal()
    renderTeam()
  }
}

// --- Template Form Functions ---

async function handleTemplateForm() {
  const urlParams = new URLSearchParams(window.location.search)
  const id = urlParams.get('id')

  if (id) {
    const { data: template, error } = await supabase
      .from('templates')
      .select('*')
      .eq('id', id)
      .single()

    if (template) {
      document.getElementById('template-name').value = template.name
      document.getElementById('ticket-type').value = template.ticket_type
      document.getElementById('start-time').value = template.start_time
      document.getElementById('tickets-per-period').value = template.tickets_per_period
      document.getElementById('num-periods').value = template.num_periods
      document.getElementById('additional-info').value = template.additional_info || ''
    }
  }

  document.querySelector('form').onsubmit = async (e) => {
    e.preventDefault()
    const orgId = await getCurrentOrgId()

    if (!orgId) {
      alert('Organization not found.')
      return
    }

    const formData = {
      org_id: orgId,
      name: document.getElementById('template-name').value,
      ticket_type: document.getElementById('ticket-type').value,
      start_time: document.getElementById('start-time').value,
      tickets_per_period: document.getElementById('tickets-per-period').value,
      num_periods: document.getElementById('num-periods').value,
      additional_info: document.getElementById('additional-info').value
    }

    let error
    if (id) {
      ({ error } = await supabase.from('templates').update(formData).eq('id', id))
    } else {
      ({ error } = await supabase.from('templates').insert([formData]))
    }

    if (error) alert('Error saving template: ' + error.message)
    else window.location.href = 'dashboard.html'
  }
}

// --- Session Form Functions ---

async function handleSessionForm() {
  const templateSelect = document.getElementById('template-select')
  const orgId = await getCurrentOrgId()

  if (orgId) {
    // Populate templates
    const { data: templates } = await supabase.from('templates').select('id, name').eq('org_id', orgId)
    if (templates) {
      templateSelect.innerHTML = templates.map(t => `<option value="${t.id}">${t.name}</option>`).join('')
    }
  }

  const urlParams = new URLSearchParams(window.location.search)
  const id = urlParams.get('id')

  if (id) {
    const { data: session } = await supabase
      .from('sessions')
      .select('*')
      .eq('id', id)
      .single()

    if (session) {
      templateSelect.value = session.template_id
      document.getElementById('session-date').value = session.date
      document.getElementById('session-status').value = session.status
    }
  }

  document.querySelector('form').onsubmit = async (e) => {
    e.preventDefault()

    const formData = {
      template_id: templateSelect.value,
      date: document.getElementById('session-date').value,
      status: document.getElementById('session-status').value
    }

    let error
    if (id) {
      ({ error } = await supabase.from('sessions').update(formData).eq('id', id))
    } else {
      ({ error } = await supabase.from('sessions').insert([formData]))
    }

    if (error) alert('Error saving session: ' + error.message)
    else window.location.href = 'dashboard.html'
  }
}

// --- Public Sessions Functions ---

async function renderPublicSessions() {
  const sessionsList = document.getElementById('sessions-list')

  if (sessionsList) {
    const { data: sessions, error } = await supabase
      .from('sessions')
      .select('*, templates(name, org_id, organisations(city, state))')
      .eq('status', 'active')

    if (error) {
      console.error('Error fetching public sessions:', error)
      sessionsList.innerHTML = '<p>Error loading sessions.</p>'
    } else if (sessions.length === 0) {
      sessionsList.innerHTML = '<p>No upcoming sessions found.</p>'
    } else {
      sessionsList.innerHTML = sessions.map(s => `
        <div class="card">
            <h3>${s.templates?.name || 'Food Bank Session'}</h3>
            <p><strong>Date:</strong> ${s.date}</p>
            <p><strong>Location:</strong> ${s.templates?.organisations?.city || 'Unknown'}, ${s.templates?.organisations?.state || ''}</p>
            <div style="margin-top: 1rem;">
              <button class="btn btn-secondary">View Details</button>
            </div>
        </div>
      `).join('')
    }
  }
}
