'use strict';

const products = [
  { id: 'shampoo', collections: ["diario","mas-vendidos","shampoos"], name: 'Shampoo suave', category: 'Cabello', size: '250 ml', price: 1250, art: 'sage', label: 'Limpieza suave', description: 'Una pausa fresca para tu cabello. Limpieza delicada con una textura ligera que acompaña el cuidado de todos los días.', benefits: ['Limpieza suave para uso frecuente', 'Sensación fresca y ligera', 'Para distintas texturas de cabello'] },
  { id: 'acondicionador', collections: ["diario","acondicionadores"], name: 'Acondicionador nutritivo', category: 'Cabello', size: '250 ml', price: 1400, art: 'cream', label: 'Suavidad diaria', description: 'Un gesto sencillo después del lavado. Una textura cremosa para desenredar con calma y dejar el cabello suave al tacto.', benefits: ['Facilita el desenredado', 'Suaviza medios y puntas', 'Textura cremosa de fácil enjuague'] },
  { id: 'tratamiento', collections: ["tratamientos","mas-vendidos"], name: 'Mascarilla reparadora', category: 'Cabello', size: '200 g', price: 1850, art: 'jar clay', label: 'Pausa nutritiva', description: 'Dedica unos minutos a tus largos. Un tratamiento envolvente para sumar suavidad a tu ritual semanal.', benefits: ['Cuidado intensivo de medios y puntas', 'Ayuda a controlar el frizz', 'Ideal para una pausa semanal'] },
  { id: 'cera', collections: ["peinado","mas-vendidos"], name: 'Cera de acabado mate', category: 'Estilo y barba', size: '80 g', price: 1150, art: 'jar dark', label: 'Forma libre', description: 'Define tu estilo a tu manera. Una cera moldeable para dar forma y textura sin un acabado brillante.', benefits: ['Acabado mate natural', 'Fijación flexible', 'Permite retocar el peinado'] },
  { id: 'polvo', collections: ["peinado"], name: 'Polvo de volumen', category: 'Estilo y barba', size: '15 g', price: 1350, art: 'powder cream', label: 'Aire y volumen', description: 'Un poco de textura, muchas posibilidades. Polvo ligero para dar cuerpo a las raíces y movimiento al peinado.', benefits: ['Aporta textura y volumen', 'Acabado ligero y mate', 'Aplicación sobre cabello seco'] },
  { id: 'aceite', collections: ["barba","mas-vendidos"], name: 'Aceite de cabello y barba', category: 'Estilo y barba', size: '30 ml', price: 1600, art: 'oil clay', label: 'Gotas de calma', description: 'El toque final para cabello y barba. Unas gotas para suavizar las puntas y acompañar tu rutina de cuidado.', benefits: ['Suavidad para cabello y barba', 'Brillo de aspecto natural', 'Gotero para dosificar fácilmente'] },
  { id: 'jabon', collections: ["diario"], name: 'Gel de ducha botánico', category: 'Cuidado personal', size: '300 ml', price: 1000, art: 'dark', label: 'Ritual de agua', description: 'Transforma la ducha en un pequeño descanso. Una espuma ligera y una sensación limpia para empezar o terminar el día.', benefits: ['Limpieza corporal diaria', 'Espuma suave de fácil enjuague', 'Aroma herbal delicado'] },
  { id: 'crema', collections: ["diario"], name: 'Crema de manos', category: 'Cuidado personal', size: '75 ml', price: 950, art: 'tube clay', label: 'Manos en calma', description: 'Cuidado que va contigo. Una crema de textura ligera para mantener las manos suaves durante el día.', benefits: ['Suaviza la piel de las manos', 'Textura de rápida absorción', 'Formato práctico para llevar'] },
  {"id":"crema-peinar","collections":["peinado"],"name":"Crema para peinar","category":"Estilo y barba","size":"150 ml","price":1300,"art":"tube clay","label":"Movimiento natural","description":"Una crema ligera para acompañar ondas y rizos con una forma suave y natural.","benefits":["Definición flexible","Ayuda a controlar el frizz","Aplicación en medios y puntas"]},
  {"id":"spray-textura","collections":["peinado"],"name":"Spray de textura","category":"Estilo y barba","size":"150 ml","price":1450,"art":"sage","label":"Textura libre","description":"Un acabado desenfadado para dar cuerpo al cabello y conservar su movimiento.","benefits":["Aporta cuerpo al peinado","Acabado de aspecto natural","Permite remodelar con las manos"]},
  {"id":"serum-puntas","collections":["tratamientos"],"name":"Sérum de puntas","category":"Cabello","size":"30 ml","price":1750,"art":"oil cream","label":"Suavidad en gotas","description":"Un gesto concentrado para suavizar los largos y dar un acabado cuidado a las puntas.","benefits":["Suaviza las puntas","Aporta brillo ligero","Dosificación con gotero"]},
  {"id":"protector-termico","collections":["tratamientos"],"name":"Protector térmico","category":"Cabello","size":"150 ml","price":1550,"art":"cream","label":"Antes del peinado","description":"Un paso de cuidado antes del secador para acompañar el peinado con una textura ligera.","benefits":["Cuidado previo al secado","Facilita el peinado","Aplicación sobre cabello húmedo"]},
  {"id":"exfoliante-capilar","collections":["tratamientos"],"name":"Exfoliante capilar","category":"Cabello","size":"150 g","price":1800,"art":"jar sage","label":"Renovar el ritual","description":"Una pausa ocasional antes del lavado para masajear suavemente el cuero cabelludo y retirar residuos.","benefits":["Complementa la limpieza","Textura para masaje suave","Se retira con abundante agua"]},
  {"id":"limpiador-barba","collections":["barba"],"name":"Limpiador de barba","category":"Estilo y barba","size":"150 ml","price":1200,"art":"dark","label":"Barba fresca","description":"Una limpieza suave para la barba, con espuma ligera y un enjuague sencillo.","benefits":["Retira residuos cotidianos","Espuma de fácil enjuague","Deja una sensación fresca"]},
  {"id":"balsamo-barba","collections":["barba"],"name":"Bálsamo de barba","category":"Estilo y barba","size":"60 g","price":1400,"art":"jar cream","label":"Forma y suavidad","description":"Un bálsamo para ordenar la barba y suavizar su textura sin perder un acabado natural.","benefits":["Ayuda a ordenar la barba","Fijación suave","Se distribuye con las manos"]},
  {"id":"locion-barba","collections":["barba"],"name":"Loción de barba","category":"Estilo y barba","size":"100 ml","price":1350,"art":"clay","label":"Cuidado ligero","description":"Un cuidado ligero después de la limpieza para dejar la barba suave y fácil de peinar.","benefits":["Suaviza el vello facial","Textura ligera sin enjuague","Facilita el peinado diario"]},
  {"id": "shampoo-equilibrante", "collections": ["shampoos"], "name": "Shampoo equilibrante", "category": "Cabello", "size": "250 ml", "price": 1300, "art": "dark", "label": "Equilibrio diario", "description": "Una limpieza de textura suave para acompañar tu ritual de lavado.", "benefits": ["Limpieza de uso cotidiano", "Espuma de fácil enjuague", "Aplicar sobre cabello húmedo"]},
  {"id": "shampoo-nutritivo", "collections": ["shampoos"], "name": "Shampoo nutritivo", "category": "Cabello", "size": "250 ml", "price": 1450, "art": "clay", "label": "Limpieza envolvente", "description": "Una limpieza de textura suave para acompañar tu ritual de lavado.", "benefits": ["Limpieza de uso cotidiano", "Espuma de fácil enjuague", "Aplicar sobre cabello húmedo"]},
  {"id": "shampoo-ligero", "collections": ["shampoos"], "name": "Shampoo ligero", "category": "Cabello", "size": "250 ml", "price": 1350, "art": "cream", "label": "Frescura ligera", "description": "Una limpieza de textura suave para acompañar tu ritual de lavado.", "benefits": ["Limpieza de uso cotidiano", "Espuma de fácil enjuague", "Aplicar sobre cabello húmedo"]},
  {"id": "acondicionador-ligero", "collections": ["acondicionadores"], "name": "Acondicionador ligero", "category": "Cabello", "size": "250 ml", "price": 1450, "art": "sage", "label": "Suavidad ligera", "description": "Una textura cremosa para desenredar y suavizar el cabello después del lavado.", "benefits": ["Facilita el desenredado", "Suaviza medios y puntas", "Enjuagar después de aplicar"]},
  {"id": "acondicionador-rizos", "collections": ["acondicionadores"], "name": "Acondicionador para rizos", "category": "Cabello", "size": "250 ml", "price": 1550, "art": "clay", "label": "Rizos suaves", "description": "Una textura cremosa para desenredar y suavizar el cabello después del lavado.", "benefits": ["Facilita el desenredado", "Suaviza medios y puntas", "Enjuagar después de aplicar"]},
  {"id": "acondicionador-puntas", "collections": ["acondicionadores"], "name": "Acondicionador de medios y puntas", "category": "Cabello", "size": "250 ml", "price": 1500, "art": "cream", "label": "Cuidado de largos", "description": "Una textura cremosa para desenredar y suavizar el cabello después del lavado.", "benefits": ["Facilita el desenredado", "Suaviza medios y puntas", "Enjuagar después de aplicar"]}
];
const categories = ['Cabello', 'Estilo y barba', 'Cuidado personal'];
// Colecciones independientes de los índices históricos de categoría.
const collections = [
  { id: 'diario', title: 'Cuidado diario', note: 'Los gestos de cada día', description: 'Limpieza y suavidad para acompañar tu rutina.' },
  { id: 'peinado', title: 'Peinado y fijación', note: 'Forma a tu manera', description: 'Texturas y acabados para encontrar tu estilo.' },
  { id: 'tratamientos', title: 'Tratamientos', note: 'Un momento de cuidado', description: 'Una selección para dedicar tiempo al cabello.' },
  { id: 'barba', title: 'Cuidado de barba', note: 'Tu ritual de barba', description: 'Limpiar, suavizar y dar forma con calma.' },
  { id: 'mas-vendidos', title: 'Más vendidos', note: 'La selección NUDO', description: 'Cuatro destacados de nuestra selección demostrativa.' },
  { id: 'shampoos', title: 'Shampoos', note: 'El inicio del ritual', description: 'Cuatro formas de acompañar tu lavado.' },
  { id: 'acondicionadores', title: 'Acondicionadores', note: 'Un gesto de suavidad', description: 'Cuatro cuidados para desenredar y suavizar.' }
];
const homeCollections = ['diario', 'peinado', 'tratamientos', 'barba', 'mas-vendidos'].map(id => collections.find(collection => collection.id === id));
const quickCollections = ['shampoos', 'acondicionadores', 'peinado', 'tratamientos', 'barba'].map(id => collections.find(collection => collection.id === id));
const collectionProducts = collection => products.filter(product => product.collections.includes(collection.id));
const collectionHref = collection => '#productos/coleccion-' + collection.id;
const app = document.querySelector('#app');
const status = document.querySelector('#status');
const storageKey = 'nudo-cart-v1';
const money = cents => new Intl.NumberFormat('es', { style: 'currency', currency: 'USD' }).format(cents / 100);
const total = items => items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
const escapeHTML = value => String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
let cart = loadCart();
let shipping = {};
let shippingReady = false;
let order = null;
let orderNumber = 0;
let storageWarning = false;

