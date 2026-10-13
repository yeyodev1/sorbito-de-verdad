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
  { value: '', label: 'Todas', icon: 'fa-solid fa-border-all' },
  { value: 'boscan', label: 'Boscan', icon: 'fa-solid fa-mug-hot' },
  { value: 'moni', label: 'La Moni', icon: 'fa-solid fa-heart' },
  { value: 'rustica', label: 'Rústica', icon: 'fa-solid fa-hands' },
  { value: 'set', label: 'Colección', icon: 'fa-solid fa-layer-group' },
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
watch(selectedCollection, () => applyFilters(1));
</script>

<template>
  <MainLayout>
    <div class="shop">

      <!-- Header -->
      <header class="shop__hero">
        <div class="container shop__hero-inner">
          <span class="eyebrow">Tienda</span>
          <h1 class="shop__title">Elige tu taza</h1>
          <p class="shop__subtitle">4 modelos · 2 tamaños · 1 colección completa. Hechas a mano en Ecuador.</p>
        </div>
      </header>

      <!-- Sticky filter bar -->
      <div class="shop__bar">
        <div class="container shop__bar-inner">
          <div class="shop__chips" role="tablist" aria-label="Colecciones">
            <button
              v-for="col in collections"
              :key="col.value"
              type="button"
              role="tab"
              :aria-selected="selectedCollection === col.value"
              :class="['shop__chip', { 'shop__chip--active': selectedCollection === col.value }]"
              @click="selectedCollection = col.value"
            >
              {{ col.label }}
            </button>
          </div>

          <div class="shop__tools">
            <label class="shop__search">
              <span class="sr-only">Buscar tazas</span>
              <i class="fa-solid fa-magnifying-glass shop__search-icon" aria-hidden="true"></i>
              <input
                v-model="searchQuery"
                type="search"
                placeholder="Buscar taza…"
                class="shop__search-input"
                @input="onSearchInput"
              />
            </label>
            <label class="shop__sort">
              <span class="sr-only">Ordenar por</span>
              <select v-model="selectedSort" class="shop__sort-select">
                <option v-for="s in sorts" :key="s.value" :value="s.value">{{ s.label }}</option>
              </select>
              <i class="fa-solid fa-chevron-down shop__sort-icon" aria-hidden="true"></i>
            </label>
          </div>
        </div>
      </div>

      <!-- Results -->
      <section class="container shop__content">
        <div class="shop__meta">
          <p class="shop__count" aria-live="polite">
            <template v-if="!loading">
              <strong>{{ pagination.total }}</strong> taza{{ pagination.total !== 1 ? 's' : '' }}
              <template v-if="selectedCollection">
                en <em>{{ collections.find(c => c.value === selectedCollection)?.label }}</em>
              </template>
            </template>
            <template v-else>Buscando…</template>
          </p>
          <button v-if="hasActiveFilters" type="button" class="shop__clear" @click="clearFilters">
            <i class="fa-solid fa-xmark" aria-hidden="true"></i>
            Limpiar
          </button>
        </div>

        <!-- Loading Skeletons -->
        <div v-if="loading" class="shop__grid">
          <div v-for="i in 8" :key="`skeleton-${i}`" class="shop-skel">
            <div class="shop-skel__image skeleton"></div>
            <div class="shop-skel__line skeleton" style="width: 70%"></div>
            <div class="shop-skel__line skeleton" style="width: 40%"></div>
            <div class="shop-skel__btn skeleton"></div>
          </div>
        </div>

        <!-- Products Grid -->
        <div v-else-if="products.length > 0" class="shop__grid">
          <ProductCard
            v-for="product in products"
            :key="product._id"
            :product="product"
          />
        </div>

        <!-- No results -->
        <div v-else class="shop__empty">
          <div class="shop__empty-icon"><i class="fa-solid fa-mug-saucer" aria-hidden="true"></i></div>
          <h2 class="shop__empty-title">Sin resultados</h2>
          <p class="shop__empty-text">No encontramos tazas con esos criterios.</p>
          <button type="button" class="btn-primary" @click="clearFilters">Ver todas las tazas</button>
        </div>

        <!-- Pagination -->
        <nav v-if="!loading && pagination.pages > 1" class="shop__pagination" aria-label="Paginación">
          <button
            type="button"
            class="shop__page"
            :disabled="pagination.page <= 1"
            aria-label="Página anterior"
            @click="goToPage(pagination.page - 1)"
          ><i class="fa-solid fa-chevron-left" aria-hidden="true"></i></button>
          <button
            v-for="p in pagination.pages"
            :key="p"
            type="button"
            :class="['shop__page', { 'shop__page--active': p === pagination.page }]"
            :aria-current="p === pagination.page ? 'page' : undefined"
            @click="goToPage(p)"
          >{{ p }}</button>
          <button
            type="button"
            class="shop__page"
            :disabled="pagination.page >= pagination.pages"
            aria-label="Página siguiente"
            @click="goToPage(pagination.page + 1)"
          ><i class="fa-solid fa-chevron-right" aria-hidden="true"></i></button>
        </nav>
      </section>
    </div>
  </MainLayout>
