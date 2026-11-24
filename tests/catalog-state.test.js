'use strict';
const test = require('node:test'), assert = require('node:assert/strict'), vm = require('node:vm'), fs = require('node:fs'), path = require('node:path');
const source = fs.readFileSync(path.join(__dirname,'../frontend/catalog-repository.js'),'utf8');
async function load(response) {
 const demo = [{id:'demo'}]; const categories=['Cabello']; const context = { location:{protocol:'http:'}, NudoModel:{products:demo,categories}, fetch:async()=>response, AbortController, setTimeout, clearTimeout, URL };
 vm.createContext(context); vm.runInContext(source,context); return {state:await context.NudoCatalogRepository.load(), products:demo, categories};
}
test('catálogo distingue vacío real, respuesta inválida y caída', async () => {
 let result = await load({ok:true,json:async()=>[]}); assert.equal(result.state,'empty'); assert.equal(result.products.length,0);
 result = await load({ok:true,json:async()=>[{id:'incompleto'}]}); assert.equal(result.state,'demo'); assert.equal(result.products[0].id,'demo');
 result = await load({ok:false}); assert.equal(result.state,'demo'); assert.equal(result.products[0].id,'demo');
});

test('los productos de paquete aparecen en las categorías de la tienda', async () => {
 const product={id:'ejemplo',name:'Ejemplo',category:'Paquete de 12',description:'Prueba',label:'Ejemplo',size:'12 unidades',art:'sage',price:1200,benefits:[],collections:[]};
 const result=await load({ok:true,json:async()=>[product]});
 assert.equal(result.state,'api');
 assert.ok(result.categories.includes('Paquete de 12'));
 assert.ok(!result.categories.includes('Paquete de 24'));
});

test('tarjeta y arte escapan contenido del catálogo', () => {
  const fs = require('node:fs'), vm = require('node:vm'), path = require('node:path');
  const context = { NudoModel: { total: () => 0, deliveryFee: () => 0 }, Intl };
  vm.createContext(context); vm.runInContext(fs.readFileSync(path.join(__dirname,'../frontend/view.js'),'utf8'),context);
  const html = context.NudoView.card({ id:'x', name:'<img src=x onerror=alert(1)>', size:'50', category:'test', art:'sage', label:'test', price:100 });
  assert.doesNotMatch(html, /<img/); assert.match(html, /&lt;img/);
});

test('la ruta de filtros conserva el término de búsqueda', () => {
  const fs = require('node:fs'), vm = require('node:vm'), path = require('node:path');
  const context = { URLSearchParams }; vm.createContext(context);
  vm.runInContext(fs.readFileSync(path.join(__dirname,'../frontend/listing.js'),'utf8'),context);
  const route = context.NudoListing.route({category:'',price:'under-10',sort:'list'},'cuidado capilar');
  assert.equal(route,'buscar/cuidado%20capilar?precio=under-10');
});
