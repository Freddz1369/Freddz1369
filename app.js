(() => {
  'use strict';

  const ALLOWANCE = 5500;
  const STORAGE_KEY = 'workwear-selecta:selected:v1';
  const products = Array.isArray(window.WORKWEAR_PRODUCTS) ? window.WORKWEAR_PRODUCTS : [];
  const productById = new Map(products.map((product) => [product.id, product]));

  const state = {
    selectedIds: loadSelection(),
    search: '',
    collection: '',
    category: '',
    sort: 'collection',
  };

  const els = {
    productGrid: document.querySelector('#productGrid'),
    productTemplate: document.querySelector('#productTemplate'),
    emptyState: document.querySelector('#emptyState'),
    searchInput: document.querySelector('#searchInput'),
    collectionFilter: document.querySelector('#collectionFilter'),
    categoryFilter: document.querySelector('#categoryFilter'),
    sortSelect: document.querySelector('#sortSelect'),
    clearFilters: document.querySelector('#clearFilters'),
    resultCount: document.querySelector('#resultCount'),
    usedAmount: document.querySelector('#usedAmount'),
    remainingAmount: document.querySelector('#remainingAmount'),
    budgetFill: document.querySelector('#budgetFill'),
    selectedCount: document.querySelector('#selectedCount'),
    selectionList: document.querySelector('#selectionList'),
    selectionEmpty: document.querySelector('#selectionEmpty'),
    selectionTotal: document.querySelector('#selectionTotal'),
    selectionRemaining: document.querySelector('#selectionRemaining'),
    copySummary: document.querySelector('#copySummary'),
    copyStatus: document.querySelector('#copyStatus'),
    resetSelection: document.querySelector('#resetSelection'),
  };

  function loadSelection() {
    try {
      const raw = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
      if (!Array.isArray(raw)) return [];

      const valid = raw.filter((id) => productById.has(id));
      let runningTotal = 0;
      return valid.filter((id) => {
        const price = productById.get(id).price;
        if (runningTotal + price > ALLOWANCE) return false;
        runningTotal += price;
        return true;
      });
    } catch {
      return [];
    }
  }

  function saveSelection() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.selectedIds));
  }

  function money(value) {
    return `${new Intl.NumberFormat('nb-NO').format(value)} NOK`;
  }

  function totalSelected() {
    return state.selectedIds.reduce((sum, id) => sum + (productById.get(id)?.price || 0), 0);
  }

  function remainingAllowance() {
    return ALLOWANCE - totalSelected();
  }

  function isSelected(id) {
    return state.selectedIds.includes(id);
  }

  function canAdd(product) {
    return product.price <= remainingAllowance();
  }

  function toggleProduct(id) {
    const product = productById.get(id);
    if (!product) return;

    if (isSelected(id)) {
      state.selectedIds = state.selectedIds.filter((selectedId) => selectedId !== id);
    } else if (canAdd(product)) {
      state.selectedIds = [...state.selectedIds, id];
    }

    saveSelection();
    render();
  }

  function populateFilters() {
    const collections = [...new Set(products.map((p) => p.collection))]
      .sort((a, b) => a.localeCompare(b, 'nb'));
    const categories = [...new Set(products.map((p) => p.category))]
      .sort((a, b) => a.localeCompare(b, 'nb'));

    collections.forEach((value) => {
      const option = document.createElement('option');
      option.value = value;
      option.textContent = value;
      els.collectionFilter.append(option);
    });

    categories.forEach((value) => {
      const option = document.createElement('option');
      option.value = value;
      option.textContent = value;
      els.categoryFilter.append(option);
    });
  }

  function filteredProducts() {
    const q = state.search.trim().toLocaleLowerCase('nb-NO');

    const filtered = products.filter((product) => {
      if (state.collection && product.collection !== state.collection) return false;
      if (state.category && product.category !== state.category) return false;
      if (!q) return true;

      const haystack = [
        product.collection,
        product.model,
        product.modelNumber,
        product.category,
        String(product.price),
      ].join(' ').toLocaleLowerCase('nb-NO');

      return haystack.includes(q);
    });

    return [...filtered].sort((a, b) => {
      if (state.sort === 'price-asc') return a.price - b.price || a.model.localeCompare(b.model, 'nb');
      if (state.sort === 'price-desc') return b.price - a.price || a.model.localeCompare(b.model, 'nb');
      if (state.sort === 'name') return a.model.localeCompare(b.model, 'nb');

      return (
        a.collection.localeCompare(b.collection, 'nb') ||
        a.category.localeCompare(b.category, 'nb') ||
        a.model.localeCompare(b.model, 'nb')
      );
    });
  }

  function renderProducts() {
    const visibleProducts = filteredProducts();
    const fragment = document.createDocumentFragment();
    const remaining = remainingAllowance();

    visibleProducts.forEach((product) => {
      const node = els.productTemplate.content.cloneNode(true);
      const card = node.querySelector('.product-card');
      const button = node.querySelector('.select-button');
      const selected = isSelected(product.id);
      const disabled = !selected && product.price > remaining;

      node.querySelector('.collection-tag').textContent = product.collection;
      node.querySelector('.model-number').textContent = product.modelNumber;
      node.querySelector('.model-name').textContent = product.model;
      node.querySelector('.category').textContent = product.category;
      node.querySelector('.price').textContent = money(product.price);

      card.classList.toggle('is-selected', selected);
      card.classList.toggle('is-disabled', disabled);
      button.textContent = selected ? 'Remove' : 'Add';
      button.disabled = disabled;
      button.setAttribute('aria-pressed', String(selected));
      button.setAttribute('aria-label', `${selected ? 'Remove' : 'Add'} ${product.model}`);
      node.querySelector('.disabled-note').hidden = !disabled;

      button.addEventListener('click', () => toggleProduct(product.id));
      fragment.append(node);
    });

    els.productGrid.replaceChildren(fragment);
    els.emptyState.hidden = visibleProducts.length !== 0;
    els.resultCount.textContent = `${visibleProducts.length} of ${products.length} products`;
  }

  function renderSelection() {
    const total = totalSelected();
    const remaining = ALLOWANCE - total;
    const percentage = Math.min(100, (total / ALLOWANCE) * 100);

    els.usedAmount.textContent = money(total);
    els.remainingAmount.textContent = money(remaining);
    els.selectedCount.textContent = String(state.selectedIds.length);
    els.budgetFill.style.width = `${percentage}%`;
    els.selectionTotal.textContent = money(total);
    els.selectionRemaining.textContent = money(remaining);
    els.copySummary.disabled = state.selectedIds.length === 0;

    els.selectionEmpty.hidden = state.selectedIds.length !== 0;

    const fragment = document.createDocumentFragment();

    state.selectedIds.forEach((id) => {
      const product = productById.get(id);
      if (!product) return;

      const item = document.createElement('div');
      item.className = 'selection-item';
      item.innerHTML = `
        <div>
          <p class="selection-item-name"></p>
          <div class="selection-item-meta"></div>
        </div>
        <div class="selection-item-price"></div>
        <button class="remove-button" type="button">Remove</button>
      `;
      item.querySelector('.selection-item-name').textContent = product.model;
      item.querySelector('.selection-item-meta').textContent = `${product.collection} · ${product.modelNumber} · ${product.category}`;
      item.querySelector('.selection-item-price').textContent = money(product.price);
      item.querySelector('.remove-button').addEventListener('click', () => toggleProduct(product.id));
      fragment.append(item);
    });

    els.selectionList.replaceChildren(fragment);
  }

  function render() {
    renderProducts();
    renderSelection();
  }

  async function copySelection() {
    const selected = state.selectedIds.map((id) => productById.get(id)).filter(Boolean);
    if (!selected.length) return;

    const total = totalSelected();
    const lines = [
      'WORKWEAR SELECTA',
      '',
      ...selected.map((product, index) =>
        `${index + 1}. ${product.model} · ${product.modelNumber} · ${money(product.price)}`
      ),
      '',
      `Total: ${money(total)}`,
      `Remaining: ${money(ALLOWANCE - total)}`,
    ];

    try {
      await navigator.clipboard.writeText(lines.join('\n'));
      els.copyStatus.textContent = 'Selection copied.';
    } catch {
      els.copyStatus.textContent = 'Could not access clipboard. Select and copy manually.';
    }

    window.setTimeout(() => {
      els.copyStatus.textContent = '';
    }, 2600);
  }

  function resetSelection() {
    if (!state.selectedIds.length) return;
    state.selectedIds = [];
    saveSelection();
    render();
  }

  function clearFilters() {
    state.search = '';
    state.collection = '';
    state.category = '';
    state.sort = 'collection';

    els.searchInput.value = '';
    els.collectionFilter.value = '';
    els.categoryFilter.value = '';
    els.sortSelect.value = 'collection';
    renderProducts();
  }

  function bindEvents() {
    els.searchInput.addEventListener('input', (event) => {
      state.search = event.target.value;
      renderProducts();
    });

    els.collectionFilter.addEventListener('change', (event) => {
      state.collection = event.target.value;
      renderProducts();
    });

    els.categoryFilter.addEventListener('change', (event) => {
      state.category = event.target.value;
      renderProducts();
    });

    els.sortSelect.addEventListener('change', (event) => {
      state.sort = event.target.value;
      renderProducts();
    });

    els.clearFilters.addEventListener('click', clearFilters);
    els.copySummary.addEventListener('click', copySelection);
    els.resetSelection.addEventListener('click', resetSelection);
  }

  populateFilters();
  bindEvents();
  render();
})();
