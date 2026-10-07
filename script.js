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
  {"id": "acondicionador-rizos", "collections": ["acondicionadores", "rizos"], "name": "Acondicionador para rizos", "category": "Rizos y ondas", "size": "250 ml", "price": 1550, "art": "clay", "label": "Rizos suaves", "description": "Una textura cremosa para desenredar y suavizar el cabello después del lavado.", "benefits": ["Facilita el desenredado", "Suaviza medios y puntas", "Enjuagar después de aplicar"]},
  {"id": "acondicionador-puntas", "collections": ["acondicionadores"], "name": "Acondicionador de medios y puntas", "category": "Cabello", "size": "250 ml", "price": 1500, "art": "cream", "label": "Cuidado de largos", "description": "Una textura cremosa para desenredar y suavizar el cabello después del lavado.", "benefits": ["Facilita el desenredado", "Suaviza medios y puntas", "Enjuagar después de aplicar"]},
  {"id": "tonico-cuero-cabelludo", "collections": ["cuero-cabelludo", "tratamientos"], "name": "Tónico de cuero cabelludo", "category": "Cuero cabelludo", "size": "100 ml", "price": 1650, "art": "oil sage", "label": "Raíces frescas", "description": "Un tónico ligero para sumar un gesto de frescura al cuidado del cuero cabelludo.", "benefits": ["Textura ligera de fácil aplicación", "Acompaña la rutina entre lavados", "Aplicar con un masaje suave"]},
  {"id": "shampoo-cuero-cabelludo", "collections": ["cuero-cabelludo", "shampoos"], "name": "Shampoo de limpieza profunda", "category": "Cuero cabelludo", "size": "250 ml", "price": 1500, "art": "dark", "label": "Limpieza renovada", "description": "Una limpieza más profunda para alternar con tu shampoo habitual y renovar el ritual de lavado.", "benefits": ["Ideal para uso ocasional", "Retira residuos de peinado", "Enjuagar con abundante agua"]},
  {"id": "mascarilla-rizos", "collections": ["rizos", "tratamientos"], "name": "Mascarilla para rizos", "category": "Rizos y ondas", "size": "200 g", "price": 1950, "art": "jar clay", "label": "Rizos nutridos", "description": "Un tratamiento cremoso para acompañar el cuidado semanal de ondas y rizos.", "benefits": ["Suaviza largos y puntas", "Aporta manejabilidad", "Usar después del lavado"]},
  {"id": "gel-definidor", "collections": ["rizos", "peinado"], "name": "Gel definidor de rizos", "category": "Rizos y ondas", "size": "200 ml", "price": 1450, "art": "sage", "label": "Forma y movimiento", "description": "Un gel flexible para definir ondas y rizos sin perder su movimiento natural.", "benefits": ["Definición flexible", "Ayuda a controlar el frizz", "Aplicar sobre el cabello húmedo"]},
  {"id": "crema-sin-enjuague", "collections": ["diario", "rizos"], "name": "Crema sin enjuague", "category": "Cabello", "size": "180 ml", "price": 1600, "art": "tube sage", "label": "Suavidad sin enjuague", "description": "Una crema ligera para cuidar los largos después del lavado, sin necesidad de enjuagar.", "benefits": ["Facilita el peinado", "Aporta suavidad a los largos", "Aplicar poca cantidad"]},
  {"id": "shampoo-color", "collections": ["shampoos", "diario"], "name": "Shampoo para cabello teñido", "category": "Cabello", "size": "250 ml", "price": 1550, "art": "clay", "label": "Cuidado del color", "description": "Una limpieza delicada para acompañar la rutina de cuidado del cabello teñido.", "benefits": ["Limpieza suave", "Acompaña el cuidado del color", "Enjuagar con abundante agua"]},
  {"id": "spray-hidratante", "collections": ["tratamientos", "diario"], "name": "Bruma hidratante capilar", "category": "Cabello", "size": "120 ml", "price": 1500, "art": "sage", "label": "Bruma ligera", "description": "Una bruma ligera para refrescar el cabello y sumar un gesto de cuidado durante el día.", "benefits": ["Aplicación práctica en spray", "Textura ligera", "Puede usarse entre lavados"]},
  {"id": "pomada-flexible", "collections": ["peinado"], "name": "Pomada de fijación flexible", "category": "Estilo y barba", "size": "80 g", "price": 1450, "art": "jar dark", "label": "Fijación flexible", "description": "Una pomada moldeable para dar forma al peinado con un acabado natural.", "benefits": ["Fijación flexible", "Permite remodelar el peinado", "Aplicar sobre cabello seco o húmedo"]},
  {"id": "shampoo-barba", "collections": ["barba"], "name": "Shampoo para barba", "category": "Estilo y barba", "size": "120 ml", "price": 1250, "art": "dark", "label": "Limpieza de barba", "description": "Una limpieza suave pensada para sumar un paso sencillo al cuidado de la barba.", "benefits": ["Limpieza cotidiana", "Espuma de fácil enjuague", "Aroma herbal suave"]},
  {"id": "balsamo-post-afeitado", "collections": ["barba"], "name": "Bálsamo para después del afeitado", "category": "Estilo y barba", "size": "75 ml", "price": 1500, "art": "tube cream", "label": "Calma después del afeitado", "description": "Un bálsamo ligero para completar la rutina de cuidado después del afeitado.", "benefits": ["Textura ligera", "Fácil de aplicar", "Uso externo"]},
  {"id": "locion-corporal", "collections": ["diario"], "name": "Loción corporal", "category": "Cuidado personal", "size": "250 ml", "price": 1650, "art": "cream", "label": "Cuidado diario", "description": "Una loción de textura ligera para acompañar el cuidado cotidiano de la piel.", "benefits": ["Textura de fácil aplicación", "Para el cuidado diario", "Aroma delicado"]},
  {"id": "jabon-manos", "collections": ["diario"], "name": "Jabón líquido para manos", "category": "Cuidado personal", "size": "250 ml", "price": 950, "art": "dark", "label": "Manos limpias", "description": "Una fórmula de limpieza suave para convertir un gesto cotidiano en una pausa agradable.", "benefits": ["Limpieza de manos", "Dosificación práctica", "Aroma herbal suave"]},
  {"id": "balsamo-labios", "collections": ["diario"], "name": "Bálsamo labial", "category": "Cuidado personal", "size": "15 g", "price": 700, "art": "tube clay", "label": "Cuidado esencial", "description": "Un bálsamo compacto para sumar un gesto de suavidad a tu rutina diaria.", "benefits": ["Formato práctico", "Aplicación sencilla", "Llevar contigo"]},
  {"id": "mascarilla-rizos-ligera", "collections": ["rizos", "tratamientos"], "name": "Mascarilla ligera para ondas", "category": "Rizos y ondas", "size": "200 g", "price": 1850, "art": "jar cream", "label": "Ondas con movimiento", "description": "Un cuidado semanal de textura ligera para suavizar ondas y facilitar el peinado.", "benefits": ["Suaviza los largos", "Textura ligera", "Enjuagar después de aplicar"]},
  {"id": "spray-refresca-rizos", "collections": ["rizos", "peinado"], "name": "Spray refrescante para rizos", "category": "Rizos y ondas", "size": "150 ml", "price": 1400, "art": "sage", "label": "Rizos renovados", "description": "Una bruma para refrescar y acomodar ondas y rizos entre lavados.", "benefits": ["Aplicación en spray", "Ayuda a reactivar la forma", "No requiere enjuague"]},
  {"id": "serum-cuero-cabelludo", "collections": ["cuero-cabelludo", "tratamientos"], "name": "Sérum para cuero cabelludo", "category": "Cuero cabelludo", "size": "50 ml", "price": 1750, "art": "oil dark", "label": "Cuidado desde la raíz", "description": "Un sérum ligero para integrar un masaje suave al cuidado del cuero cabelludo.", "benefits": ["Aplicación localizada", "Textura ligera", "Masajear suavemente"]},
  {"id": "exfoliante-cuero-cabelludo", "collections": ["cuero-cabelludo", "tratamientos"], "name": "Exfoliante suave de cuero cabelludo", "category": "Cuero cabelludo", "size": "150 g", "price": 1800, "art": "jar sage", "label": "Limpieza ocasional", "description": "Una fórmula de uso ocasional para masajear el cuero cabelludo antes del lavado.", "benefits": ["Uso ocasional", "Masajear con suavidad", "Enjuagar antes del shampoo"]},
  {"id": "acondicionador-color", "collections": ["acondicionadores", "diario"], "name": "Acondicionador para cabello teñido", "category": "Cabello", "size": "250 ml", "price": 1600, "art": "clay", "label": "Suavidad y color", "description": "Un cuidado cremoso para suavizar los largos y acompañar la rutina del cabello teñido.", "benefits": ["Facilita el desenredado", "Suaviza medios y puntas", "Enjuagar después de aplicar"]}
];
const categories = ['Cabello', 'Estilo y barba', 'Cuidado personal', 'Rizos y ondas', 'Cuero cabelludo'];
// Colecciones independientes de los índices históricos de categoría.
const collections = [
  { id: 'diario', title: 'Cuidado diario', note: 'Los gestos de cada día', description: 'Limpieza y suavidad para acompañar tu rutina.' },
  { id: 'peinado', title: 'Peinado y fijación', note: 'Forma a tu manera', description: 'Texturas y acabados para encontrar tu estilo.' },
  { id: 'tratamientos', title: 'Tratamientos', note: 'Un momento de cuidado', description: 'Una selección para dedicar tiempo al cabello.' },
  { id: 'barba', title: 'Cuidado de barba', note: 'Tu ritual de barba', description: 'Limpiar, suavizar y dar forma con calma.' },
  { id: 'mas-vendidos', title: 'Destacados', note: 'La selección NUDO', description: 'Cuatro esenciales de la selección NUDO.' },
  { id: 'shampoos', title: 'Shampoos', note: 'El inicio del ritual', description: 'Cuatro formas de acompañar tu lavado.' },
  { id: 'acondicionadores', title: 'Acondicionadores', note: 'Un gesto de suavidad', description: 'Cuatro cuidados para desenredar y suavizar.' },
  { id: 'cuero-cabelludo', title: 'Cuero cabelludo', note: 'Cuidado desde la raíz', description: 'Limpieza y frescura para completar tu rutina capilar.' },
  { id: 'rizos', title: 'Rizos y ondas', note: 'Forma a tu manera', description: 'Cuidado, suavidad y definición para ondas y rizos.' }
];
const quickCategories = categories;
const collectionProducts = collection => products.filter(product => product.collections.includes(collection.id));
const relatedProducts = product => products
  .filter(candidate => candidate.id !== product.id)
  .map((candidate, index) => ({
    candidate,
    index,
    score: (candidate.category === product.category ? 3 : 0)
      + candidate.collections.filter(id => product.collections.includes(id)).length
  }))
  .sort((a, b) => b.score - a.score || a.index - b.index)
  .slice(0, 4)
  .map(({ candidate }) => candidate);
