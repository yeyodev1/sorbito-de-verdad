<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute, useRouter, RouterLink } from 'vue-router';
import MainLayout from '../layout/MainLayout.vue';
import ProductCard from '../components/ProductCard.vue';
import { useProductsStore } from '../stores/products';
import { useCartStore } from '../stores/cart';
import { useUIStore } from '../stores/ui';
import type { ProductSize } from '../types';

const route = useRoute();
const router = useRouter();
const productsStore = useProductsStore();
const cartStore = useCartStore();
const uiStore = useUIStore();

const product = computed(() => productsStore.currentProduct);
const loading = computed(() => productsStore.loading && !productsStore.currentProduct);
const relatedProducts = computed(() =>
  productsStore.products.filter(p => p._id !== product.value?._id).slice(0, 4)
);

const quantity = ref(1);
const activeImage = ref('');
const selectedSize = ref<ProductSize | undefined>(undefined);

const gallery = computed(() => {
  if (!product.value) return [];
  const imgs = [product.value.mainImage, ...(product.value.images || [])].filter(Boolean);
  return Array.from(new Set(imgs));
});

const hasSizes = computed(() => !!product.value?.sizes && product.value.sizes.length > 1);

const displayPrice = computed(() =>
  selectedSize.value?.price ?? product.value?.price ?? 0
);

const collectionLabel = computed(() => {
  const labels: Record<string, string> = {
    boscan: 'Boscan', moni: 'La Moni', rustica: 'Rústica', set: 'Set'
  };
  return product.value ? labels[product.value.collection] || product.value.collection : '';
});

const discount = computed(() => {
  if (product.value?.compareAtPrice && product.value.compareAtPrice > product.value.price) {
    return Math.round((1 - product.value.price / product.value.compareAtPrice) * 100);
  }
  return null;
});

const isOutOfStock = computed(() => !!product.value && product.value.stock === 0 && !product.value.allowBackorder);
const isPreorder = computed(() => !!product.value && product.value.stock === 0 && product.value.allowBackorder);
const maxQty = computed(() => {
  if (!product.value) return 1;
  return product.value.stock > 0 ? product.value.stock : 99;
});

async function loadProduct(slug: string) {
  await productsStore.fetchProductBySlug(slug);
  if (productsStore.currentProduct) {
    activeImage.value = productsStore.currentProduct.mainImage;
    selectedSize.value = productsStore.currentProduct.sizes?.length
      ? productsStore.currentProduct.sizes[0]
      : undefined;
    productsStore.fetchProducts(1);
  }
}

watch(() => route.params.slug, (newSlug) => {
  if (newSlug) {
    quantity.value = 1;
    selectedSize.value = undefined;
    loadProduct(newSlug as string);
  }
});

onMounted(() => {
  loadProduct(route.params.slug as string);
});

function selectSize(size: ProductSize) {
  selectedSize.value = size;
}

function addToCart() {
  if (!product.value || isOutOfStock.value) return;
  cartStore.addToCart(product.value, quantity.value, selectedSize.value);
  uiStore.openCart();
}

function buyNow() {
  if (!product.value || isOutOfStock.value) return;
  cartStore.addToCart(product.value, quantity.value, selectedSize.value);
  router.push('/checkout');
}

function formatPrice(val: number) {
  return `$${val.toFixed(2)}`;
}
</script>

