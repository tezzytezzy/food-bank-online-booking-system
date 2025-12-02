-- Food Bank Ticketing System Schema

-- 1. Users: The actual people logging in (Staff/Volunteers)
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    full_name TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 2. Organisations: The entity (Food Bank)
CREATE TABLE organisations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    city TEXT NOT NULL,
    state TEXT NOT NULL,
    country TEXT NOT NULL,
    website TEXT,
    email TEXT, -- General contact email for the org
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 3. Memberships: Linking Users to Organisations with a Role
CREATE TABLE org_members (
    user_id INTEGER NOT NULL,
    org_id INTEGER NOT NULL,
    role TEXT DEFAULT 'member', -- 'admin', 'coordinator', 'viewer'
    joined_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (org_id) REFERENCES organisations(id),
    PRIMARY KEY (user_id, org_id)
);

-- 4. Invitations: Pending invites for new members
CREATE TABLE invitations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    org_id INTEGER NOT NULL,
    email TEXT NOT NULL,
    role TEXT NOT NULL,
    token TEXT NOT NULL UNIQUE,
    expires_at DATETIME NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (org_id) REFERENCES organisations(id)
);

-- 5. Templates: Recurring session templates
CREATE TABLE templates (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    org_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    ticket_type TEXT NOT NULL,
    additional_info TEXT,
    tickets_per_period INTEGER,
    num_periods INTEGER,
    start_time TEXT,
    status TEXT DEFAULT 'active',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (org_id) REFERENCES organisations(id)
);

-- 6. Sessions: Individual scheduled sessions based on templates
CREATE TABLE sessions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    template_id INTEGER NOT NULL,
    date TEXT NOT NULL,
    status TEXT DEFAULT 'active', -- 'active', 'cancelled', 'completed'
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (template_id) REFERENCES templates(id)
);
