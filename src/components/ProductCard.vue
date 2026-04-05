<script setup lang="ts">
import { computed } from 'vue';
import { RouterLink, useRouter } from 'vue-router';
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
const router = useRouter();

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

const isOutOfStock = computed(() => props.product.stock === 0 && !props.product.allowBackorder);
const isPreorder = computed(() => props.product.stock === 0 && props.product.allowBackorder);

function addToCart() {
  cartStore.addToCart(props.product, 1);
  uiStore.success(
    `${props.product.name} agregado al carrito`,
    4500,
    {
      image: props.product.mainImage || props.product.images?.[0],
      action: { label: 'Ver carrito', to: '/carrito' },
    }
  );
}

function buyNow() {
  cartStore.addToCart(props.product, 1);
  router.push('/checkout');
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
      <div v-if="isOutOfStock" class="product-card__oos">Sin stock</div>
      <!-- Pre-order badge -->
      <div v-if="isPreorder" class="product-card__preorder">
        <i class="fa-solid fa-bolt"></i> Pre-venta
      </div>
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
        <div class="product-card__btn-group">
          <button
            :class="['product-card__btn', { 'product-card__btn--preorder': isPreorder }]"
            :disabled="isOutOfStock"
            @click.prevent="addToCart"
            aria-label="Agregar al carrito"
          >
            <i v-if="isPreorder" class="fa-solid fa-bolt"></i>
            <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
              <line x1="3" y1="6" x2="21" y2="6"/>
              <path d="M16 10a4 4 0 01-8 0"/>
            </svg>
            {{ isPreorder ? 'Pre-ordenar' : 'Agregar' }}
          </button>
          <button
            v-if="!isOutOfStock"
            class="product-card__btn-buy-now"
            @click.prevent="buyNow"
            aria-label="Comprar ahora"
          >
            <i class="fa-solid fa-bolt"></i>
            Comprar ahora
          </button>
        </div>
      </div>
    </div>
  </article>
</template>

<style lang="scss" scoped>
@use '../styles/colorVariables.module.scss' as *;
@use "sass:color";

.product-card {
  background-color: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: $radius-lg;
  overflow: hidden;
  transition: transform $transition-smooth, box-shadow $transition-smooth;
  display: flex;
  flex-direction: column;

  &:hover {
    transform: translateY(-4px);
    box-shadow: $shadow-lg;
    border-color: var(--color-accent-light);
  }

  &__image-wrap {
    position: relative;
    aspect-ratio: 1 / 1;
    overflow: hidden;
    display: block;
    background-color: var(--color-bg-subtle);
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
      background-color: var(--color-primary);
      color: white;
    }
    &--moni {
      background-color: var(--color-rose);
      color: white;
    }
    &--rustica {
      background-color: $color-accent;
      color: white;
    }
    &--set {
      background-color: var(--color-muted);
      color: white;
    }
    &--featured {
      background-color: var(--color-accent-light);
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
    color: var(--color-muted);
    font-size: 0.9375rem;
    letter-spacing: 0.05em;
  }

  &__preorder {
    position: absolute;
    bottom: 0.625rem;
    left: 0;
    right: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.375rem;
    padding: 0.375rem 0;
    background: linear-gradient(to right, rgba($color-accent, 0.9), rgba(darken($color-accent, 10%), 0.9));
    color: white;
    font-size: 0.8125rem;
    font-weight: 700;
    letter-spacing: 0.06em;
    text-transform: uppercase;

    i { font-size: 0.75rem; }
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
    color: var(--color-primary);
    line-height: 1.3;
    transition: color 0.2s ease;

    .product-card:hover & {
      color: $color-accent;
    }
  }

  &__desc {
    font-size: 0.875rem;
    color: var(--color-muted);
    line-height: 1.5;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  &__footer {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    margin-top: auto;
    padding-top: 0.75rem;
    border-top: 1px solid var(--color-border);
  }

  &__btn-group {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 0.4rem;
  }

  &__pricing {
    display: flex;
    flex-direction: column;
    gap: 0.1rem;
  }

  &__price {
    font-size: 1.125rem;
    font-weight: 600;
    color: var(--color-primary);
    font-family: var(--font-heading);
  }

  &__compare {
    font-size: 0.8125rem;
    color: var(--color-muted);
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
      background-color: var(--color-border);
      color: var(--color-muted);
      cursor: not-allowed;
    }

    &--preorder {
      background-color: darken($color-accent, 8%);
      gap: 0.4rem;

      &:hover:not(:disabled) {
        background-color: darken($color-accent, 14%);
      }
    }
  }

  &__btn-buy-now {
    display: flex;
    align-items: center;
    gap: 0.3rem;
    padding: 0.35rem 0.75rem;
    background-color: transparent;
    color: $color-accent;
    border: 1px solid $color-accent;
    border-radius: $radius-sm;
    font-size: 0.8rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
    font-family: var(--font-body);

    i { font-size: 0.7rem; }

    &:hover {
      background-color: $color-accent;
      color: white;
      transform: translateY(-1px);
    }
  }
}
</style>