const app = document.querySelector('#app');
const status = document.querySelector('#status');
const cartFeedback = document.querySelector('#cart-feedback');
const cartCount = document.querySelector('#cart-count');
const storageKey = 'nudo-cart-v1';
const money = cents => new Intl.NumberFormat('es', { style: 'currency', currency: 'USD' }).format(cents / 100);
const total = items => items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
const escapeHTML = value => String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
const icon = name => `<svg class="icon" aria-hidden="true"><use href="#icon-${name}"></use></svg>`;
const categoryIcon = category => ({ 'Cabello': 'hair', 'Rizos y ondas': 'hair', 'Cuero cabelludo': 'hair', 'Estilo y barba': 'beard', 'Cuidado personal': 'care' })[category] || 'bottle';
const normalizeSearch = value => String(value).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('es').trim();
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
function countryFlag(iso) {
  return /^[A-Z]{2}$/.test(iso) && !['XK', 'AC', 'TA'].includes(iso) ? String.fromCodePoint(...[...iso].map(char => 0x1F1E6 + char.charCodeAt(0) - 65)) : '🌐';
}
const phoneCountryOptions = selected => phoneCountries.map(({ iso, name }) => `<option value="${iso}" ${iso === selected ? 'selected' : ''}>${escapeHTML(name)}</option>`).join('');
const phoneMaxLength = iso => 15 - (dialCodes[iso] || '').length;
const nameFields = ['firstName', 'secondName', 'firstSurname', 'secondSurname'];
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
  if (input.name === 'landline' && value && !/^0[2-7][0-9]{7}$/.test(value.replace(/[ -]/g, ''))) return 'Para Ecuador escribe 0 seguido de un dígito del 2 al 7 y siete dígitos más; puedes usar espacios o guiones.';
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

