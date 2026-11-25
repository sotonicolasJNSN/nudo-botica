'use strict';
// La clave secreta solo se usa en el servidor; RLS protege el acceso público.
function createSupabaseProductRepository({ url, publishableKey, secretKey, fetchImpl = fetch }) {
  const base = new URL(url);
  if (base.protocol !== 'https:' || base.username || base.password || base.pathname !== '/' || base.search || base.hash) throw new Error('SUPABASE_URL debe ser la URL HTTPS de origen del proyecto');
  async function request(params, { method = 'GET', body, write = false } = {}) {
    if (write && !secretKey) { const error = new Error('Escritura en Supabase no configurada'); error.status = 503; throw error; }
    const endpoint = new URL('/rest/v1/products', base);
    for (const [key, value] of Object.entries(params)) endpoint.searchParams.set(key, value);
    const key = write ? secretKey : publishableKey;
    const headers = { apikey: key, Accept: 'application/json' };
    if (write) { headers['Content-Type'] = 'application/json'; headers.Prefer = 'return=representation'; }
    const response = await fetchImpl(endpoint, { method, headers, ...(body ? { body: JSON.stringify(body) } : {}), signal: AbortSignal.timeout(8000) });
    if (!response.ok) { const error = new Error(`Supabase devolvió HTTP ${response.status}`); if (response.status === 409) { error.status = 409; error.message = 'El producto ya existe'; } throw error; }
    const rows = await response.json();
    if (!Array.isArray(rows) || rows.some(row => !row || typeof row.data !== 'object' || row.data === null)) throw new Error('Respuesta de catálogo de Supabase inválida');
    return rows;
  }
  async function placeOrder(order) {
    return callInventoryRpc('nudo_place_order', {
      p_order_id: order.reference,
      p_items: order.items
    });
  }
  async function callInventoryRpc(name, body) {
    if (!secretKey) { const error = new Error('Escritura en Supabase no configurada'); error.status = 503; throw error; }
    const endpoint = new URL(`/rest/v1/rpc/${name}`, base);
    const response = await fetchImpl(endpoint, {
      method: 'POST',
      headers: { apikey: secretKey, Accept: 'application/json', 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(8000)
    });
    if (!response.ok) {
      let payload = {};
      try { payload = await response.json(); } catch {}
      const error = new Error(payload.message || `Supabase devolvió HTTP ${response.status}`);
      if (payload.code === 'P0001') {
        error.status = payload.message === 'PRODUCT_NOT_FOUND' ? 404 : 409;
        error.message = payload.message === 'PRODUCT_NOT_FOUND' ? 'Producto no encontrado' : 'Stock insuficiente para completar el pedido';
      } else if (payload.code === '22023') {
        error.status = 400;
        error.message = 'No se pudo validar el inventario';
      } else if (payload.code === 'PGRST202' || payload.code === 'PGRST203') {
        error.status = 503;
        error.message = name === 'nudo_place_order'
          ? 'La migración de inventario no está aplicada en la base de datos conectada'
          : 'La migración del kardex no está aplicada en la base de datos conectada';
      }
      throw error;
    }
    return response.json();
  }
  async function listInventoryMovements({ productId, limit, offset }) {
    if (!secretKey) { const error = new Error('Consulta del kardex no configurada'); error.status = 503; throw error; }
    const endpoint = new URL('/rest/v1/nudo_inventory_movements', base);
    endpoint.searchParams.set('select', 'id,product_id,product_name,movement_type,quantity,stock_before,stock_after,reference,notes,created_at');
    endpoint.searchParams.set('order', 'created_at.desc,id.desc');
    endpoint.searchParams.set('limit', String(limit));
    endpoint.searchParams.set('offset', String(offset));
    if (productId) endpoint.searchParams.set('product_id', `eq.${productId}`);
    const response = await fetchImpl(endpoint, {
      headers: { apikey: secretKey, Accept: 'application/json' },
      signal: AbortSignal.timeout(8000)
    });
    if (!response.ok) {
      let payload = {};
      try { payload = await response.json(); } catch {}
      const error = new Error(payload.message || `Supabase devolvió HTTP ${response.status}`);
      if (payload.code === 'PGRST205' || payload.code === '42P01') {
        error.status = 503;
        error.message = 'La migración del kardex no está aplicada en la base de datos conectada';
      }
      throw error;
    }
    const rows = await response.json();
    if (!Array.isArray(rows)) throw new Error('Respuesta de kardex de Supabase inválida');
    return rows.map(row => ({
      id: String(row.id),
      productId: row.product_id,
      productName: row.product_name,
      movementType: row.movement_type,
      quantity: Number(row.quantity),
      stockBefore: Number(row.stock_before),
      stockAfter: Number(row.stock_after),
      reference: row.reference,
      notes: row.notes,
      createdAt: row.created_at
    }));
  }
  return {
    async list() { return (await request({ select: 'data', order: 'position.asc,id.asc' })).map(row => row.data); },
    async get(id) { return (await request({ select: 'data', id: `eq.${id}` }))[0]?.data; },
    async create(product) {
      const rows = await request({ select: 'data,position', order: 'position.desc', limit: '1' });
      return (await request({ select: 'data' }, { method: 'POST', write: true, body: { id: product.id, position: (rows[0]?.position ?? -1) + 1, data: product } }))[0].data;
    },
    async update(id, product) { return (await request({ select: 'data', id: `eq.${id}` }, { method: 'PATCH', write: true, body: { data: product } }))[0]?.data; },
    async remove(id) { return (await request({ select: 'data', id: `eq.${id}` }, { method: 'DELETE', write: true })).length > 0; },
    placeOrder,
    listInventoryMovements,
    receiveStock(receipt) {
      return callInventoryRpc('nudo_receive_stock', {
        p_reference: receipt.reference,
        p_items: receipt.items,
        p_notes: receipt.notes
      });
    }
  };
}
module.exports = { createSupabaseProductRepository };
