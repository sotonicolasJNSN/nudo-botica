'use strict';

// Data API con clave publicable: los permisos de PostgreSQL y RLS determinan el acceso.
function createSupabaseProductRepository({ url, publishableKey, fetchImpl = fetch }) {
  const base = new URL(url);
  if (base.protocol !== 'https:' || base.username || base.password || base.pathname !== '/' || base.search || base.hash) {
    throw new Error('SUPABASE_URL debe ser la URL HTTPS de origen del proyecto');
  }
  const endpoint = new URL('/rest/v1/products', base);
  endpoint.searchParams.set('select', 'data');
  endpoint.searchParams.set('order', 'position.asc,id.asc');
  return {
    async list() {
      const response = await fetchImpl(endpoint, {
        headers: { apikey: publishableKey, Accept: 'application/json' },
        signal: AbortSignal.timeout(8000)
      });
      if (!response.ok) throw new Error(`Supabase devolvió HTTP ${response.status}`);
      const rows = await response.json();
      if (!Array.isArray(rows) || rows.some(row => !row || typeof row.data !== 'object' || row.data === null)) {
        throw new Error('Respuesta de catálogo de Supabase inválida');
      }
      return rows.map(row => row.data);
    }
  };
}
module.exports = { createSupabaseProductRepository };