let cart = loadCart();
let shipping = {};
let shippingReady = false;
const emptyPayment = () => ({ method: 'local', delivery: 'home', destination: { city: '', address: '', complement: '', postal: '' } });
let payment = emptyPayment();
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
const art = product => `<div class="art ${product.art}" role="img" aria-label="Ilustración de ${product.name}, envase de ${product.size}"><div class="pack" aria-hidden="true"><div class="label"><b>nudo</b><span>${product.label}</span><small>${product.size} · BOTICA</small></div></div></div>`;
const heading = (eyebrow, title) => `<p class="eyebrow">${eyebrow}</p><h1 tabindex="-1">${title}</h1>`;
const card = product => `<article class="card"><a class="card-visual" href="#detalle/${product.id}" aria-label="Ver ${product.name}">${art(product)}<span class="card-number" aria-hidden="true">Nº ${String(products.indexOf(product) + 1).padStart(2, '0')}</span></a><p class="eyebrow">${product.category}</p><h3><a href="#detalle/${product.id}">${product.name}</a></h3><p class="card-size">${product.size}</p><div class="card-bottom"><strong>${money(product.price)}</strong><a href="#detalle/${product.id}" aria-label="Ver detalle de ${product.name}">Ver detalle ↗</a></div><button class="card-add" type="button" data-add="${product.id}" aria-label="Agregar ${product.name} al carrito">${icon('cart')}<span>Agregar</span></button></article>`;
const miniProduct = product => `<article class="mini-product">${art(product)}<div class="mini-product-copy"><h3>${escapeHTML(product.name)}</h3><strong>${money(product.price)}</strong><a href="#detalle/${encodeURIComponent(product.id)}" aria-label="Ver detalle de ${escapeHTML(product.name)}">Ver detalle ↗</a></div></article>`;
// Importes en centavos; única regla de cargo por fulfillment.
const deliveryFee = fulfillment => fulfillment === 'online-home' ? 500 : 0;
const totals = (items, fulfillment) => `<dl class="totals"><div><dt>Subtotal</dt><dd>${money(total(items))}</dd></div>${fulfillment === 'local-pickup' || fulfillment === 'online-pickup' ? '' : `<div><dt>Envío</dt><dd>${!fulfillment ? 'Se define en Pago' : money(deliveryFee(fulfillment))}</dd></div>`}<div class="total"><dt>Total <small>USD</small></dt><dd>${money(total(items) + deliveryFee(fulfillment))}</dd></div></dl>`;
const summary = (items, fulfillment) => `<ul class="summary">${items.map(item => `<li><span>${item.product.name} × ${item.quantity}</span><strong>${money(item.product.price * item.quantity)}</strong></li>`).join('')}</ul>${totals(items, fulfillment)}`;
const stepper = step => `<ol class="stepper" aria-label="Pasos del checkout">${[['Datos de compra/contacto', 'person'], ['Pago', 'card'], ['Confirmación', 'check']].map(([label, symbol], index) => `<li ${index + 1 === step ? 'aria-current="step"' : ''} class="${index + 1 < step ? 'done' : ''}"><span aria-hidden="true">${index + 1 < step ? icon('check') : icon(symbol)}</span>${label}</li>`).join('')}</ol>`;
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
    const digits = input.value.replace(/\D/g, '');
    if (digits.length < 12 || digits.length > 19) return 'Escribe un número de tarjeta de 12 a 19 dígitos.';
  }
  if (input.name === 'expiry') {
    if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(input.value)) return 'Escribe un mes válido en formato MM/AA.';
  }
  if (input.name === 'cvv' && !/^\d{3,4}$/.test(input.value)) return 'Escribe el código de seguridad de 3 o 4 dígitos.';
  return '';
}
function updateCountryFlag() {
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
    if (input.name === 'cardNumber') input.value = input.value.replace(/[^0-9 ]/g, '');
    if (input.name === 'expiry') {
      const digits = input.value.replace(/\D/g, '').slice(0, 4);
      input.value = digits.length > 2 ? digits.slice(0, 2) + '/' + digits.slice(2) : digits;
    }
    if (input.name === 'cvv') input.value = input.value.replace(/[^0-9]/g, '').slice(0, 4);
    const error = Object.hasOwn(payment.destination, input.name)
      ? destinationError(input)
      : cardError(input);
    setFieldError(input, error);
  }
}

