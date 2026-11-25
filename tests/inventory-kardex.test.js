'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const { createApp } = require('../backend/src/app');
const { createInventoryService } = require('../backend/src/services/inventory-service');
const { createProductRepository } = require('../backend/src/repositories/product-repository');
const { createPrismaProductRepository } = require('../backend/src/repositories/prisma-product-repository');
const { createSupabaseProductRepository } = require('../backend/src/repositories/supabase-product-repository');

const receipt = {
  reference: 'COMPRA-12345678-1234-1234-1234-123456789ABC',
  items: [{ id: 'shampoo', quantity: 12 }],
  notes: 'Factura 123'
};
const movement = {
  id: '1',
  productId: 'shampoo',
  productName: 'Shampoo',
  movementType: 'purchase',
  quantity: 12,
  stockBefore: 0,
  stockAfter: 12,
  reference: receipt.reference,
  notes: receipt.notes,
  createdAt: '2026-11-24T12:00:00.000Z'
};

test('inventory service validates purchase receipts and Kardex pagination', async () => {
  let saved, query;
  const service = createInventoryService({
    receiveStock: async value => { saved = value; return { reference: value.reference }; },
    listInventoryMovements: async value => { query = value; return [movement]; }
  });
  assert.deepEqual(await service.receiveStock(receipt), { reference: receipt.reference });
  assert.deepEqual(saved, receipt);
  assert.deepEqual(await service.listMovements({ productId: 'shampoo', limit: '20', offset: '10' }), [movement]);
  assert.deepEqual(query, { productId: 'shampoo', limit: 20, offset: 10 });
  assert.throws(() => service.receiveStock({ ...receipt, items: [{ id: 'shampoo', quantity: 1.5 }] }), /Cantidad/);
  assert.throws(() => service.receiveStock({ ...receipt, items: [...receipt.items, ...receipt.items] }), /repetidos/);
  assert.throws(() => service.listMovements({ limit: '101' }), /Paginación/);
});

test('Kardex endpoints require admin session and return logged movements', async t => {
  let savedReceipt, movementQuery;
  const server = createApp({
    list: async () => [],
    listInventoryMovements: async query => { movementQuery = query; return [movement]; },
    receiveStock: async value => { savedReceipt = value; return { reference: value.reference, stock: [{ id: 'shampoo', stock: 12 }] }; }
  }, { adminPassword: 'kardex-test-password' });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  t.after(() => new Promise(resolve => server.close(resolve)));
  const base = `http://127.0.0.1:${server.address().port}`;
  let response = await fetch(`${base}/api/admin/inventory-movements`);
  assert.equal(response.status, 401);
  response = await fetch(`${base}/api/session`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password: 'kardex-test-password' })
  });
  const { token } = await response.json();
  response = await fetch(`${base}/api/admin/inventory-movements?productId=shampoo&limit=20`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), [movement]);
  assert.deepEqual(movementQuery, { productId: 'shampoo', limit: 20, offset: 0 });
  response = await fetch(`${base}/api/admin/inventory-receipts`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(receipt)
  });
  assert.equal(response.status, 201);
  assert.equal((await response.json()).stock[0].stock, 12);
  assert.deepEqual(savedReceipt, receipt);
});

test('Prisma repository reads the ledger and calls the purchase RPC with bound values', async () => {
  const calls = [];
  const repository = createPrismaProductRepository({
    $queryRaw: async (strings, ...values) => {
      const sql = strings.join('?');
      calls.push({ sql, values });
      if (sql.includes('nudo_inventory_movements')) return [movement];
      return [{ result: { reference: receipt.reference, stock: [{ id: 'shampoo', stock: 12 }] } }];
    }
  });
  assert.deepEqual(await repository.listInventoryMovements({ productId: 'shampoo', limit: 20, offset: 0 }), [movement]);
  assert.deepEqual(await repository.receiveStock(receipt), { reference: receipt.reference, stock: [{ id: 'shampoo', stock: 12 }] });
  assert.match(calls[0].sql, /FROM public\.nudo_inventory_movements/);
  assert.deepEqual(calls[0].values, ['shampoo', 'shampoo', 20, 0]);
  assert.match(calls[1].sql, /public\.nudo_receive_stock/);
  assert.deepEqual(calls[1].values, [receipt.reference, JSON.stringify(receipt.items), receipt.notes]);
});

