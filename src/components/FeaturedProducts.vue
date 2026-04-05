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
  <section class="featured-products">
    <div class="container">
      <div class="featured-products__header">
        <div>
          <span class="featured-products__eyebrow">Selección especial</span>
          <h2 class="featured-products__title">Nuestros Favoritos</h2>
          <p class="featured-products__subtitle">
            Piezas que enamoran desde el primer sorbo. Cada una, única e irrepetible.
          </p>
        </div>
        <RouterLink to="/tienda" class="featured-products__see-all">
          Ver todos
          <i class="fa-solid fa-arrow-right"></i>
        </RouterLink>
      </div>

      <!-- Loading Skeletons -->
      <div v-if="loading" class="featured-products__grid">
        <div v-for="i in 4" :key="`skeleton-${i}`" class="product-skeleton">
          <div class="product-skeleton__image skeleton"></div>
          <div class="product-skeleton__body">
            <div class="product-skeleton__line skeleton" style="width: 60%"></div>
            <div class="product-skeleton__line skeleton" style="width: 40%"></div>
            <div class="product-skeleton__footer">
              <div class="product-skeleton__price skeleton" style="width: 30%"></div>
              <div class="product-skeleton__btn skeleton" style="width: 35%"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Products Grid -->
      <div v-else-if="featured.length > 0" class="featured-products__grid">
        <ProductCard
          v-for="product in featured"
          :key="product._id"
          :product="product"
          :showBadge="true"
        />
      </div>

      <!-- Empty state -->
      <div v-else class="featured-products__empty">
        <p>Pronto tendremos productos destacados para ti. ¡Vuelve pronto!</p>
        <RouterLink to="/tienda" class="btn-outline-accent">Explorar Tienda</RouterLink>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>

@keyframes skeleton-pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
}

.featured-products {
  padding: 5rem 0;
  background-color: var(--color-bg);

  @media (max-width: 768px) {
    padding: 3.5rem 0;
  }

  &__header {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    gap: 1rem;
    margin-bottom: 3rem;

    @media (max-width: 600px) {
      flex-direction: column;
      align-items: flex-start;
      margin-bottom: 2rem;
    }
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
    font-size: clamp(1.75rem, 3.5vw, 2.5rem);
    font-weight: 700;
    color: var(--color-primary);
    margin-bottom: 0.5rem;
  }

  &__subtitle {
    font-size: 1rem;
    color: var(--color-muted);
    max-width: 400px;
  }

  &__see-all {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.875rem;
    font-weight: 600;
    color: $color-accent;
    text-decoration: none;
    white-space: nowrap;
    padding: 0.5rem 1.125rem;
    border: 1.5px solid $color-accent;
    border-radius: $radius-full;
    flex-shrink: 0;
    transition: all 0.22s ease;
    letter-spacing: 0.02em;

    i { font-size: 0.75rem; transition: transform 0.22s ease; }

    &:hover {
      background-color: $color-accent;
      color: white;
      i { transform: translateX(3px); }
    }
  }

  &__grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 1.5rem;

    @media (max-width: 1024px) {
      grid-template-columns: repeat(3, 1fr);
    }

    @media (max-width: 768px) {
      grid-template-columns: repeat(2, 1fr);
      gap: 1rem;
    }

    @media (max-width: 480px) {
      grid-template-columns: 1fr;
    }
  }

  &__empty {
    text-align: center;
    padding: 4rem 2rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1.5rem;

    p { font-size: 1rem; color: var(--color-muted); }
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
    animation: skeleton-pulse 1.5s ease-in-out infinite;
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
    animation: skeleton-pulse 1.5s ease-in-out infinite;
  }

  &__footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-top: 0.75rem;
    margin-top: 0.25rem;
  }

  &__price {
    height: 20px;
    border-radius: $radius-sm;
    animation: skeleton-pulse 1.5s ease-in-out infinite;
  }

  &__btn {
    height: 34px;
    border-radius: $radius-sm;
    animation: skeleton-pulse 1.5s ease-in-out infinite;
  }
}

.skeleton {
  background-color: var(--color-border);
}

// Reuse global btn style locally
.btn-outline-accent {
  display: inline-flex;
  align-items: center;
  padding: 0.75rem 1.75rem;
  border: 2px solid $color-accent;
  color: $color-accent;
  border-radius: $radius-md;
  font-size: 0.9375rem;
  font-weight: 500;
  text-decoration: none;
  transition: all 0.25s ease;

  &:hover {
    background-color: $color-accent;
    color: white;
  }
}
</style>
