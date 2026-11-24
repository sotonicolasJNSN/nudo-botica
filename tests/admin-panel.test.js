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
  appendChild(option) { this.options.push(option); }
  replaceChildren() { this.options = []; }
  reset() { for (const field of Object.values(this.elements)) field.value = ''; }
  async dispatch(type) { return this.listeners[type]({ preventDefault() {} }); }
}

function makeHarness() {
  const selectors = ['#admin-status', '#login', '#panel', '#products', '#editor', '#delete', '#new', '#refresh', '#logout', '#supplier', '#supplier-list', '#supplier-form', '#supplier-to-delete', '#delete-supplier', '#supplier-add-message', '#supplier-delete-message', '#product-message'];
  const elements = Object.fromEntries(selectors.map(selector => [selector, new Element()]));
  const fields = ['id', 'name', 'category', 'size', 'price', 'art', 'label', 'description', 'benefits', 'collections'];
  elements['#login'].elements.password = new Element();
  elements['#supplier-form'].elements.name = new Element();
  elements['#editor'].elements = Object.fromEntries(fields.map(field => [field, new Element()]));
  const rows = new Map();
  const supplierRows = [{ id:'proveedor-prueba', name:'Proveedor de prueba' }];
  const calls = [];
  let serverToken = '';
  let failLogout = false;
  let failRefresh = false;
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
    if (url.pathname === '/api/suppliers' && method === 'GET') return failRefresh ? respond(503, {error:'Lista no disponible'}) : respond(200, supplierRows);
    if (url.pathname === '/api/suppliers' && method === 'POST') { const row = {id:'otro-proveedor',name:JSON.parse(options.body).name}; supplierRows.push(row); return respond(201,row); }
    if (url.pathname === '/api/suppliers/otro-proveedor' && method === 'DELETE') { supplierRows.splice(1,1); return respond(204,null); }
    if (url.pathname === '/api/product-suppliers' && method === 'GET') return respond(200, [...rows.keys()].map(productId => ({ productId, supplierId:'proveedor-prueba' })));
    if (url.pathname.startsWith('/api/admin/products')) {
      if (token !== serverToken) return respond(401, { error: 'Session required' });
      const {product, supplierId} = JSON.parse(options.body);
      if (supplierId !== 'proveedor-prueba') return respond(400, {error:'Proveedor inválido'});
      rows.set(product.id, product);
      return respond(method === 'POST' ? 201 : 200, product);
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
  const context = { location: { hostname: 'sotonicolasjnsn.github.io', origin: 'https://sotonicolasjnsn.github.io' }, document: { querySelector: selector => elements[selector], createElement: () => new Element() }, crypto:{randomUUID:()=>'12345678-abcd-4000-8000-123456789012'}, fetch, URL, Option: class { constructor(text, value) { this.text = text; this.value = value; } }, confirm: () => true };
  vm.createContext(context);
  vm.runInContext(configSource, context);
  vm.runInContext(adminSource, context);
  return { elements, rows, calls, setFailLogout(value) { failLogout = value; }, setFailRefresh(value) { failRefresh = value; } };
}

test('admin panel uses deployed API for login and CRUD and reports logout errors', async () => {
  const { elements, rows, calls, setFailLogout } = makeHarness();
  elements['#login'].elements.password.value = 'valid-test-password';
  await elements['#login'].dispatch('submit');
  assert.equal(elements['#panel'].hidden, false);
  assert.match(elements['#admin-status'].textContent, /activa/);
  elements['#supplier-form'].elements.name.value = 'Nuevo proveedor';
  await elements['#supplier-form'].dispatch('submit');
  assert.match(elements['#supplier-add-message'].textContent, /Proveedor agregado correctamente/);
  assert.ok(elements['#supplier'].options.some(option => option.text === 'Nuevo proveedor'));
  elements['#supplier-to-delete'].value = 'otro-proveedor';
  await elements['#delete-supplier'].dispatch('click');
  assert.match(elements['#supplier-delete-message'].textContent, /Proveedor eliminado correctamente/);

  const editor = elements['#editor'];
  const product = { name:'Temporary product', category:'Paquete de 12', size:'50 ml', price:'12.00', description:'Temporary test', benefits:'Test benefit', collections:'diario' };
  const productId = 'temporary-product-12345678';
  for (const [field, value] of Object.entries(product)) editor.elements[field].value = value;
  elements['#supplier'].value = 'proveedor-prueba';
  await editor.dispatch('submit');
  assert.equal(rows.get(productId).price, 1200);
  assert.equal(rows.get(productId).category, 'Paquete de 12');
  assert.match(elements['#product-message'].textContent, /Producto agregado correctamente/);
  for (const field of ['name','category','size','price','description','benefits','collections']) assert.equal(editor.elements[field].value, '');
  assert.equal(elements['#supplier'].value,'');

  elements['#products'].value = productId;
  await elements['#products'].dispatch('change');
  editor.elements.price.value = '17.50';
  await editor.dispatch('submit');
  assert.equal(rows.get(productId).price, 1750);
  assert.match(elements['#product-message'].textContent, /Producto actualizado correctamente/);

  await elements['#delete'].dispatch('click');
  assert.equal(rows.has(productId), false);
  assert.match(elements['#product-message'].textContent, /Producto eliminado correctamente/);

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
  assert.ok(calls.some(call => call.method === 'POST' && call.path === '/api/admin/products' && call.token === 'session-token'));
  assert.ok(calls.some(call => call.method === 'PUT' && call.token === 'session-token'));
  assert.ok(calls.some(call => call.method === 'DELETE' && call.path.startsWith('/api/products/') && call.token === 'session-token'));
});

test('si falla la actualización de la lista, informa que el producto sí se guardó', async () => {
  const {elements,rows,setFailRefresh}=makeHarness();
  elements['#login'].elements.password.value='valid-test-password';
  await elements['#login'].dispatch('submit');
  const editor=elements['#editor'];
  const data={name:'Crema',category:'Paquete de 12',size:'50 ml',price:'12.00',description:'Prueba',benefits:'',collections:''};
  for (const [field,value] of Object.entries(data)) editor.elements[field].value=value;
  elements['#supplier'].value='proveedor-prueba';
  setFailRefresh(true);
  await editor.dispatch('submit');
  assert.ok(rows.has('crema-12345678'));
  assert.equal(editor.elements.name.value,'');
  assert.match(elements['#product-message'].textContent,/Producto guardado, pero no se pudo actualizar/);
});

test('editar un producto anterior conserva su identificador, categoría y campos ocultos', async () => {
  const { elements, rows } = makeHarness();
  const original={id:'shampoo',name:'Shampoo',category:'Cabello',size:'250 ml',price:1250,art:'cream',label:'Limpieza suave',description:'Descripción',benefits:[],collections:[]};
  rows.set(original.id,original);
  elements['#login'].elements.password.value='valid-test-password';
  await elements['#login'].dispatch('submit');
  elements['#products'].value=original.id;
  await elements['#products'].dispatch('change');
  assert.equal(elements['#editor'].elements.price.value,'12.50');
  elements['#editor'].elements.price.value='13.25';
  await elements['#editor'].dispatch('submit');
  assert.equal(rows.get('shampoo').category,'Cabello');
  assert.equal(rows.get('shampoo').art,'cream');
  assert.equal(rows.get('shampoo').label,'Limpieza suave');
  assert.equal(rows.get('shampoo').price,1325);
});
