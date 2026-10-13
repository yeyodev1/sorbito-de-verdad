<script setup lang="ts">
import { computed } from 'vue';
import { RouterLink } from 'vue-router';
import { useProductsStore } from '../stores/products';
import ProductCard from './ProductCard.vue';

const productsStore = useProductsStore();

const featured = computed(() => productsStore.featured);
const loading = computed(() => productsStore.loading);
</script>

<template>
  <section class="featured" aria-labelledby="featured-title">
    <div class="container">
      <div class="featured__header">
        <div>
          <span class="eyebrow">La colección completa</span>
          <h2 id="featured-title" class="featured__title">Nuestras tazas</h2>
          <p class="featured__subtitle">
            4 modelos únicos · Tamaño Estándar (250 ml) o XXL · Hechos a mano en Ecuador.
          </p>
        </div>
        <RouterLink to="/tienda" class="featured__see-all">
          Ver todos
          <i class="fa-solid fa-arrow-right"></i>
        </RouterLink>
      </div>

      <!-- Loading Skeletons -->
      <div v-if="loading" class="featured__grid">
        <div v-for="i in 4" :key="`skeleton-${i}`" class="product-skeleton">
          <div class="product-skeleton__image skeleton"></div>
          <div class="product-skeleton__body">
            <div class="product-skeleton__line skeleton" style="width: 60%"></div>
            <div class="product-skeleton__line skeleton" style="width: 40%"></div>
            <div class="product-skeleton__btn skeleton"></div>
          </div>
        </div>
      </div>

      <!-- Products Grid -->
      <div v-else-if="featured.length > 0" class="featured__grid">
        <ProductCard
          v-for="product in featured"
          :key="product._id"
          :product="product"
          :showBadge="true"
        />
      </div>

      <!-- Empty state -->
      <div v-else class="featured__empty">
        <p>Pronto tendremos productos destacados para ti. ¡Vuelve pronto!</p>
        <RouterLink to="/tienda" class="btn-outline-accent">Explorar tienda</RouterLink>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.featured {
  padding: 3.5rem 0;
  background-color: var(--color-bg);

  @media (min-width: 768px) {
    padding: 6rem 0;
  }

  &__header {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
    margin-bottom: 2rem;

    @media (min-width: 640px) {
      flex-direction: row;
      align-items: flex-end;
      justify-content: space-between;
      margin-bottom: 3rem;
    }
  }

  &__title {
    margin: 0.5rem 0;
    font-size: clamp(2rem, 4.5vw, 3rem);
    font-weight: 500;
  }

  &__subtitle {
    max-width: 46ch;
    font-size: 0.975rem;
  }

  &__see-all {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    min-height: 44px;
    font-size: 0.9rem;
    font-weight: 600;
    color: var(--color-primary);
    white-space: nowrap;
    border-bottom: 1.5px solid var(--color-accent);
    flex-shrink: 0;

    i {
      font-size: 0.75rem;
      color: var(--color-accent);
      transition: transform 0.2s ease;
    }

    &:hover i { transform: translateX(4px); }
  }

  &__grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 1rem;

    @media (min-width: 560px) {
      grid-template-columns: repeat(2, 1fr);
    }

    @media (min-width: 900px) {
      grid-template-columns: repeat(3, 1fr);
      gap: 1.5rem;
    }

    @media (min-width: 1200px) {
      grid-template-columns: repeat(4, 1fr);
    }
  }

  &__empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1.5rem;
    padding: 4rem 1rem;
    text-align: center;
    background-color: var(--color-bg-subtle);
    border-radius: $radius-xl;
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
    border-radius: 0;
  }

  &__body {
    display: flex;
    flex-direction: column;
    gap: 0.6rem;
    padding: 1.125rem;
  }

  &__line {
    height: 16px;
  }

  &__btn {
    height: 46px;
    margin-top: 0.5rem;
    border-radius: $radius-full;
  }
}
</style>
