<script setup lang="ts">
import { computed } from 'vue';
import { RouterLink } from 'vue-router';
import { useCartStore } from '../../stores/cart';
import type { CartItem } from '../../types';

const props = defineProps<{ item: CartItem }>();

const cartStore = useCartStore();
const unitPrice = computed(() => props.item.selectedSize?.price ?? props.item.product.price);

function formatPrice(val: number) {
  return `$${val.toFixed(2)}`;
}
</script>

<template>
  <li class="cv-row">
    <RouterLink :to="`/tienda/${item.product.slug}`" class="cv-row__media">
      <img :src="item.product.mainImage || '/placeholder-cup.jpg'" :alt="item.product.name" />
    </RouterLink>
    <div class="cv-row__info">
      <RouterLink :to="`/tienda/${item.product.slug}`" class="cv-row__name">{{ item.product.name }}</RouterLink>
      <span class="cv-row__meta">
        <template v-if="item.selectedSize">{{ item.selectedSize.name }} · </template>{{ formatPrice(unitPrice) }} c/u
      </span>
      <div class="cv-row__controls">
        <div class="cv-qty">
          <button @click="cartStore.updateQuantity(item.product._id, item.quantity - 1, item.selectedSize?.name)" aria-label="Reducir cantidad">−</button>
          <span>{{ item.quantity }}</span>
          <button @click="cartStore.updateQuantity(item.product._id, item.quantity + 1, item.selectedSize?.name)" aria-label="Aumentar cantidad">+</button>
        </div>
        <button class="cv-row__remove" @click="cartStore.removeFromCart(item.product._id, item.selectedSize?.name)">
          Quitar
        </button>
      </div>
    </div>
    <span class="cv-row__total">{{ formatPrice(unitPrice * item.quantity) }}</span>
  </li>
</template>

<style lang="scss" scoped>
.cv-row {
  display: flex;
  gap: 1rem;
  padding: 1.25rem 0;
  border-bottom: 1px solid var(--color-border);

  &__media {
    flex-shrink: 0;
    width: 96px;
    height: 112px;
    overflow: hidden;
    background-color: var(--color-bg-subtle);
    border-radius: $radius-md;

    @media (min-width: 640px) {
      width: 120px;
      height: 140px;
    }

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  &__info {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  &__name {
    font-family: var(--font-heading);
    font-size: 1.125rem;
    font-weight: 600;
    line-height: 1.25;

    &:hover { color: var(--color-accent); }
  }

  &__meta {
    font-size: 0.8125rem;
    color: var(--color-muted);
  }

  &__controls {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-top: auto;
    padding-top: 0.5rem;
  }

  &__remove {
    min-height: 36px;
    font-size: 0.8125rem;
    color: var(--color-muted);
    text-decoration: underline;
    text-underline-offset: 3px;

    &:hover { color: var(--color-error); }
  }

  &__total {
    font-weight: 700;
    font-variant-numeric: tabular-nums;
  }
}

.cv-qty {
  display: inline-flex;
  align-items: center;
  border: 1.5px solid var(--color-border);
  border-radius: $radius-full;

  button {
    width: 38px;
    height: 38px;
    font-size: 1.125rem;
    border-radius: 50%;

    &:hover { background-color: var(--color-bg-subtle); }
  }

  span {
    min-width: 24px;
    text-align: center;
    font-size: 0.9375rem;
    font-weight: 600;
    font-variant-numeric: tabular-nums;
  }
}
</style>
