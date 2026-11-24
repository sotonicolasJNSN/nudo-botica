'use strict';
(() => {
  const base = globalThis.NUDO_API_BASE || location.origin;
  const url = path => new URL(path.replace(/^\//, ''), base.endsWith('/') ? base : base + '/');
  const status = document.querySelector('#admin-status'), login = document.querySelector('#login'), panel = document.querySelector('#panel');
  const select = document.querySelector('#products'), editor = document.querySelector('#editor');
  const supplierSelect = document.querySelector('#supplier'), supplierList = document.querySelector('#supplier-list'), supplierForm = document.querySelector('#supplier-form');
  const supplierToDelete = document.querySelector('#supplier-to-delete');
  const supplierAddMessage = document.querySelector('#supplier-add-message'), supplierDeleteMessage = document.querySelector('#supplier-delete-message'), productMessage = document.querySelector('#product-message');
  const kardexProduct = document.querySelector('#kardex-product'), kardexRows = document.querySelector('#kardex-rows');
  const kardexStatus = document.querySelector('#kardex-status'), receiptForm = document.querySelector('#inventory-receipt-form');
  const receiptProduct = document.querySelector('#receipt-product');
  let token = '', products = [], suppliers = [], links = [], selected = '';
  let pendingReceiptReference = '', pendingReceiptFingerprint = '', receiptBusy = false;
  const message = (value, target = status) => { status.textContent = value; if (target !== status) target.textContent = value; };
  async function request(path, options = {}) {
    const response = await fetch(url(path), { ...options, headers: { ...(options.body ? { 'Content-Type': 'application/json' } : {}), ...(token ? { Authorization: `Bearer ${token}` } : {}) } });
    if (response.status === 401 && token) { token = ''; showSession(); }
    if (!response.ok) { let result; try { result = await response.json(); } catch { result = {}; } throw Error(result.error || `HTTP ${response.status}`); }
    return response.status === 204 ? null : response.json();
  }
  function showSession() { login.hidden = !!token; panel.hidden = !token; }
  function showProduct() {
    const product = products.find(p => p.id === selected) || { id:'', name:'', category:'', size:'', price:0, stock:0, art:'sage', label:'', description:'', benefits:[], collections:[] };
    for (const field of ['name','size','description']) editor.elements[field].value = product[field];
    const category = editor.elements.category;
    category.replaceChildren();
    category.add(new Option('Selecciona una categoría', ''));
    for (const value of ['Paquete de 12','Paquete de 24']) category.add(new Option(value, value));
    if (product.category && !['Paquete de 12','Paquete de 24'].includes(product.category)) category.add(new Option(product.category + ' (actual)', product.category));
    category.value = product.category;
    editor.elements.price.value = selected ? (product.price / 100).toFixed(2) : '';
    editor.elements.stock.value = product.stock ?? 0;
    editor.elements.benefits.value = product.benefits.join('\n');
    editor.elements.collections.value = product.collections.join(', ');
    supplierSelect.value = links.find(link => link.productId === selected)?.supplierId || '';
    document.querySelector('#delete').disabled = !selected;
  }
  function readProduct() {
    const existing = products.find(p => p.id === selected);
    const product = {};
    for (const field of ['name','category','size','description']) product[field] = editor.elements[field].value.trim();
    const slug = product.name.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'').slice(0,60).replace(/-$/,'') || 'producto';
    product.id = existing?.id || `${slug}-${globalThis.crypto.randomUUID().slice(0,8)}`;
    product.art = existing?.art || 'sage';
    product.label = existing?.label || product.name;
    const price = editor.elements.price.value;
    if (!/^\d+(?:\.\d{1,2})?$/.test(price) || Number(price) > 100000) throw Error('Escribe un precio válido con hasta dos decimales');
    product.price = Math.round(Number(price) * 100);
    const stock = editor.elements.stock.value;
    if (!/^(0|[1-9]\d*)$/.test(stock) || Number(stock) > 1000000000) throw Error('El stock debe ser un entero no negativo');
    product.stock = Number(stock);
    product.benefits = editor.elements.benefits.value.split(/\r?\n/).map(value => value.trim()).filter(Boolean);
    product.collections = editor.elements.collections.value.split(',').map(value => value.trim()).filter(Boolean);
    return product;
  }
  function renderKardex(movements) {
    kardexRows.replaceChildren();
    let purchases = 0, sales = 0, adjustments = 0;
    for (const movement of movements) {
      const quantity = Number(movement.quantity);
      if (movement.movementType === 'purchase') purchases += quantity;
      else if (movement.movementType === 'sale') sales += quantity;
      else adjustments += Number(movement.stockAfter) - Number(movement.stockBefore);
      const row = document.createElement('tr');
      const date = new Date(movement.createdAt);
      const values = [
        Number.isNaN(date.getTime()) ? movement.createdAt : date.toLocaleString(),
        movement.productName,
        movement.movementType === 'purchase' ? 'Compra / ingreso' : movement.movementType === 'sale' ? 'Venta' : 'Ajuste',
        `${movement.movementType === 'sale' ? '-' : movement.movementType === 'purchase' ? '+' : Number(movement.stockAfter) >= Number(movement.stockBefore) ? '+' : '-'}${quantity}`,
        movement.stockBefore,
        movement.stockAfter,
        [movement.reference, movement.notes].filter(Boolean).join(' · ')
      ];
      values.forEach((value, index) => {
        const cell = document.createElement('td');
        cell.textContent = String(value ?? '—');
        if (index === 2) cell.className = `kardex-type-${movement.movementType}`;
        row.appendChild(cell);
      });
      kardexRows.appendChild(row);
    }
    if (!movements.length) {
      const row = document.createElement('tr'), cell = document.createElement('td');
      cell.colSpan = 7;
      cell.className = 'kardex-empty';
      cell.textContent = 'Aún no hay movimientos de inventario.';
      row.appendChild(cell);
      kardexRows.appendChild(row);
    }
    document.querySelector('#kardex-purchases').textContent = String(purchases);
    document.querySelector('#kardex-sales').textContent = String(sales);
    document.querySelector('#kardex-adjustments').textContent = String(adjustments);
  }
  async function refreshKardex() {
    const params = new URLSearchParams({ limit: '100' });
    if (kardexProduct.value) params.set('productId', kardexProduct.value);
    const movements = await request(`/api/admin/inventory-movements?${params}`);
    if (!Array.isArray(movements)) throw Error('La respuesta del kardex no es válida');
    renderKardex(movements);
    kardexStatus.textContent = movements.length
      ? `${movements.length} movimientos cargados.`
      : 'Aún no hay movimientos de inventario.';
  }
  async function refreshKardexSafely() {
    try { await refreshKardex(); }
    catch (error) { kardexStatus.textContent = `No se pudo cargar el kardex: ${error.message}`; }
  }
  async function refresh() {
    [products, suppliers, links] = await Promise.all([request('/api/products'), request('/api/suppliers'), request('/api/product-suppliers')]);
    select.replaceChildren(); supplierSelect.replaceChildren(); supplierList.replaceChildren(); supplierToDelete.replaceChildren();
    const kardexFilter = kardexProduct.value;
    kardexProduct.replaceChildren(); receiptProduct.replaceChildren();
    kardexProduct.add(new Option('Todos los productos', ''));
    supplierSelect.add(new Option('Selecciona un proveedor', ''));
    supplierToDelete.add(new Option('Selecciona un proveedor', ''));
    receiptProduct.add(new Option('Selecciona un producto', ''));
    suppliers.forEach(supplier => {
      supplierSelect.add(new Option(supplier.name, supplier.id));
      supplierToDelete.add(new Option(supplier.name, supplier.id));
      const item = document.createElement('li'); item.textContent = supplier.name; supplierList.appendChild(item);
    });
    select.add(new Option('Nuevo producto', ''));
    products.forEach(p => {
      select.add(new Option(`${p.name} (${p.id})`, p.id));
      kardexProduct.add(new Option(`${p.name} (${p.id})`, p.id));
      receiptProduct.add(new Option(`${p.name} (${p.id})`, p.id));
    });
    kardexProduct.value = products.some(p => p.id === kardexFilter) ? kardexFilter : '';
    if (!products.some(p => p.id === selected)) selected = '';
    select.value = selected; showProduct();
    await refreshKardexSafely();
  }
  supplierForm.addEventListener('submit', async e => {
    e.preventDefault();
    try { await request('/api/suppliers', { method:'POST', body:JSON.stringify({name:supplierForm.elements.name.value.trim()}) }); }
    catch (error) { message(error.message, supplierAddMessage); return; }
    supplierForm.reset();
    message('Proveedor agregado correctamente.', supplierAddMessage);
    try { await refresh(); } catch { message('Proveedor agregado, pero no se pudo actualizar la lista. Pulsa Actualizar lista.', supplierAddMessage); }
  });
  document.querySelector('#delete-supplier').addEventListener('click', async () => {
    const id=supplierToDelete.value;
    if (!id) { message('Selecciona un proveedor', supplierDeleteMessage); return; }
    if (!confirm('¿Eliminar el proveedor seleccionado?')) return;
    try { await request(`/api/suppliers/${encodeURIComponent(id)}`, {method:'DELETE'}); }
    catch (error) { message(error.message, supplierDeleteMessage); return; }
    message('Proveedor eliminado correctamente.', supplierDeleteMessage);
    try { await refresh(); } catch { message('Proveedor eliminado, pero no se pudo actualizar la lista. Pulsa Actualizar lista.', supplierDeleteMessage); }
  });
  login.addEventListener('submit', async e => { e.preventDefault(); try { const result = await request('/api/session', { method:'POST', body:JSON.stringify({password:login.elements.password.value}) }); token = result.token; login.reset(); showSession(); await refresh(); message('Sesión activa.'); } catch (error) { message(error.message); } });
  select.addEventListener('change', () => { selected = select.value; productMessage.textContent = ''; showProduct(); });
  document.querySelector('#new').addEventListener('click', () => { selected = ''; select.value = ''; productMessage.textContent = ''; showProduct(); editor.elements.name.focus(); });
  document.querySelector('#refresh').addEventListener('click', async () => { try { await refresh(); message('Lista actualizada.'); } catch (error) { message(error.message); } });
  document.querySelector('#refresh-kardex').addEventListener('click', refreshKardexSafely);
  kardexProduct.addEventListener('change', refreshKardexSafely);
  receiptForm.addEventListener('submit', async e => {
    e.preventDefault();
    if (receiptBusy) return;
    const productId = receiptForm.elements.productId.value;
    const rawQuantity = receiptForm.elements.quantity.value;
    const notes = receiptForm.elements.notes.value.trim();
    if (!productId) { kardexStatus.textContent = 'Selecciona el producto recibido.'; return; }
    if (!/^[1-9]\d*$/.test(rawQuantity) || Number(rawQuantity) > 1000000000) {
      kardexStatus.textContent = 'La cantidad recibida debe ser un entero positivo.';
      return;
    }
    const fingerprint = JSON.stringify({ productId, quantity: Number(rawQuantity), notes });
    if (!pendingReceiptReference || pendingReceiptFingerprint !== fingerprint) {
      pendingReceiptReference = `COMPRA-${globalThis.crypto.randomUUID().toUpperCase()}`;
      pendingReceiptFingerprint = fingerprint;
    }
    receiptBusy = true;
    try {
      await request('/api/admin/inventory-receipts', {
        method: 'POST',
        body: JSON.stringify({
          reference: pendingReceiptReference,
          items: [{ id: productId, quantity: Number(rawQuantity) }],
          notes
        })
      });
      pendingReceiptReference = '';
      pendingReceiptFingerprint = '';
      receiptForm.reset();
      kardexStatus.textContent = 'Compra registrada y stock actualizado.';
      await refresh();
    } catch (error) {
      kardexStatus.textContent = `No se pudo registrar la compra: ${error.message}`;
    } finally {
      receiptBusy = false;
    }
  });
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
  editor.addEventListener('submit', async e => {
    e.preventDefault();
    const isNew = !selected;
    let saved;
    try {
      const product = readProduct();
      if (!supplierSelect.value) throw Error('Selecciona un proveedor');
      saved = await request(selected ? `/api/admin/products/${encodeURIComponent(selected)}` : '/api/admin/products', { method:selected ? 'PUT' : 'POST', body:JSON.stringify({product, supplierId:supplierSelect.value}) });
    } catch (error) { message(error.message, productMessage); return; }
    selected = isNew ? '' : saved.id;
    if (isNew) { select.value = ''; showProduct(); }
    message(isNew ? 'Producto agregado correctamente. Ya puedes crear otro.' : 'Producto actualizado correctamente.', productMessage);
    try { await refresh(); } catch { message('Producto guardado, pero no se pudo actualizar la lista. Pulsa Actualizar lista.', productMessage); }
  });
  document.querySelector('#delete').addEventListener('click', async () => {
    if (!selected || !confirm(`¿Eliminar ${selected}?`)) return;
    try { await request(`/api/products/${encodeURIComponent(selected)}`, {method:'DELETE'}); }
    catch (error) { message(error.message, productMessage); return; }
    selected = ''; select.value = ''; showProduct();
    message('Producto eliminado correctamente.', productMessage);
    try { await refresh(); } catch { message('Producto eliminado, pero no se pudo actualizar la lista. Pulsa Actualizar lista.', productMessage); }
  });
})();
