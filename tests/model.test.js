'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
require('../frontend/model.js');
require('../frontend/cart-repository.js');
require('../frontend/view.js');
const model = globalThis.NudoModel;
const repository = globalThis.NudoCartRepository;

test('búsqueda sin tildes, filtros y orden de precios', () => {
  const base = { category: '', price: 'all', sort: 'list' };
  assert.ok(model.filteredProducts(model.products, base, 'mascarilla reparadora').length);
  assert.equal(model.normalizeSearch('  RÍZOS  '), 'rizos');
  const filtered = model.filteredProducts(model.products, { ...base, price: 'under-10', sort: 'price-asc' });
  assert.ok(filtered.length);
  assert.ok(filtered.every((product, index) => product.price < 1000 && (!index || filtered[index - 1].price <= product.price)));
});

test('totales, envío y validación Luhn', () => {
  assert.equal(model.total([{ product: { price: 1250 }, quantity: 2 }]), 2500);
  assert.equal(model.deliveryFee('online-home'), 500);
  assert.equal(model.deliveryFee('local-pickup'), 0);
  assert.equal(model.passesLuhn('4242424242424242'), true);
  assert.equal(model.passesLuhn('4242424242424241'), false);
});

test('el repositorio valida los datos y solo guarda identificador y cantidad', () => {
  const product = model.products[0];
  let value = JSON.stringify([{ id: product.id, quantity: 2 }, { id: product.id, quantity: 4 }, { id: 'desconocido', quantity: 1 }, { id: product.id, quantity: 100 }]);
  globalThis.localStorage = { getItem: () => value, setItem: (key, data) => { value = data; } };
  const loaded = repository.load();
  assert.equal(loaded.unavailable, false);
  assert.equal(loaded.items.length, 1);
  assert.equal(loaded.items[0].product, product);
  assert.equal(repository.save(loaded.items), true);
  assert.deepEqual(JSON.parse(value), [{ id: product.id, quantity: 2 }]);
  value = '{';
  assert.deepEqual(repository.load(), { items: [], unavailable: false });
});

test('el repositorio informa cuando el navegador bloquea el almacenamiento', () => {
  globalThis.localStorage = { getItem() { throw Error('blocked'); }, setItem() { throw Error('blocked'); } };
  assert.deepEqual(repository.load(), { items: [], unavailable: true });
  assert.equal(repository.save([]), false);
});

test('los componentes muestran el total y escapan datos variables', () => {
  assert.equal(globalThis.NudoView.escapeHTML('<script>'), '&lt;script&gt;');
  assert.match(globalThis.NudoView.totals([{ product: { price: 1000 }, quantity: 1 }], 'online-home'), /15[,.]00/);
});

