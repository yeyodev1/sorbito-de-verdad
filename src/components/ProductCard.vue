<script setup lang="ts">
import { computed, ref } from 'vue';
import { RouterLink, useRouter } from 'vue-router';
import type { Product, ProductSize } from '../types';
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

const hasSizes = computed(() => props.product.sizes && props.product.sizes.length > 1);
const selectedSize = ref<ProductSize | undefined>(
  props.product.sizes?.length ? props.product.sizes[0] : undefined
);
const justAdded = ref(false);

const displayPrice = computed(() =>
  selectedSize.value?.price ?? props.product.price
);

const comparePrice = computed(() => {
  const cmp = props.product.compareAtPrice;
  return cmp && cmp > displayPrice.value ? cmp : null;
});

const collectionLabel = computed(() => {
  const labels: Record<string, string> = {
    boscan: 'Boscan',
    moni: 'La Moni',
    rustica: 'Rústica',
    set: 'Set',
  };
  return labels[props.product.collection] || props.product.collection;
});

const isOutOfStock = computed(() => props.product.stock === 0 && !props.product.allowBackorder);
const isPreorder = computed(() => props.product.stock === 0 && props.product.allowBackorder);

function selectSize(size: ProductSize) {
  selectedSize.value = size;
}

function addToCart() {
  cartStore.addToCart(props.product, 1, selectedSize.value);
  justAdded.value = true;
  setTimeout(() => { justAdded.value = false; }, 1400);
  uiStore.openCart();
}

function buyNow() {
  cartStore.addToCart(props.product, 1, selectedSize.value);
  router.push('/checkout');
}

function formatPrice(val: number) {
  return `$${Number.isInteger(val) ? val : val.toFixed(2)}`;
}
</script>

<template>
  <article :class="['pc', { 'pc--oos': isOutOfStock }]">
    <RouterLink :to="`/tienda/${product.slug}`" class="pc__media" :aria-label="product.name">
      <img
        :src="product.mainImage || '/placeholder-cup.jpg'"
        :alt="product.name"
        class="pc__img"
        loading="lazy"
        decoding="async"
      />
      <span v-if="showBadge" class="pc__badge">{{ collectionLabel }}</span>
      <span v-if="isPreorder" class="pc__badge pc__badge--pre">
        <i class="fa-solid fa-bolt"></i> Pre-venta
      </span>
      <span v-if="isOutOfStock" class="pc__oos">Agotado</span>
    </RouterLink>

    <div class="pc__body">
      <RouterLink :to="`/tienda/${product.slug}`" class="pc__name-link">
        <h3 class="pc__name">{{ product.name }}</h3>
      </RouterLink>

      <div class="pc__price-row">
        <span class="pc__price">{{ formatPrice(displayPrice) }}</span>
        <span v-if="comparePrice" class="pc__compare">{{ formatPrice(comparePrice) }}</span>
        <span class="pc__note">IVA + envío incl.</span>
      </div>

      <div v-if="hasSizes" class="pc__sizes" role="radiogroup" aria-label="Tamaño">
        <button
          v-for="size in product.sizes"
          :key="size.name"
          type="button"
          role="radio"
          :aria-checked="selectedSize?.name === size.name"
          :class="['pc__size', { 'pc__size--active': selectedSize?.name === size.name }]"
          @click.prevent="selectSize(size)"
        >
          {{ size.name }}
        </button>
      </div>

      <div v-if="!isOutOfStock" class="pc__actions">
        <button type="button" class="pc__buy" @click.prevent="buyNow">
          Comprar ya
        </button>
        <button
          type="button"
          :class="['pc__add', { 'pc__add--done': justAdded }]"
          :aria-label="`Agregar ${product.name} al carrito`"
          :title="'Agregar al carrito'"
          @click.prevent="addToCart"
        >
          <i v-if="justAdded" class="fa-solid fa-check"></i>
          <svg v-else width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
            <line x1="3" y1="6" x2="21" y2="6"/>
            <path d="M16 10a4 4 0 01-8 0"/>
          </svg>
        </button>
      </div>
      <RouterLink v-else :to="`/tienda/${product.slug}`" class="pc__oos-link">
        Ver detalles
      </RouterLink>
    </div>
  </article>
</template>

