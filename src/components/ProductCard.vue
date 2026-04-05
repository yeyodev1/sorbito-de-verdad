<script setup lang="ts">
import { computed } from 'vue';
import { RouterLink } from 'vue-router';
import type { Product } from '../types';
import { useCartStore } from '../stores/cart';
import { useUIStore } from '../stores/ui';

const props = withDefaults(defineProps<{
  product: Product;
  showBadge?: boolean;
}>(), {
  showBadge: true,
});

const cartStore = useCartStore();
const uiStore = useUIStore();

const collectionLabel = computed(() => {
  const labels: Record<string, string> = {
    boscan: 'Boscan',
    moni: 'La Moni',
    rustica: 'Rústica',
    set: 'Set',
  };
  return labels[props.product.collection] || props.product.collection;
});

const discount = computed(() => {
  if (props.product.compareAtPrice && props.product.compareAtPrice > props.product.price) {
    return Math.round((1 - props.product.price / props.product.compareAtPrice) * 100);
  }
  return null;
});

function addToCart() {
  cartStore.addToCart(props.product, 1);
  uiStore.showNotification(`"${props.product.name}" agregado al carrito`, 'success');
}

function formatPrice(val: number) {
  return `$${val.toFixed(2)}`;
}
</script>

<template>
  <article class="product-card">
    <RouterLink :to="`/tienda/${product.slug}`" class="product-card__image-wrap">
      <img
        :src="product.mainImage || '/placeholder-cup.jpg'"
        :alt="product.name"
        class="product-card__image"
        loading="lazy"
      />
      <!-- Badges -->
      <div v-if="showBadge" class="product-card__badges">
        <span :class="['product-card__badge', `product-card__badge--${product.collection}`]">
          {{ collectionLabel }}
        </span>
        <span v-if="product.isFeatured" class="product-card__badge product-card__badge--featured">
          Destacado
        </span>
        <span v-if="discount" class="product-card__badge product-card__badge--discount">
          -{{ discount }}%
        </span>
      </div>
      <!-- Out of stock overlay -->
      <div v-if="product.stock === 0" class="product-card__oos">Sin stock</div>
    </RouterLink>

    <div class="product-card__body">
      <RouterLink :to="`/tienda/${product.slug}`" class="product-card__name-link">
        <h3 class="product-card__name">{{ product.name }}</h3>
      </RouterLink>
      <p v-if="product.shortDescription" class="product-card__desc">
        {{ product.shortDescription }}
      </p>
      <div class="product-card__footer">
        <div class="product-card__pricing">
          <span class="product-card__price">{{ formatPrice(product.price) }}</span>
          <span v-if="product.compareAtPrice" class="product-card__compare">{{ formatPrice(product.compareAtPrice) }}</span>
        </div>
        <button
          class="product-card__btn"
          :disabled="product.stock === 0"
          @click.prevent="addToCart"
          aria-label="Agregar al carrito"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
            <line x1="3" y1="6" x2="21" y2="6"/>
            <path d="M16 10a4 4 0 01-8 0"/>
          </svg>
          Agregar
        </button>
      </div>
    </div>
  </article>
</template>

<style lang="scss" scoped>
@use '../styles/colorVariables.module.scss' as *;
@use "sass:color";

.product-card {
  background-color: $color-bg-card;
  border: 1px solid $color-border;
  border-radius: $radius-lg;
  overflow: hidden;
  transition: transform $transition-smooth, box-shadow $transition-smooth;
  display: flex;
  flex-direction: column;

  &:hover {
    transform: translateY(-4px);
    box-shadow: $shadow-lg;
    border-color: $color-accent-light;
  }

  &__image-wrap {
    position: relative;
    aspect-ratio: 1 / 1;
    overflow: hidden;
    display: block;
    background-color: $color-bg-subtle;
  }

  &__image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.4s ease;

    .product-card:hover & {
      transform: scale(1.04);
    }
  }

  &__badges {
    position: absolute;
    top: 0.75rem;
    left: 0.75rem;
    display: flex;
    flex-direction: column;
    gap: 0.35rem;
  }

  &__badge {
    display: inline-block;
    padding: 0.25rem 0.625rem;
    font-size: 0.75rem;
    font-weight: 600;
    border-radius: $radius-full;
    letter-spacing: 0.02em;
    line-height: 1.4;

    &--boscan {
      background-color: $color-primary;
      color: white;
    }
    &--moni {
      background-color: $color-rose;
      color: white;
    }
    &--rustica {
      background-color: $color-accent;
      color: white;
    }
    &--set {
      background-color: $color-muted;
      color: white;
    }
    &--featured {
      background-color: $color-accent-light;
      color: $color-accent;
    }
    &--discount {
      background-color: #e53e3e;
      color: white;
    }
  }

  &__oos {
    position: absolute;
    inset: 0;
    background-color: rgba(white, 0.75);
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 600;
    color: $color-muted;
    font-size: 0.9375rem;
    letter-spacing: 0.05em;
  }

  &__body {
    padding: 1.125rem;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    flex: 1;
  }

  &__name-link {
    text-decoration: none;
  }

  &__name {
    font-family: var(--font-heading);
    font-size: 1.0625rem;
    font-weight: 700;
    color: $color-primary;
    line-height: 1.3;
    transition: color 0.2s ease;

    .product-card:hover & {
      color: $color-accent;
    }
  }

  &__desc {
    font-size: 0.875rem;
    color: $color-muted;
    line-height: 1.5;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  &__footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: auto;
    padding-top: 0.75rem;
    border-top: 1px solid $color-border;
  }

  &__pricing {
    display: flex;
    flex-direction: column;
    gap: 0.1rem;
  }

  &__price {
    font-size: 1.125rem;
    font-weight: 600;
    color: $color-primary;
    font-family: var(--font-heading);
  }

  &__compare {
    font-size: 0.8125rem;
    color: $color-muted;
    text-decoration: line-through;
  }

  &__btn {
    display: flex;
    align-items: center;
    gap: 0.375rem;
    padding: 0.5rem 0.875rem;
    background-color: $color-accent;
    color: white;
    border: none;
    border-radius: $radius-sm;
    font-size: 0.875rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
    font-family: var(--font-body);

    &:hover:not(:disabled) {
      background-color: color.adjust($color-accent, $lightness: -8%);
      transform: translateY(-1px);
    }

    &:disabled {
      background-color: $color-border;
      color: $color-muted;
      cursor: not-allowed;
    }
  }
}
</style>
