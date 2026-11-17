'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const { createApp } = require('../backend/src/app');
const { createProductRepository } = require('../backend/src/repositories/product-repository');

test('repositorio consulta PostgreSQL y entrega los productos en orden', async () => {
  let query;
  const repository = createProductRepository({ query: async sql => { query = sql; return { rows: [{ data: { id: 'uno' } }] }; } });
  assert.deepEqual(await repository.list(), [{ id: 'uno' }]);
  assert.match(query, /ORDER BY position, id/);
});

test('API, archivos y errores de base de datos', async t => {
  let fail = false;
  const server = createApp({ list: async () => { if (fail) throw Error('DB unavailable'); return [{ id: 'uno' }]; } });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  t.after(() => new Promise(resolve => server.close(resolve)));
  const base = `http://127.0.0.1:${server.address().port}`;
  let response = await fetch(`${base}/api/products`);
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), [{ id: 'uno' }]);
  response = await fetch(`${base}/`);
  assert.equal(response.status, 200);
  assert.match(await response.text(), /catalog-repository\.js/);
  assert.equal((await fetch(`${base}/api/products`, { method: 'POST' })).status, 401);
  assert.equal((await fetch(`${base}/missing`)).status, 404);
  fail = true;
  response = await fetch(`${base}/api/products`);
  assert.equal(response.status, 503);
  assert.deepEqual(await response.json(), { error: 'Catálogo no disponible' });
});

test('API consulta un PostgreSQL real cuando se configura PG_INTEGRATION', { skip: !process.env.PG_INTEGRATION }, async t => {
  const { Pool } = require('../backend/node_modules/pg');
  const pool = new Pool();
  const server = createApp(createProductRepository(pool));
  t.after(async () => { await new Promise(resolve => server.close(resolve)); await pool.end(); });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const response = await fetch(`http://127.0.0.1:${server.address().port}/api/products`);
  assert.equal(response.status, 200);
  const products = await response.json();
  assert.equal(products.length, 60);
  assert.equal(products[0].id, 'shampoo');
});

test('CORS permite únicamente el origen configurado', async t => {
  const server = createApp({ list: async () => [] }, { frontendOrigin: 'https://example.github.io' });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  t.after(() => new Promise(resolve => server.close(resolve)));
  const url = `http://127.0.0.1:${server.address().port}/api/products`;
  const allowed = await fetch(url, { headers: { Origin: 'https://example.github.io' } });
  assert.equal(allowed.headers.get('access-control-allow-origin'), 'https://example.github.io');
  const other = await fetch(url, { headers: { Origin: 'https://other.example' } });
  assert.equal(other.headers.get('access-control-allow-origin'), null);
});