function loadCart() {
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey) || '[]');
    if (!Array.isArray(saved)) return [];
    const result = [];
    for (const item of saved.slice(0, 100)) {
      if (!item || typeof item !== 'object') continue;
      const product = products.find(product => product.id === item.id);
      if (!product || !Number.isInteger(item.quantity) || item.quantity < 1 || item.quantity > 99 || result.some(entry => entry.product.id === item.id)) continue;
      result.push({ product, quantity: item.quantity });
    }
    return result;
  } catch { return []; }
}
function saveCart() {
  try { localStorage.setItem(storageKey, JSON.stringify(cart.map(item => ({ id: item.product.id, quantity: item.quantity })))); }
  catch { storageWarning = true; }
}
function announce(message) { status.textContent = message + (storageWarning ? ' El navegador no permite guardar el carrito; se conservará solo durante esta sesión.' : ''); }
const art = product => `<div class="art ${product.art}" role="img" aria-label="Ilustración de ${product.name}, envase de ${product.size}"><div class="pack" aria-hidden="true"><div class="label"><b>nudo</b><span>${product.label}</span><small>${product.size} · BOTICA</small></div></div></div>`;
const heading = (eyebrow, title) => `<p class="eyebrow">${eyebrow}</p><h1 tabindex="-1">${title}</h1>`;
const card = product => `<article class="card"><a class="card-visual" href="#detalle/${product.id}" aria-label="Ver ${product.name}">${art(product)}<span class="card-number" aria-hidden="true">Nº ${String(products.indexOf(product) + 1).padStart(2, '0')}</span></a><p class="eyebrow">${product.category}</p><h3><a href="#detalle/${product.id}">${product.name}</a></h3><p class="card-size">${product.size}</p><div class="card-bottom"><strong>${money(product.price)}</strong><a href="#detalle/${product.id}" aria-label="Ver detalle de ${product.name}">Ver detalle ↗</a></div></article>`;
const miniProduct = product => `<article class="mini-product">${art(product)}<div class="mini-product-copy"><h3>${escapeHTML(product.name)}</h3><strong>${money(product.price)}</strong><a href="#detalle/${encodeURIComponent(product.id)}" aria-label="Ver detalle de ${escapeHTML(product.name)}">Ver detalle ↗</a></div></article>`;
const totals = items => `<dl class="totals"><div><dt>Subtotal</dt><dd>${money(total(items))}</dd></div><div><dt>Envío simulado</dt><dd>Gratis</dd></div><div class="total"><dt>Total <small>USD</small></dt><dd>${money(total(items))}</dd></div></dl>`;
const summary = items => `<ul class="summary">${items.map(item => `<li><span>${item.product.name} × ${item.quantity}</span><strong>${money(item.product.price * item.quantity)}</strong></li>`).join('')}</ul>${totals(items)}`;
const stepper = step => `<ol class="stepper" aria-label="Pasos del checkout">${['Datos de envío', 'Pago simulado', 'Confirmación'].map((label, index) => `<li ${index + 1 === step ? 'aria-current="step"' : ''} class="${index + 1 < step ? 'done' : ''}"><span aria-hidden="true">${index + 1 < step ? '✓' : index + 1}</span>${label}</li>`).join('')}</ol>`;
const categoryHref = category => '#productos/' + categories.indexOf(category);
function replaceRoute(route) { history.replaceState(null, '', '#' + route); render(); }