</template>

<style lang="scss" scoped>
.shop {
  background-color: var(--color-bg);
  min-height: 100vh;

  // ── Header ──────────────────────────────────
  &__hero {
    padding: 2.5rem 0 1.5rem;

    @media (min-width: 768px) {
      padding: 4rem 0 2.25rem;
    }
  }

  &__hero-inner {
    display: flex;
    flex-direction: column;
    gap: 0.625rem;
  }

  &__title {
    font-size: clamp(2.25rem, 6vw, 4rem);
    font-weight: 500;
  }

  &__subtitle {
    max-width: 46ch;
    font-size: 1rem;
  }

  // ── Filter bar ──────────────────────────────
  &__bar {
    position: sticky;
    top: 60px;
    z-index: 50;
    background-color: var(--navbar-bg-scrolled);
    backdrop-filter: blur(14px);
    -webkit-backdrop-filter: blur(14px);
    border-top: 1px solid var(--color-border);
    border-bottom: 1px solid var(--color-border);

    @media (min-width: 768px) {
      top: 70px;
    }
  }

  &__bar-inner {
    display: flex;
    flex-direction: column;
    gap: 0.625rem;
    padding-top: 0.75rem;
    padding-bottom: 0.75rem;

    @media (min-width: 900px) {
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      gap: 1.5rem;
    }
  }

  &__chips {
    display: flex;
    gap: 0.5rem;
    overflow-x: auto;
    scrollbar-width: none;
    margin: 0 -1rem;
    padding: 0 1rem;
    scroll-snap-type: x proximity;

    &::-webkit-scrollbar { display: none; }

    @media (min-width: 768px) {
      margin: 0;
      padding: 0;
    }
  }

  &__chip {
    flex-shrink: 0;
    scroll-snap-align: start;
    min-height: 44px;
    padding: 0 1.125rem;
    border-radius: $radius-full;
    border: 1.5px solid var(--color-border);
    background-color: var(--color-bg-card);
    color: var(--color-primary);
    font-size: 0.875rem;
    font-weight: 500;
    white-space: nowrap;
    transition: background-color 0.2s ease, border-color 0.2s ease, color 0.2s ease;

    &:hover {
      border-color: var(--color-border-strong);
    }

    &--active,
    &--active:hover {
      background-color: var(--color-bg-inverse);
      border-color: var(--color-bg-inverse);
      color: var(--color-on-inverse);
    }
  }

  &__tools {
    display: flex;
    gap: 0.5rem;
    min-width: 0;

    @media (min-width: 900px) {
      flex-shrink: 0;
    }
  }

  &__search {
    position: relative;
    flex: 1;
    min-width: 0;

    @media (min-width: 900px) {
      width: 240px;
      flex: none;
    }
  }

  &__search-icon {
    position: absolute;
    left: 0.95rem;
    top: 50%;
    transform: translateY(-50%);
    font-size: 0.8125rem;
    color: var(--color-muted);
    pointer-events: none;
  }

  &__search-input,
  &__sort-select {
    width: 100%;
    min-height: 44px;
    border-radius: $radius-full;
    border: 1.5px solid var(--color-border);
    background-color: var(--color-bg-card);
    color: var(--color-primary);
    font-size: 1rem;
    outline: none;
    transition: border-color 0.2s ease, box-shadow 0.2s ease;

    &:focus {
      border-color: var(--color-accent);
      box-shadow: var(--focus-ring);
    }

    @media (min-width: 900px) {
      font-size: 0.875rem;
    }
  }

  &__search-input {
    padding: 0 1rem 0 2.4rem;

    &::placeholder { color: var(--color-muted); opacity: 0.8; }
  }

  &__sort {
    position: relative;
    flex-shrink: 0;
    width: 44%;
    max-width: 180px;

    @media (min-width: 900px) {
      width: 180px;
    }
  }

  &__sort-select {
    appearance: none;
    -webkit-appearance: none;
    padding: 0 2.25rem 0 1rem;
    cursor: pointer;

    option { background-color: var(--color-bg-card); color: var(--color-primary); }
  }

  &__sort-icon {
    position: absolute;
    right: 0.95rem;
    top: 50%;
    transform: translateY(-50%);
    font-size: 0.6875rem;
    color: var(--color-muted);
    pointer-events: none;
  }

  // ── Content ─────────────────────────────────
  &__content {
    padding-top: 1.25rem;
    padding-bottom: 5rem;
  }

  &__meta {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    min-height: 44px;
    margin-bottom: 1rem;
  }

  &__count {
    font-size: 0.875rem;

    strong { color: var(--color-primary); font-weight: 600; }
    em { font-style: normal; color: var(--color-accent); font-weight: 500; }
  }

  &__clear {
    display: inline-flex;
    align-items: center;
    gap: 0.375rem;
    min-height: 44px;
    padding: 0 0.875rem;
    border-radius: $radius-full;
    font-size: 0.8125rem;
    font-weight: 600;
    color: var(--color-muted);
    transition: color 0.2s ease, background-color 0.2s ease;

    &:hover {
      color: var(--color-primary);
      background-color: var(--color-bg-subtle);
    }
  }

  &__grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 0.75rem;

    @media (min-width: 768px) {
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 1.25rem;
    }

    @media (min-width: 1180px) {
      grid-template-columns: repeat(4, minmax(0, 1fr));
      gap: 1.5rem;
    }
  }

  // ── Empty ───────────────────────────────────
  &__empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 0.75rem;
    padding: 4rem 1rem;
  }

  &__empty-icon {
    display: grid;
    place-items: center;
    width: 64px;
    height: 64px;
    border-radius: 50%;
    background-color: var(--color-accent-light);
    color: var(--color-accent);
    font-size: 1.5rem;
    margin-bottom: 0.5rem;
  }

  &__empty-title {
    font-size: 1.5rem;
  }

  &__empty-text {
    margin-bottom: 0.75rem;
  }

  // ── Pagination ──────────────────────────────
  &__pagination {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    gap: 0.375rem;
    margin-top: 3rem;
  }

  &__page {
    display: grid;
    place-items: center;
    min-width: 44px;
    height: 44px;
    padding: 0 0.75rem;
    border-radius: $radius-full;
    border: 1.5px solid var(--color-border);
    background-color: var(--color-bg-card);
    color: var(--color-primary);
    font-size: 0.875rem;
    font-weight: 500;
    transition: border-color 0.2s ease, background-color 0.2s ease, color 0.2s ease;

    &:hover:not(:disabled) {
      border-color: var(--color-border-strong);
    }

    &--active,
    &--active:hover:not(:disabled) {
      background-color: var(--color-bg-inverse);
      border-color: var(--color-bg-inverse);
      color: var(--color-on-inverse);
    }

    &:disabled {
      opacity: 0.4;
      cursor: not-allowed;
    }
  }
}

// ── Skeleton card ─────────────────────────────
.shop-skel {
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
  padding-bottom: 0.5rem;

  &__image {
    aspect-ratio: 1 / 1;
    border-radius: $radius-lg;
  }

  &__line {
    height: 14px;
  }

  &__btn {
    height: 44px;
    border-radius: $radius-full;
    margin-top: 0.25rem;
  }
}
</style>