<template>
  <MainLayout>
    <div class="pd">
      <div class="container">
        <nav class="pd__crumbs" aria-label="Breadcrumb">
          <RouterLink to="/">Inicio</RouterLink>
          <span aria-hidden="true">/</span>
          <RouterLink to="/tienda">Tienda</RouterLink>
          <span aria-hidden="true">/</span>
          <span class="pd__crumbs-current">{{ product?.name || 'Producto' }}</span>
        </nav>

        <!-- Loading -->
        <div v-if="loading" class="pd__layout">
          <div class="skeleton pd__sk-media"></div>
          <div class="pd__sk-info">
            <div class="skeleton" style="width: 30%; height: 14px"></div>
            <div class="skeleton" style="width: 85%; height: 40px"></div>
            <div class="skeleton" style="width: 25%; height: 28px"></div>
            <div class="skeleton" style="height: 90px"></div>
            <div class="skeleton" style="height: 54px; border-radius: 999px"></div>
          </div>
        </div>

        <div v-else-if="product" class="pd__layout">
          <!-- Galería -->
          <div class="pd-gallery">
            <div class="pd-gallery__main">
              <img :src="activeImage || product.mainImage" :alt="product.name" />
              <span v-if="discount" class="pd-gallery__discount">-{{ discount }}%</span>
            </div>
            <div v-if="gallery.length > 1" class="pd-gallery__thumbs">
              <button
                v-for="(img, idx) in gallery"
                :key="img"
                type="button"
                :class="['pd-gallery__thumb', { 'pd-gallery__thumb--active': activeImage === img }]"
                :aria-label="`Ver imagen ${idx + 1}`"
                @click="activeImage = img"
              >
                <img :src="img" :alt="`${product.name} imagen ${idx + 1}`" loading="lazy" />
              </button>
            </div>
          </div>

          <!-- Info -->
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
                  @click="selectSize(size)"
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
              <button type="button" class="btn-outline btn-lg pd-info__add" @click="addToCart">
                Agregar al carrito
              </button>
              <button type="button" class="btn-primary btn-lg pd-info__now" @click="buyNow">
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
        </div>

        <!-- No encontrado -->
        <div v-else class="pd__missing">
          <div class="pd__missing-icon"><i class="fa-solid fa-magnifying-glass"></i></div>
          <h2>Producto no encontrado</h2>
          <p>El producto que buscas no existe o no está disponible.</p>
          <RouterLink to="/tienda" class="btn-primary">Volver a la tienda</RouterLink>
        </div>
      </div>

      <!-- Relacionados -->
      <section v-if="!loading && product && relatedProducts.length > 0" class="pd__related">
        <div class="container">
          <h2 class="pd__related-title">También te puede gustar</h2>
          <div class="pd__related-grid">
            <ProductCard v-for="p in relatedProducts" :key="p._id" :product="p" />
          </div>
        </div>
      </section>

      <!-- Barra de compra fija en móvil -->
      <div v-if="product && !loading && !isOutOfStock" class="pd-sticky">
        <div class="pd-sticky__info">
          <span class="pd-sticky__name">{{ product.name }}</span>
          <strong>{{ formatPrice(displayPrice * quantity) }}</strong>
        </div>
        <button type="button" class="pd-sticky__add" @click="addToCart" aria-label="Agregar al carrito">
          <i class="fa-solid fa-plus"></i>
        </button>
        <button type="button" class="btn-primary pd-sticky__buy" @click="buyNow">Comprar ahora</button>
      </div>
    </div>
  </MainLayout>
</template>

<style lang="scss" scoped>
.pd {
  padding: 1rem 0 6rem;

  @media (min-width: 960px) {
    padding: 2rem 0 5rem;
  }

  &__crumbs {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 1.25rem;
    font-size: 0.8125rem;
    color: var(--color-muted);
    white-space: nowrap;
    overflow: hidden;

    a:hover { color: var(--color-accent); }
  }

  &__crumbs-current {
    color: var(--color-primary);
    overflow: hidden;
    text-overflow: ellipsis;
  }

  &__layout {
    display: grid;
    grid-template-columns: minmax(0, 1fr);
    gap: 1.5rem;

    @media (min-width: 960px) {
      grid-template-columns: minmax(0, 1.1fr) minmax(0, 1fr);
      gap: 3.5rem;
      align-items: start;
    }
  }

  &__sk-media {
    aspect-ratio: 1;
    border-radius: $radius-xl;
  }

  &__sk-info {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  &__missing {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.875rem;
    padding: 5rem 1rem;
    text-align: center;
  }

  &__missing-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 72px;
    height: 72px;
    font-size: 1.5rem;
    color: var(--color-accent);
    background-color: var(--color-accent-light);
    border-radius: 50%;
  }

  &__related {
    margin-top: 4rem;
    padding: 3.5rem 0;
    background-color: var(--color-bg-subtle);
  }

  &__related-title {
    margin-bottom: 1.5rem;
    font-size: clamp(1.5rem, 3vw, 2rem);
  }

  &__related-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 0.75rem;

    @media (min-width: 768px) {
      gap: 1.25rem;
    }

    @media (min-width: 1024px) {
      grid-template-columns: repeat(4, minmax(0, 1fr));
    }
  }
}

