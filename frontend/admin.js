'use strict';
(() => {
  const base = globalThis.NUDO_API_BASE || location.origin;
  const url = path => new URL(path.replace(/^\//, ''), base.endsWith('/') ? base : base + '/');
  const status = document.querySelector('#admin-status'), login = document.querySelector('#login'), panel = document.querySelector('#panel');
  const select = document.querySelector('#products'), editor = document.querySelector('#editor');
  let token = '', products = [], selected = '';
  const message = value => { status.textContent = value; };
  async function request(path, options = {}) {
    const response = await fetch(url(path), { ...options, headers: { ...(options.body ? { 'Content-Type': 'application/json' } : {}), ...(token ? { Authorization: `Bearer ${token}` } : {}) } });
    if (response.status === 401 && token) { token = ''; showSession(); }
    if (!response.ok) { let result; try { result = await response.json(); } catch { result = {}; } throw Error(result.error || `HTTP ${response.status}`); }
    return response.status === 204 ? null : response.json();
  }
  function showSession() { login.hidden = !!token; panel.hidden = !token; }
  function showProduct() {
    const product = products.find(p => p.id === selected) || { id:'', name:'', category:'', size:'', price:0, art:'sage', label:'', description:'', benefits:[], collections:[] };
    for (const field of ['id','name','category','size','price','art','label','description']) editor.elements[field].value = product[field];
    editor.elements.benefits.value = product.benefits.join('\n');
    editor.elements.collections.value = product.collections.join(', ');
    editor.elements.id.disabled = !!selected;
    document.querySelector('#delete').disabled = !selected;
  }
  function readProduct() {
    const product = {};
    for (const field of ['id','name','category','size','art','label','description']) product[field] = editor.elements[field].value.trim();
    product.price = Number(editor.elements.price.value);
    product.benefits = editor.elements.benefits.value.split(/\r?\n/).map(value => value.trim()).filter(Boolean);
    product.collections = editor.elements.collections.value.split(',').map(value => value.trim()).filter(Boolean);
    return product;
  }
  async function refresh() {
    products = await request('/api/products'); select.replaceChildren();
    select.add(new Option('Nuevo producto', ''));
    products.forEach(p => select.add(new Option(`${p.name} (${p.id})`, p.id)));
    if (!products.some(p => p.id === selected)) selected = '';
    select.value = selected; showProduct();
  }
  login.addEventListener('submit', async e => { e.preventDefault(); try { const result = await request('/api/session', { method:'POST', body:JSON.stringify({password:login.elements.password.value}) }); token = result.token; login.reset(); showSession(); await refresh(); message('Sesión activa.'); } catch (error) { message(error.message); } });
  select.addEventListener('change', () => { selected = select.value; showProduct(); });
  document.querySelector('#new').addEventListener('click', () => { selected = ''; select.value = ''; showProduct(); editor.elements.id.focus(); });
  document.querySelector('#refresh').addEventListener('click', async () => { try { await refresh(); message('Lista actualizada.'); } catch (error) { message(error.message); } });
  document.querySelector('#logout').addEventListener('click', async () => {
    try {
      await request('/api/session', { method:'DELETE' });
      token = '';
      selected = '';
      showSession();
      message('Sesion cerrada.');
    } catch (error) {
      message('No se pudo cerrar la sesion en el servidor: ' + error.message);
    }
  });
  editor.addEventListener('submit', async e => { e.preventDefault(); try { const product = readProduct(); const saved = await request(selected ? `/api/products/${encodeURIComponent(selected)}` : '/api/products', { method:selected ? 'PUT' : 'POST', body:JSON.stringify(product) }); selected = saved.id; await refresh(); message('Producto guardado en la base de datos.'); } catch (error) { message(error.message); } });
  document.querySelector('#delete').addEventListener('click', async () => { if (!selected || !confirm(`¿Eliminar ${selected}?`)) return; try { await request(`/api/products/${encodeURIComponent(selected)}`, {method:'DELETE'}); selected = ''; await refresh(); message('Producto eliminado.'); } catch (error) { message(error.message); } });
})();
