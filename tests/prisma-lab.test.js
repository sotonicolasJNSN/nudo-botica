'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const { randomUUID } = require('node:crypto');
const { createLabService, validateProduct } = require('../backend/prisma-lab/service');
const connection = process.env.LAB_DATABASE_URL;

test('laboratorio valida nombre, precio, stock y categoría', () => {
  const base = {nombre:'Shampoo NUDO',precio:1250,stock:5,categoriaId:1};
  for (const bad of [{nombre:'x'},{precio:-1},{stock:-1},{categoriaId:0}]) assert.throws(() => validateProduct({...base,...bad}));
});
test('laboratorio Prisma relacional: migración, CRUD y transacción', {skip:!connection}, async t => {
  const url = new URL(connection);
  if (!['127.0.0.1','localhost'].includes(url.hostname) || url.pathname !== '/nudo_test' || url.searchParams.get('schema') !== 'nudo_lab') throw Error('Se requiere base local nudo_test y esquema nudo_lab');
  const { PrismaClient } = require('../backend/node_modules/.prisma/nudo-lab');
  const prisma = new PrismaClient({datasources:{db:{url:connection}}});
  const service = createLabService(prisma);
  const category = await prisma.categoria.create({data:{nombre:`Cabello prueba ${randomUUID()}`}});
  t.after(async () => { await prisma.producto.deleteMany({where:{categoriaId:category.id}}); await prisma.categoria.delete({where:{id:category.id}}); await prisma.$disconnect(); });
  const data = {nombre:'Shampoo NUDO de prueba',precio:1250,stock:10,categoriaId:category.id};
  const product = await service.create(data);
  assert.equal((await service.get(product.id)).categoria.nombre,category.nombre);
  assert.ok((await service.list()).some(p => p.id === product.id));
  assert.equal((await service.update(product.id,{...data,precio:1450})).precio,1450);
  await assert.rejects(prisma.$transaction(async tx => {
    await tx.producto.update({where:{id:product.id},data:{stock:4}});
    await tx.producto.create({data:{...data,nombre:'XX',precio:-1}});
  }));
  assert.equal((await service.get(product.id)).stock,10);
  await service.remove(product.id); assert.equal(await service.get(product.id),null);
});
