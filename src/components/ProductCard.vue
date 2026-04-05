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
const qty = ref(1);

const displayPrice = computed(() =>
  selectedSize.value?.price ?? props.product.price
);

function incQty() { qty.value++; }
function decQty() { if (qty.value > 1) qty.value--; }

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
  cartStore.addToCart(props.product, qty.value, selectedSize.value);
  uiStore.success(
    `${props.product.name}${selectedSize.value ? ` (${selectedSize.value.name})` : ''} agregado`,
    4500,
    {
      image: props.product.mainImage || props.product.images?.[0],
      action: { label: 'Ver carrito', to: '/carrito' },
    }
  );
  qty.value = 1;
}

function buyNow() {
  cartStore.addToCart(props.product, qty.value, selectedSize.value);
  router.push('/checkout');
}

function formatPrice(val: number) {
  return `$${val.toFixed(0)}`;
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

      <!-- Size selector -->
      <div v-if="hasSizes" class="product-card__sizes">
        <button
          v-for="size in product.sizes"
          :key="size.name"
          :class="['product-card__size-chip', { 'product-card__size-chip--active': selectedSize?.name === size.name }]"
          @click.prevent="selectSize(size)"
          :aria-label="`Tamaño ${size.name}`"
        >
          {{ size.name }}
          <span class="product-card__size-price">{{ formatPrice(size.price) }}</span>
        </button>
      </div>

      <div class="product-card__footer">
        <!-- Price row -->
        <div class="product-card__price-row">
          <div class="product-card__pricing">
            <span class="product-card__price">{{ formatPrice(displayPrice) }}</span>
            <span class="product-card__price-note">IVA + envío incl.</span>
          </div>
          <div v-if="isOutOfStock" class="product-card__oos-label">Sin stock</div>
        </div>

        <!-- Qty stepper + Add -->
        <div v-if="!isOutOfStock" class="product-card__actions">
          <div class="product-card__qty">
            <button class="product-card__qty-btn" @click.prevent="decQty" :disabled="qty <= 1" aria-label="Menos">−</button>
            <span class="product-card__qty-num">{{ qty }}</span>
            <button class="product-card__qty-btn" @click.prevent="incQty" aria-label="Más">+</button>
          </div>
          <button
            :class="['product-card__btn', { 'product-card__btn--preorder': isPreorder }]"
            @click.prevent="addToCart"
            aria-label="Agregar al carrito"
          >
            <i v-if="isPreorder" class="fa-solid fa-bolt"></i>
            <svg v-else width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
              <line x1="3" y1="6" x2="21" y2="6"/>
              <path d="M16 10a4 4 0 01-8 0"/>
            </svg>
            Agregar
          </button>
        </div>
      </div>

      <!-- Buy now -->
      <button v-if="!isOutOfStock" class="product-card__btn-buy-now" @click.prevent="buyNow">
        <span class="product-card__buy-now-left">
          <i class="fa-solid fa-bolt"></i>
          Comprar ahora
        </span>
        <span class="product-card__buy-now-price">{{ formatPrice(displayPrice * qty) }}</span>
      </button>
    </div>
  </article>
</template>

<style lang="scss" scoped>
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

    &--boscan  { background-color: var(--color-primary); color: white; }
    &--moni    { background-color: var(--color-rose); color: white; }
    &--rustica { background-color: $color-accent; color: white; }
    &--set     { background-color: var(--color-muted); color: white; }
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
    padding: 1rem;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    flex: 1;
  }

  &__name-link { text-decoration: none; }

  &__name {
    font-family: var(--font-heading);
    font-size: 1rem;
    font-weight: 700;
    color: var(--color-primary);
    line-height: 1.3;
    transition: color 0.2s ease;

    .product-card:hover & { color: $color-accent; }
  }

  &__desc {
    font-size: 0.8125rem;
    color: var(--color-muted);
    line-height: 1.5;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  // ── Size chips ─────────────────────────────────
  &__sizes {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
    margin-top: 0.125rem;
  }

  &__size-chip {
    display: flex;
    align-items: center;
    gap: 0.3rem;
    padding: 0.3rem 0.6rem;
    border: 1.5px solid var(--color-border);
    border-radius: $radius-sm;
    font-size: 0.75rem;
    font-weight: 600;
    color: var(--color-muted);
    background: none;
    cursor: pointer;
    font-family: var(--font-body);
    transition: all 0.18s ease;

    &:hover {
      border-color: $color-accent;
      color: $color-accent;
    }

    &--active {
      border-color: $color-accent;
      background-color: rgba($color-accent, 0.1);
      color: $color-accent;
    }
  }

  &__size-price {
    font-weight: 700;
    color: inherit;
  }

  &__footer {
    display: flex;
    flex-direction: column;
    gap: 0.625rem;
    margin-top: auto;
    padding-top: 0.75rem;
    border-top: 1px solid var(--color-border);
  }

  &__price-row {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
  }

  &__pricing {
    display: flex;
    flex-direction: column;
    gap: 0.1rem;
  }

  &__price {
    font-size: 1.25rem;
    font-weight: 700;
    color: var(--color-primary);
    font-family: var(--font-heading);
    line-height: 1.1;
  }

  &__price-note {
    font-size: 0.65rem;
    color: var(--color-muted);
  }

  &__oos-label {
    font-size: 0.8125rem;
    color: var(--color-muted);
    font-weight: 500;
  }

  // ── Qty + Add row ──────────────────────────────
  &__actions {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    width: 100%;
  }

  &__qty {
    display: flex;
    align-items: center;
    border: 1.5px solid var(--color-border);
    border-radius: $radius-sm;
    overflow: hidden;
  }

  &__qty-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    background: none;
    border: none;
    color: var(--color-muted);
    cursor: pointer;
    font-size: 1rem;
    line-height: 1;
    font-family: var(--font-body);
    transition: all 0.15s ease;

    &:hover:not(:disabled) { background-color: var(--color-bg-subtle); color: var(--color-primary); }
    &:disabled { opacity: 0.3; cursor: default; }
  }

  &__qty-num {
    min-width: 24px;
    text-align: center;
    font-size: 0.875rem;
    font-weight: 600;
    color: var(--color-primary);
    border-left: 1px solid var(--color-border);
    border-right: 1px solid var(--color-border);
    line-height: 28px;
  }

  &__btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.35rem;
    flex: 1;
    padding: 0 0.875rem;
    background-color: $color-accent;
    color: white;
    border: none;
    border-radius: $radius-sm;
    font-size: 0.8125rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
    font-family: var(--font-body);
    height: 32px;
    white-space: nowrap;

    &:hover:not(:disabled) {
      background-color: color.adjust($color-accent, $lightness: -8%);
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba($color-accent, 0.35);
    }

    &:disabled {
      background-color: var(--color-border);
      color: var(--color-muted);
      cursor: not-allowed;
    }
  }

  // ── Buy now bar ────────────────────────────────
  &__btn-buy-now {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: calc(100% + 2rem);
    margin: 0.25rem -1rem -1rem;
    padding: 0.7rem 1.25rem;
    background: linear-gradient(135deg, var(--color-primary) 0%, color.adjust(#1A1A1A, $lightness: 8%) 100%);
    color: white;
    border: none;
    border-top: 1px solid rgba(white, 0.06);
    font-size: 0.8125rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.22s ease;
    font-family: var(--font-body);
  }

  &__buy-now-left {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    color: rgba(white, 0.82);

    i {
      color: $color-accent;
      font-size: 0.7rem;
    }
  }

  &__buy-now-price {
    font-family: var(--font-heading);
    font-size: 0.9375rem;
    font-weight: 700;
    color: $color-accent;
  }

  &__btn-buy-now:hover {
    background: linear-gradient(135deg, color.adjust(#1A1A1A, $lightness: 10%) 0%, color.adjust(#1A1A1A, $lightness: 18%) 100%);

    .product-card__buy-now-left { color: white; }
  }
}
</style>
