import Database from "better-sqlite3"
import path from "path"

const dbPath = path.join(process.cwd(), "family-tree.db")
const db = new Database(dbPath)

// Enable foreign keys
db.pragma("foreign_keys = ON")

export interface FamilyMember {
  id: number
  name: string
  surname: string
  totem?: string
  date_of_birth?: string
  date_of_death?: string
  picture_url?: string
  x_position: number
  y_position: number
  created_at: string
  updated_at: string
}

export interface FamilyRelationship {
  id: number
  parent_id: number
  child_id: number
  relationship_type: string
  created_at: string
}

export interface User {
  id: number
  email: string
  role: string
  created_at: string
}

// Family Members CRUD operations
export const familyMemberQueries = {
  getAll: db.prepare("SELECT * FROM family_members ORDER BY surname, name"),
  getById: db.prepare("SELECT * FROM family_members WHERE id = ?"),
  create: db.prepare(`
    INSERT INTO family_members (name, surname, totem, date_of_birth, date_of_death, picture_url, x_position, y_position)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `),
  update: db.prepare(`
    UPDATE family_members 
    SET name = ?, surname = ?, totem = ?, date_of_birth = ?, date_of_death = ?, picture_url = ?, x_position = ?, y_position = ?, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `),
  updatePosition: db.prepare(`
    UPDATE family_members 
    SET x_position = ?, y_position = ?, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `),
  delete: db.prepare("DELETE FROM family_members WHERE id = ?"),
}

// Relationships CRUD operations
export const relationshipQueries = {
  getAll: db.prepare("SELECT * FROM family_relationships"),
  getByMember: db.prepare(`
    SELECT fr.*, 
           p.name as parent_name, p.surname as parent_surname,
           c.name as child_name, c.surname as child_surname
    FROM family_relationships fr
    JOIN family_members p ON fr.parent_id = p.id
    JOIN family_members c ON fr.child_id = c.id
    WHERE fr.parent_id = ? OR fr.child_id = ?
  `),
  create: db.prepare("INSERT INTO family_relationships (parent_id, child_id, relationship_type) VALUES (?, ?, ?)"),
  delete: db.prepare("DELETE FROM family_relationships WHERE id = ?"),
  deleteByMembers: db.prepare("DELETE FROM family_relationships WHERE parent_id = ? AND child_id = ?"),
}

// User operations
export const userQueries = {
  getByEmail: db.prepare("SELECT * FROM users WHERE email = ?"),
  create: db.prepare("INSERT INTO users (email, password_hash, role) VALUES (?, ?, ?)"),
}

export default db
