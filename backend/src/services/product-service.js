'use strict';
function bad(message, status = 400) { const error = new Error(message); error.status = status; return error; }
function validate(product, id) {
  if (!product || typeof product !== 'object' || Array.isArray(product)) throw bad('Producto inválido');
  if (typeof product.id !== 'string' || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(product.id) || product.id.length > 80 || (id && product.id !== id)) throw bad('Identificador inválido');
  for (const field of ['name','category','description','label','size','art']) {
    if (typeof product[field] !== 'string' || !product[field].trim() || product[field].length > 500) throw bad(`Campo ${field} inválido`);
  }
  if (!Number.isSafeInteger(product.price) || product.price < 0 || product.price > 10000000) throw bad('Precio inválido: use centavos enteros');
  const stock = product.stock === undefined ? 0 : product.stock;
  if (!Number.isSafeInteger(stock) || stock < 0 || stock > 1000000000) throw bad('Stock inválido: use una cantidad entera no negativa');
  for (const field of ['benefits','collections']) if (!Array.isArray(product[field]) || product[field].length > 30 || product[field].some(x => typeof x !== 'string' || !x.trim() || x.length > 200)) throw bad(`Campo ${field} inválido`);
  return { ...Object.fromEntries(['id','name','category','description','label','size','art','price','benefits','collections'].map(key => [key, product[key]])), stock };
}
function validateOrder(order) {
  if (!order || typeof order !== 'object' || !/^NUDO-[0-9A-F]{4}(?:-[0-9A-F]{4}){3}$/.test(order.reference || '')) throw bad('Referencia de pedido inválida');
  if (!Array.isArray(order.items) || order.items.length < 1 || order.items.length > 60) throw bad('Artículos del pedido inválidos');
  const seen = new Set();
  const items = order.items.map(item => {
    if (!item || typeof item.id !== 'string' || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(item.id) || item.id.length > 80) throw bad('Identificador de producto inválido');
    if (!Number.isSafeInteger(item.quantity) || item.quantity < 1 || item.quantity > 99) throw bad('Cantidad inválida');
    if (seen.has(item.id)) throw bad('No se permiten productos repetidos en el pedido');
    seen.add(item.id);
    return { id: item.id, quantity: item.quantity };
  });
  return { reference: order.reference, items };
}
function createProductService(repository) {
  return {
    list: () => repository.list(),
    get: async id => repository.get ? repository.get(id) : (await repository.list()).find(p => p.id === id),
    create: product => repository.create(validate(product)),
    update: (id, product) => repository.update(id, validate(product, id)),
    remove: id => repository.remove(id),
    placeOrder: async order => {
      if (typeof repository.placeOrder !== 'function') throw bad('Descuento de inventario no configurado', 503);
      return repository.placeOrder(validateOrder(order));
    }
  };
}
module.exports = { createProductService, validate };
