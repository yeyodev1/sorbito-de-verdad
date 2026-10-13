<script setup lang="ts">
import { computed } from 'vue';
import { RouterLink } from 'vue-router';
import type { Product, ProductSize } from '../../types';

const props = defineProps<{
  product: Product;
  displayPrice: number;
  isOutOfStock: boolean;
  isPreorder: boolean;
}>();

const emit = defineEmits<{ add: []; buy: [] }>();

const quantity = defineModel<number>('quantity', { required: true });
const selectedSize = defineModel<ProductSize | undefined>('selectedSize');

const hasSizes = computed(() => !!props.product.sizes && props.product.sizes.length > 1);

const collectionLabel = computed(() => {
  const labels: Record<string, string> = {
    boscan: 'Boscan', moni: 'La Moni', rustica: 'Rústica', set: 'Set'
  };
  return labels[props.product.collection] || props.product.collection;
});

const maxQty = computed(() => (props.product.stock > 0 ? props.product.stock : 99));

function formatPrice(val: number) {
  return `$${val.toFixed(2)}`;
}
</script>

<template>
  <div class="pd-info">
    <div class="pd-info__badges">
      <span class="eyebrow">Colección {{ collectionLabel }}</span>
      <span v-if="product.isFeatured" class="pd-info__chip">Destacado</span>
    </div>

    <h1 class="pd-info__name">{{ product.name }}</h1>

    <div class="pd-info__pricing">
      <span class="pd-info__price">{{ formatPrice(displayPrice) }}</span>
      <span v-if="product.compareAtPrice && product.compareAtPrice > displayPrice" class="pd-info__compare">
        {{ formatPrice(product.compareAtPrice) }}
      </span>
    </div>

    <p v-if="product.shortDescription" class="pd-info__short">{{ product.shortDescription }}</p>

    <p :class="['pd-info__stock', {
      'pd-info__stock--low': product.stock > 0 && product.stock <= 5,
      'pd-info__stock--out': isOutOfStock,
    }]">
      <span class="pd-info__dot"></span>
      <template v-if="isPreorder">Pre-venta: lo fabricamos para ti</template>
      <template v-else-if="product.stock > 5">En stock, listo para enviar</template>
      <template v-else-if="product.stock > 0">¡Solo quedan {{ product.stock }}!</template>
      <template v-else>Agotado</template>
    </p>

    <!-- Tamaño -->
    <div v-if="hasSizes" class="pd-info__block">
      <p class="pd-info__label">Tamaño</p>
      <div class="pd-info__sizes" role="radiogroup" aria-label="Tamaño">
        <button
          v-for="size in product.sizes"
          :key="size.name"
          type="button"
          role="radio"
          :aria-checked="selectedSize?.name === size.name"
          :class="['pd-info__size', { 'pd-info__size--active': selectedSize?.name === size.name }]"
          @click="selectedSize = size"
        >
          <span>{{ size.name }}</span>
          <small>{{ formatPrice(size.price) }}</small>
        </button>
      </div>
    </div>

    <!-- Compra -->
    <div v-if="!isOutOfStock" class="pd-info__buy">
      <div class="pd-info__qty" aria-label="Cantidad">
        <button type="button" @click="quantity = Math.max(1, quantity - 1)" :disabled="quantity <= 1" aria-label="Reducir">−</button>
        <span>{{ quantity }}</span>
        <button type="button" @click="quantity = Math.min(maxQty, quantity + 1)" :disabled="quantity >= maxQty" aria-label="Aumentar">+</button>
      </div>
      <button type="button" class="btn-outline btn-lg pd-info__add" @click="emit('add')">
        Agregar al carrito
      </button>
      <button type="button" class="btn-primary btn-lg pd-info__now" @click="emit('buy')">
        <i class="fa-solid fa-bolt"></i>
        Comprar ahora · {{ formatPrice(displayPrice * quantity) }}
      </button>
    </div>
    <div v-else class="pd-info__oos">
      Este producto está agotado por ahora.
      <RouterLink to="/tienda">Ver otras tazas</RouterLink>
    </div>

    <ul class="pd-info__perks">
      <li><i class="fa-solid fa-truck-fast"></i> Envío a todo Ecuador y al exterior</li>
      <li><i class="fa-solid fa-hand-holding-heart"></i> Cerámica hecha a mano</li>
      <li><i class="fa-solid fa-shield-halved"></i> Pago seguro con tarjeta</li>
    </ul>

    <details class="pd-info__details" open>
      <summary>Descripción</summary>
      <p>{{ product.description }}</p>
    </details>
    <details v-if="product.tags?.length || product.sku" class="pd-info__details">
      <summary>Detalles</summary>
      <div class="pd-info__tags">
        <span v-for="tag in product.tags" :key="tag">{{ tag }}</span>
      </div>
      <p v-if="product.sku" class="pd-info__sku">SKU: {{ product.sku }}</p>
    </details>
  </div>
</template>

<style lang="scss" scoped src="./ProductBuyBox.scss"></style>
