<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import MainLayout from '../layout/MainLayout.vue';
import ProductCard from '../components/ProductCard.vue';
import { useProductsStore } from '../stores/products';

const productsStore = useProductsStore();
const route = useRoute();

const searchQuery = ref('');
const selectedCollection = ref('');
const selectedSort = ref('');
const debounceTimer = ref<ReturnType<typeof setTimeout> | null>(null);

const products = computed(() => productsStore.products);
const loading = computed(() => productsStore.loading);
const pagination = computed(() => productsStore.pagination);

const collections = [
  { value: '', label: 'Todas las colecciones' },
  { value: 'boscan', label: 'Colección Boscan' },
  { value: 'moni', label: 'Colección La Moni' },
  { value: 'rustica', label: 'Artesanal Rústica' },
  { value: 'set', label: 'Sets de Colección' },
];

const sorts = [
  { value: '', label: 'Más recientes' },
  { value: 'price_asc', label: 'Precio: menor a mayor' },
  { value: 'price_desc', label: 'Precio: mayor a menor' },
  { value: 'name_asc', label: 'Nombre A-Z' },
];

async function applyFilters(page = 1) {
  productsStore.setFilters({
    collection: selectedCollection.value || undefined,
    search: searchQuery.value || undefined,
    sort: selectedSort.value || undefined,
  });
  await productsStore.fetchProducts(page);
}

function onSearchInput() {
  if (debounceTimer.value) clearTimeout(debounceTimer.value);
  debounceTimer.value = setTimeout(() => {
    applyFilters(1);
  }, 400);
}

function clearFilters() {
  searchQuery.value = '';
  selectedCollection.value = '';
  selectedSort.value = '';
  productsStore.clearFilters();
  productsStore.fetchProducts(1);
}

function goToPage(page: number) {
  applyFilters(page);
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

watch(() => route.query.collection, (val) => {
  if (val && typeof val === 'string') {
    selectedCollection.value = val;
    applyFilters(1);
  }
}, { immediate: false });

onMounted(() => {
  const collectionParam = route.query.collection;
  if (collectionParam && typeof collectionParam === 'string') {
    selectedCollection.value = collectionParam;
  }
  applyFilters(1);
});

watch([selectedCollection, selectedSort], () => {
  applyFilters(1);
});

</script>

<template>
  <MainLayout>
    <div class="shop-view">
      <!-- Page Header -->
      <div class="shop-view__hero">
        <div class="container">
          <span class="shop-view__eyebrow">Nuestra Tienda</span>
          <h1 class="shop-view__title">Tazas con Alma</h1>
          <p class="shop-view__subtitle">Descubre cada colección y encuentra la taza que cuenta tu historia.</p>
        </div>
      </div>

      <div class="container shop-view__layout">
        <!-- Sidebar Filters -->
        <aside class="shop-view__sidebar">
          <div class="shop-filter">
            <h3 class="shop-filter__title">Filtros</h3>

            <!-- Search -->
            <div class="shop-filter__group">
              <label class="shop-filter__label" for="shop-search">Buscar</label>
              <div class="shop-filter__search-wrap">
                <svg class="shop-filter__search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                </svg>
                <input
                  id="shop-search"
                  v-model="searchQuery"
                  type="search"
                  placeholder="Buscar taza..."
                  class="shop-filter__input"
                  @input="onSearchInput"
                />
              </div>
            </div>

            <!-- Collection -->
            <div class="shop-filter__group">
              <label class="shop-filter__label">Colección</label>
              <div class="shop-filter__radio-list">
                <label v-for="col in collections" :key="col.value" class="shop-filter__radio-item">
                  <input
                    type="radio"
                    :value="col.value"
                    v-model="selectedCollection"
                    class="shop-filter__radio"
                  />
                  <span class="shop-filter__radio-label">{{ col.label }}</span>
                </label>
              </div>
            </div>

            <!-- Sort -->
            <div class="shop-filter__group">
              <label class="shop-filter__label" for="shop-sort">Ordenar por</label>
              <select id="shop-sort" v-model="selectedSort" class="shop-filter__select">
                <option v-for="s in sorts" :key="s.value" :value="s.value">{{ s.label }}</option>
              </select>
            </div>

            <button v-if="searchQuery || selectedCollection || selectedSort" class="shop-filter__clear" @click="clearFilters">
              Limpiar filtros
            </button>
          </div>
        </aside>

        <!-- Products Area -->
        <div class="shop-view__main">
          <!-- Results info -->
          <div class="shop-view__results-bar">
            <p class="shop-view__results-text">
              <template v-if="!loading">
                {{ pagination.total }} producto{{ pagination.total !== 1 ? 's' : '' }} encontrado{{ pagination.total !== 1 ? 's' : '' }}
              </template>
              <template v-else>Buscando...</template>
            </p>
          </div>

          <!-- Loading Skeletons -->
          <div v-if="loading" class="shop-view__grid">
            <div v-for="i in 8" :key="`skeleton-${i}`" class="product-skeleton">
              <div class="product-skeleton__image skeleton"></div>
              <div class="product-skeleton__body">
                <div class="product-skeleton__line skeleton" style="width: 65%"></div>
                <div class="product-skeleton__line skeleton" style="width: 45%"></div>
                <div class="product-skeleton__footer">
                  <div class="product-skeleton__price skeleton" style="width: 30%"></div>
                  <div class="product-skeleton__btn skeleton" style="width: 35%"></div>
                </div>
              </div>
            </div>
          </div>

          <!-- Products Grid -->
          <div v-else-if="products.length > 0" class="shop-view__grid">
            <ProductCard
              v-for="product in products"
              :key="product._id"
              :product="product"
            />
          </div>

          <!-- No results -->
          <div v-else class="shop-view__empty">
            <div class="shop-view__empty-icon"><i class="fa-solid fa-magnifying-glass"></i></div>
            <h3 class="shop-view__empty-title">Sin resultados</h3>
            <p class="shop-view__empty-text">No encontramos tazas con esos criterios. Prueba con otros filtros.</p>
            <button class="shop-view__empty-btn" @click="clearFilters">Ver todas las tazas</button>
          </div>

          <!-- Pagination -->
          <div v-if="!loading && pagination.pages > 1" class="shop-view__pagination">
            <button
              class="shop-view__page-btn"
              :disabled="pagination.page <= 1"
              @click="goToPage(pagination.page - 1)"
              aria-label="Página anterior"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="15 18 9 12 15 6"/>
              </svg>
            </button>
            <button
              v-for="p in pagination.pages"
              :key="p"
              :class="['shop-view__page-btn', { 'shop-view__page-btn--active': p === pagination.page }]"
              @click="goToPage(p)"
            >{{ p }}</button>
            <button
              class="shop-view__page-btn"
              :disabled="pagination.page >= pagination.pages"
              @click="goToPage(pagination.page + 1)"
              aria-label="Página siguiente"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="9 18 15 12 9 6"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  </MainLayout>
</template>

<style lang="scss" scoped>
@use "sass:color";

@keyframes skeleton-pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
}