function render(options = {}) {
  const route = location.hash.slice(1) || 'inicio';
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
  const isCatalog = route === 'productos' || categoryIndex >= 0 || Boolean(collection);
  if (!['inicio', 'carrito', 'envio', 'pago', 'confirmacion'].includes(route) && !isCatalog && !product && !isSearch) return replaceRoute('productos');
  if ((route === 'envio' || route === 'pago') && !cart.length) return replaceRoute('carrito');
  if (route === 'pago' && !shippingReady) return replaceRoute('envio');
  if (route === 'confirmacion' && !order) return replaceRoute('carrito');
  updateCartCount();
  if (isSearch) document.querySelector('#site-search-input').value = searchQuery;
  document.querySelectorAll('nav a').forEach(link => {
    const active = link.hash === '#' + route || ((product || isCatalog || isSearch) && link.hash === '#productos');
    if (active) link.setAttribute('aria-current', 'page'); else link.removeAttribute('aria-current');
  });
  if (route === 'inicio') {
    app.innerHTML = `<section class="hero" aria-labelledby="home-title">
      <div class="hero-copy"><p class="eyebrow">Cuidado capilar & personal</p><h1 id="home-title" tabindex="-1">Tu naturaleza.<br>Tu <em>ritual.</em></h1><p>Para tu cabello, tu piel, para ti. Pequeños gestos de cuidado, todos los días.</p><a class="button" href="#productos">Explorar la botica <span aria-hidden="true">↗</span></a><p class="hero-note">Cuidado sin etiquetas. A tu manera.</p></div>
      <div class="scene"><span class="scene-caption">LA COLECCIÓN / NUDO</span><span class="scene-stamp">Pequeños<br>rituales,<br>cada día.</span><div class="plinth" aria-hidden="true"></div>${art(products[0])}${art(products[1])}${art(products[2])}<span class="scene-bottom">CABELLO · PIEL · BIENESTAR</span></div>
      <aside class="hero-discovery" aria-labelledby="discovery-title"><h2 id="discovery-title">Encuentra tu ritual</h2><div class="discovery-links" aria-label="Explorar por categoría">${quickCategories.map(category => `<a class="discovery-link" href="${categoryHref(category)}"><span>${category}</span><span aria-hidden="true">↗</span></a>`).join('')}</div><div class="mini-products">${[products[0], products[1]].map(miniProduct).join('')}</div></aside>
      </section><div class="value-strip"><span>Una rutina para cada persona</span><span>Lo esencial, bien elegido</span><span>Tu momento de cuidado</span></div><div class="container home-selections">${categories.map((category, index) => { const items = products.filter(item => item.category === category); return '<section class="home-collection category-preview" aria-labelledby="home-category-' + index + '"><div class="section-head"><div><p class="eyebrow">La colección / NUDO</p><h2 id="home-category-' + index + '">' + category + '</h2></div></div><div class="grid home-grid">' + items.map(card).join('') + '</div><a class="explore-more" href="' + categoryHref(category) + '">Ver todos los productos de ' + category + ' <span aria-hidden="true">→</span></a></section>'; }).join('')}</div>`;
  } else if (isSearch) {
    const query = normalizeSearch(searchQuery);
    const results = products.filter(item => normalizeSearch(`${item.name} ${item.category} ${item.description} ${item.label}`).includes(query));
    app.innerHTML = `<div class="container search-results"><a class="back" href="#productos">← Volver a productos</a>${heading('Búsqueda / NUDO', `Resultados para “${escapeHTML(searchQuery)}”`)}${results.length ? `<div class="grid search-grid">${results.map(card).join('')}</div>` : `<div class="search-empty">${icon('search')}<h2>No encontramos productos</h2><p class="muted">Prueba con otro nombre o categoría, o explora todos los productos.</p><a class="button" href="#productos">Ver todos los productos</a></div>`}</div>`;
  } else if (isCatalog) {
    const selected = categoryIndex < 0 ? null : categories[categoryIndex];
    const catalogSection = (title, id, items, preview) => '<section class="category-section" aria-labelledby="' + id + '"><div class="category-heading"><h2 id="' + id + '">' + title + '</h2></div><div class="grid' + (preview ? ' home-grid' : '') + '">' + items.map(card).join('') + '</div>' + (preview ? '<a class="explore-more" href="' + categoryHref(title) + '">Ver todos los productos de ' + title + ' <span aria-hidden="true">→</span></a>' : '') + '</section>';
    const otherCategories = categories.filter(category => category !== selected).map((category, index) =>
      catalogSection(category, 'other-category-' + index, products.filter(item => item.category === category), true)
    ).join('');
    app.innerHTML = '<div class="container"><div class="catalog-intro"><div>' + heading('La colección / NUDO', collection ? collection.title : selected || 'Tu próxima rutina.') + '<p class="muted">' + (collection ? collection.description : selected ? 'Descubre toda la colección de ' + selected.toLowerCase() + ' y encuentra tus esenciales.' : 'Cabello, estilo y cuidado personal. Elige lo que acompaña tu rutina.') + '</p></div><p class="muted">Precios en USD</p></div>' + (collection ? catalogSection(collection.title, 'collection-' + collection.id, collectionProducts(collection), false) : selected ? catalogSection(selected, 'category-' + categoryIndex, products.filter(item => item.category === selected), false) + '<section class="other-categories" aria-labelledby="other-categories-title"><h2 id="other-categories-title">También puedes explorar</h2>' + otherCategories + '</section>' : categories.map((category, index) => catalogSection(category, 'category-' + index, products.filter(item => item.category === category), true)).join('')) + '</div>';
  } else if (product) {
    app.innerHTML = `<div class="container"><a class="back" href="#productos">← Volver a la colección</a><div class="detail">${art(product)}<div class="detail-copy">${heading(product.category + ' / NUDO', product.name)}<p>${product.description}</p><p>Presentación · <strong>${product.size}</strong></p><ul class="benefits">${product.benefits.map(benefit => `<li>${icon('check')}${benefit}</li>`).join('')}</ul><div class="detail-price">${money(product.price)}<small>USD</small></div><button class="button" data-add="${product.id}">${icon('cart')}<span>Agregar al carrito</span></button><p class="fine">Se agrega una unidad. Podrás ajustar la cantidad en el carrito.</p></div></div><section class="related-products" aria-labelledby="related-title"><div class="section-head"><div><p class="eyebrow">Completa tu rutina</p><h2 id="related-title">Productos que podrían interesarte</h2></div><a class="text-link" href="#productos">Ver todos ↗</a></div><div class="grid">${relatedProducts(product).map(card).join('')}</div></section></div>`;
  } else if (route === 'carrito') {
    app.innerHTML = `<div class="container">${heading('Tu selección', 'Carrito')}${cart.length ? `<div class="layout"><div>${cart.map(item => `<article class="cart-row">${art(item.product)}<div><h2><a href="#detalle/${item.product.id}">${item.product.name}</a></h2><p>${item.product.size} · ${money(item.product.price)} / unidad</p><strong class="cart-price">${money(item.product.price * item.quantity)}</strong><div class="quantity"><button class="secondary" data-change="-1" data-id="${item.product.id}" aria-label="Restar una unidad de ${item.product.name}" ${item.quantity === 1 ? 'disabled' : ''}>−</button><span aria-label="Cantidad: ${item.quantity}">${item.quantity}</span><button class="secondary" data-change="1" data-id="${item.product.id}" aria-label="Sumar una unidad de ${item.product.name}" ${item.quantity >= 99 ? 'disabled' : ''}>+</button><button class="remove" data-remove="${item.product.id}" aria-label="Eliminar ${item.product.name}">Eliminar</button></div></div></article>`).join('')}<a class="back" href="#productos">← Seguir explorando</a></div><aside class="panel" aria-label="Resumen del carrito"><h2>${icon('cart')}Tu ritual, listo.</h2>${totals(cart)}<a class="button" href="#envio">Continuar a datos de compra/contacto →</a></aside></div>` : `<div class="empty"><div class="empty-icon">${icon('cart')}</div><h2>Tu ritual está por empezar.</h2><p class="muted">Tu carrito está vacío. Explora nuestros esenciales y encuentra un momento para ti.</p><a class="button" href="#productos">Explorar productos ↗</a></div>`}</div>`;
  } else if (route === 'envio') {
    const fields = [
      ['firstName', 'Primer nombre', 'given-name', true], ['secondName', 'Segundo nombre (opcional)', 'additional-name', false],
      ['firstSurname', 'Primer apellido', 'section-first family-name', true], ['secondSurname', 'Segundo apellido (opcional)', 'section-second family-name', false],
      ['email', 'Correo electrónico', 'email', true], ['landline', 'Teléfono fijo (opcional)', 'section-landline tel-national', false]
    ];
    const phoneCountry = shipping.phoneCountry || 'EC';
    app.innerHTML = `<div class="container">${stepper(1)}${heading('Tu pedido / 01', 'Datos de compra/contacto')}<p class="muted">Los campos con * son obligatorios.</p><p><strong>Contexto de la compra:</strong> Ecuador</p><div class="layout"><form id="shipping-form" novalidate><div id="form-error" class="form-error" role="alert"></div><div class="fields">${fields.map(([name, label, autocomplete, required]) => `<div class="field"><label for="shipping-${name}">${label}${required ? ' <span aria-hidden="true">*</span>' : ''}</label><input id="shipping-${name}" name="${name}" type="${name === 'email' ? 'email' : name === 'landline' ? 'tel' : 'text'}" autocomplete="${autocomplete}" maxlength="160" ${name === 'landline' ? 'placeholder="02 999 9999"' : ''} ${required ? 'required' : ''} aria-describedby="error-${name}" value="${escapeHTML(shipping[name] || '')}"><span class="field-error" id="error-${name}" aria-live="polite" aria-atomic="true"></span></div>`).join('')}

    <div class="phone-fields wide"><div class="field"><label for="shipping-phoneCountry">País del celular / prefijo</label><span class="phone-country-control"><span id="shipping-phoneCountry-flag" class="phone-country-flag">${countryFlag(phoneCountry)}</span><select id="shipping-phoneCountry" name="phoneCountry" aria-describedby="error-phoneCountry">${phoneCountryOptions(phoneCountry)}</select><span id="phone-prefix" class="phone-prefix">+${dialCodes[phoneCountry]}</span></span><span class="field-error" id="error-phoneCountry" aria-live="polite" aria-atomic="true"></span></div><div class="field"><label for="shipping-mobile">Celular *</label><input id="shipping-mobile" name="mobile" type="text" required inputmode="numeric" autocomplete="tel-national" maxlength="${phoneMaxLength(phoneCountry)}" value="${escapeHTML(shipping.mobile || '')}" aria-describedby="error-mobile help-mobile"><span class="field-error" id="error-mobile" aria-live="polite" aria-atomic="true"></span></div><span class="field-help wide" id="help-mobile">Solo dígitos, sin prefijo. Para Ecuador: 9 dígitos empezando en 9, sin cero inicial. Máximo 15 dígitos contando el prefijo seleccionado.</span></div>
    </div><div class="actions"><button type="submit">Continuar al pago →</button><a class="text-link" href="#carrito">← Volver al carrito</a></div><p class="fine">Los datos de contacto no se guardan y se eliminan al recargar o confirmar.</p></form><aside class="panel"><h2>Tu selección</h2>${summary(cart)}</aside></div></div>`;
  } else if (route === 'pago') {
    app.innerHTML = `<div class="container">${stepper(2)}${heading('Tu pedido / 02', 'Pago')}<div class="layout"><div><form id="payment-form" novalidate><div id="form-error" class="form-error" role="alert"></div><fieldset class="checkout-options"><legend>Elige cómo pagar</legend><div class="segmented">${paymentOption('method', 'local', 'Pagar y retirar en el local')}${paymentOption('method', 'online', 'Pago en línea')}</div></fieldset><p id="local-notice" ${payment.method === 'local' ? '' : 'hidden'}>Pago pendiente en el local. Retira en 12 de Octubre y Veintimilla. No necesitas indicar un destino.</p><fieldset id="delivery-options" class="checkout-options" ${payment.method === 'online' ? '' : 'hidden'}><legend>Entrega del pedido</legend><div class="segmented">${paymentOption('delivery', 'home', 'Enviar a casa')}${paymentOption('delivery', 'pickup', 'Retirar en el local')}</div></fieldset><div id="card-panel">${cardFields()}</div><div id="destination-panel">${destinationFields()}</div></form><h2>Contacto</h2><p class="shipping-summary">${escapeHTML(nameFields.map(key => shipping[key]).filter(Boolean).join(' '))}<br>Correo: ${escapeHTML(shipping.email)}<br>Celular: ${countryFlag(shipping.phoneCountry)} ${escapeHTML(phoneCountries.find(country => country.iso === shipping.phoneCountry)?.name || shipping.phoneCountry)} +${dialCodes[shipping.phoneCountry]} ${escapeHTML(shipping.mobile)}${shipping.landline ? '<br>Teléfono fijo (Ecuador): ' + escapeHTML(shipping.landline) : ''}</p><a class="text-link" href="#envio">← Editar contacto</a></div><aside class="panel"><h2>Resumen del pedido</h2><div id="payment-summary">${summary(cart, currentFulfillment())}</div><p id="fulfillment-summary">${fulfillmentLabel(currentFulfillment())}</p><button class="button" type="submit" form="payment-form" data-pay>${paymentButtonLabel()}</button><a class="text-link" href="#carrito">Editar carrito</a></aside></div></div>`;
  } else if (route === 'confirmacion') {
    app.innerHTML = `<div class="container confirmation">${stepper(3)}<div class="success-mark" aria-hidden="true">✓</div>${heading('Tu pedido / 03 · ' + order.reference, order.fulfillment === 'online-home' ? 'Ticket de envío a casa' : 'Ticket de retiro')}<p class="confirmation-encouragement">Gracias por elegir NUDO. Sigue explorando y encuentra más esenciales para tu rutina.</p><p class="checkout-disclosure"><strong>${order.fulfillment === 'local-pickup' ? 'Pago pendiente en el local.' : 'Pago en línea no procesado.'}</strong> No se ha realizado ningún cobro${order.fulfillment === 'online-home' ? ' ni envío' : ''}. Los datos personales ya se eliminaron.</p><div class="panel"><h2>Resumen del pedido</h2>${summary(order.items, order.fulfillment)}<p>${fulfillmentLabel(order.fulfillment)}</p>${order.fulfillment === 'online-home' ? '<p>Envío a casa · Cargo de envío: ' + money(order.deliveryFee) + '</p>' : ''}</div><div class="actions"><a class="button" href="#productos">Seguir explorando ↗</a><a class="text-link" href="#inicio">Volver al inicio</a></div></div>`;
  }
  updateCountryFlag();
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
  } else if (button.dataset.change || button.dataset.remove) {
    const id = button.dataset.id || button.dataset.remove;
    const item = cart.find(entry => entry.product.id === id);
    if (!item) return;
    const change = button.dataset.change;
    if (button.dataset.remove) cart = cart.filter(entry => entry !== item);
    else item.quantity = Math.min(99, Math.max(1, item.quantity + Number(change)));
    shippingReady = false;
    order = null;
    if (!cart.length) { shipping = {}; payment = emptyPayment(); }
    saveCart();
    render({ keepPosition: true });
    const next = [...app.querySelectorAll('button')].find(candidate => candidate.dataset.id === id && candidate.dataset.change === change && !candidate.disabled)
      || [...app.querySelectorAll('button')].find(candidate => candidate.dataset.id === id && !candidate.disabled)
      || app.querySelector('.cart-row button:not(:disabled)') || app.querySelector('h1');
    next.focus({ preventScroll: true });
    announce(`${button.dataset.remove ? item.product.name + ' eliminado.' : 'Cantidad actualizada: ' + item.quantity + '.'} Total del carrito: ${money(total(cart))}.`);
  }
});

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
  if (!query) { searchInput.focus(); return; }
  closeSearch();
  location.hash = 'buscar/' + encodeURIComponent(query);
});
searchForm.addEventListener('keydown', event => {
  if (event.key !== 'Escape') return;
  closeSearch(true);
});
function editShipping(event) {
  const input = event.target;
  if (!(input instanceof HTMLInputElement || input instanceof HTMLSelectElement) || input.form?.id !== 'shipping-form') return;
  if (input.name === 'mobile') input.value = input.value.replace(/[^0-9]/g, '').slice(0, input.maxLength);
  shipping[input.name] = input.value;
  shippingReady = false;
  if (input.name === 'phoneCountry') {
    const mobile = input.form.elements.mobile;
    updateCountryFlag();
    mobile.maxLength = phoneMaxLength(input.value);
    if (mobile.value || mobile.hasAttribute('aria-invalid')) setFieldError(mobile, shippingError(mobile, input.form));
  }
  setFieldError(input, shippingError(input, input.form));
}

app.addEventListener('paste', event => {
  const input = event.target;
  if (input.form?.id !== 'shipping-form' || input.name !== 'mobile') return;
  event.preventDefault();
  const digits = event.clipboardData.getData('text').replace(/[^0-9]/g, '');
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
  document.querySelector('[data-pay]').disabled = true;
  orderNumber += 1;
  order = { reference: 'NUDO-' + String(orderNumber).padStart(4, '0'), items: cart.map(item => ({ ...item })), fulfillment: currentFulfillment(), deliveryFee: deliveryFee(currentFulfillment()) };
  cart = [];
  shipping = {};
  shippingReady = false;
  payment = emptyPayment();
  saveCart();
  // Sustituir Pago en el historial y vaciar el carrito impide repetir la simulación.
  replaceRoute('confirmacion');
  announce('Pedido registrado. No se ha realizado ningún cobro.');
});
document.querySelector('.skip-link').addEventListener('click', event => { event.preventDefault(); app.focus(); app.scrollIntoView(); });
window.addEventListener('hashchange', () => render());
if (!location.hash) history.replaceState(null, '', '#inicio');
render();
