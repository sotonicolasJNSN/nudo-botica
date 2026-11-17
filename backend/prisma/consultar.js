'use strict';
// Solo lectura: DATABASE_URL debe apuntar a una base autorizada.
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
(async () => {
  const products = await prisma.product.findMany({ orderBy: [{ position: 'asc' }, { id: 'asc' }], take: 5 });
  console.log(JSON.stringify(products.map(p => p.data), null, 2));
})().catch(error => { console.error('No se pudo consultar con Prisma:', error.message); process.exitCode = 1; }).finally(() => prisma.$disconnect());
