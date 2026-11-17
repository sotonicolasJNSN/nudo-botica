'use strict';
function bad(message, status = 400) { const error = new Error(message); error.status = status; return error; }
function validate(product, id) {
  if (!product || typeof product !== 'object' || Array.isArray(product)) throw bad('Producto inválido');
  if (typeof product.id !== 'string' || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(product.id) || product.id.length > 80 || (id && product.id !== id)) throw bad('Identificador inválido');
  for (const field of ['name','category','description','label','size','art']) {
    if (typeof product[field] !== 'string' || !product[field].trim() || product[field].length > 500) throw bad(`Campo ${field} inválido`);
  }
  if (!Number.isSafeInteger(product.price) || product.price < 0 || product.price > 10000000) throw bad('Precio inválido: use centavos enteros');
  for (const field of ['benefits','collections']) if (!Array.isArray(product[field]) || product[field].length > 30 || product[field].some(x => typeof x !== 'string' || !x.trim() || x.length > 200)) throw bad(`Campo ${field} inválido`);
  return Object.fromEntries(['id','name','category','description','label','size','art','price','benefits','collections'].map(key => [key, product[key]]));
}
function createProductService(repository) {
  return {
    list: () => repository.list(),
    get: async id => repository.get ? repository.get(id) : (await repository.list()).find(p => p.id === id),
    create: product => repository.create(validate(product)),
    update: (id, product) => repository.update(id, validate(product, id)),
    remove: id => repository.remove(id)
  };
}
module.exports = { createProductService };
