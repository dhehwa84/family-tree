-- Create the family_members table
CREATE TABLE IF NOT EXISTS family_members (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    surname TEXT NOT NULL,
    totem TEXT,
    date_of_birth DATE,
    date_of_death DATE,
    picture_url TEXT,
    x_position REAL DEFAULT 0,
    y_position REAL DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Create the relationships table for family connections
CREATE TABLE IF NOT EXISTS family_relationships (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    parent_id INTEGER NOT NULL,
    child_id INTEGER NOT NULL,
    relationship_type TEXT DEFAULT 'parent-child',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (parent_id) REFERENCES family_members(id) ON DELETE CASCADE,
    FOREIGN KEY (child_id) REFERENCES family_members(id) ON DELETE CASCADE,
    UNIQUE(parent_id, child_id)
);

-- Create users table for authentication
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role TEXT DEFAULT 'user',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Insert admin user (you'll need to update the password hash)
INSERT OR IGNORE INTO users (email, role, password_hash) 
VALUES ('admin@example.com', 'admin', '$2a$12$dummy.hash.replace.with.real.hash');

-- Create some sample family members
INSERT OR IGNORE INTO family_members (name, surname, totem, date_of_birth, x_position, y_position) VALUES
('John', 'Smith', 'Eagle', '1950-01-15', 250, 100),
('Mary', 'Smith', 'Wolf', '1952-03-20', 450, 100),
('Robert', 'Smith', 'Bear', '1975-07-10', 150, 300),
('Sarah', 'Smith', 'Owl', '1977-11-05', 350, 300),
('Michael', 'Smith', 'Fox', '2000-09-12', 100, 500),
('Emily', 'Smith', 'Deer', '2002-12-18', 250, 500);

-- Create sample relationships
INSERT OR IGNORE INTO family_relationships (parent_id, child_id) VALUES
(1, 3), -- John -> Robert
(2, 3), -- Mary -> Robert
(1, 4), -- John -> Sarah
(2, 4), -- Mary -> Sarah
(3, 5), -- Robert -> Michael
(4, 6); -- Sarah -> Emily
