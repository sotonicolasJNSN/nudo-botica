'use strict';

function mapInventoryError(error) {
  const code = error?.meta?.code || error?.code;
  const message = error?.meta?.message || error?.message || '';
  if (code === 'P0001') {
    error.status = message.includes('PRODUCT_NOT_FOUND') ? 404 : 409;
    error.message = message.includes('PRODUCT_NOT_FOUND')
      ? 'Producto no encontrado'
      : 'Stock insuficiente para completar el pedido';
  } else if (code === '22023') {
    error.status = 400;
    error.message = 'No se pudo validar el inventario';
  } else if (code === '42883' || code === '42P01') {
    error.status = 503;
    error.message = 'La migración del kardex no está aplicada en la base de datos conectada';
  } else {
    error.message = message;
  }
  return error;
}

module.exports = { mapInventoryError };
