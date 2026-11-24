'use strict';
const { validate } = require('./product-service');
function invalid(message) { const error = Error(message); error.status = 400; return error; }
function createSupplierService(repository) {
  return {
    list: () => repository.list(),
    links: () => repository.links(),
    create(input) {
      const name = typeof input?.name === 'string' ? input.name.trim() : '';
      if (!name || name.length > 120) throw invalid('Nombre de proveedor inválido');
      return repository.create(name);
    },
    saveProduct(body, id) {
      if (typeof body?.supplierId !== 'string' || !body.supplierId || body.supplierId.length > 80) throw invalid('Selecciona un proveedor');
      return repository.saveProduct(validate(body.product, id), body.supplierId, !id);
    }
  };
}
module.exports = { createSupplierService };
