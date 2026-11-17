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
  return {
    async list() { return (await request({ select: 'data', order: 'position.asc,id.asc' })).map(row => row.data); },
    async get(id) { return (await request({ select: 'data', id: `eq.${id}` }))[0]?.data; },
    async create(product) {
      const rows = await request({ select: 'data,position', order: 'position.desc', limit: '1' });
      return (await request({ select: 'data' }, { method: 'POST', write: true, body: { id: product.id, position: (rows[0]?.position ?? -1) + 1, data: product } }))[0].data;
    },
    async update(id, product) { return (await request({ select: 'data', id: `eq.${id}` }, { method: 'PATCH', write: true, body: { data: product } }))[0]?.data; },
    async remove(id) { return (await request({ select: 'data', id: `eq.${id}` }, { method: 'DELETE', write: true })).length > 0; }
  };
}
module.exports = { createSupabaseProductRepository };
