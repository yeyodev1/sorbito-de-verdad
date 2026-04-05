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
  { value: '', label: 'Todas', icon: '✦' },
  { value: 'boscan', label: 'Boscan', icon: '🎩' },
  { value: 'moni', label: 'La Moni', icon: '💋' },
  { value: 'rustica', label: 'Rústica', icon: '🏺' },
  { value: 'set', label: 'Colección', icon: '🎁' },
];

const sorts = [
  { value: '', label: 'Más recientes' },
  { value: 'price_asc', label: 'Menor precio' },
  { value: 'price_desc', label: 'Mayor precio' },
  { value: 'name_asc', label: 'Nombre A–Z' },
];

const hasActiveFilters = computed(() => searchQuery.value || selectedCollection.value || selectedSort.value);

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
  if (typeof val === 'string') {
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

watch(selectedSort, () => applyFilters(1));
</script>

<template>
  <MainLayout>
    <div class="shop-view">

      <!-- Hero header -->
      <div class="shop-view__hero">
        <div class="container shop-view__hero-inner">
          <div>
            <span class="shop-view__eyebrow">Tienda</span>
            <h1 class="shop-view__title">Elige tu taza</h1>
            <p class="shop-view__subtitle">4 modelos · 2 tamaños · 1 colección completa</p>
          </div>
        </div>
      </div>

      <!-- Sticky filter bar -->
      <div class="shop-view__filter-bar">
        <div class="container shop-view__filter-inner">

          <!-- Search -->
          <div class="shop-filter-search">
            <i class="fa-solid fa-magnifying-glass shop-filter-search__icon"></i>
            <input
              v-model="searchQuery"
              type="search"
              placeholder="Buscar..."
              class="shop-filter-search__input"
              @input="onSearchInput"
            />
          </div>

          <!-- Collection pills -->
          <div class="shop-filter-pills">
            <button
              v-for="col in collections"
              :key="col.value"
              :class="['shop-filter-pill', { 'shop-filter-pill--active': selectedCollection === col.value }]"
              @click="selectedCollection = col.value"
            >
              <span class="shop-filter-pill__icon">{{ col.icon }}</span>
              {{ col.label }}
            </button>
          </div>

          <!-- Sort -->
          <div class="shop-filter-sort">
            <i class="fa-solid fa-arrow-up-wide-short shop-filter-sort__icon"></i>
            <select v-model="selectedSort" class="shop-filter-sort__select">
              <option v-for="s in sorts" :key="s.value" :value="s.value">{{ s.label }}</option>
            </select>
          </div>

        </div>
      </div>

      <!-- Results -->
      <div class="container shop-view__content">
        <!-- Results bar -->
        <div class="shop-view__results-bar">
          <p class="shop-view__results-text">
            <template v-if="!loading">
              <strong>{{ pagination.total }}</strong> taza{{ pagination.total !== 1 ? 's' : '' }}
              <template v-if="selectedCollection">
                en <em>{{ collections.find(c => c.value === selectedCollection)?.label }}</em>
              </template>
            </template>
            <template v-else>Buscando...</template>
          </p>
          <button v-if="hasActiveFilters" class="shop-view__clear-btn" @click="clearFilters">
            <i class="fa-solid fa-xmark"></i>
            Limpiar filtros
          </button>
        </div>

        <!-- Loading Skeletons -->
        <div v-if="loading" class="shop-view__grid">
          <div v-for="i in 6" :key="`skeleton-${i}`" class="product-skeleton">
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
          <p class="shop-view__empty-text">No encontramos tazas con esos criterios.</p>
          <button class="shop-view__empty-btn" @click="clearFilters">Ver todas las tazas</button>
        </div>

        <!-- Pagination -->
        <div v-if="!loading && pagination.pages > 1" class="shop-view__pagination">
          <button
            class="shop-view__page-btn"
            :disabled="pagination.page <= 1"
            @click="goToPage(pagination.page - 1)"
          >&lsaquo;</button>
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
          >&rsaquo;</button>
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
    border-bottom: 1px solid var(--color-border);
    padding: 3rem 0 2.5rem;
  }

  &__hero-inner {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    gap: 1rem;
  }

  &__eyebrow {
    display: inline-block;
    font-size: 0.75rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.14em;
    color: $color-accent;
    margin-bottom: 0.375rem;
  }

  &__title {
    font-family: var(--font-heading);
    font-size: clamp(1.75rem, 4vw, 2.75rem);
    font-weight: 700;
    color: var(--color-primary);
    margin: 0 0 0.375rem;
    line-height: 1.15;
  }

  &__subtitle {
    font-size: 0.9375rem;
    color: var(--color-muted);
    margin: 0;
  }

  // ── Filter Bar ────────────────────────────────────────────
  &__filter-bar {
    position: sticky;
    top: 0;
    z-index: 40;
    background-color: var(--color-bg-card);
    border-bottom: 1px solid var(--color-border);
    box-shadow: 0 1px 8px rgba(0,0,0,0.06);
  }

  &__filter-inner {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding-top: 0.875rem;
    padding-bottom: 0.875rem;
    flex-wrap: wrap;

    @media (max-width: 768px) {
      gap: 0.75rem;
    }
  }

  // ── Content ───────────────────────────────────────────────
  &__content {
    padding-top: 2rem;
    padding-bottom: 4rem;
  }

  &__results-bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 1.5rem;
    min-height: 28px;
  }

  &__results-text {
    font-size: 0.9375rem;
    color: var(--color-muted);

    strong { color: var(--color-primary); }
    em { color: $color-accent; font-style: normal; font-weight: 600; }
  }

  &__clear-btn {
    display: flex;
    align-items: center;
    gap: 0.375rem;
    padding: 0.35rem 0.875rem;
    font-size: 0.8125rem;
    font-weight: 600;
    color: var(--color-muted);
    background: none;
    border: 1px solid var(--color-border);
    border-radius: $radius-full;
    cursor: pointer;
    font-family: var(--font-body);
    transition: all 0.2s ease;

    i { font-size: 0.7rem; }

    &:hover {
      border-color: var(--color-error);
      color: var(--color-error);
    }
  }

  &__grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1.5rem;

    @media (max-width: 1100px) { grid-template-columns: repeat(2, 1fr); }
    @media (max-width: 560px)  { grid-template-columns: 1fr; gap: 1rem; }
  }

  &__empty {
    text-align: center;
    padding: 5rem 2rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
  }

  &__empty-icon { font-size: 2.5rem; opacity: 0.35; }

  &__empty-title {
    font-family: var(--font-heading);
    font-size: 1.375rem;
    color: var(--color-primary);
    margin: 0;
  }

  &__empty-text {
    font-size: 0.9375rem;
    color: var(--color-muted);
    max-width: 280px;
    line-height: 1.6;
    margin: 0;
  }

  &__empty-btn {
    padding: 0.75rem 1.75rem;
    background-color: $color-accent;
    color: white;
    border: none;
    border-radius: $radius-md;
    font-size: 0.9375rem;
    font-weight: 600;
    cursor: pointer;
    font-family: var(--font-body);
    transition: background-color 0.2s ease;

    &:hover { background-color: color.adjust($color-accent, $lightness: -8%); }
  }

  &__pagination {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.375rem;
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

    &:hover:not(:disabled) { border-color: $color-accent; color: $color-accent; }
    &--active { background-color: $color-accent; border-color: $color-accent; color: white; font-weight: 600; }
    &:disabled { opacity: 0.4; cursor: not-allowed; }
  }
}