function render(options = {}) {
  const route = location.hash.slice(1) || 'inicio';
  const product = products.find(item => route === 'detalle/' + item.id);
  const categoryMatch = /^productos\/(0|[1-9]\d*)$/.exec(route);
  const categoryIndex = categoryMatch && Number(categoryMatch[1]) < categories.length ? Number(categoryMatch[1]) : -1;
  const collection = collections.find(item => route === 'productos/coleccion-' + item.id);
  const isCatalog = route === 'productos' || categoryIndex >= 0 || Boolean(collection);
  if (!['inicio', 'carrito', 'envio', 'pago', 'confirmacion'].includes(route) && !isCatalog && !product) return replaceRoute('productos');
  if ((route === 'envio' || route === 'pago') && !cart.length) return replaceRoute('carrito');
  if (route === 'pago' && !shippingReady) return replaceRoute('envio');
  if (route === 'confirmacion' && !order) return replaceRoute('carrito');
  document.querySelector('#cart-count').textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
  document.querySelectorAll('nav a').forEach(link => {
    const active = link.hash === '#' + route || ((product || isCatalog) && link.hash === '#productos');
    if (active) link.setAttribute('aria-current', 'page'); else link.removeAttribute('aria-current');
  });
  if (route === 'inicio') {
    app.innerHTML = `<section class="hero" aria-labelledby="home-title">
      <div class="hero-copy"><p class="eyebrow">Cuidado capilar & personal</p><h1 id="home-title" tabindex="-1">Tu naturaleza.<br>Tu <em>ritual.</em></h1><p>Para tu cabello, tu piel, para ti. Pequeños gestos de cuidado, todos los días.</p><a class="button" href="#productos">Explorar la botica <span aria-hidden="true">↗</span></a><p class="hero-note">Cuidado sin etiquetas. A tu manera.</p></div>
      <div class="scene"><span class="scene-caption">LA COLECCIÓN / NUDO</span><span class="scene-stamp">Pequeños<br>rituales,<br>cada día.</span><div class="plinth" aria-hidden="true"></div>${art(products[0])}${art(products[1])}${art(products[2])}<span class="scene-bottom">CABELLO · PIEL · BIENESTAR</span></div>
      <aside class="hero-discovery" aria-labelledby="discovery-title"><h2 id="discovery-title">Encuentra tu ritual</h2><p id="rail-help" class="sr-only">Desliza horizontalmente o usa las flechas con el carril enfocado. También puedes recorrer los enlaces con Tab.</p><div class="discovery-links" role="region" aria-label="Explorar por colección" aria-describedby="rail-help" tabindex="0">${quickCollections.map(collection => `<a class="discovery-link" href="${collectionHref(collection)}"><span>${collection.title}</span><span aria-hidden="true">↗</span></a>`).join('')}</div><div class="mini-products">${[products[0], products[1]].map(miniProduct).join('')}</div></aside>
      </section><div class="value-strip"><span>Una rutina para cada persona</span><span>Lo esencial, bien elegido</span><span>Tu momento de cuidado</span></div><div class="container home-selections">${homeCollections.map(collection => '<section class="home-collection" aria-labelledby="home-' + collection.id + '"><p class="eyebrow">' + collection.note + '</p><div class="section-head"><h2 id="home-' + collection.id + '">' + collection.title + '</h2><a class="text-link" href="' + collectionHref(collection) + '" aria-label="Ver todos: ' + collection.title + '">Ver todos ↗</a></div><p class="collection-description muted">' + collection.description + '</p><div class="grid home-grid">' + collectionProducts(collection).map(card).join('') + '</div></section>').join('')}</div>`;
  } else if (isCatalog) {
    const selected = categoryIndex < 0 ? null : categories[categoryIndex];
    const visibleProducts = collection ? collectionProducts(collection) : products.filter(item => !selected || item.category === selected);
    const catalogSection = (title, id, items) => '<section class="category-section" aria-labelledby="' + id + '"><div class="category-heading"><h2 id="' + id + '">' + title + '</h2><span>' + items.length + ' esenciales</span></div><div class="grid">' + items.map(card).join('') + '</div></section>';
    app.innerHTML = '<div class="container"><div class="catalog-intro"><div>' + heading('La colección / NUDO', collection ? collection.title : 'Tu próxima rutina.') + '<p class="muted">' + (collection ? collection.description : 'Cabello, estilo y piel. Elige el cuidado que va contigo.') + '</p></div><p class="muted">' + visibleProducts.length + ' productos · Precios en USD</p></div><div class="chips" role="group" aria-label="Filtrar por categoría"><button class="chip" data-filter="all" aria-pressed="' + (!selected && !collection) + '">Todos</button>' + categories.map((category, i) => '<button class="chip" data-filter="' + i + '" aria-pressed="' + (category === selected) + '">' + category + '</button>').join('') + '</div>' + (collection ? catalogSection(collection.title, 'collection-' + collection.id, visibleProducts) : categories.filter(category => !selected || selected === category).map(category => catalogSection(category, 'category-' + categories.indexOf(category), visibleProducts.filter(item => item.category === category))).join('')) + '</div>';
  } else if (product) {
    app.innerHTML = `<div class="container"><a class="back" href="#productos">← Volver a la colección</a><div class="detail">${art(product)}<div class="detail-copy">${heading(product.category + ' / NUDO', product.name)}<p>${product.description}</p><p>Presentación · <strong>${product.size}</strong></p><ul class="benefits">${product.benefits.map(benefit => `<li>${benefit}</li>`).join('')}</ul><div class="detail-price">${money(product.price)}<small>USD · Precio ficticio</small></div><button class="button" data-add="${product.id}">Agregar al carrito <span aria-hidden="true">＋</span></button><p class="fine">Se agrega una unidad. Podrás ajustar la cantidad en el carrito.</p></div></div></div>`;
  } else if (route === 'carrito') {
    app.innerHTML = `<div class="container">${heading('Tu selección', 'Carrito')}${cart.length ? `<div class="layout"><div>${cart.map(item => `<article class="cart-row">${art(item.product)}<div><h2><a href="#detalle/${item.product.id}">${item.product.name}</a></h2><p>${item.product.size} · ${money(item.product.price)} / unidad</p><strong class="cart-price">${money(item.product.price * item.quantity)}</strong><div class="quantity"><button class="secondary" data-change="-1" data-id="${item.product.id}" aria-label="Restar una unidad de ${item.product.name}" ${item.quantity === 1 ? 'disabled' : ''}>−</button><span aria-label="Cantidad: ${item.quantity}">${item.quantity}</span><button class="secondary" data-change="1" data-id="${item.product.id}" aria-label="Sumar una unidad de ${item.product.name}" ${item.quantity >= 99 ? 'disabled' : ''}>+</button><button class="remove" data-remove="${item.product.id}" aria-label="Eliminar ${item.product.name}">Eliminar</button></div></div></article>`).join('')}<a class="back" href="#productos">← Seguir explorando</a></div><aside class="panel" aria-label="Resumen del carrito"><h2>Tu ritual, listo.</h2>${totals(cart)}<a class="button" href="#envio">Continuar a datos de envío →</a><p class="fine">Compra ficticia. No se realizarán cobros ni envíos reales.</p></aside></div>` : `<div class="empty"><div class="empty-icon" aria-hidden="true">∪</div><h2>Tu ritual está por empezar.</h2><p class="muted">Tu carrito está vacío. Explora nuestros esenciales y encuentra un momento para ti.</p><a class="button" href="#productos">Explorar productos ↗</a></div>`}</div>`;
  } else if (route === 'envio') {
    const fields = [['name', 'Nombre completo', 'text', 'name'], ['email', 'Correo electrónico', 'email', 'email'], ['address', 'Dirección', 'text', 'street-address'], ['city', 'Ciudad', 'text', 'address-level2'], ['postal', 'Código postal', 'text', 'postal-code'], ['country', 'País', 'text', 'country-name']];
    app.innerHTML = `<div class="container">${stepper(1)}${heading('Tu pedido / 01', 'Datos de envío')}<p class="muted">Todos los campos son obligatorios. Usa datos ficticios para probar el demo.</p><div class="layout"><form id="shipping-form" novalidate><div id="form-error" class="form-error" role="alert"></div><div class="fields">${fields.map(([name, label, type, autocomplete]) => `<div class="field ${name === 'address' ? 'wide' : ''}"><label for="shipping-${name}">${label} <span aria-hidden="true">*</span></label><input id="shipping-${name}" name="${name}" type="${type}" autocomplete="${autocomplete}" maxlength="160" required aria-describedby="error-${name}" value="${escapeHTML(shipping[name] || '')}"><span class="field-error" id="error-${name}"></span></div>`).join('')}</div><div class="actions"><button type="submit">Continuar al pago simulado →</button><a class="text-link" href="#carrito">← Volver al carrito</a></div><p class="fine">Estos datos solo viven en esta pestaña y se borran al recargar o confirmar.</p></form><aside class="panel"><h2>Tu selección</h2>${summary(cart)}</aside></div></div>`;
  } else if (route === 'pago') {
    app.innerHTML = `<div class="container">${stepper(2)}${heading('Tu pedido / 02', 'Pago simulado')}<div class="layout"><div><div class="notice"><strong>Solo estamos probando el ritual.</strong><p>Esta compra es ficticia. No necesitamos datos bancarios y no se realizará ningún cobro, correo ni envío real.</p></div><h2>Datos de envío</h2><p class="shipping-summary">${escapeHTML(shipping.name)}<br>${escapeHTML(shipping.address)}<br>${escapeHTML(shipping.city)}, ${escapeHTML(shipping.postal)}, ${escapeHTML(shipping.country)}<br>${escapeHTML(shipping.email)}</p><a class="text-link" href="#envio">← Editar datos de envío</a></div><aside class="panel"><h2>Resumen del pedido</h2>${summary(cart)}<button class="button" data-pay>Simular pago y confirmar →</button><a class="text-link" href="#carrito">Editar carrito</a></aside></div></div>`;
  } else if (route === 'confirmacion') {
    app.innerHTML = `<div class="container confirmation">${stepper(3)}<div class="success-mark" aria-hidden="true">✓</div>${heading('Tu pedido / 03 · ' + order.reference, 'Pedido ficticio confirmado')}<p>Tu recorrido por la botica está completo.</p><div class="notice"><strong>Pago simulado completado. No es una compra real.</strong><p>No se ha cobrado dinero, enviado un correo ni creado un envío. Los datos de envío ya se han borrado.</p></div><div class="panel"><h2>Resumen de la simulación</h2>${summary(order.items)}</div><div class="actions"><a class="button" href="#inicio">Volver al inicio ↗</a><a class="text-link" href="#productos">Explorar la colección</a></div></div>`;
  }
  document.title = app.querySelector('h1').textContent + ' | NUDO';
  if (!options.keepPosition) { app.querySelector('h1').focus({ preventScroll: true }); window.scrollTo(0, 0); }
}

