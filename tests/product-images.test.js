'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.join(__dirname, '..');
const catalog = require('../tools/product-renders/catalog.json');
const directory = path.join(root, 'frontend/images/products');

function viewContext() {
  const context = { NudoModel: { total: () => 0, deliveryFee: () => 0 }, Intl };
  vm.createContext(context);
  vm.runInContext(fs.readFileSync(path.join(root, 'frontend/product-images.js'), 'utf8'), context);
  vm.runInContext(fs.readFileSync(path.join(root, 'frontend/view.js'), 'utf8'), context);
  return context;
}

test('los 60 productos tienen un WebP único y el índice coincide con el catálogo', () => {
  const ids = catalog.map(p => p.id);
  const context = viewContext();
  assert.equal(ids.length, 60);
  assert.equal(new Set(ids).size, 60);
  assert.deepEqual([...context.NudoProductImages].sort(), [...ids].sort());
  const files = fs.readdirSync(directory).filter(f => f.endsWith('.webp'));
  assert.deepEqual(files.sort(), ids.map(id => `${id}.webp`).sort());
  const hashes = files.map(file => {
    const bytes = fs.readFileSync(path.join(directory, file));
    assert.equal(bytes.toString('ascii', 0, 4), 'RIFF');
    assert.equal(bytes.toString('ascii', 8, 12), 'WEBP');
    return crypto.createHash('sha256').update(bytes).digest('hex');
  });
  assert.equal(new Set(hashes).size, 60);
});

test('las imágenes conocidas usan carga diferida y las prioritarias se anticipan', () => {
  const context = viewContext();
  const product = catalog[0];
  const normal = context.NudoView.art(product);
  assert.match(normal, /src="images\/products\/shampoo\.webp"/);
  assert.match(normal, /width="512" height="512" loading="lazy"/);
  assert.match(context.NudoView.art(product, { priority: true }), /loading="eager"[^>]*fetchpriority="high"/);
  assert.doesNotMatch(context.NudoView.art({ ...product, id: '../otro' }), /<img/);
  assert.doesNotMatch(context.NudoView.art(product, { illustration: true }), /<img/);
  const unsafe = context.NudoView.art({ ...product, name: '<script>alert(1)</script>' });
  assert.doesNotMatch(unsafe, /<script>/);
  assert.match(unsafe, /&lt;script&gt;/);
});
