# The Workflow: From Invite to Access

This document outlines the step-by-step process for the "Invite via Email" feature, which allows organisations to add members with their own unique credentials.

### 1. The Admin Initiates the Invite
*   **Where**: The Admin (e.g., the Food Bank Manager) logs in and navigates to a **"Team Management"** section on their Dashboard.
*   **Action**: They click an **"Invite Member"** button.
*   **Input**: A modal appears asking for:
    *   **Email Address**: `volunteer@gmail.com`
    *   **Role**: They select "Coordinator" (or "Admin", "Viewer").
*   **Trigger**: They click **"Send Invitation"**.

### 2. The System Processes the Request (Behind the Scenes)
*   **Validation**: The system checks if this email is *already* a member of this specific organisation to prevent duplicates.
*   **Token Generation**: The system generates a unique, secure **Invite Token** (a long random string of characters, e.g., `abc-123-xyz`).
*   **Storage**: This token is saved in a database table (e.g., `invitations`) linked to the specific Organisation ID and the email address, with an expiration time (usually 48 hours).
*   **Email Delivery**: The system sends an email to `volunteer@gmail.com`.

### 3. The Invitee Receives the Email
*   **Inbox**: The volunteer receives an email with the subject: *"Join [Food Bank Name] on FoodBank Connect"*.
*   **Content**: "Hello! [Admin Name] has invited you to manage sessions for [Food Bank Name]. Click below to get started."
*   **The Link**: The button in the email points to a specific URL containing the secure token:
    `https://app.foodbankconnect.com/accept-invite?token=abc-123-xyz`

### 4. The Invitee Clicks the Link
When the volunteer clicks the link, the browser opens your app. The system checks the token. One of two things happens:

**Scenario A: They are a New User (No account yet)**
*   **Screen**: They see a **"Create Your Account"** page.
*   **Pre-filled**: The email field is already filled in and locked (for security, so they can't claim an invite meant for someone else).
*   **Action**: They enter their **Full Name** and create a **Password**.
*   **Submit**: They click "Create Account & Join".

**Scenario B: They are an Existing User (Already help another food bank)**
*   **Screen**: They see a **"Login to Accept"** page.
*   **Action**: They enter their existing password.
*   **Confirmation**: A prompt asks, *"Do you want to join [Food Bank Name] as a Coordinator?"*
*   **Submit**: They click "Accept Invite".

### 5. Access Granted
*   **Database Update**: The system creates a new record in the `org_members` table linking this User ID to this Organisation ID.
*   **Cleanup**: The Invite Token is marked as "used" or deleted so it cannot be used again.
*   **Redirect**: The user is immediately dropped into the **Organisation Dashboard**, ready to work.

### Why this is better
1.  **Security**: You never share passwords. Each person has their own.
2.  **Revocability**: If a volunteer stops coming, the Admin just clicks "Remove" next to their name in the Team list. That specific user loses access immediately, but everyone else can keep working without changing the password.
3.  **Audit Trails**: Later, if a session is accidentally deleted, the system logs will show exactly *who* did it (e.g., "Deleted by Sarah"), rather than just "Deleted by Admin".
