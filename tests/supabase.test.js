'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const { randomUUID } = require('node:crypto');
const { createApp } = require('../backend/src/app');
const { createSupabaseProductRepository } = require('../backend/src/repositories/supabase-product-repository');
const { createCatalogProvider } = require('../backend/src/repositories/catalog-provider');

const supabaseConfig = {
  url: process.env.SUPABASE_URL,
  publishableKey: process.env.SUPABASE_PUBLISHABLE_KEY,
  secretKey: process.env.SUPABASE_SECRET_KEY
};
const supabaseReadIntegration = process.env.SUPABASE_INTEGRATION === '1' &&
  Boolean(supabaseConfig.url && supabaseConfig.publishableKey);
const supabaseCrudIntegration = supabaseReadIntegration && Boolean(supabaseConfig.secretKey);

test('Supabase read uses publishable key and maps products', async () => {
  let request;
  const repository = createSupabaseProductRepository({
    url: 'https://example.supabase.co', publishableKey: 'sb_publishable_test',
    fetchImpl: async (url, options) => { request = { url: String(url), options }; return { ok: true, json: async () => [{ data: { id: 'shampoo' } }] }; }
  });
  assert.deepEqual(await repository.list(), [{ id: 'shampoo' }]);
  assert.ok(request.url.includes('/rest/v1/products?'));
  assert.equal(request.options.headers.apikey, 'sb_publishable_test');
  assert.equal(request.options.headers.Authorization, undefined);
});

test('Supabase errors and incomplete configuration are surfaced', async () => {
  const repository = createSupabaseProductRepository({ url: 'https://example.supabase.co', publishableKey: 'key', fetchImpl: async () => ({ ok: false, status: 403 }) });
  await assert.rejects(repository.list(), /403/);
  assert.throws(() => createSupabaseProductRepository({ url: 'http://example.com', publishableKey: 'key' }), /HTTPS/);
  assert.throws(() => createCatalogProvider({ SUPABASE_URL: 'https://example.supabase.co' }, () => {}), /conjuntamente/);
  assert.throws(() => createCatalogProvider({ CATALOG_SOURCE: 'supabase' }, () => {}), /conjuntamente/);
  assert.throws(() => createCatalogProvider({ CATALOG_SOURCE: 'unknown' }, () => {}), /CATALOG_SOURCE/);
});

test('PostgreSQL remains explicitly selectable', async () => {
  let options;
  const pool = { end: async () => {}, query: async () => ({ rows: [] }) };
  const provider = createCatalogProvider({ CATALOG_SOURCE: 'postgres', PGDATABASE: 'nudo', SUPABASE_URL: 'https://example.supabase.co' }, value => { options = value; return pool; });
  assert.equal(options.database, 'nudo');
  assert.deepEqual(await provider.repository.list(), []);
  await provider.close();
});

test('configured Supabase catalog contains the 60 existing products', { skip: !supabaseReadIntegration }, async () => {
  const repository = createSupabaseProductRepository(supabaseConfig);
  const products = await repository.list();
  assert.equal(products.length, 60);
  assert.equal(new Set(products.map(product => product.id)).size, 60);
  assert.ok(products.every(product => typeof product.id === 'string'));
});

test('Supabase CRUD uses a disposable product and removes it', { skip: !supabaseCrudIntegration }, async t => {
  const repository = createSupabaseProductRepository(supabaseConfig);
  const server = createApp(repository, { adminPassword: 'nudo-integration-test-password' });
  const id = 'integration-' + randomUUID();
  const product = { id, name: 'Temporary integration product', category: 'Cabello', size: '50 ml', price: 1200, art: 'sage', label: 'Test', description: 'Temporary test row', benefits: ['Temporary'], collections: ['diario'] };
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  t.after(async () => {
    try { await repository.remove(id); }
    finally { await new Promise((resolve, reject) => server.close(error => error ? reject(error) : resolve())); }
  });

  const base = 'http://127.0.0.1:' + server.address().port;
  const login = await fetch(base + '/api/session', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ password: 'nudo-integration-test-password' }) });
  assert.equal(login.status, 200);
  const { token } = await login.json();
  const call = (path, method, body) => fetch(base + path, { method, headers: { Authorization: 'Bearer ' + token, ...(body ? { 'Content-Type': 'application/json' } : {}) }, ...(body ? { body: JSON.stringify(body) } : {}) });

  let response = await call('/api/products', 'POST', product);
  assert.equal(response.status, 201);
  assert.equal((await response.json()).id, id);
  response = await fetch(base + '/api/products/' + encodeURIComponent(id));
  assert.equal(response.status, 200);
  assert.equal((await response.json()).price, 1200);
  response = await call('/api/products/' + encodeURIComponent(id), 'PUT', { ...product, price: 1750 });
  assert.equal(response.status, 200);
  assert.equal((await response.json()).price, 1750);
  response = await call('/api/products/' + encodeURIComponent(id), 'DELETE');
  assert.equal(response.status, 204);
  response = await fetch(base + '/api/products/' + encodeURIComponent(id));
  assert.equal(response.status, 404);
});

test('Supabase writes use secret key and no bearer header', async () => {
  const calls = [];
  const repository = createSupabaseProductRepository({ url: 'https://example.supabase.co', publishableKey: 'sb_publishable_test', secretKey: 'sb_secret_test', fetchImpl: async (url, options) => { calls.push({url:String(url),options}); return { ok:true, json: async () => options.method === 'POST' ? [{data:{id:'nuevo'}}] : [] }; } });
  await repository.create({id:'nuevo'});
  assert.equal(calls[0].options.headers.apikey, 'sb_publishable_test');
  assert.equal(calls[1].options.headers.apikey, 'sb_secret_test');
  assert.equal(calls[1].options.headers.Authorization, undefined);
  const readonly = createSupabaseProductRepository({ url: 'https://example.supabase.co', publishableKey:'public', fetchImpl: async () => ({ok:true,json:async()=>[]}) });
  await assert.rejects(readonly.remove('nuevo'), /configurada/);
});
