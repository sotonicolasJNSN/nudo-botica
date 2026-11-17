'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const configSource = fs.readFileSync(path.join(__dirname, '../frontend/app-config.js'), 'utf8');

test('GitHub Pages uses Render and local development keeps same-origin API', () => {
  const pages = { location: { hostname: 'sotonicolasjnsn.github.io' } };
  vm.runInNewContext(configSource, pages);
  assert.equal(pages.NUDO_API_BASE, 'https://nudo-botica.onrender.com/');
  const local = { location: { hostname: '127.0.0.1' } };
  vm.runInNewContext(configSource, local);
  assert.equal(local.NUDO_API_BASE, '');
});

test('public API URL contains no credentials', () => {
  const pages = { location: { hostname: 'sotonicolasjnsn.github.io' } };
  vm.runInNewContext(configSource, pages);
  const api = new URL(pages.NUDO_API_BASE);
  assert.equal(api.protocol, 'https:');
  assert.equal(api.username, '');
  assert.equal(api.password, '');
  assert.equal(api.search, '');
});

const renderConfig = fs.readFileSync(path.join(__dirname, '../render.yaml'), 'utf8');
const backendPackage = JSON.parse(fs.readFileSync(path.join(__dirname, '../backend/package.json'), 'utf8'));

test('Render uses backend npm scripts and leaves credentials unset in source control', () => {
  assert.match(renderConfig, /name: nudo-botica/);
  assert.match(renderConfig, /buildCommand: npm ci --prefix backend/);
  assert.match(renderConfig, /startCommand: npm start --prefix backend/);
  for (const key of ['SUPABASE_URL', 'SUPABASE_PUBLISHABLE_KEY', 'SUPABASE_SECRET_KEY', 'ADMIN_PASSWORD']) {
    assert.match(renderConfig, new RegExp('key: ' + key + '\\n\\s+sync: false'));
  }
  assert.equal(backendPackage.scripts.start, 'node src/server.js');
  assert.ok(backendPackage.engines.node);
});