.shop-view {
  &__hero {
    background-color: var(--color-bg-subtle);
    padding: 3.5rem 0 3rem;
    border-bottom: 1px solid var(--color-border);
  }

  &__eyebrow {
    display: inline-block;
    font-size: 0.8125rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.12em;
    color: $color-accent;
    margin-bottom: 0.5rem;
  }

  &__title {
    font-family: var(--font-heading);
    font-size: clamp(1.75rem, 4vw, 3rem);
    font-weight: 700;
    color: var(--color-primary);
    margin-bottom: 0.625rem;
  }

  &__subtitle {
    font-size: 1rem;
    color: var(--color-muted);
    max-width: 480px;
  }

  &__layout {
    display: grid;
    grid-template-columns: 260px 1fr;
    gap: 3rem;
    padding-top: 3rem;
    padding-bottom: 4rem;
    align-items: start;

    @media (max-width: 900px) {
      grid-template-columns: 1fr;
      gap: 2rem;
      padding-top: 2rem;
    }
  }

  &__sidebar {
    position: sticky;
    top: 90px;

    @media (max-width: 900px) {
      position: static;
    }
  }

  &__main {
    min-width: 0;
  }

  &__results-bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 1.5rem;
  }

  &__results-text {
    font-size: 0.9375rem;
    color: var(--color-muted);
  }

  &__grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1.5rem;

    @media (max-width: 1200px) {
      grid-template-columns: repeat(2, 1fr);
    }

    @media (max-width: 600px) {
      grid-template-columns: 1fr;
      gap: 1rem;
    }
  }

  &__empty {
    text-align: center;
    padding: 5rem 2rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
  }

  &__empty-icon {
    font-size: 3rem;
    opacity: 0.4;
  }

  &__empty-title {
    font-family: var(--font-heading);
    font-size: 1.375rem;
    color: var(--color-primary);
  }

  &__empty-text {
    font-size: 0.9375rem;
    color: var(--color-muted);
    max-width: 300px;
    line-height: 1.6;
  }

  &__empty-btn {
    margin-top: 0.5rem;
    padding: 0.75rem 1.75rem;
    background-color: $color-accent;
    color: white;
    border: none;
    border-radius: $radius-md;
    font-size: 0.9375rem;
    font-weight: 500;
    cursor: pointer;
    font-family: var(--font-body);
    transition: background-color 0.2s ease;

    &:hover {
      background-color: color.adjust($color-accent, $lightness: -8%);
    }
  }

  &__pagination {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    margin-top: 3rem;
    flex-wrap: wrap;
  }

  &__page-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 40px;
    height: 40px;
    padding: 0 0.75rem;
    border: 1px solid var(--color-border);
    border-radius: $radius-sm;
    font-size: 0.9375rem;
    color: var(--color-muted);
    cursor: pointer;
    background: none;
    transition: all 0.2s ease;
    font-family: var(--font-body);

    &:hover:not(:disabled) {
      border-color: $color-accent;
      color: $color-accent;
    }

    &--active {
      background-color: $color-accent;
      border-color: $color-accent;
      color: white;
      font-weight: 600;
    }

    &:disabled {
      opacity: 0.4;
      cursor: not-allowed;
    }
  }
}