// ── Search ────────────────────────────────────────────────
.shop-filter-search {
  position: relative;
  flex-shrink: 0;

  &__icon {
    position: absolute;
    left: 0.75rem;
    top: 50%;
    transform: translateY(-50%);
    font-size: 0.8rem;
    color: var(--color-muted);
    pointer-events: none;
  }

  &__input {
    width: 180px;
    padding: 0.5rem 0.875rem 0.5rem 2.125rem;
    border: 1px solid var(--color-border);
    border-radius: $radius-full;
    font-size: 0.875rem;
    color: var(--color-primary);
    background-color: var(--color-bg);
    font-family: var(--font-body);
    transition: border-color 0.2s ease, width 0.25s ease;

    &:focus {
      outline: none;
      border-color: $color-accent;
      width: 220px;
    }

    &::placeholder { color: var(--color-muted); }

    @media (max-width: 560px) { width: 100%; &:focus { width: 100%; } }
  }
}

// ── Collection pills ─────────────────────────────────────
.shop-filter-pills {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  flex-wrap: wrap;
  flex: 1;
}

.shop-filter-pill {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0.4rem 0.875rem;
  border: 1.5px solid var(--color-border);
  border-radius: $radius-full;
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--color-muted);
  background: none;
  cursor: pointer;
  font-family: var(--font-body);
  transition: all 0.2s ease;
  white-space: nowrap;

  &__icon { font-size: 0.85em; }

  &:hover {
    border-color: $color-accent;
    color: $color-accent;
  }

  &--active {
    background-color: $color-accent;
    border-color: $color-accent;
    color: white;
  }
}

// ── Sort ─────────────────────────────────────────────────
.shop-filter-sort {
  position: relative;
  flex-shrink: 0;
  display: flex;
  align-items: center;

  &__icon {
    position: absolute;
    left: 0.75rem;
    font-size: 0.8rem;
    color: var(--color-muted);
    pointer-events: none;
  }

  &__select {
    padding: 0.5rem 1rem 0.5rem 2.125rem;
    border: 1px solid var(--color-border);
    border-radius: $radius-full;
    font-size: 0.875rem;
    color: var(--color-primary);
    background-color: var(--color-bg);
    font-family: var(--font-body);
    cursor: pointer;
    transition: border-color 0.2s ease;
    appearance: none;
    -webkit-appearance: none;

    &:focus { outline: none; border-color: $color-accent; }
  }
}

// ── Skeletons ─────────────────────────────────────────────
.product-skeleton {
  background-color: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: $radius-lg;
  overflow: hidden;

  &__image { aspect-ratio: 1 / 1; width: 100%; }

  &__body {
    padding: 1rem;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  &__line { height: 14px; border-radius: $radius-sm; }

  &__footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-top: 0.75rem;
    margin-top: 0.25rem;
  }

  &__price { height: 20px; border-radius: $radius-sm; }
  &__btn   { height: 32px; border-radius: $radius-sm; }
}

.skeleton {
  background-color: var(--color-border);
  animation: skeleton-pulse 1.5s ease-in-out infinite;
}
</style>
