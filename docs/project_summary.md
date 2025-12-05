# Project Summary: FoodBank Connect (Wireframe/Prototype)

## Overview
This project is a high-fidelity wireframe/prototype for an online food bank ticketing system. It demonstrates the core workflows for organisations to manage their sessions and for users to view available slots. The project is built using **HTML, CSS, and Vanilla JavaScript**, powered by **Vite**.

## Key Features Implemented

### 1. Public Interface
-   **Landing Page (`index.html`)**:
    -   Displays a list of upcoming food bank sessions.
    -   Includes a filtering interface for Location (Country, State/Province, City).
    -   "Organisation Sign-in/up" entry point.

### 2. Organisation Management
-   **Authentication (`org-auth.html`)**:
    -   Tabbed interface for **Sign In** and **Register Organisation**.
    -   Registration captures details like Name, Email, Website, and Location.
-   **Dashboard (`dashboard.html`)**:
    -   Central hub for logged-in organisations.
    -   **Recurring Templates**: View, Edit, and Delete templates for recurring events.
    -   **Scheduled Sessions**: View upcoming and past sessions with status indicators (Active, Completed).

### 3. Session & Template Management
-   **Template Management (`template-form.html`)**:
    -   Form to create or edit session templates.
    -   Fields for Name, Ticket Type, Start Time, Capacity (Tickets per period), and Instructions.
-   **Session Scheduling (`session-form.html`)**:
    -   Form to schedule specific sessions based on existing templates.
    -   Allows setting the Date and Status (Active, Cancelled, Completed).

### 4. Team Management (In Progress)
-   **Team Management (`team-management.html`)**:
    -   Interface for inviting new members and managing existing staff/volunteers.
-   **Invite Workflow (`accept-invite.html`)**:
    -   Flow for new users to accept email invitations and create their accounts.

## Technical Architecture
-   **Frontend**: Plain HTML5, CSS3 (custom styling), and ES Modules.
-   **Build Tool**: Vite for fast development and bundling.
-   **Data**: Currently uses static mock data within HTML files. Future implementation plans include a mock backend using `localStorage` to simulate database operations.
-   **Styling**: Custom CSS variables for consistent theming (colors, spacing, radius).

## File Structure
-   `/`: Root HTML files for each page.
-   `/src`: Source code for logic (`main.js`, `mock-backend.js` - planned) and styles (`style.css`).
-   `/public`: Static assets.
-   `invite_workflow.md`: Documentation for the invitation logic.
-   `schema.sql`: Proposed database schema for the backend.
