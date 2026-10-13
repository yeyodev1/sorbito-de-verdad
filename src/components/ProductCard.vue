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

<style lang="scss" scoped src="./ProductCard.scss"></style>