<style lang="scss" scoped>
.pc {
  display: flex;
  flex-direction: column;
  min-width: 0;
  background-color: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: $radius-lg;
  overflow: hidden;
  transition: box-shadow 0.3s ease, border-color 0.3s ease, transform 0.3s cubic-bezier(0.22, 1, 0.36, 1);

  @media (hover: hover) {
    &:hover {
      transform: translateY(-3px);
      box-shadow: var(--shadow-lg);
      border-color: var(--color-border-strong);
    }
  }

  &__media {
    position: relative;
    display: block;
    aspect-ratio: 4 / 5;
    overflow: hidden;
    background-color: var(--color-bg-subtle);
  }

  &__img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.6s cubic-bezier(0.22, 1, 0.36, 1);

    @media (hover: hover) {
      .pc:hover & { transform: scale(1.04); }
    }
  }

  &__badge {
    position: absolute;
    top: 0.625rem;
    left: 0.625rem;
    display: inline-flex;
    align-items: center;
    gap: 0.3rem;
    padding: 0.3rem 0.65rem;
    font-size: 0.6875rem;
    font-weight: 600;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: var(--color-primary);
    background-color: color-mix(in srgb, var(--color-bg-card) 88%, transparent);
    backdrop-filter: blur(6px);
    border-radius: $radius-full;

    &--pre {
      left: auto;
      right: 0.625rem;
      color: var(--color-on-accent);
      background-color: var(--color-accent);
    }
  }

  &__oos {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.8125rem;
    font-weight: 600;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--color-primary);
    background-color: color-mix(in srgb, var(--color-bg) 65%, transparent);
  }

  &__body {
    display: flex;
    flex-direction: column;
    gap: 0.625rem;
    flex: 1;
    padding: 0.875rem;

    @media (min-width: 640px) {
      padding: 1.125rem;
      gap: 0.75rem;
    }
  }

  &__name-link {
    text-decoration: none;
  }

  &__name {
    font-family: var(--font-heading);
    font-size: 1rem;
    font-weight: 600;
    line-height: 1.25;
    letter-spacing: -0.01em;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;

    @media (min-width: 640px) {
      font-size: 1.1875rem;
    }
  }

  &__price-row {
    display: flex;
    align-items: baseline;
    flex-wrap: wrap;
    column-gap: 0.5rem;
    row-gap: 0.125rem;
  }

  &__price {
    font-size: 1.125rem;
    font-weight: 700;
    color: var(--color-primary);
    font-variant-numeric: tabular-nums;
  }

  &__compare {
    font-size: 0.8125rem;
    color: var(--color-muted);
    text-decoration: line-through;
  }

  &__note {
    width: 100%;
    font-size: 0.6875rem;
    color: var(--color-muted);
  }

  &__sizes {
    display: flex;
    flex-wrap: wrap;
    gap: 0.375rem;
  }

  &__size {
    min-height: 32px;
    padding: 0.25rem 0.75rem;
    font-size: 0.75rem;
    font-weight: 600;
    color: var(--color-muted);
    border: 1.5px solid var(--color-border);
    border-radius: $radius-full;
    transition: all 0.2s ease;

    &:hover {
      color: var(--color-primary);
      border-color: var(--color-border-strong);
    }

    &--active {
      color: var(--color-primary);
      border-color: var(--color-primary);
      background-color: var(--color-bg-subtle);
    }
  }

  &__actions {
    display: flex;
    gap: 0.5rem;
    margin-top: auto;
    padding-top: 0.25rem;
  }

  &__buy {
    flex: 1;
    min-width: 0;
    min-height: 44px;
    padding: 0 0.5rem;
    font-size: 0.8125rem;
    font-weight: 600;
    white-space: nowrap;
    color: var(--color-on-accent);
    background-color: var(--color-accent);
    border-radius: $radius-full;
    transition: background-color 0.2s ease, transform 0.15s ease;

    &:hover { background-color: var(--color-accent-hover); }
    &:active { transform: scale(0.97); }

    @media (min-width: 640px) {
      font-size: 0.875rem;
    }
  }

  &__add {
    flex-shrink: 0;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 44px;
    height: 44px;
    color: var(--color-primary);
    border: 1.5px solid var(--color-border-strong);
    border-radius: 50%;
    transition: all 0.2s ease;

    &:hover {
      border-color: var(--color-primary);
      background-color: var(--color-bg-subtle);
    }

    &:active { transform: scale(0.94); }

    &--done {
      color: var(--color-on-accent);
      background-color: var(--color-success);
      border-color: var(--color-success);
    }
  }

  &__oos-link {
    margin-top: auto;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-height: 44px;
    font-size: 0.875rem;
    font-weight: 600;
    color: var(--color-muted);
    border: 1.5px dashed var(--color-border-strong);
    border-radius: $radius-full;
  }
}
</style>
