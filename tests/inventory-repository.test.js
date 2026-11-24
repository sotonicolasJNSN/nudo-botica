'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const { createProductRepository } = require('../backend/src/repositories/product-repository');
const { createPrismaProductRepository } = require('../backend/src/repositories/prisma-product-repository');

const order = { reference: 'NUDO-A1B2-C3D4-E5F6-A7B8', items: [{ id: 'shampoo', quantity: 12 }] };

test('Prisma repository calls the atomic inventory function with parameterized order data', async () => {
  let call;
  const expected = { reference: order.reference, stock: [{ id: 'shampoo', stock: 0 }] };
  const repository = createPrismaProductRepository({
    $queryRaw: async (strings, ...values) => {
      call = { sql: strings.join('?'), values };
      return [{ result: expected }];
    }
  });

  assert.deepEqual(await repository.placeOrder(order), expected);
  assert.match(call.sql, /public\.nudo_place_order/);
  assert.deepEqual(call.values, [order.reference, JSON.stringify(order.items)]);
});

test('SQL repositories report insufficient stock and unapplied migration', async () => {
  const stockError = () => Object.assign(new Error('database error'), { code: 'P0001' });
  const migrationError = () => Object.assign(new Error('database error'), { code: '42883' });
  const prismaRepository = createPrismaProductRepository({
    $queryRaw: async () => { throw Object.assign(new Error('query failed'), { code: 'P2010', meta: { code: 'P0001', message: 'INSUFFICIENT_STOCK' } }); }
  });
  const postgresRepository = createProductRepository({
    query: async () => { throw stockError(); }
  });
  const missingMigrationRepository = createProductRepository({
    query: async () => { throw migrationError(); }
  });

  for (const repository of [prismaRepository, postgresRepository]) {
    await assert.rejects(repository.placeOrder(order), {
      status: 409,
      message: 'Stock insuficiente para completar el pedido'
    });
  }
  await assert.rejects(missingMigrationRepository.placeOrder(order), {
    status: 503,
    message: 'La migración del kardex no está aplicada en Supabase'
  });
});
