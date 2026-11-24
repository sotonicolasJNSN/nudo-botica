'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const { createApp } = require('../backend/src/app');
const { createSupplierRepository } = require('../backend/src/repositories/supplier-repository');

test('proveedores requieren sesión y el producto requiere proveedor válido', async t => {
  const records = new Map();
  const suppliers = { list: async () => [...records.values()], links: async () => [], create: async name => { const row = { id:'p1', name }; records.set(row.id, row); return row; }, saveProduct: async (product, supplierId) => { if (!records.has(supplierId)) { const e=Error('Proveedor no encontrado'); e.status=400; throw e; } return product; } };
  const server = createApp({ list: async () => [] }, { suppliers, adminPassword:'clave-de-prueba-larga' });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  t.after(() => new Promise(resolve => server.close(resolve)));
  const base = `http://127.0.0.1:${server.address().port}`;
  const call = (path, method='GET', body, token) => fetch(base+path,{method,headers:{...(body ? {'Content-Type':'application/json'}:{}),...(token ? {Authorization:`Bearer ${token}`}:{})},...(body ? {body:JSON.stringify(body)}:{})});
  assert.equal((await call('/api/suppliers')).status, 401);
  const {token} = await (await call('/api/session','POST',{password:'clave-de-prueba-larga'})).json();
  assert.equal((await call('/api/suppliers','POST',{name:'  '},token)).status,400);
  assert.equal((await call('/api/suppliers','POST',{name:'Proveedor ficticio'},token)).status,201);
  assert.equal((await (await call('/api/suppliers','GET',null,token)).json())[0].name,'Proveedor ficticio');
  const product={id:'test',name:'Test',category:'Cabello',description:'Prueba',label:'Prueba',size:'50 ml',art:'sage',price:100,benefits:[],collections:[]};
  assert.equal((await call('/api/admin/products','POST',{product,supplierId:'no-existe'},token)).status,400);
  assert.equal((await call('/api/admin/products','POST',{product,supplierId:'p1'},token)).status,201);
});

test('repositorio guarda producto y relación en una sola transacción', async () => {
  const events=[];
  const tx={ supplier:{findUnique:async()=>({id:'p1'})}, product:{aggregate:async()=>({_max:{position:5}}),create:async q=>events.push(['product',q.data])}, productSupplier:{upsert:async q=>events.push(['link',q.create])} };
  const repository=createSupplierRepository({$transaction:async action=>action(tx)});
  await repository.saveProduct({id:'nuevo'},'p1',true);
  assert.equal(events[0][1].position,6);
  assert.deepEqual(events[1],['link',{productId:'nuevo',supplierId:'p1'}]);
});
