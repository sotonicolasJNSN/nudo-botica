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
  const selectors = ['#admin-status', '#login', '#panel', '#products', '#editor', '#delete', '#new', '#refresh', '#logout', '#supplier', '#supplier-list', '#supplier-form', '#supplier-to-delete', '#delete-supplier', '#supplier-add-message', '#supplier-delete-message', '#product-message', '#kardex-product', '#kardex-rows', '#kardex-status', '#receipt-product', '#inventory-receipt-form', '#refresh-kardex', '#kardex-purchases', '#kardex-sales', '#kardex-adjustments'];
  const elements = Object.fromEntries(selectors.map(selector => [selector, new Element()]));
  const fields = ['id', 'name', 'category', 'size', 'price', 'stock', 'art', 'label', 'description', 'benefits', 'collections'];
  elements['#login'].elements.password = new Element();
  elements['#supplier-form'].elements.name = new Element();
  elements['#editor'].elements = Object.fromEntries(fields.map(field => [field, new Element()]));
  elements['#inventory-receipt-form'].elements = {
    productId: elements['#receipt-product'],
    quantity: new Element(),
    notes: new Element()
  };
  const rows = new Map();
  const supplierRows = [{ id:'proveedor-prueba', name:'Proveedor de prueba' }];
  const ledger = [{ id:'1', productId:'shampoo', productName:'Shampoo', movementType:'sale', quantity:2, stockBefore:5, stockAfter:3, reference:'NUDO-A1B2-C3D4-E5F6-A7B8', notes:'Pedido confirmado', createdAt:'2026-11-24T12:00:00.000Z' }];
  const calls = [];
  let serverToken = '';
  let failLogout = false;
  let failRefresh = false;
  const fetch = async (input, options = {}) => {
    const url = new URL(input);
    const method = options.method || 'GET';
    const headers = options.headers || {};
    const token = (headers.Authorization || '').replace(/^Bearer /, '');
    const body = options.body ? JSON.parse(options.body) : undefined;
    calls.push({ origin: url.origin, path: url.pathname, method, token, body });
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
    if (url.pathname === '/api/admin/inventory-movements' && method === 'GET') {
      if (token !== serverToken) return respond(401, { error: 'Session required' });
      return respond(200, ledger.filter(item => !url.searchParams.get('productId') || item.productId === url.searchParams.get('productId')));
    }
    if (url.pathname === '/api/admin/inventory-receipts' && method === 'POST') {
      if (token !== serverToken) return respond(401, { error: 'Session required' });
      const { reference, items, notes } = body;
      const item = items[0], product = rows.get(item.id);
      product.stock += item.quantity;
      ledger.unshift({ id:String(ledger.length + 1), productId:item.id, productName:product.name, movementType:'purchase', quantity:item.quantity, stockBefore:product.stock - item.quantity, stockAfter:product.stock, reference, notes, createdAt:'2026-11-24T12:00:00.000Z' });
      return respond(201, { reference, stock:[{id:item.id,stock:product.stock}] });
    }
    if (url.pathname.startsWith('/api/admin/products')) {
      if (token !== serverToken) return respond(401, { error: 'Session required' });
      const {product, supplierId} = body;
      if (supplierId !== 'proveedor-prueba') return respond(400, {error:'Proveedor inválido'});
      rows.set(product.id, product);
      return respond(method === 'POST' ? 201 : 200, product);
    }
    if (url.pathname.startsWith('/api/products')) {
      if (method !== 'GET' && token !== serverToken) return respond(401, { error: 'Session required' });
      if (url.pathname === '/api/products' && method === 'GET') return respond(200, [...rows.values()]);
      if (url.pathname === '/api/products' && method === 'POST') {
        const product = body;
        if (rows.has(product.id)) return respond(409, { error: 'Duplicate' });
        rows.set(product.id, product);
        return respond(201, product);
      }
      const id = decodeURIComponent(url.pathname.slice('/api/products/'.length));
      if (method === 'PUT') {
        if (!rows.has(id)) return respond(404, { error: 'Not found' });
        const product = body;
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
  const context = { location: { hostname: 'sotonicolasjnsn.github.io', origin: 'https://sotonicolasjnsn.github.io' }, document: { querySelector: selector => elements[selector], createElement: () => new Element() }, crypto:{randomUUID:()=>'12345678-abcd-4000-8000-123456789012'}, fetch, URL, URLSearchParams, Option: class { constructor(text, value) { this.text = text; this.value = value; } }, confirm: () => true };
  vm.createContext(context);
  vm.runInContext(configSource, context);
  vm.runInContext(adminSource, context);
  return { elements, rows, calls, ledger, setFailLogout(value) { failLogout = value; }, setFailRefresh(value) { failRefresh = value; } };
}

test('admin panel uses deployed API for login and CRUD and reports logout errors', async () => {
  const { elements, rows, calls, setFailLogout } = makeHarness();
  elements['#login'].elements.password.value = 'valid-test-password';
  await elements['#login'].dispatch('submit');
  assert.equal(elements['#panel'].hidden, false);
  assert.match(elements['#admin-status'].textContent, /activa/);
  assert.equal(elements['#kardex-sales'].textContent, '2');
  assert.equal(elements['#kardex-rows'].options.length, 1);
  elements['#supplier-form'].elements.name.value = 'Nuevo proveedor';
  await elements['#supplier-form'].dispatch('submit');
  assert.match(elements['#supplier-add-message'].textContent, /Proveedor agregado correctamente/);
  assert.ok(elements['#supplier'].options.some(option => option.text === 'Nuevo proveedor'));
  elements['#supplier-to-delete'].value = 'otro-proveedor';
  await elements['#delete-supplier'].dispatch('click');
  assert.match(elements['#supplier-delete-message'].textContent, /Proveedor eliminado correctamente/);

  const editor = elements['#editor'];
  const product = { name:'Temporary product', category:'Paquete de 12', size:'50 ml', price:'12.00', stock:'12', description:'Temporary test', benefits:'Test benefit', collections:'diario' };
  const productId = 'temporary-product-12345678';
  for (const [field, value] of Object.entries(product)) editor.elements[field].value = value;
  elements['#supplier'].value = 'proveedor-prueba';
  await editor.dispatch('submit');
  assert.equal(rows.get(productId).price, 1200);
  assert.equal(rows.get(productId).stock, 12);
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

test('administra ingresos de compra y actualiza cantidades del kardex', async () => {
  const { elements, rows, calls, ledger } = makeHarness();
  rows.set('shampoo', { id:'shampoo', name:'Shampoo', category:'Cabello', size:'250 ml', price:1200, stock:10, art:'sage', label:'Shampoo', description:'Producto', benefits:[], collections:[] });
  elements['#login'].elements.password.value = 'valid-test-password';
  await elements['#login'].dispatch('submit');
  const form = elements['#inventory-receipt-form'];
  form.elements.productId.value = 'shampoo';
  form.elements.quantity.value = '12';
  form.elements.notes.value = 'Factura 123';
  await form.dispatch('submit');

  const call = calls.find(item => item.path === '/api/admin/inventory-receipts');
  assert.equal(call.method, 'POST');
  assert.equal(call.token, 'session-token');
  assert.equal(call.body.items[0].quantity, 12);
  assert.match(call.body.reference, /^COMPRA-[0-9A-F-]{36}$/);
  assert.equal(rows.get('shampoo').stock, 22);
  assert.equal(ledger[0].movementType, 'purchase');
  assert.equal(elements['#kardex-purchases'].textContent, '12');
  assert.match(elements['#kardex-status'].textContent, /movimientos cargados/);
});

test('no envía al kardex cantidades de compra fraccionarias', async () => {
  const { elements, rows, calls } = makeHarness();
  rows.set('shampoo', { id:'shampoo', name:'Shampoo', category:'Cabello', size:'250 ml', price:1200, stock:10, art:'sage', label:'Shampoo', description:'Producto', benefits:[], collections:[] });
  elements['#login'].elements.password.value = 'valid-test-password';
  await elements['#login'].dispatch('submit');
  const form = elements['#inventory-receipt-form'];
  form.elements.productId.value = 'shampoo';
  form.elements.quantity.value = '1.5';
  await form.dispatch('submit');

  assert.equal(calls.some(item => item.path === '/api/admin/inventory-receipts'), false);
  assert.equal(rows.get('shampoo').stock, 10);
  assert.match(elements['#kardex-status'].textContent, /entero positivo/);
});

test('si falla la actualización de la lista, informa que el producto sí se guardó', async () => {
  const {elements,rows,setFailRefresh}=makeHarness();
  elements['#login'].elements.password.value='valid-test-password';
  await elements['#login'].dispatch('submit');
  const editor=elements['#editor'];
  const data={name:'Crema',category:'Paquete de 12',size:'50 ml',price:'12.00',stock:'0',description:'Prueba',benefits:'',collections:''};
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
