'use strict';
// Ejecute solo contra una base autorizada; los valores se pasan por entorno, nunca en Git.
const { PrismaClient } = require('@prisma/client');
const { hashPassword } = require('../src/repositories/admin-user-repository');

async function main() {
  const username = process.env.NUDO_ADMIN_USERNAME;
  const password = process.env.NUDO_ADMIN_NEW_PASSWORD;
  if (!username || !password) throw Error('Configure NUDO_ADMIN_USERNAME y NUDO_ADMIN_NEW_PASSWORD en el entorno.');
  const prisma = new PrismaClient();
  try {
    await prisma.adminUser.create({ data: { username, passwordHash: await hashPassword(password) } });
    console.log('Cuenta creada.');
  } finally { await prisma.$disconnect(); }
}
main().catch(error => { console.error(error.message); process.exitCode = 1; });
