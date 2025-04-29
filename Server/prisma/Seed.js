const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcrypt');

async function main() {
  const admin = await prisma.super.upsert({
    where: { username: 'initialadmin' },
    update: {},
    create: {
      username: 'initialadmin',
      password: await bcrypt.hash('AdminPassword123', 12)
    }
  });
  console.log('Created initial admin:', admin);
}

main();