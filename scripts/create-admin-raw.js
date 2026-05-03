const Database = require('better-sqlite3');
const bcrypt = require('bcryptjs');
const { randomBytes } = require('crypto');

// Simple CUID-like ID generator (just for the script)
const generateId = () => randomBytes(12).toString('hex');

async function main() {
  const db = new Database('./dev.db');
  
  const email = 'admin@fillform.info';
  const username = 'admin';
  const password = 'admin123';
  const hashedPassword = await bcrypt.hash(password, 12);
  const name = 'Admin User';
  const credits = 999999;
  const role = 'ADMIN';
  const referralCode = 'ADMIN2024';
  const now = new Date().toISOString();

  try {
    // Check if user exists
    const existing = db.prepare('SELECT id FROM User WHERE email = ?').get(email);
    
    if (existing) {
      console.log('Updating existing user...');
      db.prepare(`
        UPDATE User 
        SET role = ?, credits = ?, password = ?
        WHERE id = ?
      `).run(role, credits, hashedPassword, existing.id);
      console.log('Admin user updated successfully.');
    } else {
      console.log('Creating new admin user...');
      db.prepare(`
        INSERT INTO User (id, email, username, password, name, credits, role, referralCode, createdAt, updatedAt)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(generateId(), email, username, hashedPassword, name, credits, role, referralCode, now, now);
      console.log('Admin user created successfully.');
    }
  } catch (error) {
    console.error('Error:', error);
  } finally {
    db.close();
  }
}

main();