app.addEventListener('click', event => {
  const button = event.target.closest('button');
  if (!button || button.disabled) return;
  if (button.dataset.filter !== undefined) {
    location.hash = button.dataset.filter === 'all' ? 'productos' : 'productos/' + button.dataset.filter;
  } else if (button.dataset.add) {
    const product = products.find(item => item.id === button.dataset.add);
    if (!product) return;
    const existing = cart.find(item => item.product.id === product.id);
    if (existing && existing.quantity >= 99) { announce('Máximo de 99 unidades por producto.'); return; }
    order = null;
    shippingReady = false;
    if (existing) existing.quantity += 1; else cart.push({ product, quantity: 1 });
    saveCart();
    announce(product.name + ' agregado al carrito.');
    location.hash = 'carrito';
  } else if (button.dataset.change || button.dataset.remove) {
    const id = button.dataset.id || button.dataset.remove;
    const item = cart.find(entry => entry.product.id === id);
    if (!item) return;
    const change = button.dataset.change;
    if (button.dataset.remove) cart = cart.filter(entry => entry !== item);
    else item.quantity = Math.min(99, Math.max(1, item.quantity + Number(change)));
    shippingReady = false;
    if (!cart.length) shipping = {};
    saveCart();
    render({ keepPosition: true });
    const next = [...app.querySelectorAll('button')].find(candidate => candidate.dataset.id === id && candidate.dataset.change === change && !candidate.disabled)
      || [...app.querySelectorAll('button')].find(candidate => candidate.dataset.id === id && !candidate.disabled)
      || app.querySelector('.cart-row button:not(:disabled)') || app.querySelector('h1');
    next.focus({ preventScroll: true });
    announce(`${button.dataset.remove ? item.product.name + ' eliminado.' : 'Cantidad actualizada: ' + item.quantity + '.'} Total del carrito: ${money(total(cart))}.`);
  } else if (button.hasAttribute('data-pay') && cart.length && shippingReady && location.hash === '#pago') {
    button.disabled = true;
    orderNumber += 1;
    order = { reference: 'DEMO-' + String(orderNumber).padStart(4, '0'), items: cart.map(item => ({ ...item })) };
    cart = [];
    shipping = {};
    shippingReady = false;
    saveCart();
    // Replace the payment history entry so it cannot be submitted again with Back.
    replaceRoute('confirmacion');
    announce('Pedido ficticio confirmado. No se ha realizado ningún cobro.');
  }
});
app.addEventListener('input', event => {
  const input = event.target;
  if (input.form?.id !== 'shipping-form') return;
  shipping[input.name] = input.value;
  shippingReady = false;
  input.removeAttribute('aria-invalid');
  document.querySelector('#error-' + input.name).textContent = '';
  document.querySelector('#form-error').textContent = '';
});
app.addEventListener('submit', event => {
  if (event.target.id !== 'shipping-form') return;
  event.preventDefault();
  const form = event.target;
  let firstInvalid = null;
  for (const input of form.querySelectorAll('input')) {
    input.value = input.value.trim();
    const error = !input.value ? 'Completa este campo.' : !input.validity.valid ? (input.type === 'email' ? 'Escribe un correo válido, por ejemplo: hola@ejemplo.com.' : 'Revisa este campo (máximo 160 caracteres).') : '';
    document.querySelector('#error-' + input.name).textContent = error;
    if (error) { input.setAttribute('aria-invalid', 'true'); firstInvalid ||= input; }
    else input.removeAttribute('aria-invalid');
  }
  if (firstInvalid) { shippingReady = false; document.querySelector('#form-error').textContent = 'Revisa los campos señalados para continuar.'; firstInvalid.focus(); return; }
  shipping = Object.fromEntries(new FormData(form));
  shippingReady = true;
  location.hash = 'pago';
});
document.querySelector('.skip-link').addEventListener('click', event => { event.preventDefault(); app.focus(); app.scrollIntoView(); });
window.addEventListener('hashchange', () => render());
if (!location.hash) history.replaceState(null, '', '#inicio');
render();

