/*
SINGLE INSTANCE

WHY THIS MATTERS:

Connection Pooling --> Reuse existing database connections

Memory Efficiency --> Prevents multiple client instances

Best Practice --> Recommended by Prisma documentation

Error Prevention --> Avoids "Too many clients" database errors
*/

const {PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient();
module.exports = prisma;