.shop-filter {
  background-color: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: $radius-lg;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.75rem;

  &__title {
    font-family: var(--font-heading);
    font-size: 1.0625rem;
    font-weight: 700;
    color: var(--color-primary);
  }

  &__group {
    display: flex;
    flex-direction: column;
    gap: 0.625rem;
  }

  &__label {
    font-size: 0.875rem;
    font-weight: 600;
    color: var(--color-primary);
    text-transform: uppercase;
    letter-spacing: 0.06em;
  }

  &__search-wrap {
    position: relative;
    display: flex;
    align-items: center;
  }

  &__search-icon {
    position: absolute;
    left: 0.875rem;
    color: var(--color-muted);
    pointer-events: none;
  }

  &__input {
    width: 100%;
    padding: 0.625rem 1rem 0.625rem 2.5rem;
    border: 1px solid var(--color-border);
    border-radius: $radius-sm;
    font-size: 0.9375rem;
    color: var(--color-primary);
    background-color: var(--color-bg);
    font-family: var(--font-body);
    transition: border-color 0.2s ease;

    &:focus {
      outline: none;
      border-color: $color-accent;
    }

    &::placeholder { color: var(--color-muted); }
  }

  &__radio-list {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  &__radio-item {
    display: flex;
    align-items: center;
    gap: 0.625rem;
    cursor: pointer;
  }

  &__radio {
    width: 16px;
    height: 16px;
    accent-color: $color-accent;
    cursor: pointer;
  }

  &__radio-label {
    font-size: 0.9375rem;
    color: var(--color-muted);
    cursor: pointer;
    transition: color 0.2s ease;

    .shop-filter__radio:checked + & {
      color: var(--color-primary);
      font-weight: 500;
    }
  }

  &__select {
    width: 100%;
    padding: 0.625rem 1rem;
    border: 1px solid var(--color-border);
    border-radius: $radius-sm;
    font-size: 0.9375rem;
    color: var(--color-primary);
    background-color: var(--color-bg);
    font-family: var(--font-body);
    cursor: pointer;
    transition: border-color 0.2s ease;

    &:focus {
      outline: none;
      border-color: $color-accent;
    }
  }

  &__clear {
    width: 100%;
    padding: 0.625rem;
    background: none;
    border: 1px solid var(--color-border);
    border-radius: $radius-sm;
    font-size: 0.875rem;
    color: var(--color-muted);
    cursor: pointer;
    font-family: var(--font-body);
    transition: all 0.2s ease;

    &:hover {
      border-color: var(--color-error);
      color: var(--color-error);
    }
  }
}

.product-skeleton {
  background-color: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: $radius-lg;
  overflow: hidden;

  &__image {
    aspect-ratio: 1 / 1;
    width: 100%;
  }

  &__body {
    padding: 1.125rem;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  &__line {
    height: 16px;
    border-radius: $radius-sm;
  }

  &__footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-top: 0.75rem;
    margin-top: 0.25rem;
  }

  &__price { height: 20px; border-radius: $radius-sm; }
  &__btn { height: 34px; border-radius: $radius-sm; }
}

.skeleton {
  background-color: var(--color-border);
  animation: skeleton-pulse 1.5s ease-in-out infinite;
}
</style>
