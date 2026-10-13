<script setup lang="ts">
import { RouterLink } from 'vue-router';
import { useCartStore } from '../../stores/cart';
import type { CartItem } from '../../types';

defineProps<{ item: CartItem }>();
const emit = defineEmits<{ navigate: [] }>();

const cartStore = useCartStore();

function formatPrice(val: number) {
  return `$${val.toFixed(2)}`;
}
</script>

<template>
  <li class="cd-item">
    <RouterLink :to="`/tienda/${item.product.slug}`" class="cd-item__media" @click="emit('navigate')">
      <img :src="item.product.mainImage || '/placeholder-cup.jpg'" :alt="item.product.name" loading="lazy" />
    </RouterLink>
    <div class="cd-item__info">
      <div class="cd-item__top">
        <RouterLink :to="`/tienda/${item.product.slug}`" class="cd-item__name" @click="emit('navigate')">
          {{ item.product.name }}
        </RouterLink>
        <button class="cd-item__remove" @click="cartStore.removeFromCart(item.product._id, item.selectedSize?.name)" :aria-label="`Eliminar ${item.product.name}`">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="3 6 5 6 21 6"/>
            <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a1 1 0 011-1h4a1 1 0 011 1v2"/>
          </svg>
        </button>
      </div>
      <span v-if="item.selectedSize" class="cd-item__size">{{ item.selectedSize.name }}</span>
      <div class="cd-item__bottom">
        <div class="qty">
          <button class="qty__btn" @click="cartStore.updateQuantity(item.product._id, item.quantity - 1, item.selectedSize?.name)" aria-label="Reducir cantidad">−</button>
          <span class="qty__num">{{ item.quantity }}</span>
          <button class="qty__btn" @click="cartStore.updateQuantity(item.product._id, item.quantity + 1, item.selectedSize?.name)" aria-label="Aumentar cantidad">+</button>
        </div>
        <span class="cd-item__price">{{ formatPrice((item.selectedSize?.price ?? item.product.price) * item.quantity) }}</span>
      </div>
    </div>
  </li>
</template>

<style lang="scss" scoped>
.cd-item {
  display: flex;
  gap: 0.875rem;
  padding: 1rem 0;
  border-bottom: 1px solid var(--color-border);

  &:last-child { border-bottom: none; }

  &__media {
    flex-shrink: 0;
    width: 84px;
    height: 96px;
    overflow: hidden;
    background-color: var(--color-bg-subtle);
    border-radius: $radius-md;

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

  &__top {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 0.5rem;
  }

  &__name {
    font-family: var(--font-heading);
    font-size: 1rem;
    font-weight: 600;
    line-height: 1.3;
    color: var(--color-primary);

    &:hover { color: var(--color-accent); }
  }

  &__remove {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    margin: -0.25rem -0.375rem 0 0;
    color: var(--color-muted);
    border-radius: 50%;
    transition: all 0.2s ease;

    &:hover {
      color: var(--color-error);
      background-color: var(--color-error-light);
    }
  }

  &__size {
    align-self: flex-start;
    padding: 0.125rem 0.5rem;
    font-size: 0.6875rem;
    font-weight: 600;
    color: var(--color-muted);
    background-color: var(--color-bg-subtle);
    border-radius: $radius-full;
  }

  &__bottom {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: auto;
    padding-top: 0.375rem;
  }

  &__price {
    font-weight: 700;
    font-variant-numeric: tabular-nums;
  }
}

.qty {
  display: inline-flex;
  align-items: center;
  border: 1.5px solid var(--color-border);
  border-radius: $radius-full;

  &__btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    font-size: 1.125rem;
    color: var(--color-primary);
    border-radius: 50%;

    &:hover { background-color: var(--color-bg-subtle); }
  }

  &__num {
    min-width: 24px;
    text-align: center;
    font-size: 0.875rem;
    font-weight: 600;
    font-variant-numeric: tabular-nums;
  }
}
</style>
