<script setup lang="ts">
import ProductCard from '../ProductCard.vue';
import type { Product } from '../../types';

defineProps<{
  loading: boolean;
  products: Product[];
}>();

const emit = defineEmits<{ clear: [] }>();
</script>

<template>
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
    <button type="button" class="btn-primary" @click="emit('clear')">Ver todas las tazas</button>
  </div>
</template>

<style lang="scss" scoped>
.shop {
  // Columnas con flex: cada tarjeta mide (100% - huecos) / columnas
  &__grid {
    --gap: 0.75rem;
    --cols: 2;

    display: flex;
    flex-wrap: wrap;
    gap: var(--gap);

    > * {
      flex: 0 0 calc((100% - var(--gap) * (var(--cols) - 1)) / var(--cols));
      min-width: 0;
    }

    @media (min-width: 768px) {
      --gap: 1.25rem;
      --cols: 3;
    }

    @media (min-width: 1180px) {
      --gap: 1.5rem;
      --cols: 4;
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
    display: flex;
    align-items: center;
    justify-content: center;
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
