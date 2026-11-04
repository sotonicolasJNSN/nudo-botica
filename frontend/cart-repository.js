'use strict';
// Infraestructura: solo se almacenan identificadores y cantidades.
globalThis.NudoCartRepository = (() => {
  const key = 'nudo-cart-v1';
  function load() {
    let raw;
    try { raw = localStorage.getItem(key); }
    catch { return { items: [], unavailable: true }; }
    let saved;
    try { saved = JSON.parse(raw || '[]'); }
    catch { return { items: [], unavailable: false }; }
    if (!Array.isArray(saved)) return { items: [], unavailable: false };
    const items = [];
    for (const item of saved.slice(0, 100)) {
      if (!item || typeof item !== 'object') continue;
      const product = globalThis.NudoModel.products.find(candidate => candidate.id === item.id);
      if (!product || !Number.isInteger(item.quantity) || item.quantity < 1 || item.quantity > 99 || items.some(entry => entry.product.id === item.id)) continue;
      items.push({ product, quantity: item.quantity });
    }
    return { items, unavailable: false };
  }
  function save(items) {
    try {
      localStorage.setItem(key, JSON.stringify(items.map(item => ({ id: item.product.id, quantity: item.quantity }))));
      return true;
    } catch { return false; }
  }
  return { load, save };
})();
