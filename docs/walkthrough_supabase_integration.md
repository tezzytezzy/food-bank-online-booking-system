# Walkthrough - Supabase Integration

I have successfully integrated Supabase into the Online QR-Code Ticketing System. The application now persists data to the cloud database instead of using mock data.

## Changes Implemented

-   **Database**: Applied the schema to your Supabase project.
-   **Dependencies**: Installed `@supabase/supabase-js`.
-   **Client**: Created `src/lib/supabase.js` to initialize the connection.
-   **Logic**: Updated `src/main.js` to handle:
    -   Fetching and displaying Templates and Sessions on the Dashboard.
    -   Creating and Editing Templates.
    -   Scheduling Sessions.
    -   Fetching and displaying Public Sessions on the landing page.
    -   Managing Team Invitations.
-   **UI**: Updated HTML files (`index.html`, `pages/dashboard.html`, `pages/team-management.html`, `pages/template-form.html`, `pages/session-form.html`) with IDs to allow JavaScript to inject data.

## How to Verify

### 1. Start the Development Server
Run the following command in your terminal:
```bash
npm run dev
```
Open the provided localhost URL in your browser.

### 2. Public Landing Page (`index.html`)
-   Initially, it will say "No upcoming sessions found." because the database is empty.
-   Once you create sessions (see below), they will appear here.

### 3. Dashboard Access (Auth Required)
-   Navigate to `/pages/dashboard.html`. You should be redirected to `/pages/org-auth.html`.
-   **Sign Up**:
    -   Click "Register Org".
    -   Fill in the details (Org Name, Full Name, Email, Password, etc.).
    -   Click "Create Account".
    -   You should be alerted of success and the page will reload.
-   **Sign In**:
    -   Enter the email and password you just registered with.
    -   Click "Sign In".
    -   You should be redirected to the Dashboard.

### 4. Create a Template
-   Click **"+ Create Template"**.
-   Fill in the form.
-   Click **"Save Template"**.
-   Verify it appears on the dashboard.

### 5. Schedule a Session
-   Click **"+ Schedule Session"**.
-   Select the template you created.
-   Click **"Schedule Session"**.
-   Verify it appears on the dashboard.

### 6. Verify Public Page Again
-   Go back to the landing page (`index.html`).
-   The session you just scheduled should now be visible.

### 7. Team Management
-   From the Dashboard, click **"Manage Team"**.
-   Click **"+ Invite Member"**.
-   Enter an email and select a role.
-   Click **"Send Invitation"**.
-   **Simulation**: An alert will appear with an **Invitation Link**. Copy this link.
-   **Accept Invite**:
    -   Paste the link into a new tab (or log out first).
    -   You will see the invitation details.
    -   Fill in the "Create Account" form.
    -   Click **"Create Account & Join"**.
    -   **Magic Link**: Supabase will send a confirmation email to the address you entered.
    -   Since this is a real Supabase project, check the email inbox for the "Confirm your signup" link.
    -   Clicking that link will confirm the account and log you in.
-   **Verify Active Members**:
    -   After the new user joins, refresh the "Manage Team" page.
    -   The new member should now appear in the "Active Members" list.

## Notes
-   Since we don't have a full authentication flow yet, I've mocked the "Current Organisation" logic to automatically create/use a default organisation ("My Food Bank") when you perform actions.
-   The "Delete" buttons on the dashboard will prompt for confirmation before deleting data from Supabase.
