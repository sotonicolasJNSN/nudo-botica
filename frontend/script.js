'use strict';
document.addEventListener('error', event => {
  if (event.target?.classList?.contains('product-render')) event.target.remove();
}, true);
(async () => {
const catalogState = await globalThis.NudoCatalogRepository.load();
const catalogNotice = document.getElementById('catalog-status');
catalogNotice.textContent = catalogState === 'demo' ? 'Catálogo de demostración: la API no está disponible.' : catalogState === 'empty' ? 'El catálogo de la base de datos está vacío.' : 'Catálogo conectado a la API.';
// Controlador: coordina estado, eventos y navegaci?n.
const { products, categories, priceRanges, sortOptions, collections, collectionProducts, relatedProducts, normalizeSearch, filteredProducts, total, deliveryFee, passesLuhn } = globalThis.NudoModel;
const { money, escapeHTML, icon, categoryIcon, art, heading, card, miniProduct, totals, summary, stepper } = globalThis.NudoView;

const listingOptions = { categories, priceRanges, sortOptions };
const filterFields = (prefix, state) => NudoListing.filterFields(prefix, state, listingOptions, escapeHTML);
const listingControls = state => NudoListing.controls(state, listingOptions, escapeHTML);
const listingStateFrom = NudoListing.stateFrom;
const quickCategories = categories;
const app = document.querySelector('#app');
const status = document.querySelector('#status');
const cartFeedback = document.querySelector('#cart-feedback');
const cartCount = document.querySelector('#cart-count');
let cartFeedbackTimer;
// Datos vendorizados el 2026-10-05: mapa proporcionado de libphonenumber-js 1.12.6.
// Solo metadatos; sin librería ni consultas de red en ejecución.
const dialRegions = {
1:'US AG AI AS BB BM BS CA DM DO GD GU JM KN KY LC MP MS PR SX TC TT VC VG VI',7:'RU KZ',20:'EG',27:'ZA',30:'GR',31:'NL',32:'BE',33:'FR',34:'ES',36:'HU',39:'IT VA',40:'RO',41:'CH',43:'AT',44:'GB GG IM JE',45:'DK',46:'SE',47:'NO SJ',48:'PL',49:'DE',51:'PE',52:'MX',53:'CU',54:'AR',55:'BR',56:'CL',57:'CO',58:'VE',60:'MY',61:'AU CC CX',62:'ID',63:'PH',64:'NZ',65:'SG',66:'TH',81:'JP',82:'KR',84:'VN',86:'CN',90:'TR',91:'IN',92:'PK',93:'AF',94:'LK',95:'MM',98:'IR',211:'SS',212:'MA EH',213:'DZ',216:'TN',218:'LY',220:'GM',221:'SN',222:'MR',223:'ML',224:'GN',225:'CI',226:'BF',227:'NE',228:'TG',229:'BJ',230:'MU',231:'LR',232:'SL',233:'GH',234:'NG',235:'TD',236:'CF',237:'CM',238:'CV',239:'ST',240:'GQ',241:'GA',242:'CG',243:'CD',244:'AO',245:'GW',246:'IO',247:'AC',248:'SC',249:'SD',250:'RW',251:'ET',252:'SO',253:'DJ',254:'KE',255:'TZ',256:'UG',257:'BI',258:'MZ',260:'ZM',261:'MG',262:'RE YT',263:'ZW',264:'NA',265:'MW',266:'LS',267:'BW',268:'SZ',269:'KM',290:'SH TA',291:'ER',297:'AW',298:'FO',299:'GL',350:'GI',351:'PT',352:'LU',353:'IE',354:'IS',355:'AL',356:'MT',357:'CY',358:'FI AX',359:'BG',370:'LT',371:'LV',372:'EE',373:'MD',374:'AM',375:'BY',376:'AD',377:'MC',378:'SM',380:'UA',381:'RS',382:'ME',383:'XK',385:'HR',386:'SI',387:'BA',389:'MK',420:'CZ',421:'SK',423:'LI',500:'FK',501:'BZ',502:'GT',503:'SV',504:'HN',505:'NI',506:'CR',507:'PA',508:'PM',509:'HT',590:'GP BL MF',591:'BO',592:'GY',593:'EC',594:'GF',595:'PY',596:'MQ',597:'SR',598:'UY',599:'CW BQ',670:'TL',672:'NF',673:'BN',674:'NR',675:'PG',676:'TO',677:'SB',678:'VU',679:'FJ',680:'PW',681:'WF',682:'CK',683:'NU',685:'WS',686:'KI',687:'NC',688:'TV',689:'PF',690:'TK',691:'FM',692:'MH',850:'KP',852:'HK',853:'MO',855:'KH',856:'LA',880:'BD',886:'TW',960:'MV',961:'LB',962:'JO',963:'SY',964:'IQ',965:'KW',966:'SA',967:'YE',968:'OM',970:'PS',971:'AE',972:'IL',973:'BH',974:'QA',975:'BT',976:'MN',977:'NP',992:'TJ',993:'TM',994:'AZ',995:'GE',996:'KG',998:'UZ'
};
const dialCodes = Object.fromEntries(Object.entries(dialRegions).flatMap(([dial, regions]) => regions.split(' ').map(iso => [iso, dial])));
let regionNames;
try { regionNames = new Intl.DisplayNames(['es'], { type: 'region' }); } catch { /* Fallback ISO. */ }
const phoneCountries = Object.keys(dialCodes).map(iso => {
  let name = iso;
  try { name = regionNames?.of(iso) || iso; } catch { /* Fallback ISO. */ }
  return { iso, name };
}).sort((a, b) => a.name.localeCompare(b.name, 'es'));
let phonePicker = null;
let phonePickerMode = '';
let phonePickerResizeTimer;
function countryFlag(iso) {
  return /^[A-Z]{2}$/.test(iso) && !['XK', 'AC', 'TA'].includes(iso) ? String.fromCodePoint(...[...iso].map(char => 0x1F1E6 + char.charCodeAt(0) - 65)) : '🌐';
}
const phoneCountryOptions = selected => phoneCountries.map(({ iso, name }) => `<option value="${iso}" ${iso === selected ? 'selected' : ''}>${escapeHTML(name)}</option>`).join('');
const phoneMaxLength = iso => iso === 'EC' ? 9 : 15 - (dialCodes[iso] || '').length;
const normalizeMobile = (value, iso, maxLength) => {
  const digits = value.replace(/[^0-9]/g, '');
  return (iso === 'EC' ? digits.replace(/^0/, '') : digits).slice(0, maxLength);
};
const nameFields = ['firstName', 'firstSurname'];
function shippingError(input, form) {
  const value = input.value;
  if (input.required && !value) return 'Completa este campo.';
  if (nameFields.includes(input.name) && value && (!/^[\p{L}\p{M} '\u2019-]+$/u.test(value) || (value.match(/\p{L}/gu) || []).length < 2)) return 'Escribe al menos dos letras; usa solo letras, espacios, guiones o apóstrofes.';
  if (input.name === 'phoneCountry' && !Object.hasOwn(dialCodes, value)) return 'Selecciona un país del listado.';
  if (input.name === 'mobile' && value) {
    const iso = form.elements.phoneCountry.value;
    if (!/^[0-9]+$/.test(value) || !dialCodes[iso] || value.length > phoneMaxLength(iso)) return 'Usa solo dígitos; el prefijo y el celular juntos admiten hasta 15 dígitos.';
    if (iso === 'EC' && !/^9[0-9]{8}$/.test(value)) return 'Para Ecuador escribe 9 dígitos empezando en 9, sin cero inicial; el prefijo +593 ya está seleccionado.';
  }
  if (input.name === 'email' && !/^[^\s@]+@[^\s@.]+(?:\.[^\s@.]+)+$/.test(value)) return 'Escribe un correo con usuario, @ y dominio con punto, por ejemplo: persona@ejemplo.com, sin espacios.';
  if (!input.validity.valid) return 'Revisa este campo.';
  return '';
}
function destinationError(input) {
  if (input.name === 'postal') {
    return /^[0-9]{6}$/.test(input.value) ? '' : 'Escribe un código postal de seis dígitos.';
  }
  if (input.required && !input.value.trim()) return 'Completa este campo para el envío a casa.';
  return input.validity.valid ? '' : 'Revisa este campo.';
}
function setFieldError(input, message) {
  const error = document.querySelector('#error-' + input.name);
  if (error) error.textContent = message;
  if (message) input.setAttribute('aria-invalid', 'true');
  else input.removeAttribute('aria-invalid');
  const formError = input.form?.querySelector('#form-error');
  if (formError && !input.form.querySelector('[aria-invalid="true"]')) formError.textContent = '';
}

const cartLoad = globalThis.NudoCartRepository.load();
let cart = cartLoad.items;
let shipping = {};
let shippingReady = false;
const emptyPayment = () => ({ method: 'local', delivery: 'home', destination: { city: '', address: '', complement: '', postal: '' } });
let payment = emptyPayment();
let order = null;
let storageWarning = cartLoad.unavailable;
let cartConfirmationAction = null;

const cartConfirmDialog = document.querySelector('#cart-confirm-dialog');
const cartConfirmTitle = document.querySelector('#cart-confirm-title');
const cartConfirmMessage = document.querySelector('#cart-confirm-message');
const cartConfirmAccept = document.querySelector('#cart-confirm-accept');

function requestCartConfirmation(title, message, actionLabel, action) {
  cartConfirmTitle.textContent = title;
  cartConfirmMessage.textContent = message;
  cartConfirmAccept.textContent = actionLabel;
  cartConfirmationAction = action;
  cartConfirmDialog.showModal();
}
function updateCartAfterRemoval(message) {
  shippingReady = false;
  order = null;
  if (!cart.length) { shipping = {}; payment = emptyPayment(); }
  saveCart();
  render({ keepPosition: true });
  (app.querySelector('[data-empty-cart]') || app.querySelector('h1')).focus({ preventScroll: true });
  announce(`${message} Total del carrito: ${money(total(cart))}.`);
}
cartConfirmAccept.addEventListener('click', () => {
  const action = cartConfirmationAction;
  cartConfirmationAction = null;
  cartConfirmDialog.close();
  action?.();
});
document.querySelector('#cart-confirm-cancel').addEventListener('click', () => {
  cartConfirmationAction = null;
  cartConfirmDialog.close();
});
cartConfirmDialog.addEventListener('close', () => { cartConfirmationAction = null; });

function saveCart() {
  storageWarning = !globalThis.NudoCartRepository.save(cart);
}
function announce(message) { status.textContent = message + (storageWarning ? ' El navegador no permite guardar el carrito; se conservará solo durante esta sesión.' : ''); }
function updateCartCount() {
  cartCount.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
}
function showCartFeedback(message) {
  announce(message);
  cartFeedback.textContent = message;
  cartFeedback.hidden = false;
  window.clearTimeout(cartFeedbackTimer);
  cartFeedbackTimer = window.setTimeout(() => { cartFeedback.hidden = true; }, 3200);
}
const categoryHref = category => '#productos/' + categories.indexOf(category);
function replaceRoute(route) { history.replaceState(null, '', '#' + route); render(); }

const currentFulfillment = () => payment.method === 'local' ? 'local-pickup' : payment.delivery === 'home' ? 'online-home' : 'online-pickup';
const fulfillmentLabel = value => ({
  'local-pickup': 'Retiro en 12 de Octubre y Veintimilla.',
  'online-home': 'Entrega a domicilio en Ecuador.',
  'online-pickup': 'Retiro en 12 de Octubre y Veintimilla.'
})[value];
const paymentButtonLabel = () => payment.method === 'local' ? 'Continuar' : 'Finalizar pedido';
const paymentOption = (name, value, label) => `<label class="checkout-choice"><input type="radio" name="${name}" value="${value}" ${payment[name] === value ? 'checked' : ''}><span>${label}</span></label>`;
function destinationFields() {
  if (currentFulfillment() !== 'online-home') return '';
  return `<fieldset class="checkout-options"><legend>Destino en Ecuador</legend><div class="fields">${[
    ['city', 'Ciudad', 'address-level2'], ['address', 'Dirección / calle y número', 'address-line1'],
    ['complement', 'Complemento (opcional)', 'address-line2'], ['postal', 'Código postal', 'postal-code']
  ].map(([name, label, autocomplete]) => `<div class="field"><label for="payment-${name}">${label}${name !== 'complement' ? ' *' : ''}</label><input id="payment-${name}" name="${name}" autocomplete="${autocomplete}" ${name !== 'complement' ? 'required' : ''} ${name === 'postal' ? 'inputmode="numeric"' : 'maxlength="160"'} value="${escapeHTML(payment.destination[name])}" aria-describedby="error-${name}${name === 'postal' ? ' help-postal postal-rule' : ''}"><span class="field-error" id="error-${name}" aria-live="polite" aria-atomic="true"></span></div>`).join('')}</div><p id="postal-rule" class="field-help">El código postal debe contener seis dígitos.</p><p id="help-postal" class="field-help">Consulte su Código Postal en: <a href="https://www.codigopostal.gob.ec/" target="_blank" rel="noopener">Código Postal Ecuador</a></p></fieldset>`;
}
function cardFields() {
  if (payment.method !== 'online') return '';
  return `<fieldset class="checkout-options"><legend>Pago en línea</legend><div class="fields">${[
    ['cardNumber', 'Número de tarjeta', '0000 0000 0000 0000', 23],
    ['expiry', 'Vencimiento (MM/AA)', 'MM/AA', 5], ['cvv', 'CVV', '123', 4]
  ].map(([name, label, placeholder, max]) => `<div class="field"><label for="payment-${name}">${label} *</label><input id="payment-${name}" name="${name}" type="text" required autocomplete="off" inputmode="numeric" maxlength="${max}" placeholder="${placeholder}" aria-describedby="error-${name}"><span class="field-error" id="error-${name}" aria-live="polite" aria-atomic="true"></span></div>`).join('')}</div></fieldset>`;
}
function cardError(input) {
  if (input.name === 'cardNumber') {
    const value = input.value.trim();
    if (!/^[0-9]+(?:[ -][0-9]+)*$/.test(value)) return 'El número de tarjeta no es válido.';
    const digits = value.replace(/[ -]/g, '');
    if (digits.length < 12 || digits.length > 19 || !passesLuhn(digits)) return 'El número de tarjeta no es válido.';
  }
  if (input.name === 'expiry') {
    if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(input.value)) return 'Escribe un mes válido en formato MM/AA.';
  }
  if (input.name === 'cvv' && !/^\d{3,4}$/.test(input.value)) return 'Escribe el código de seguridad de 3 o 4 dígitos.';
  return '';
}
function formatExpiry(input) {
  let digits = input.value.replace(/\D/g, '').slice(0, 4);
  if (digits[0] > '1') digits = digits.slice(1);
  if (digits.length > 1) {
    const month = Number(digits.slice(0, 2));
    if (month < 1 || month > 12) digits = digits[0];
  }
  input.value = digits.length > 2 ? digits.slice(0, 2) + '/' + digits.slice(2) : digits;
}
function formatCardNumber(input) {
  const startDigits = input.value.slice(0, input.selectionStart).replace(/\D/g, '').length;
  const endDigits = input.value.slice(0, input.selectionEnd).replace(/\D/g, '').length;
  const digits = input.value.replace(/\D/g, '').slice(0, 19);
  input.value = digits.replace(/(.{4})/g, '$1 ').trim();
  const caretPosition = digitCount => digitCount + Math.floor(Math.max(0, digitCount - 1) / 4);
  input.setSelectionRange(caretPosition(startDigits), caretPosition(endDigits));
}
function ticketDestination(destination) {
  if (!destination) return '';
  const lines = [
    escapeHTML(destination.address),
    destination.complement ? escapeHTML(destination.complement) : '',
    `${escapeHTML(destination.city)} · CP ${escapeHTML(destination.postal)}`
  ].filter(Boolean);
  return `<section class="ticket-address" aria-labelledby="ticket-address-title"><h3 id="ticket-address-title">Dirección de entrega</h3><address>${lines.join('<br>')}</address></section>`;
}
function ticketBuyer(buyer) {
  const countryName = phoneCountries.find(country => country.iso === buyer.phoneCountry)?.name || buyer.phoneCountry;
  return `<section class="ticket-buyer" aria-labelledby="ticket-buyer-title"><h3 id="ticket-buyer-title">Datos del comprador</h3><dl><div><dt>Nombre</dt><dd>${escapeHTML(buyer.firstName)} ${escapeHTML(buyer.firstSurname)}</dd></div><div><dt>Correo</dt><dd>${escapeHTML(buyer.email)}</dd></div><div><dt>Celular</dt><dd>${countryFlag(buyer.phoneCountry)} ${escapeHTML(countryName)} +${escapeHTML(dialCodes[buyer.phoneCountry])} ${escapeHTML(buyer.mobile)}</dd></div></dl></section>`;
}
function createVerificationCode() {
  if (!window.crypto?.getRandomValues) throw new Error('No está disponible un generador seguro para el código del pedido.');
  const bytes = window.crypto.getRandomValues(new Uint8Array(8));
  const value = Array.from(bytes, byte => byte.toString(16).padStart(2, '0')).join('').toUpperCase();
  return 'NUDO-' + value.match(/.{4}/g).join('-');
}
function updateCountryFlag() {
  if (phonePicker) return;
  const iso = document.querySelector('#shipping-phoneCountry')?.value;
  if (!iso) return;
  const host = document.querySelector('#shipping-phoneCountry-flag');
  const img = document.createElement('img');
  img.width = 24; img.height = 18; img.loading = 'eager'; img.referrerPolicy = 'no-referrer';
  img.alt = 'Bandera de ' + phoneCountries.find(country => country.iso === iso).name;
  img.onerror = () => { host.textContent = countryFlag(iso); host.setAttribute('role', 'img'); host.setAttribute('aria-label', img.alt); };
  host.removeAttribute('role'); host.removeAttribute('aria-label');
  img.src = `https://flagcdn.com/w40/${iso.toLowerCase()}.png`;
  host.replaceChildren(img);
  document.querySelector('#phone-prefix').textContent = '+' + dialCodes[iso];
}
function initializePhonePicker() {
  const countrySelect = document.querySelector('#shipping-phoneCountry');
  const mobile = document.querySelector('#shipping-mobile');
  if (!countrySelect || !mobile || !window.intlTelInput) {
    updateCountryFlag();
    return;
  }
  phonePickerMode = window.matchMedia('(max-width: 700px)').matches ? 'FULLSCREEN' : 'DROPDOWN';
  phonePicker = window.intlTelInput(mobile, {
    initialCountry: countrySelect.value.toLowerCase(),
    separateDialCode: true,
    countrySearch: true,
    showFlags: true,
    countrySelectorMode: phonePickerMode,
    formatAsYouType: false,
    countryNameLocale: 'es',
    i18n: {
      ...Object.fromEntries(phoneCountries.map(({ iso, name }) => [iso.toLowerCase(), name])),
      selectedCountryAriaLabel: 'Cambiar país del número telefónico; seleccionado ${countryName} (${dialCode})',
      noCountrySelected: 'Seleccionar país del número telefónico',
      countryListAriaLabel: 'Lista de países',
      searchPlaceholder: 'Buscar país o prefijo',
      clearSearchAriaLabel: 'Limpiar búsqueda',
      zeroSearchResults: 'No se encontraron países',
      oneSearchResult: '1 país encontrado',
      multipleSearchResults: '${count} países encontrados'
    },
    uiTranslations: {
      selectedCountryAriaLabel: 'Cambiar país del número telefónico; seleccionado ${countryName} (${dialCode})',
      noCountrySelected: 'Seleccionar país del número telefónico',
      countryListAriaLabel: 'Lista de países',
      searchPlaceholder: 'Buscar país o prefijo',
      clearSearchAriaLabel: 'Limpiar búsqueda',
      closeCountrySelectorAriaLabel: 'Cerrar',
      searchEmptyState: 'No se encontraron países',
      searchSummaryAria: count => count === 0 ? 'No se encontraron países' : count === 1 ? '1 país encontrado' : `${count} países encontrados`
    }
  });
  mobile.form.classList.add('has-phone-picker');
  mobile.addEventListener('countrychange', () => {
    const iso = phonePicker.getSelectedCountryData().iso2.toUpperCase();
    if (!Object.hasOwn(dialCodes, iso)) return;
    const countryChanged = countrySelect.value !== iso;
    countrySelect.value = iso;
    shipping.phoneCountry = iso;
    if (countryChanged) shippingReady = false;
    mobile.maxLength = phoneMaxLength(iso);
    mobile.value = normalizeMobile(mobile.value, iso, mobile.maxLength);
    if (mobile.value || mobile.hasAttribute('aria-invalid')) setFieldError(mobile, shippingError(mobile, mobile.form));
  });
}
function adaptPhonePickerToViewport() {
  if (!phonePicker) return;
  const mode = window.matchMedia('(max-width: 700px)').matches ? 'FULLSCREEN' : 'DROPDOWN';
  if (mode === phonePickerMode) return;
  const mobile = document.querySelector('#shipping-mobile');
  if (!mobile) return;
  const hadFocus = document.activeElement === mobile;
  phonePicker.destroy();
  phonePicker = null;
  phonePickerMode = '';
  mobile.form.classList.remove('has-phone-picker');
  initializePhonePicker();
  if (hadFocus) mobile.focus({ preventScroll: true });
}
window.addEventListener('resize', () => {
  window.clearTimeout(phonePickerResizeTimer);
  phonePickerResizeTimer = window.setTimeout(adaptPhonePickerToViewport, 120);
});
function editPayment(event) {
  const input = event.target;
  if (!(input instanceof HTMLInputElement || input instanceof HTMLSelectElement) || input.form?.id !== 'payment-form') return;
  if (input.type === 'radio' && ['method', 'delivery'].includes(input.name)) {
    if (event.type !== 'change') return;
    payment[input.name] = input.value;
    document.querySelector('#form-error').textContent = '';
    document.querySelector('#local-notice').hidden = payment.method !== 'local';
    document.querySelector('#delivery-options').hidden = payment.method !== 'online';
    document.querySelector('#card-panel').innerHTML = cardFields();
    document.querySelector('#destination-panel').innerHTML = destinationFields();
    document.querySelector('[data-pay]').textContent = paymentButtonLabel();
    document.querySelector('#payment-summary').innerHTML = summary(cart, currentFulfillment());
    document.querySelector('#fulfillment-summary').textContent = fulfillmentLabel(currentFulfillment());
    announce(fulfillmentLabel(currentFulfillment()) + (currentFulfillment() === 'online-home' ? ' Envío: ' + money(deliveryFee(currentFulfillment())) + '. Completa el destino.' : ' No se requiere dirección ni código postal.'));
  } else {
    if (Object.hasOwn(payment.destination, input.name)) payment.destination[input.name] = input.value;
    if (input.name === 'cardNumber') formatCardNumber(input);
    if (input.name === 'expiry') formatExpiry(input);
    if (input.name === 'cvv') input.value = input.value.replace(/[^0-9]/g, '').slice(0, 4);
    const error = Object.hasOwn(payment.destination, input.name)
      ? destinationError(input)
      : cardError(input);
    setFieldError(input, error);
  }
}

function render(options = {}) {
  phonePicker?.destroy();
  phonePicker = null;
  phonePickerMode = '';
  const [route, routeQuery = ''] = (location.hash.slice(1) || 'inicio').split('?');
  const routeParams = new URLSearchParams(routeQuery);
  const product = products.find(item => route === 'detalle/' + item.id);
  const searchMatch = /^buscar\/(.+)$/.exec(route);
  let searchQuery = '';
  if (searchMatch) {
    try { searchQuery = decodeURIComponent(searchMatch[1]).trim(); }
    catch { return replaceRoute('productos'); }
  }
  const isSearch = Boolean(searchMatch);
  const categoryMatch = /^productos\/(0|[1-9]\d*)$/.exec(route);
  const categoryIndex = categoryMatch && Number(categoryMatch[1]) < categories.length ? Number(categoryMatch[1]) : -1;
  const collection = collections.find(item => route === 'productos/coleccion-' + item.id);
  const categoryParam = categories.includes(routeParams.get('categoria')) ? routeParams.get('categoria') : '';
  const listingState = {
    category: categoryParam || (categoryIndex >= 0 ? categories[categoryIndex] : ''),
    price: priceRanges.some(range => range.value === routeParams.get('precio')) ? routeParams.get('precio') : 'all',
    sort: sortOptions.some(option => option.value === routeParams.get('orden')) ? routeParams.get('orden') : 'list'
  };
  const isCatalog = route === 'productos' || categoryIndex >= 0 || Boolean(collection);
  if (!['inicio', 'carrito', 'envio', 'pago', 'confirmacion'].includes(route) && !isCatalog && !product && !isSearch) return replaceRoute('productos');
  if ((route === 'envio' || route === 'pago') && !cart.length) return replaceRoute('carrito');
  if (route === 'pago' && !shippingReady) return replaceRoute('envio');
  if (route === 'confirmacion' && !order) return replaceRoute('carrito');
  updateCartCount();
  document.querySelector('#site-search-input').value = isSearch ? searchQuery : '';
  document.querySelector('#search-filter-options').innerHTML = filterFields('search', listingState);
  document.querySelectorAll('nav a').forEach(link => {
    const active = link.hash === '#' + route || ((product || isCatalog || isSearch) && link.hash === '#productos');
    if (active) link.setAttribute('aria-current', 'page'); else link.removeAttribute('aria-current');
  });
  if (route === 'inicio') {
    app.innerHTML = `<section class="hero" aria-labelledby="home-title">
      <div class="hero-copy"><p class="eyebrow">Cuidado capilar & personal</p><h1 id="home-title" tabindex="-1">Tu naturaleza.<br>Tu <em>ritual.</em></h1><p>Para tu cabello, tu piel, para ti. Pequeños gestos de cuidado, todos los días.</p><a class="button" href="#productos">Explorar la botica <span aria-hidden="true">↗</span></a><p class="hero-note">Cuidado sin etiquetas. A tu manera.</p></div>
      <div class="scene"><span class="scene-caption">LA COLECCIÓN / NUDO</span><span class="scene-stamp">Pequeños<br>rituales,<br>cada día.</span><div class="plinth" aria-hidden="true"></div>${products.slice(0, 3).map(product => art(product, { illustration: true })).join('')}<span class="scene-bottom">CABELLO · PIEL · BIENESTAR</span></div>
      <aside class="hero-discovery" aria-labelledby="discovery-title"><h2 id="discovery-title">Encuentra tu ritual</h2><div class="discovery-links" aria-label="Explorar por categoría">${quickCategories.map(category => `<a class="discovery-link" href="${categoryHref(category)}"><span>${category}</span><span aria-hidden="true">↗</span></a>`).join('')}</div><div class="mini-products">${products.slice(0, 2).map(miniProduct).join('')}</div></aside>
      </section><div class="value-strip"><span>Una rutina para cada persona</span><span>Lo esencial, bien elegido</span><span>Tu momento de cuidado</span></div><div class="container home-selections">${categories.map((category, index) => { const items = products.filter(item => item.category === category); return '<section class="home-collection category-preview" aria-labelledby="home-category-' + index + '"><div class="section-head"><div><p class="eyebrow">La colección / NUDO</p><h2 id="home-category-' + index + '">' + category + '</h2></div></div><div class="grid home-grid">' + items.map(card).join('') + '</div><a class="explore-more" href="' + categoryHref(category) + '">Ver todos los productos de ' + category + ' <span aria-hidden="true">→</span></a></section>'; }).join('')}</div>`;
  } else if (isSearch) {
    const results = filteredProducts(products, listingState, searchQuery);
    app.innerHTML = NudoListing.searchScreen({query:searchQuery, state:listingState, results, heading, card, icon, escapeHTML, options:listingOptions});
  } else if (isCatalog) {
    const selected = categoryIndex < 0 ? (listingState.category || null) : categories[categoryIndex];
    const catalogSection = (title, id, items, preview) => '<section class="category-section" aria-labelledby="' + id + '"><div class="category-heading"><h2 id="' + id + '">' + title + '</h2></div><div class="grid' + (preview ? ' home-grid' : '') + '">' + items.map(card).join('') + '</div>' + (preview ? '<a class="explore-more" href="' + categoryHref(title) + '">Ver todos los productos de ' + title + ' <span aria-hidden="true">→</span></a>' : '') + '</section>';
    const sourceProducts = collection ? collectionProducts(collection) : products;
    const results = filteredProducts(sourceProducts, listingState);
    const otherCategories = categories.filter(category => category !== selected).map((category, index) =>
      catalogSection(category, 'other-category-' + index, products.filter(item => item.category === category), true)
    ).join('');
    const showPreviews = !collection && !selected && !routeQuery;
    const catalogContent = collection
      ? results.length ? catalogSection(collection.title, 'collection-' + collection.id, results, false) : `<div class="search-empty"><h2>No hay productos con estos filtros</h2><p class="muted">Prueba con otra categoría o rango de precio.</p></div>`
      : selected && !routeQuery
        ? catalogSection(selected, 'category-' + categoryIndex, results, false) + '<section class="other-categories" aria-labelledby="other-categories-title"><h2 id="other-categories-title">También puedes explorar</h2>' + otherCategories + '</section>'
        : showPreviews
          ? categories.map((category, index) => catalogSection(category, 'category-' + index, products.filter(item => item.category === category), true)).join('')
          : results.length ? catalogSection(listingState.category || 'Productos', 'filtered-products', results, false) : `<div class="search-empty"><h2>No hay productos con estos filtros</h2><p class="muted">Prueba con otra categoría o rango de precio.</p></div>`;
    app.innerHTML = '<div class="container"><div class="catalog-intro"><div>' + heading('La colección / NUDO', collection ? collection.title : selected || 'Tu próxima rutina.') + '<p class="muted">' + (collection ? collection.description : selected ? 'Descubre toda la colección de ' + selected.toLowerCase() + ' y encuentra tus esenciales.' : 'Cabello, estilo y cuidado personal. Elige lo que acompaña tu rutina.') + '</p></div></div>' + listingControls(listingState) + catalogContent + '</div>';
  } else if (product) {
    app.innerHTML = `<div class="container"><a class="back" href="#productos">← Volver a la colección</a><div class="detail">${art(product, { priority: true })}<div class="detail-copy">${heading(escapeHTML(product.category) + ' / NUDO', escapeHTML(product.name))}<p>${escapeHTML(product.description)}</p><p>Presentación · <strong>${escapeHTML(product.size)}</strong></p><ul class="benefits">${product.benefits.map(benefit => `<li>${icon('check')}${escapeHTML(benefit)}</li>`).join('')}</ul><div class="detail-price">${money(product.price)}</div><button class="button" data-add="${escapeHTML(product.id)}">${icon('cart')}<span>Agregar al carrito</span></button><p class="fine">Se agrega una unidad. Podrás ajustar la cantidad en el carrito.</p></div></div><section class="related-products" aria-labelledby="related-title"><div class="section-head"><div><p class="eyebrow">Completa tu rutina</p><h2 id="related-title">Productos que podrían interesarte</h2></div><a class="text-link" href="#productos">Ver todos ↗</a></div><div class="grid">${relatedProducts(product).map(card).join('')}</div></section></div>`;
  } else if (route === 'carrito') {
    app.innerHTML = `<div class="container">${heading('Tu selección', 'Carrito')}${cart.length ? `<div class="layout"><div class="cart-items"><div class="cart-actions"><a class="back" href="#productos">← Seguir explorando</a><button class="secondary empty-cart" type="button" data-empty-cart>Vaciar carrito</button></div>${cart.map(item => `<article class="cart-row">${art(item.product)}<div><h2><a href="#detalle/${escapeHTML(item.product.id)}">${escapeHTML(item.product.name)}</a></h2><p>${escapeHTML(item.product.size)} · ${money(item.product.price)} / unidad</p><strong class="cart-price">${money(item.product.price * item.quantity)}</strong><div class="quantity"><button class="secondary" data-change="-1" data-id="${escapeHTML(item.product.id)}" aria-label="Restar una unidad de ${escapeHTML(item.product.name)}" ${item.quantity === 1 ? 'disabled' : ''}>−</button><span aria-label="Cantidad: ${item.quantity}">${item.quantity}</span><button class="secondary" data-change="1" data-id="${escapeHTML(item.product.id)}" aria-label="Sumar una unidad de ${escapeHTML(item.product.name)}" ${item.quantity >= 99 ? 'disabled' : ''}>+</button><button class="remove" data-remove="${escapeHTML(item.product.id)}" aria-label="Eliminar ${escapeHTML(item.product.name)}">Eliminar</button></div></div></article>`).join('')}</div><aside class="panel" aria-label="Resumen del carrito"><h2>${icon('cart')}Tu ritual, listo.</h2>${totals(cart)}<a class="button" href="#envio">Continuar a datos de compra/contacto →</a></aside></div>` : `<div class="empty"><div class="empty-icon">${icon('cart')}</div><h2>Tu ritual está por empezar.</h2><p class="muted">Tu carrito está vacío. Explora nuestros esenciales y encuentra un momento para ti.</p><a class="button" href="#productos">Explorar productos ↗</a></div>`}</div>`;
  } else if (route === 'envio') {
    const fields = [
      ['firstName', 'Nombre', 'given-name', true],
      ['firstSurname', 'Apellido', 'family-name', true],
      ['email', 'Correo electrónico', 'email', true]
    ];
    const phoneCountry = shipping.phoneCountry || 'EC';
    app.innerHTML = `<div class="container">${stepper(1)}${heading('Tu pedido / 01', 'Datos de compra/contacto')}<p class="muted">Los campos con * son obligatorios.</p><p><strong>Contexto de la compra:</strong> Ecuador</p><div class="layout"><form id="shipping-form" novalidate><div id="form-error" class="form-error" role="alert"></div><div class="fields">${fields.map(([name, label, autocomplete, required]) => `<div class="field"><label for="shipping-${name}">${label}${required ? ' <span aria-hidden="true">*</span>' : ''}</label><input id="shipping-${name}" name="${name}" type="${name === 'email' ? 'email' : 'text'}" autocomplete="${autocomplete}" maxlength="160" ${required ? 'required' : ''} aria-describedby="error-${name}" value="${escapeHTML(shipping[name] || '')}"><span class="field-error" id="error-${name}" aria-live="polite" aria-atomic="true"></span></div>`).join('')}

    <div class="phone-fields wide"><div class="field phone-country-field"><label for="shipping-phoneCountry">País del celular / prefijo</label><span class="phone-country-control"><span id="shipping-phoneCountry-flag" class="phone-country-flag">${countryFlag(phoneCountry)}</span><select id="shipping-phoneCountry" name="phoneCountry" aria-describedby="error-phoneCountry">${phoneCountryOptions(phoneCountry)}</select><span id="phone-prefix" class="phone-prefix">+${dialCodes[phoneCountry]}</span></span><span class="field-error" id="error-phoneCountry" aria-live="polite" aria-atomic="true"></span></div><div class="field phone-number-field"><label for="shipping-mobile">Celular *</label><input id="shipping-mobile" name="mobile" type="tel" required inputmode="tel" autocomplete="tel-national" maxlength="${phoneMaxLength(phoneCountry)}" value="${escapeHTML(shipping.mobile || '')}" aria-describedby="error-mobile help-mobile"><span class="field-error" id="error-mobile" aria-live="polite" aria-atomic="true"></span></div><span class="field-help wide" id="help-mobile">Para Ecuador: máximo nueve dígitos, empezando en 9 y sin cero inicial. En otros países, hasta 15 dígitos contando el prefijo seleccionado.</span></div>
    </div><div class="actions"><button type="submit">Continuar al pago →</button><a class="text-link" href="#carrito">← Volver al carrito</a></div><p class="fine">Los datos de contacto se usan para este pedido y aparecen en su confirmación; no se guardan al recargar la página.</p></form><aside class="panel"><h2>Tu selección</h2>${summary(cart)}</aside></div></div>`;
  } else if (route === 'pago') {
    app.innerHTML = `<div class="container">${stepper(2)}${heading('Tu pedido / 02', 'Pago')}<div class="layout"><div><form id="payment-form" novalidate><div id="form-error" class="form-error" role="alert"></div><fieldset class="checkout-options"><legend>Elige cómo pagar</legend><div class="segmented">${paymentOption('method', 'local', 'Pagar y retirar en el local')}${paymentOption('method', 'online', 'Pago en línea')}</div></fieldset><p id="local-notice" ${payment.method === 'local' ? '' : 'hidden'}>Pago pendiente en el local. Retira en 12 de Octubre y Veintimilla. No necesitas indicar un destino.</p><fieldset id="delivery-options" class="checkout-options" ${payment.method === 'online' ? '' : 'hidden'}><legend>Entrega del pedido</legend><div class="segmented">${paymentOption('delivery', 'home', 'Enviar a casa')}${paymentOption('delivery', 'pickup', 'Retirar en el local')}</div></fieldset><div id="card-panel">${cardFields()}</div><div id="destination-panel">${destinationFields()}</div></form><h2>Contacto</h2><p class="shipping-summary">${escapeHTML(nameFields.map(key => shipping[key]).filter(Boolean).join(' '))}<br>Correo: ${escapeHTML(shipping.email)}<br>Celular: ${countryFlag(shipping.phoneCountry)} ${escapeHTML(phoneCountries.find(country => country.iso === shipping.phoneCountry)?.name || shipping.phoneCountry)} +${dialCodes[shipping.phoneCountry]} ${escapeHTML(shipping.mobile)}</p><a class="text-link" href="#envio">← Editar contacto</a></div><aside class="panel"><h2>Resumen del pedido</h2><div id="payment-summary">${summary(cart, currentFulfillment())}</div><p id="fulfillment-summary">${fulfillmentLabel(currentFulfillment())}</p><button class="button" type="submit" form="payment-form" data-pay>${paymentButtonLabel()}</button><a class="text-link" href="#carrito">Editar carrito</a></aside></div></div>`;
  } else if (route === 'confirmacion') {
    const ticketTitle = order.paymentMethod === 'local' ? 'Ticket de pago' : order.fulfillment === 'online-home' ? 'Ticket de envío' : 'Ticket de retiro';
    const paymentStatus = order.paymentMethod === 'local' ? 'Pago pendiente en el local.' : 'Pago confirmado.';
    app.innerHTML = `<div class="container confirmation">${stepper(3)}<div class="success-mark" aria-hidden="true">✓</div>${heading('Tu pedido / 03', ticketTitle)}<p class="confirmation-encouragement">Gracias por elegir NUDO. Sigue explorando y encuentra más esenciales para tu rutina.</p><p class="checkout-disclosure"><strong>${paymentStatus}</strong></p><div class="panel ticket-panel"><h2>Resumen del pedido</h2><p class="verification-code"><span>Código de verificación</span><strong>${order.reference}</strong></p>${summary(order.items, order.fulfillment)}<p>${order.paymentMethod === 'local' ? 'Punto de pago: 12 de Octubre y Veintimilla.' : fulfillmentLabel(order.fulfillment)}</p>${ticketBuyer(order.buyer)}${order.fulfillment === 'online-home' ? ticketDestination(order.destination) + '<p>Envío a casa · Cargo de envío: ' + money(order.deliveryFee) + '</p>' : ''}</div><div class="actions"><a class="button" href="#productos">Seguir explorando ↗</a><a class="text-link" href="#inicio">Volver al inicio</a></div></div>`;
  }
  initializePhonePicker();
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
    updateCartCount();
    showCartFeedback(`${product.name} agregado al carrito. ${cart.reduce((sum, item) => sum + item.quantity, 0)} artículos en tu carrito.`);
    const originalContent = button.innerHTML;
    button.innerHTML = `${icon('check')}<span>Agregado</span>`;
    button.classList.add('added-feedback');
    window.setTimeout(() => {
      if (!button.isConnected) return;
      button.innerHTML = originalContent;
      button.classList.remove('added-feedback');
    }, 1800);
  } else if (button.dataset.change) {
    const id = button.dataset.id;
    const item = cart.find(entry => entry.product.id === id);
    if (!item) return;
    const change = button.dataset.change;
    item.quantity = Math.min(99, Math.max(1, item.quantity + Number(change)));
    shippingReady = false;
    order = null;
    saveCart();
    render({ keepPosition: true });
    const next = [...app.querySelectorAll('button')].find(candidate => candidate.dataset.id === id && candidate.dataset.change === change && !candidate.disabled)
      || [...app.querySelectorAll('button')].find(candidate => candidate.dataset.id === id && !candidate.disabled)
      || app.querySelector('.cart-row button:not(:disabled)') || app.querySelector('h1');
    next.focus({ preventScroll: true });
    announce(`Cantidad actualizada: ${item.quantity}. Total del carrito: ${money(total(cart))}.`);
  }
});
app.addEventListener('click', event => {
  const button = event.target.closest('[data-remove], [data-empty-cart]');
  if (!button) return;
  if (button.dataset.emptyCart !== undefined) {
    requestCartConfirmation(
      '¿Vaciar el carrito?',
      'Se eliminarán todos los productos del carrito. Esta acción no se puede deshacer.',
      'Vaciar carrito',
      () => { cart = []; updateCartAfterRemoval('Carrito vaciado.'); }
    );
    return;
  }
  const item = cart.find(entry => entry.product.id === button.dataset.remove);
  if (!item) return;
  requestCartConfirmation(
    '¿Eliminar este producto?',
    `Se quitará ${item.product.name} del carrito.`,
    'Eliminar producto',
    () => {
      cart = cart.filter(entry => entry !== item);
      updateCartAfterRemoval(`${item.product.name} eliminado.`);
    }
  );
});
cartConfirmDialog.addEventListener('cancel', () => { cartConfirmationAction = null; });

const searchToggle = document.querySelector('#search-toggle');
const searchForm = document.querySelector('#site-search');
const searchInput = document.querySelector('#site-search-input');
const searchTools = document.querySelector('#search-tools');
function closeSearch(restoreFocus = false) {
  if (searchForm.hidden) return;
  searchForm.hidden = true;
  searchToggle.setAttribute('aria-expanded', 'false');
  if (restoreFocus) searchToggle.focus();
}
searchToggle.addEventListener('click', () => {
  searchForm.hidden = false;
  searchToggle.setAttribute('aria-expanded', 'true');
  searchInput.focus();
});
document.querySelector('#search-close').addEventListener('click', () => {
  closeSearch(true);
});
document.addEventListener('pointerdown', event => {
  if (!searchForm.hidden && !searchTools.contains(event.target)) closeSearch();
});
searchForm.addEventListener('submit', event => {
  event.preventDefault();
  const query = searchInput.value.trim();
  closeSearch();
  location.hash = NudoListing.route(listingStateFrom(searchForm), query);
});
function resetFilters(form) {
  form.elements.category.value = '';
  form.elements.price.value = 'all';
  form.elements.sort.value = 'list';
  form.requestSubmit();
}
function applyListingFilters(form) {
  const query = form === searchForm || location.hash.slice(1).startsWith('buscar/') ? searchInput.value.trim() : '';
  location.hash = NudoListing.route(listingStateFrom(form), query);
}
searchForm.addEventListener('click', event => {
  if (event.target.closest('[data-reset-filters]')) resetFilters(searchForm);
});
app.addEventListener('click', event => {
  const resetButton = event.target.closest('[data-reset-filters]');
  if (resetButton) {
    const form = location.hash.slice(1).startsWith('buscar/')
      ? searchForm
      : resetButton.closest('form') || app.querySelector('[data-listing-controls]');
    if (form) resetFilters(form);
  }
});
searchForm.addEventListener('change', event => {
  if (event.target.matches('select[name="category"], select[name="price"], select[name="sort"]')) {
    applyListingFilters(searchForm);
  }
});
app.addEventListener('change', event => {
  const form = event.target.closest('[data-listing-controls]');
  if (form && event.target.matches('select[name="category"], select[name="price"], select[name="sort"]')) {
    applyListingFilters(form);
  }
});
app.addEventListener('submit', event => {
  const form = event.target;
  if (!form.matches('[data-listing-controls]')) return;
  event.preventDefault();
  applyListingFilters(form);
});
searchForm.addEventListener('keydown', event => {
  if (event.key !== 'Escape') return;
  closeSearch(true);
});
function editShipping(event) {
  const input = event.target;
  if (!(input instanceof HTMLInputElement || input instanceof HTMLSelectElement) || input.form?.id !== 'shipping-form') return;
  if (!['firstName', 'firstSurname', 'email', 'phoneCountry', 'mobile'].includes(input.name)) return;
  if (input.name === 'mobile') input.value = normalizeMobile(input.value, input.form.elements.phoneCountry.value, input.maxLength);
  shipping[input.name] = input.value;
  shippingReady = false;
  if (input.name === 'phoneCountry') {
    const mobile = input.form.elements.mobile;
    phonePicker?.setCountry(input.value.toLowerCase());
    updateCountryFlag();
    mobile.maxLength = phoneMaxLength(input.value);
    mobile.value = normalizeMobile(mobile.value, input.value, mobile.maxLength);
    shipping.mobile = mobile.value;
    if (mobile.value || mobile.hasAttribute('aria-invalid')) setFieldError(mobile, shippingError(mobile, input.form));
  }
  setFieldError(input, shippingError(input, input.form));
}

app.addEventListener('paste', event => {
  const input = event.target;
  if (input.form?.id !== 'shipping-form' || input.name !== 'mobile') return;
  event.preventDefault();
  const pastedDigits = event.clipboardData.getData('text').replace(/[^0-9]/g, '');
  const digits = input.form.elements.phoneCountry.value === 'EC' ? pastedDigits.replace(/^0/, '') : pastedDigits;
  const start = input.selectionStart;
  const end = input.selectionEnd;
  const available = Math.max(0, input.maxLength - (input.value.length - (end - start)));
  input.setRangeText(digits.slice(0, available), start, end, 'end');
  editShipping(event);
});
app.addEventListener('input', editShipping);
app.addEventListener('change', editShipping);
app.addEventListener('blur', editShipping, true);
app.addEventListener('blur', editPayment, true);
app.addEventListener('submit', event => {
  if (event.target.id !== 'shipping-form') return;
  event.preventDefault();
  const form = event.target;
  let firstInvalid = null;
  for (const input of form.querySelectorAll('input, select')) {
    if (input.name !== 'email') input.value = input.value.trim();
    const error = shippingError(input, form);
    setFieldError(input, error);
    if (error) { input.setAttribute('aria-invalid', 'true'); firstInvalid ||= input; }
  }
  if (firstInvalid) { shippingReady = false; document.querySelector('#form-error').textContent = 'Revisa los campos señalados para continuar.'; firstInvalid.focus(); return; }
  shipping = Object.fromEntries(new FormData(form));
  shippingReady = true;
  location.hash = 'pago';
});
app.addEventListener('input', editPayment);
app.addEventListener('change', editPayment);
app.addEventListener('submit', event => {
  if (event.target.id !== 'payment-form') return;
  event.preventDefault();
  if (!cart.length || !shippingReady || order || location.hash !== '#pago') return;
  const form = event.target;
  let firstInvalid = null;
  if (currentFulfillment() === 'online-home') {
    for (const input of form.querySelectorAll('#destination-panel input')) {
      input.value = input.value.trim();
      payment.destination[input.name] = input.value;
      const error = destinationError(input);
      setFieldError(input, error);
      if (error) firstInvalid ||= input;
    }
  }
  if (payment.method === 'online') {
    for (const input of form.querySelectorAll('#card-panel input')) {
      const error = cardError(input);
      setFieldError(input, error);
      if (error) firstInvalid ||= input;
    }
  }
  firstInvalid = form.querySelector('[aria-invalid="true"]');
  if (firstInvalid) {
    document.querySelector('#form-error').textContent = 'Revisa los campos señalados antes de continuar.';
    firstInvalid.focus();
    return;
  }
  let verificationCode;
  try {
    verificationCode = createVerificationCode();
  } catch (error) {
    console.error(error);
    document.querySelector('#form-error').textContent = 'No se pudo generar el código del pedido. Intenta nuevamente.';
    return;
  }
  document.querySelector('[data-pay]').disabled = true;
  const fulfillment = currentFulfillment();
  order = { reference: verificationCode, items: cart.map(item => ({ ...item })), fulfillment, paymentMethod: payment.method, buyer: { firstName: shipping.firstName, firstSurname: shipping.firstSurname, email: shipping.email, phoneCountry: shipping.phoneCountry, mobile: shipping.mobile }, destination: fulfillment === 'online-home' ? { ...payment.destination } : null, deliveryFee: deliveryFee(fulfillment) };
  cart = [];
  shipping = {};
  shippingReady = false;
  payment = emptyPayment();
  saveCart();
  // Sustituir Pago en el historial y vaciar el carrito impide repetir la simulación.
  replaceRoute('confirmacion');
  announce('Pedido registrado.');
});
document.querySelector('.skip-link').addEventListener('click', event => { event.preventDefault(); app.focus(); app.scrollIntoView(); });
window.addEventListener('hashchange', () => render());
if (!location.hash) history.replaceState(null, '', '#inicio');
render();
})().catch(error => console.error('No se pudo iniciar la aplicación:', error));
