'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.join(__dirname, '..');
const configSource = fs.readFileSync(path.join(root, 'frontend/app-config.js'), 'utf8');
const adminSource = fs.readFileSync(path.join(root, 'frontend/admin.js'), 'utf8');

class Element {
  constructor() { this.hidden = false; this.value = ''; this.disabled = false; this.textContent = ''; this.listeners = {}; this.options = []; this.elements = {}; }
  addEventListener(type, handler) { this.listeners[type] = handler; }
  add(option) { this.options.push(option); }
  replaceChildren() { this.options = []; }
  reset() { if (this.elements.password) this.elements.password.value = ''; }
  async dispatch(type) { return this.listeners[type]({ preventDefault() {} }); }
}

function makeHarness() {
  const selectors = ['#admin-status', '#login', '#panel', '#products', '#editor', '#delete', '#new', '#refresh', '#logout'];
  const elements = Object.fromEntries(selectors.map(selector => [selector, new Element()]));
  const fields = ['id', 'name', 'category', 'size', 'price', 'art', 'label', 'description', 'benefits', 'collections'];
  elements['#login'].elements.password = new Element();
  elements['#editor'].elements = Object.fromEntries(fields.map(field => [field, new Element()]));
  const rows = new Map();
  const calls = [];
  let serverToken = '';
  let failLogout = false;
  const fetch = async (input, options = {}) => {
    const url = new URL(input);
    const method = options.method || 'GET';
    const headers = options.headers || {};
    const token = (headers.Authorization || '').replace(/^Bearer /, '');
    calls.push({ origin: url.origin, path: url.pathname, method, token });
    const respond = (status, data) => ({ status, ok: status >= 200 && status < 300, json: async () => data });
    if (url.pathname === '/api/session' && method === 'POST') {
      if (JSON.parse(options.body).password !== 'valid-test-password') return respond(401, { error: 'Invalid credentials' });
      serverToken = 'session-token';
      return respond(200, { token: serverToken });
    }
    if (url.pathname === '/api/session' && method === 'DELETE') {
      if (token !== serverToken) return respond(401, { error: 'Invalid session' });
      if (failLogout) return respond(503, { error: 'API unavailable' });
      serverToken = '';
      return respond(204, null);
    }
    if (url.pathname.startsWith('/api/products')) {
      if (method !== 'GET' && token !== serverToken) return respond(401, { error: 'Session required' });
      if (url.pathname === '/api/products' && method === 'GET') return respond(200, [...rows.values()]);
      if (url.pathname === '/api/products' && method === 'POST') {
        const product = JSON.parse(options.body);
        if (rows.has(product.id)) return respond(409, { error: 'Duplicate' });
        rows.set(product.id, product);
        return respond(201, product);
      }
      const id = decodeURIComponent(url.pathname.slice('/api/products/'.length));
      if (method === 'PUT') {
        if (!rows.has(id)) return respond(404, { error: 'Not found' });
        const product = JSON.parse(options.body);
        rows.set(id, product);
        return respond(200, product);
      }
      if (method === 'DELETE') {
        if (!rows.delete(id)) return respond(404, { error: 'Not found' });
        return respond(204, null);
      }
    }
    return respond(404, { error: 'Route not found' });
  };
  const context = { location: { hostname: 'sotonicolasjnsn.github.io', origin: 'https://sotonicolasjnsn.github.io' }, document: { querySelector: selector => elements[selector] }, fetch, URL, Option: class { constructor(text, value) { this.text = text; this.value = value; } }, confirm: () => true };
  vm.createContext(context);
  vm.runInContext(configSource, context);
  vm.runInContext(adminSource, context);
  return { elements, rows, calls, setFailLogout(value) { failLogout = value; } };
}

test('admin panel uses deployed API for login and CRUD and reports logout errors', async () => {
  const { elements, rows, calls, setFailLogout } = makeHarness();
  elements['#login'].elements.password.value = 'valid-test-password';
  await elements['#login'].dispatch('submit');
  assert.equal(elements['#panel'].hidden, false);
  assert.match(elements['#admin-status'].textContent, /activa/);

  const editor = elements['#editor'];
  const product = { id:'temporal-admin-test', name:'Temporary product', category:'Cabello', size:'50 ml', price:'1200', art:'sage', label:'Test', description:'Temporary test', benefits:'Test benefit', collections:'diario' };
  for (const [field, value] of Object.entries(product)) editor.elements[field].value = value;
  await editor.dispatch('submit');
  assert.equal(rows.get(product.id).price, 1200);
  assert.match(elements['#admin-status'].textContent, /guardado/);

  elements['#products'].value = product.id;
  await elements['#products'].dispatch('change');
  editor.elements.price.value = '1750';
  await editor.dispatch('submit');
  assert.equal(rows.get(product.id).price, 1750);

  await elements['#delete'].dispatch('click');
  assert.equal(rows.has(product.id), false);
  assert.match(elements['#admin-status'].textContent, /eliminado/);

  setFailLogout(true);
  await elements['#logout'].dispatch('click');
  assert.match(elements['#admin-status'].textContent, /No se pudo cerrar la sesion/);
  assert.equal(elements['#panel'].hidden, false);
  setFailLogout(false);
  await elements['#logout'].dispatch('click');
  assert.equal(elements['#panel'].hidden, true);
  assert.match(elements['#admin-status'].textContent, /cerrada/);

  assert.ok(calls.every(call => call.origin === 'https://nudo-botica.onrender.com'));
  assert.ok(calls.some(call => call.method === 'POST' && call.path === '/api/session'));
  assert.ok(calls.some(call => call.method === 'POST' && call.path === '/api/products' && call.token === 'session-token'));
  assert.ok(calls.some(call => call.method === 'PUT' && call.token === 'session-token'));
  assert.ok(calls.some(call => call.method === 'DELETE' && call.path.startsWith('/api/products/') && call.token === 'session-token'));
});
