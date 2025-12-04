import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://usmdmqtncmaanputmdno.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVzbWRtcXRuY21hYW5wdXRtZG5vIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI0NDA3MDUsImV4cCI6MjA3ODAxNjcwNX0.4-MHkEcDebVGz3q1Xa2r7ddMAdG0TgUXynM01soHY8w'

export const supabase = createClient(supabaseUrl, supabaseKey)
