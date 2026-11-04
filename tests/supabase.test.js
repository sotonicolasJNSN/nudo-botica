'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const { createSupabaseProductRepository } = require('../backend/src/repositories/supabase-product-repository');
const { createCatalogProvider } = require('../backend/src/repositories/catalog-provider');

test('el repositorio consulta Supabase con clave publicable y mapea productos', async () => {
  let request;
  const repository = createSupabaseProductRepository({
    url: 'https://example.supabase.co', publishableKey: 'sb_publishable_test',
    fetchImpl: async (url, options) => { request = { url: String(url), options }; return { ok: true, json: async () => [{ data: { id: 'shampoo' } }] }; }
  });
  assert.deepEqual(await repository.list(), [{ id: 'shampoo' }]);
  assert.match(request.url, /\/rest\/v1\/products\?/);
  assert.equal(request.options.headers.apikey, 'sb_publishable_test');
  assert.equal(request.options.headers.Authorization, undefined);
});

test('errores de Supabase y configuración incompleta no se ocultan', async () => {
  const repository = createSupabaseProductRepository({ url: 'https://example.supabase.co', publishableKey: 'key', fetchImpl: async () => ({ ok: false, status: 403 }) });
  await assert.rejects(repository.list(), /403/);
  assert.throws(() => createSupabaseProductRepository({ url: 'http://example.com', publishableKey: 'key' }), /HTTPS/);
  assert.throws(() => createCatalogProvider({ SUPABASE_URL: 'https://example.supabase.co' }, () => {}), /conjuntamente/);
});

test('PostgreSQL local se puede seleccionar explícitamente', async () => {
  let options;
  const pool = { end: async () => {}, query: async () => ({ rows: [] }) };
  const provider = createCatalogProvider({ CATALOG_SOURCE: 'postgres', PGDATABASE: 'nudo', SUPABASE_URL: 'https://example.supabase.co' }, value => { options = value; return pool; });
  assert.equal(options.database, 'nudo');
  assert.deepEqual(await provider.repository.list(), []);
  await provider.close();
});

test('el catálogo configurado responde desde Supabase', { skip: !process.env.SUPABASE_INTEGRATION }, async () => {
  const config = require('../backend/supabase-config.json');
  const repository = createSupabaseProductRepository(config);
  const products = await repository.list();
  assert.ok(products.length > 0);
  assert.ok(products.every(product => typeof product.id === 'string'));
});
