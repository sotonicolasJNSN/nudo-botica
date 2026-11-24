'use strict';
function bad(message, status = 400) { const error = new Error(message); error.status = status; return error; }

function validateReceipt(receipt) {
  if (!receipt || typeof receipt !== 'object' || Array.isArray(receipt)) throw bad('Compra inválida');
  if (typeof receipt.reference !== 'string' || !/^COMPRA-[0-9A-F]{8}(?:-[0-9A-F]{4}){3}-[0-9A-F]{12}$/.test(receipt.reference)) {
    throw bad('Referencia de compra inválida');
  }
  if (typeof receipt.notes !== 'string' || receipt.notes.length > 500) throw bad('Observación inválida');
  if (!Array.isArray(receipt.items) || receipt.items.length < 1 || receipt.items.length > 60) throw bad('Artículos de compra inválidos');
  const seen = new Set();
  const items = receipt.items.map(item => {
    if (!item || typeof item.id !== 'string' || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(item.id) || item.id.length > 80) {
      throw bad('Identificador de producto inválido');
    }
    if (!Number.isSafeInteger(item.quantity) || item.quantity < 1 || item.quantity > 1000000000) {
      throw bad('Cantidad de compra inválida');
    }
    if (seen.has(item.id)) throw bad('No se permiten productos repetidos en una compra');
    seen.add(item.id);
    return { id: item.id, quantity: item.quantity };
  });
  return { reference: receipt.reference, notes: receipt.notes.trim(), items };
}

function validateMovementQuery(query) {
  const productId = query.productId || '';
  if (productId && (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(productId) || productId.length > 80)) {
    throw bad('Identificador de producto inválido');
  }
  const limit = query.limit === undefined ? 100 : Number(query.limit);
  const offset = query.offset === undefined ? 0 : Number(query.offset);
  if (!Number.isInteger(limit) || limit < 1 || limit > 100 || !Number.isSafeInteger(offset) || offset < 0) {
    throw bad('Paginación del kardex inválida');
  }
  return { productId: productId || null, limit, offset };
}

function createInventoryService(repository) {
  return {
    listMovements(query) {
      if (typeof repository.listInventoryMovements !== 'function') throw bad('Kardex no configurado', 503);
      return repository.listInventoryMovements(validateMovementQuery(query));
    },
    receiveStock(receipt) {
      if (typeof repository.receiveStock !== 'function') throw bad('Registro de compras no configurado', 503);
      return repository.receiveStock(validateReceipt(receipt));
    }
  };
}

module.exports = { createInventoryService, validateReceipt, validateMovementQuery };
