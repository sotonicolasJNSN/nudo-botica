'use strict';

function mapInventoryError(error) {
  const code = error?.meta?.code || error?.code;
  const message = error?.meta?.message || error?.message || '';
  if (code === 'P0001') {
    error.status = 409;
    error.message = 'Stock insuficiente para completar el pedido';
  } else if (code === '22023') {
    error.status = 400;
    error.message = 'No se pudo validar el inventario';
  } else if (code === '42883') {
    error.status = 503;
    error.message = 'La migración de inventario no está aplicada en Supabase';
  } else {
    error.message = message;
  }
  return error;
}

module.exports = { mapInventoryError };
