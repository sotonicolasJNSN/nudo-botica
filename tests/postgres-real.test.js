'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const { randomUUID } = require('node:crypto');
const { createApp } = require('../backend/src/app');
const { createProductRepository } = require('../backend/src/repositories/product-repository');
const { createCatalogProvider } = require('../backend/src/repositories/catalog-provider');
const connection = process.env.NUDO_TEST_DATABASE_URL;
function validateDatabase() {
  const url = new URL(connection);
  if (!['127.0.0.1','localhost'].includes(url.hostname) || url.pathname !== '/nudo_test') throw Error('Solo se permite una base local aislada llamada nudo_test');
}
function fixture(id) { return { id, name:'Producto de prueba', category:'Cabello', size:'50 ml', price:1200, art:'sage', label:'Prueba', description:'Producto temporal', benefits:['Suave'], collections:['diario'] }; }

test('API y repositorio Prisma conservan el CRUD administrativo', {skip: !connection}, async t => {
  validateDatabase();
  const { PrismaClient } = require('../backend/node_modules/@prisma/client');
  const prisma = new PrismaClient({datasources:{db:{url:connection}}});
  const provider = createCatalogProvider({ CATALOG_SOURCE: 'prisma', DATABASE_URL: connection }, () => { throw Error('No debe usar pg'); });
  const server = createApp(provider.repository, { adminPassword: 'contrasena-temporal-1234' });
  const id = `prueba-${randomUUID()}`;
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  t.after(async () => { await prisma.product.deleteMany({where:{id}}); await new Promise(resolve => server.close(resolve)); await provider.close(); await prisma.$disconnect(); });
  const base = `http://127.0.0.1:${server.address().port}`;
  const login = await fetch(base+'/api/session',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({password:'contrasena-temporal-1234'})});
  assert.equal(login.status, 200);
  const { token } = await login.json();
  const call = (method, path, body) => fetch(base+path,{method,headers:{Authorization:`Bearer ${token}`, ...(body ? {'Content-Type':'application/json'} : {})}, ...(body ? {body:JSON.stringify(body)} : {})});
  assert.equal((await call('POST','/api/products',fixture(id))).status, 201);
  assert.equal((await call('POST','/api/products',fixture(id))).status, 409);
  assert.ok((await (await fetch(base+'/api/products')).json()).some(product => product.id === id));
  assert.equal((await (await fetch(base+`/api/v1/products/${id}`)).json()).price, 1200);
  assert.equal((await call('PUT',`/api/products/${id}`,{...fixture(id),price:1750})).status, 200);
  assert.equal((await (await fetch(base+`/api/products/${id}`)).json()).price, 1750);
  assert.equal((await call('DELETE',`/api/products/${id}`)).status, 204);
  assert.equal((await call('DELETE',`/api/products/${id}`)).status, 404);
  assert.equal((await call('PUT',`/api/products/${id}`,fixture(id))).status, 404);
  assert.equal((await fetch(base+`/api/products/${id}`)).status, 404);
});

test('API CRUD sobre PostgreSQL real con limpieza', {skip: !connection}, async t => {
  validateDatabase();
  const { Pool } = require('../backend/node_modules/pg');
  const pool = new Pool({ connectionString: connection });
  const server = createApp(createProductRepository(pool), { adminPassword: 'contrasena-temporal-1234' });
  const id = `prueba-${randomUUID()}`;
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  t.after(async () => { await pool.query('DELETE FROM products WHERE id=$1',[id]); await new Promise(resolve => server.close(resolve)); await pool.end(); });
  const base = `http://127.0.0.1:${server.address().port}`;
  const login = await fetch(base+'/api/session',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({password:'contrasena-temporal-1234'})});
  const { token } = await login.json();
  const call = (method, path, body) => fetch(base+path,{method,headers:{Authorization:`Bearer ${token}`, ...(body ? {'Content-Type':'application/json'} : {})}, ...(body ? {body:JSON.stringify(body)} : {})});
  let response = await call('POST','/api/products',fixture(id)); assert.equal(response.status,201);
  response = await fetch(base+`/api/products/${id}`); assert.equal((await response.json()).price,1200);
  response = await call('PUT',`/api/products/${id}`,{...fixture(id),price:1750}); assert.equal(response.status,200);
  assert.equal((await pool.query('SELECT data FROM products WHERE id=$1',[id])).rows[0].data.price,1750);
  assert.equal((await call('DELETE',`/api/products/${id}`)).status,204);
  assert.equal((await fetch(base+`/api/products/${id}`)).status,404);
});

test('Prisma: CRUD y rollback atómico en PostgreSQL real', {skip: !connection}, async t => {
  validateDatabase();
  const { PrismaClient } = require('../backend/node_modules/@prisma/client');
  const prisma = new PrismaClient({datasources:{db:{url:connection}}});
  const prefix = `prueba-${randomUUID()}`, id = `${prefix}-crud`, rolled = `${prefix}-rollback`, committed = `${prefix}-commit`;
  t.after(async () => { await prisma.product.deleteMany({where:{id:{in:[id,rolled,committed]}}}); await prisma.$disconnect(); });
  await prisma.product.create({data:{id, position:900001, data:fixture(id)}});
  assert.equal((await prisma.product.findUnique({where:{id}})).data.price,1200);
  await prisma.product.update({where:{id},data:{data:{...fixture(id),price:1800}}});
  assert.equal((await prisma.product.findUnique({where:{id}})).data.price,1800);
  await prisma.product.delete({where:{id}}); assert.equal(await prisma.product.findUnique({where:{id}}),null);
  await assert.rejects(prisma.$transaction(async tx => {
    await tx.product.create({data:{id:rolled,position:900002,data:fixture(rolled)}});
    await tx.product.create({data:{id:rolled,position:900003,data:fixture(rolled)}});
  }));
  assert.equal(await prisma.product.findUnique({where:{id:rolled}}),null);
  await prisma.$transaction(async tx => {
    await tx.product.create({data:{id:committed,position:900004,data:fixture(committed)}});
    await tx.product.update({where:{id:committed},data:{data:{...fixture(committed),price:2000}}});
  });
  assert.equal((await prisma.product.findUnique({where:{id:committed}})).data.price,2000);
});