.pd-gallery {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;

  @media (min-width: 960px) {
    position: sticky;
    top: 96px;
  }

  &__main {
    position: relative;
    aspect-ratio: 1;
    overflow: hidden;
    background-color: var(--color-bg-subtle);
    border-radius: $radius-xl;
    margin: 0 -1rem;

    @media (min-width: 640px) {
      margin: 0;
    }

    @media (max-width: 639px) {
      border-radius: 0;
    }

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  &__discount {
    position: absolute;
    top: 1rem;
    left: 1rem;
    padding: 0.375rem 0.75rem;
    font-size: 0.8125rem;
    font-weight: 700;
    color: var(--color-on-accent);
    background-color: var(--color-accent);
    border-radius: $radius-full;
  }

  &__thumbs {
    display: flex;
    gap: 0.5rem;
    overflow-x: auto;
    scrollbar-width: none;

    &::-webkit-scrollbar { display: none; }
  }

  &__thumb {
    flex-shrink: 0;
    width: 72px;
    height: 72px;
    overflow: hidden;
    border: 2px solid transparent;
    border-radius: $radius-md;
    opacity: 0.65;
    transition: opacity 0.2s ease, border-color 0.2s ease;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    &:hover { opacity: 1; }

    &--active {
      opacity: 1;
      border-color: var(--color-accent);
    }
  }
}

.pd-info {
  display: flex;
  flex-direction: column;
  gap: 1rem;

  &__badges {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  &__chip {
    padding: 0.25rem 0.625rem;
    font-size: 0.6875rem;
    font-weight: 600;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: var(--color-accent);
    background-color: var(--color-accent-light);
    border-radius: $radius-full;
  }

  &__name {
    font-size: clamp(1.875rem, 4.5vw, 3rem);
  }

  &__pricing {
    display: flex;
    align-items: baseline;
    gap: 0.75rem;
  }

  &__price {
    font-size: 1.75rem;
    font-weight: 700;
    font-variant-numeric: tabular-nums;
  }

  &__compare {
    font-size: 1.125rem;
    color: var(--color-muted);
    text-decoration: line-through;
  }

  &__short {
    font-size: 1rem;
  }

  &__stock {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.875rem;
    font-weight: 500;
    color: var(--color-success);

    &--low { color: var(--color-warning); }
    &--out { color: var(--color-error); }
  }

  &__dot {
    width: 8px;
    height: 8px;
    background-color: currentColor;
    border-radius: 50%;
    box-shadow: 0 0 0 4px color-mix(in srgb, currentColor 20%, transparent);
  }

  &__block {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  &__label {
    font-size: 0.8125rem;
    font-weight: 600;
    color: var(--color-primary);
  }

  &__sizes {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  &__size {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    min-width: 108px;
    padding: 0.625rem 1rem;
    text-align: left;
    border: 1.5px solid var(--color-border);
    border-radius: $radius-md;
    transition: all 0.2s ease;

    span { font-weight: 600; }
    small { font-size: 0.8125rem; color: var(--color-muted); }

    &:hover { border-color: var(--color-border-strong); }

    &--active {
      border-color: var(--color-primary);
      background-color: var(--color-bg-subtle);
    }
  }

  &__buy {
    display: grid;
    grid-template-columns: auto 1fr;
    gap: 0.625rem;
    margin-top: 0.25rem;
  }

  &__qty {
    display: inline-flex;
    align-items: center;
    height: 54px;
    border: 1.5px solid var(--color-border-strong);
    border-radius: $radius-full;

    button {
      width: 46px;
      height: 100%;
      font-size: 1.25rem;
      border-radius: 50%;

      &:disabled { opacity: 0.35; cursor: not-allowed; }
    }

    span {
      min-width: 28px;
      text-align: center;
      font-weight: 600;
      font-variant-numeric: tabular-nums;
    }
  }

  &__now {
    grid-column: 1 / -1;
  }

  &__oos {
    padding: 1rem;
    font-size: 0.9375rem;
    background-color: var(--color-bg-subtle);
    border-radius: $radius-md;

    a {
      margin-left: 0.25rem;
      font-weight: 600;
      color: var(--color-accent);
      text-decoration: underline;
    }
  }

  &__perks {
    display: flex;
    flex-direction: column;
    gap: 0.625rem;
    padding: 1rem 0;
    border-top: 1px solid var(--color-border);
    border-bottom: 1px solid var(--color-border);
    font-size: 0.875rem;
    color: var(--color-muted);

    i {
      width: 20px;
      margin-right: 0.5rem;
      color: var(--color-accent);
    }
  }

  &__details {
    border-bottom: 1px solid var(--color-border);

    summary {
      display: flex;
      align-items: center;
      justify-content: space-between;
      min-height: 52px;
      font-weight: 600;
      cursor: pointer;
      list-style: none;

      &::-webkit-details-marker { display: none; }

      &::after {
        content: '+';
        font-size: 1.25rem;
        font-weight: 400;
        color: var(--color-muted);
      }
    }

    &[open] summary::after { content: '−'; }

    > p {
      padding-bottom: 1rem;
      white-space: pre-line;
    }
  }

  &__tags {
    display: flex;
    flex-wrap: wrap;
    gap: 0.375rem;
    padding-bottom: 0.75rem;

    span {
      padding: 0.25rem 0.625rem;
      font-size: 0.75rem;
      color: var(--color-muted);
      background-color: var(--color-bg-subtle);
      border-radius: $radius-full;
    }
  }

  &__sku {
    padding-bottom: 1rem;
    font-size: 0.75rem;
  }
}

.pd-sticky {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 900;
  display: flex;
  align-items: center;
  gap: 0.625rem;
  padding: 0.625rem 1rem calc(0.625rem + env(safe-area-inset-bottom));
  background-color: color-mix(in srgb, var(--color-bg-card) 94%, transparent);
  backdrop-filter: blur(12px);
  border-top: 1px solid var(--color-border);
  box-shadow: 0 -8px 24px -12px rgba(0, 0, 0, 0.18);

  @media (min-width: 960px) {
    display: none;
  }

  &__info {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    line-height: 1.25;

    strong { font-size: 1.0625rem; font-variant-numeric: tabular-nums; }
  }

  &__name {
    font-size: 0.75rem;
    color: var(--color-muted);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  &__add {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 46px;
    height: 46px;
    border: 1.5px solid var(--color-border-strong);
    border-radius: 50%;
  }

  &__buy {
    flex-shrink: 0;
  }
}
</style>
