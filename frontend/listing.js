'use strict';
// Controles y construcción de rutas del listado: no administra el DOM ni el carrito.
globalThis.NudoListing = (() => {
  function filterFields(prefix, state, {categories, priceRanges, sortOptions}, escapeHTML) {
    return `<label for="${prefix}-category">Categoría<select id="${prefix}-category" name="category">${[['', 'Todas las categorías'], ...categories.map(category => [category, category])].map(([value, label]) => `<option value="${escapeHTML(value)}" ${state.category === value ? 'selected' : ''}>${escapeHTML(label)}</option>`).join('')}</select></label>
    <label for="${prefix}-price">Precio<select id="${prefix}-price" name="price">${priceRanges.map(range => `<option value="${range.value}" ${state.price === range.value ? 'selected' : ''}>${range.label}</option>`).join('')}</select></label>
    <label class="sort-field" for="${prefix}-sort">Ordenar por<select id="${prefix}-sort" name="sort">${sortOptions.map(option => `<option value="${option.value}" ${state.sort === option.value ? 'selected' : ''}>${option.label}</option>`).join('')}</select></label>`;
  }
  const stateFrom = form => ({ category:form.elements.category.value, price:form.elements.price.value, sort:form.elements.sort.value });
  function queryString(state) {
    const params = new URLSearchParams();
    if (state.category) params.set('categoria', state.category);
    if (state.price !== 'all') params.set('precio', state.price);
    if (state.sort !== 'list') params.set('orden', state.sort);
    const query = params.toString();
    return query ? '?' + query : '';
  }
  function route(state, searchText) {
    const query = searchText.trim();
    return (query ? 'buscar/' + encodeURIComponent(query) : 'productos') + queryString(state);
  }
  function controls(state, options, escapeHTML) {
    return `<form class="listing-controls" data-listing-controls><div class="filter-fields">${filterFields('catalog', state, options, escapeHTML)}</div><div class="filter-actions"><button type="button" class="filter-reset" data-reset-filters>Limpiar filtros</button></div></form>`;
  }
  function searchScreen({query, state, results, heading, card, icon, escapeHTML, options}) {
    const hasFilters = state.category || state.price !== 'all' || state.sort !== 'list';
    const empty = `<div class="search-empty">${icon('search')}<h2>No hay productos con estos filtros</h2><p class="muted">Prueba con otro término, categoría o rango de precio.</p>${hasFilters ? '<button class="secondary" type="button" data-reset-filters>Limpiar filtros</button>' : '<a class="button" href="#productos">Explorar todos los productos</a>'}</div>`;
    return `<div class="container search-results"><a class="back" href="#productos">← Volver a productos</a>${heading('Búsqueda / NUDO', `Resultados para “${escapeHTML(query)}”`)}${controls(state, options, escapeHTML)}${results.length ? `<div class="grid search-grid">${results.map(card).join('')}</div>` : empty}</div>`;
  }
  return { filterFields, stateFrom, queryString, route, controls, searchScreen };
})();
