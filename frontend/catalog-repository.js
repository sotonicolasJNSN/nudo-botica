'use strict';
// El catálogo local permite seguir usando la demo cuando la API no está disponible.
globalThis.NudoCatalogRepository = {
  async load() {
    if (location.protocol === 'file:') return false;
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 3000);
    try {
      const response = await fetch('/api/products', { signal: controller.signal });
      if (!response.ok) return false;
      const products = await response.json();
      if (!Array.isArray(products) || !products.length || !products.every(product =>
        product && typeof product.id === 'string' && typeof product.name === 'string' &&
        typeof product.category === 'string' && typeof product.description === 'string' &&
        typeof product.label === 'string' && typeof product.size === 'string' &&
        typeof product.art === 'string' && Number.isSafeInteger(product.price) && product.price >= 0 &&
        Array.isArray(product.benefits) && Array.isArray(product.collections))) return false;
      globalThis.NudoModel.products.splice(0, globalThis.NudoModel.products.length, ...products);
      return true;
    } catch { return false; }
    finally { clearTimeout(timer); }
  }
};