test('PostgreSQL repository queries the ledger and receives stock via the RPC', async () => {
  const calls = [];
  const repository = createProductRepository({
    query: async (sql, values) => {
      calls.push({ sql, values });
      return sql.includes('nudo_inventory_movements')
        ? { rows: [movement] }
        : { rows: [{ result: { reference: receipt.reference } }] };
    }
  });
  assert.deepEqual(await repository.listInventoryMovements({ productId: 'shampoo', limit: 20, offset: 0 }), [movement]);
  assert.deepEqual(await repository.receiveStock(receipt), { reference: receipt.reference });
  assert.match(calls[0].sql, /FROM nudo_inventory_movements/);
  assert.deepEqual(calls[0].values, ['shampoo', 20, 0]);
  assert.match(calls[1].sql, /nudo_receive_stock/);
  assert.deepEqual(calls[1].values, [receipt.reference, JSON.stringify(receipt.items), receipt.notes]);
});

test('Supabase reads Kardex with the server secret and registers an incoming purchase', async () => {
  const calls = [];
  const repository = createSupabaseProductRepository({
    url: 'https://example.supabase.co',
    publishableKey: 'sb_publishable_test',
    secretKey: 'sb_secret_test',
    fetchImpl: async (url, options) => {
      calls.push({ url: String(url), options });
      return {
        ok: true,
        json: async () => new URL(url).pathname.endsWith('nudo_inventory_movements')
          ? [{ id: 1, product_id: 'shampoo', product_name: 'Shampoo', movement_type: 'purchase', quantity: 12, stock_before: 0, stock_after: 12, reference: receipt.reference, notes: receipt.notes, created_at: movement.createdAt }]
          : { reference: receipt.reference, stock: [{ id: 'shampoo', stock: 12 }] }
      };
    }
  });
  assert.deepEqual(await repository.listInventoryMovements({ productId: 'shampoo', limit: 20, offset: 0 }), [movement]);
  assert.deepEqual(await repository.receiveStock(receipt), { reference: receipt.reference, stock: [{ id: 'shampoo', stock: 12 }] });
  assert.equal(new URL(calls[0].url).pathname, '/rest/v1/nudo_inventory_movements');
  assert.equal(calls[0].options.headers.apikey, 'sb_secret_test');
  assert.equal(calls[0].options.headers.Authorization, undefined);
  assert.equal(new URL(calls[0].url).searchParams.get('product_id'), 'eq.shampoo');
  assert.equal(new URL(calls[1].url).pathname, '/rest/v1/rpc/nudo_receive_stock');
  assert.deepEqual(JSON.parse(calls[1].options.body), {
    p_reference: receipt.reference,
    p_items: receipt.items,
    p_notes: receipt.notes
  });
});

test('Kardex reports missing server credentials or migration explicitly', async () => {
  const readonly = createSupabaseProductRepository({
    url: 'https://example.supabase.co',
    publishableKey: 'sb_publishable_test',
    fetchImpl: async () => { throw Error('Must not call Supabase without the server secret'); }
  });
  await assert.rejects(readonly.listInventoryMovements({ productId: null, limit: 100, offset: 0 }), {
    status: 503,
    message: 'Consulta del kardex no configurada'
  });
  await assert.rejects(readonly.receiveStock(receipt), {
    status: 503,
    message: 'Escritura en Supabase no configurada'
  });

  const missingMigration = createSupabaseProductRepository({
    url: 'https://example.supabase.co',
    publishableKey: 'public',
    secretKey: 'server-secret',
    fetchImpl: async () => ({ ok: false, status: 404, json: async () => ({ code: 'PGRST205', message: 'table not found' }) })
  });
  await assert.rejects(missingMigration.listInventoryMovements({ productId: null, limit: 100, offset: 0 }), {
    status: 503,
    message: 'La migración del kardex no está aplicada en la base de datos conectada'
  });
});
