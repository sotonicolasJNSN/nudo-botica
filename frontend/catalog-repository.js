'use strict';
globalThis.NudoCatalogRepository = {
  async load() {
    if (location.protocol === 'file:') return 'demo';
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 8000);
    try {
      const base = globalThis.NUDO_API_BASE;
      const endpoint = base ? new URL('api/products', base.endsWith('/') ? base : base + '/').href : '/api/products';
      const response = await fetch(endpoint, { signal: controller.signal });
      if (!response.ok) return 'demo';
      const products = await response.json();
      if (!Array.isArray(products) || !products.every(product =>
        product && typeof product.id === 'string' && typeof product.name === 'string' &&
        typeof product.category === 'string' && typeof product.description === 'string' &&
        typeof product.label === 'string' && typeof product.size === 'string' &&
        typeof product.art === 'string' && Number.isSafeInteger(product.price) && product.price >= 0 &&
        Array.isArray(product.benefits) && Array.isArray(product.collections))) return 'demo';
      globalThis.NudoModel.products.splice(0, globalThis.NudoModel.products.length, ...products);
      return products.length ? 'api' : 'empty';
    } catch { return 'demo'; }
    finally { clearTimeout(timer); }
  }
};
