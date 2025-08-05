import Database from 'better-sqlite3'
import path from 'path'

const dbPath = path.join(process.cwd(), 'family-tree.db')
const db = new Database(dbPath)

db.pragma('foreign_keys = ON')

db.exec(`
  CREATE TABLE IF NOT EXISTS family_members (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    surname TEXT NOT NULL,
    totem TEXT,
    date_of_birth TEXT,
    date_of_death TEXT,
    picture_url TEXT,
    x_position INTEGER NOT NULL DEFAULT 0,
    y_position INTEGER NOT NULL DEFAULT 0,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS family_relationships (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    parent_id INTEGER,
    child_id INTEGER,
    relationship_type TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(parent_id) REFERENCES family_members(id),
    FOREIGN KEY(child_id) REFERENCES family_members(id)
  );

  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    role TEXT DEFAULT 'user',
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  );
`)

console.log("✅ Database initialized.")
