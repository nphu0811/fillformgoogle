const { PrismaClient } = require('@prisma/client');
const { PrismaBetterSqlite3 } = require('@prisma/adapter-better-sqlite3');
const Database = require('better-sqlite3');
const bcrypt = require('bcryptjs');

async function main() {
  const db = new Database('./prisma/dev.db');
  const adapter = new PrismaBetterSqlite3(db);
  const prisma = new PrismaClient({ adapter });

  const adminPassword = await bcrypt.hash('admin123', 12);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@fillform.info' },
    update: {
      role: 'ADMIN',
      credits: 999999
    },
    create: {
      email: 'admin@fillform.info',
      username: 'admin',
      password: adminPassword,
      name: 'Admin User',
      credits: 999999,
      role: 'ADMIN',
      referralCode: 'ADMIN2024',
    },
  });

  console.log('Admin created:', admin.email);
}

main().catch(console.error);
