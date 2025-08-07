import bcrypt from "bcryptjs";
import Database from "better-sqlite3";
import path from "path";
import fs from "fs";

// Path to your SQLite DB
const dbPath = path.resolve(process.cwd(), "family-tree.db");

// Ensure db file exists
if (!fs.existsSync(dbPath)) {
  console.error("❌ Database file not found at:", dbPath);
  process.exit(1);
}

const db = new Database(dbPath);

const email = "dhehwa84@gmail.com";
const plainPassword = "Safety@135";
const role = "admin"; // or "user"

async function seed() {
  const password_hash = await bcrypt.hash(plainPassword, 12);

  const stmt = db.prepare(`
    INSERT INTO users (email, password_hash, role)
    VALUES (?, ?, ?)
  `);

  try {
    stmt.run(email, password_hash, role);
    console.log(`✅ User created: ${email}`);
  }  catch (error) {
    if (error instanceof Error) {
      console.error("❌ Failed to seed user:", error.message);
    } else {
      console.error("❌ Failed to seed user:", error);
    }
  }
}

seed();
