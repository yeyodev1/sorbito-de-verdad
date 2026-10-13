<script setup lang="ts">
import MainLayout from '../layout/MainLayout.vue';
import ShopFilters from '../components/shop/ShopFilters.vue';
import ShopGrid from '../components/shop/ShopGrid.vue';
import ShopPagination from '../components/shop/ShopPagination.vue';
import { collections } from '../data/shop';
import { useShopFilters } from '../composables/useShopFilters';

const {
  searchQuery, selectedCollection, selectedSort,
  products, loading, pagination, hasActiveFilters,
  onSearchInput, clearFilters, goToPage,
} = useShopFilters();
</script>

<template>
  <MainLayout>
    <div class="shop">

      <!-- Header -->
      <header class="shop__hero">
        <div class="container">
          <div class="shop__hero-inner">
          <span class="eyebrow">Tienda</span>
          <h1 class="shop__title">Elige tu <em>taza</em></h1>
          <p class="shop__subtitle">4 modelos · 2 tamaños · 1 colección completa. Hechas a mano en Ecuador.</p>
          </div>
        </div>
      </header>

      <!-- Sticky filter bar -->
      <ShopFilters
        v-model:collection="selectedCollection"
        v-model:search="searchQuery"
        v-model:sort="selectedSort"
        @search-input="onSearchInput"
      />

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

        <ShopGrid :loading="loading" :products="products" @clear="clearFilters" />

        <!-- Pagination -->
        <ShopPagination
          v-if="!loading && pagination.pages > 1"
          :page="pagination.page"
          :pages="pagination.pages"
          @go="goToPage"
        />
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
    padding: 0.75rem 0 1.25rem;

    @media (min-width: 768px) {
      padding: 0.5rem 0 1.75rem;
    }
  }

  // Encabezado en una tarjeta pastel
  &__hero-inner {
    display: flex;
    flex-direction: column;
    gap: 0.625rem;
    padding: 2rem 1.25rem;
    color: var(--tile-ink);
    background-color: var(--tile-peach);
    border-radius: $radius-xl;

    @media (min-width: 768px) {
      padding: 3.5rem 3rem;
    }
  }

  &__title {
    font-size: clamp(2.5rem, 7vw, 5rem);
    font-weight: 700;
    letter-spacing: -0.045em;
    color: inherit;
  }

  &__subtitle {
    max-width: 46ch;
    font-size: 1rem;
    color: inherit;
    opacity: 0.75;
  }

  .eyebrow {
    color: inherit;
    opacity: 0.7;
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
}
</style>
