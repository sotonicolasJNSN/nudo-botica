'use strict';
// Componentes de presentaci?n reutilizables.
globalThis.NudoView = (() => {
const { total, deliveryFee } = globalThis.NudoModel;
const money = cents => '$' + new Intl.NumberFormat('es-EC', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(cents / 100);
const escapeHTML = value => String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
const icon = name => `<svg class="icon" aria-hidden="true"><use href="#icon-${name}"></use></svg>`;
const categoryIcon = category => ({ 'Cabello': 'hair', 'Rizos y ondas': 'hair', 'Cuero cabelludo': 'hair', 'Estilo y barba': 'beard', 'Cuidado personal': 'care' })[category] || 'bottle';
const art = (product, options = {}) => {
  const hasImage = !options.illustration && globalThis.NudoProductImages?.has(product.id);
  const priority = options.priority === true;
  const image = hasImage ? `<img class="product-render" src="images/products/${encodeURIComponent(product.id)}.webp?v=photos-20261116" width="512" height="512" loading="${priority ? 'eager' : 'lazy'}" decoding="async"${priority ? ' fetchpriority="high"' : ''} alt="">` : '';
  return `<div class="art ${escapeHTML(product.art)}${hasImage ? ' has-product-render' : ''}" role="img" aria-label="${hasImage ? 'Fotografía de' : 'Ilustración de'} ${escapeHTML(product.name)}, envase de ${escapeHTML(product.size)}"><div class="pack" aria-hidden="true"><div class="label"><b>nudo</b><span>${escapeHTML(product.label)}</span><small>${escapeHTML(product.size)} · BOTICA</small></div></div>${image}</div>`;
};
const heading = (eyebrow, title) => `<p class="eyebrow">${eyebrow}</p><h1 tabindex="-1">${title}</h1>`;
const card = product => `<article class="card"><a class="card-visual" href="#detalle/${escapeHTML(product.id)}" aria-label="Ver ${escapeHTML(product.name)}">${art(product)}</a><p class="eyebrow">${escapeHTML(product.category)}</p><h3><a href="#detalle/${escapeHTML(product.id)}">${escapeHTML(product.name)}</a></h3><p class="card-size">${escapeHTML(product.size)}</p><div class="card-bottom"><strong>${money(product.price)}</strong><a href="#detalle/${escapeHTML(product.id)}" aria-label="Ver detalle de ${escapeHTML(product.name)}">Ver detalle ↗</a></div><button class="card-add" type="button" data-add="${escapeHTML(product.id)}" aria-label="Agregar ${escapeHTML(product.name)} al carrito">${icon('cart')}<span>Agregar</span></button></article>`;
const miniProduct = (product, index) => `<article class="mini-product">${art(product, { priority: index === 0 })}<div class="mini-product-copy"><h3>${escapeHTML(product.name)}</h3><strong>${money(product.price)}</strong><a href="#detalle/${encodeURIComponent(product.id)}" aria-label="Ver detalle de ${escapeHTML(product.name)}">Ver detalle ↗</a></div></article>`;
const totals = (items, fulfillment) => `<dl class="totals"><div><dt>Subtotal</dt><dd>${money(total(items))}</dd></div>${fulfillment === 'online-home' ? `<div><dt>Envío</dt><dd>${money(deliveryFee(fulfillment))}</dd></div>` : ''}<div class="total"><dt>Total</dt><dd>${money(total(items) + deliveryFee(fulfillment))}</dd></div></dl>`;
const summary = (items, fulfillment) => `<ul class="summary">${items.map(item => `<li><span>${escapeHTML(item.product.name)} × ${item.quantity}</span><strong>${money(item.product.price * item.quantity)}</strong></li>`).join('')}</ul>${totals(items, fulfillment)}`;
const stepper = step => `<ol class="stepper" aria-label="Pasos del checkout">${[['Datos de compra/contacto', 'person'], ['Pago', 'card'], ['Confirmación', 'check']].map(([label, symbol], index) => `<li ${index + 1 === step ? 'aria-current="step"' : ''} class="${index + 1 < step ? 'done' : ''}"><span aria-hidden="true">${index + 1 < step ? icon('check') : icon(symbol)}</span>${label}</li>`).join('')}</ol>`;
return { money, escapeHTML, icon, categoryIcon, art, heading, card, miniProduct, totals, summary, stepper };
})();
