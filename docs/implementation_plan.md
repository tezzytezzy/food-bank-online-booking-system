# Implementation Plan - Team Management & Invite Workflow

## Goal Description
Implement the "Invite via Email" workflow and "Team Management" interface for the Food Bank Online Booking System. This involves creating the frontend interactions for inviting members, managing team lists, and accepting invitations, as detailed in `invite_workflow.md`.

## User Review Required
> [!NOTE]
> **Backend Simulation**: Since this is a "wireframe-first" project, backend logic (database interactions, email sending, token generation) will be **mocked** using JavaScript and `localStorage` to demonstrate the flow without a real server.
>
> **Security**: The current implementation is for demonstration/prototyping. Real security (hashing, secure tokens) will need a proper backend implementation later.

## Proposed Changes

### Frontend - Team Management
#### [MODIFY] [team-management.html](file:///home/tezza/Desktop/PROJECT/online-booking/antigravity-wireframe-first/team-management.html)
- Implement "Invite Member" button and Modal.
- Create a form for Email and Role selection.
- Render a list of current members (mocked).
- Add "Remove" functionality for members.

### Frontend - Accept Invite
#### [MODIFY] [accept-invite.html](file:///home/tezza/Desktop/PROJECT/online-booking/antigravity-wireframe-first/accept-invite.html)
- Implement logic to parse the `token` from the URL.
- Create "Create Account" form (Scenario A).
- Create "Login to Accept" form (Scenario B).
- Handle form submissions and redirect to Dashboard.

### Logic & State Management
#### [NEW] [src/mock-backend.js](file:///home/tezza/Desktop/PROJECT/online-booking/antigravity-wireframe-first/src/mock-backend.js)
- Create a mock service to simulate database operations defined in `schema.sql`.
- Methods:
    - `getOrgMembers(orgId)`
    - `createInvitation(orgId, email, role)`
    - `validateToken(token)`
    - `acceptInvitation(token, userDetails)`
- Use `localStorage` to persist data across page reloads.

#### [NEW] [src/invite-flow.js](file:///home/tezza/Desktop/PROJECT/online-booking/antigravity-wireframe-first/src/invite-flow.js)
- Handle UI interactions for `team-management.html`.
- Handle UI interactions for `accept-invite.html`.

## Verification Plan

### Manual Verification
1.  **Invite Flow**:
    -   Open `team-management.html`.
    -   Click "Invite Member", enter `test@example.com`, select "Coordinator".
    -   Click "Send". Verify alert/notification.
    -   (Mock) Copy the generated link (logged to console or displayed).
2.  **Accept Flow**:
    -   Open the generated link (e.g., `accept-invite.html?token=...`).
    -   Verify "Create Account" form appears.
    -   Fill form and submit.
    -   Verify redirect to `dashboard.html`.
3.  **Persistence**:
    -   Return to `team-management.html`.
    -   Verify the new user appears in the list.
