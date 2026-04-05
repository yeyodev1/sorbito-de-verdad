<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute, RouterLink } from 'vue-router';
import MainLayout from '../layout/MainLayout.vue';
import ProductCard from '../components/ProductCard.vue';
import { useProductsStore } from '../stores/products';
import { useCartStore } from '../stores/cart';
import { useUIStore } from '../stores/ui';

const route = useRoute();
const productsStore = useProductsStore();
const cartStore = useCartStore();
const uiStore = useUIStore();

const product = computed(() => productsStore.currentProduct);
const loading = computed(() => productsStore.loading);
const relatedProducts = computed(() =>
  productsStore.products.filter(p => p._id !== product.value?._id).slice(0, 4)
);

const quantity = ref(1);
const activeImage = ref('');

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

async function loadProduct(slug: string) {
  await productsStore.fetchProductBySlug(slug);
  if (productsStore.currentProduct) {
    activeImage.value = productsStore.currentProduct.mainImage;
    // Fetch related products
    await productsStore.fetchProducts(1);
  }
}

watch(() => route.params.slug, (newSlug) => {
  if (newSlug) {
    quantity.value = 1;
    loadProduct(newSlug as string);
  }
});

onMounted(() => {
  loadProduct(route.params.slug as string);
});

function selectImage(img: string) {
  activeImage.value = img;
}

function addToCart() {
  if (!product.value) return;
  cartStore.addToCart(product.value, quantity.value);
  uiStore.success(
    `${product.value.name} agregado al carrito`,
    4500,
    {
      image: activeImage.value || product.value.mainImage || product.value.images?.[0],
      action: { label: 'Ver carrito', to: '/carrito' },
    }
  );
}

function formatPrice(val: number) {
  return `$${val.toFixed(2)}`;
}
</script>

<template>
  <MainLayout>
    <div class="product-detail">
      <div class="container">
        <!-- Breadcrumb -->
        <nav class="breadcrumb" aria-label="Breadcrumb">
          <RouterLink to="/" class="breadcrumb__link">Inicio</RouterLink>
          <span class="breadcrumb__sep" aria-hidden="true">/</span>
          <RouterLink to="/tienda" class="breadcrumb__link">Tienda</RouterLink>
          <span class="breadcrumb__sep" aria-hidden="true">/</span>
          <span class="breadcrumb__current">{{ product?.name || 'Producto' }}</span>
        </nav>

        <!-- Loading -->
        <div v-if="loading" class="product-detail__skeleton">
          <div class="pd-skeleton__gallery">
            <div class="pd-skeleton__main skeleton"></div>
            <div class="pd-skeleton__thumbs">
              <div v-for="i in 4" :key="i" class="pd-skeleton__thumb skeleton"></div>
            </div>
          </div>
          <div class="pd-skeleton__info">
            <div class="pd-skeleton__line skeleton" style="width:40%; height: 14px"></div>
            <div class="pd-skeleton__line skeleton" style="width:80%; height: 36px"></div>
            <div class="pd-skeleton__line skeleton" style="width:30%; height: 28px"></div>
            <div class="pd-skeleton__line skeleton" style="height: 80px"></div>
          </div>
        </div>

        <!-- Product Content -->
        <div v-else-if="product" class="product-detail__inner">
          <!-- Gallery -->
          <div class="product-gallery">
            <div class="product-gallery__main">
              <img
                :src="activeImage || product.mainImage"
                :alt="product.name"
                class="product-gallery__main-img"
              />
              <div v-if="discount" class="product-gallery__discount-badge">-{{ discount }}%</div>
            </div>
            <div v-if="product.images?.length > 0" class="product-gallery__thumbs">
              <button
                :class="['product-gallery__thumb', { 'product-gallery__thumb--active': activeImage === product.mainImage }]"
                @click="selectImage(product.mainImage)"
              >
                <img :src="product.mainImage" :alt="product.name" loading="lazy" />
              </button>
              <button
                v-for="(img, idx) in product.images"
                :key="idx"
                :class="['product-gallery__thumb', { 'product-gallery__thumb--active': activeImage === img }]"
                @click="selectImage(img)"
              >
                <img :src="img" :alt="`${product.name} imagen ${idx + 2}`" loading="lazy" />
              </button>
            </div>
          </div>

          <!-- Product Info -->
          <div class="product-info">
            <div class="product-info__badges">
              <span :class="['product-info__badge', `product-info__badge--${product.collection}`]">{{ collectionLabel }}</span>
              <span v-if="product.isFeatured" class="product-info__badge product-info__badge--featured">Destacado</span>
            </div>

            <h1 class="product-info__name">{{ product.name }}</h1>
            <p class="product-info__sku">SKU: {{ product.sku }}</p>

            <div class="product-info__pricing">
              <span class="product-info__price">{{ formatPrice(product.price) }}</span>
              <span v-if="product.compareAtPrice" class="product-info__compare">{{ formatPrice(product.compareAtPrice) }}</span>
            </div>

            <p class="product-info__short-desc">{{ product.shortDescription }}</p>

            <!-- Stock indicator -->
            <div class="product-info__stock">
              <span v-if="product.stock > 5" class="product-info__stock--in">En stock ({{ product.stock }} disponibles)</span>
              <span v-else-if="product.stock > 0" class="product-info__stock--low">¡Solo {{ product.stock }} en stock!</span>
              <span v-else class="product-info__stock--out">Sin stock</span>
            </div>

            <!-- Quantity + Add to Cart -->
            <div class="product-info__purchase">
              <div class="product-info__qty-wrap">
                <label class="product-info__qty-label">Cantidad</label>
                <div class="product-info__qty-controls">
                  <button class="product-info__qty-btn" @click="quantity = Math.max(1, quantity - 1)" aria-label="Reducir">−</button>
                  <span class="product-info__qty-value">{{ quantity }}</span>
                  <button class="product-info__qty-btn" @click="quantity = Math.min(product.stock, quantity + 1)" aria-label="Aumentar">+</button>
                </div>
              </div>
              <button
                class="product-info__add-btn"
                :disabled="product.stock === 0"
                @click="addToCart"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
                  <line x1="3" y1="6" x2="21" y2="6"/>
                  <path d="M16 10a4 4 0 01-8 0"/>
                </svg>
                {{ product.stock === 0 ? 'Sin stock' : 'Agregar al carrito' }}
              </button>
            </div>

            <!-- Tags -->
            <div v-if="product.tags?.length" class="product-info__tags">
              <span class="product-info__tags-label">Etiquetas:</span>
              <span v-for="tag in product.tags" :key="tag" class="product-info__tag">{{ tag }}</span>
            </div>

            <!-- Description -->
            <div class="product-info__description">
              <h3 class="product-info__description-title">Descripción</h3>
              <p class="product-info__description-text">{{ product.description }}</p>
            </div>
          </div>
        </div>

        <!-- Not Found -->
        <div v-else class="product-detail__not-found">
          <div class="product-detail__not-found-icon"><i class="fa-solid fa-magnifying-glass"></i></div>
          <h2>Producto no encontrado</h2>
          <p>El producto que buscas no existe o no está disponible.</p>
          <RouterLink to="/tienda" class="product-detail__not-found-btn">Volver a la tienda</RouterLink>
        </div>
      </div>

      <!-- Related Products -->
      <div v-if="!loading && product && relatedProducts.length > 0" class="product-detail__related">
        <div class="container">
          <h2 class="product-detail__related-title">También te puede gustar</h2>
          <div class="product-detail__related-grid">
            <ProductCard
              v-for="p in relatedProducts"
              :key="p._id"
              :product="p"
            />
          </div>
        </div>
      </div>
    </div>
  </MainLayout>
</template>

<style lang="scss" scoped>
@use "sass:color";

@keyframes skeleton-pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
}

.product-detail {
  padding-bottom: 5rem;

  .container {
    padding-top: 2rem;
  }

  &__inner {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 4rem;
    margin-top: 2rem;

    @media (max-width: 900px) {
      grid-template-columns: 1fr;
      gap: 2.5rem;
    }
  }

  &__skeleton {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 4rem;
    margin-top: 2rem;

    @media (max-width: 900px) {
      grid-template-columns: 1fr;
    }
  }

  &__related {
    background-color: var(--color-bg-subtle);
    padding: 4rem 0;
    margin-top: 4rem;
  }

  &__related-title {
    font-family: var(--font-heading);
    font-size: 1.75rem;
    font-weight: 700;
    color: var(--color-primary);
    margin-bottom: 2rem;
  }

  &__related-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 1.5rem;

    @media (max-width: 900px) { grid-template-columns: repeat(2, 1fr); }
    @media (max-width: 480px) { grid-template-columns: 1fr; }
  }

  &__not-found {
    text-align: center;
    padding: 5rem 2rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
  }

  &__not-found-icon {
    font-size: 3rem;
    opacity: 0.4;
  }

  &__not-found-btn {
    margin-top: 0.5rem;
    padding: 0.75rem 1.75rem;
    background-color: $color-accent;
    color: white;
    border-radius: $radius-md;
    text-decoration: none;
    font-weight: 500;
    transition: background-color 0.2s ease;

    &:hover { background-color: color.adjust($color-accent, $lightness: -8%); }
  }
}

.breadcrumb {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;

  &__link {
    font-size: 0.875rem;
    color: var(--color-muted);
    text-decoration: none;
    transition: color 0.2s ease;

    &:hover { color: $color-accent; }
  }

  &__sep {
    color: var(--color-border);
    font-size: 0.875rem;
  }

  &__current {
    font-size: 0.875rem;
    color: var(--color-primary);
    font-weight: 500;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 200px;
  }
}

.product-gallery {
  display: flex;
  flex-direction: column;
  gap: 0.875rem;

  &__main {
    position: relative;
    aspect-ratio: 1 / 1;
    border-radius: $radius-lg;
    overflow: hidden;
    background-color: var(--color-bg-subtle);
    border: 1px solid var(--color-border);
  }

  &__main-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.4s ease;

    &:hover { transform: scale(1.04); }
  }

  &__discount-badge {
    position: absolute;
    top: 1rem;
    left: 1rem;
    background-color: var(--color-error);
    color: white;
    font-size: 0.8125rem;
    font-weight: 700;
    padding: 0.3rem 0.625rem;
    border-radius: $radius-full;
  }

  &__thumbs {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
  }

  &__thumb {
    width: 72px;
    height: 72px;
    border-radius: $radius-sm;
    overflow: hidden;
    border: 2px solid var(--color-border);
    cursor: pointer;
    transition: border-color 0.2s ease;
    background: none;
    padding: 0;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    &--active { border-color: $color-accent; }
    &:hover:not(&--active) { border-color: var(--color-accent-light); }
  }
}

.product-info {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;

  &__badges {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
  }

  &__badge {
    display: inline-block;
    padding: 0.25rem 0.75rem;
    font-size: 0.8125rem;
    font-weight: 600;
    border-radius: $radius-full;
    letter-spacing: 0.02em;

    &--boscan { background: var(--color-primary); color: white; }
    &--moni { background: var(--color-rose); color: white; }
    &--rustica { background: $color-accent; color: white; }
    &--set { background: var(--color-muted); color: white; }
    &--featured { background: var(--color-accent-light); color: $color-accent; }
  }

  &__name {
    font-family: var(--font-heading);
    font-size: clamp(1.5rem, 3vw, 2.25rem);
    font-weight: 700;
    color: var(--color-primary);
    line-height: 1.2;
  }

  &__sku {
    font-size: 0.8125rem;
    color: var(--color-muted);
    font-family: monospace;
  }

  &__pricing {
    display: flex;
    align-items: baseline;
    gap: 0.75rem;
  }

  &__price {
    font-family: var(--font-heading);
    font-size: 1.875rem;
    font-weight: 700;
    color: var(--color-primary);
  }

  &__compare {
    font-size: 1.125rem;
    color: var(--color-muted);
    text-decoration: line-through;
  }

  &__short-desc {
    font-size: 1rem;
    color: var(--color-muted);
    line-height: 1.7;
  }

  &__stock {
    font-size: 0.9rem;
    font-weight: 500;

    &--in { color: var(--color-success); }
    &--low { color: var(--color-warning); }
    &--out { color: var(--color-error); }
  }

  &__purchase {
    display: flex;
    gap: 1rem;
    align-items: flex-end;
    flex-wrap: wrap;
  }

  &__qty-wrap {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  &__qty-label {
    font-size: 0.875rem;
    font-weight: 600;
    color: var(--color-primary);
  }

  &__qty-controls {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    border: 1px solid var(--color-border);
    border-radius: $radius-sm;
    padding: 0.25rem;
  }

  &__qty-btn {
    width: 32px;
    height: 32px;
    border: none;
    background: none;
    font-size: 1.125rem;
    color: var(--color-primary);
    cursor: pointer;
    border-radius: $radius-sm;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background-color 0.2s ease;

    &:hover { background-color: var(--color-bg-subtle); }
  }

  &__qty-value {
    font-size: 1rem;
    font-weight: 600;
    min-width: 28px;
    text-align: center;
  }

  &__add-btn {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.625rem;
    padding: 0.875rem 2rem;
    background-color: $color-accent;
    color: white;
    border: none;
    border-radius: $radius-md;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.25s ease;
    font-family: var(--font-body);

    &:hover:not(:disabled) {
      background-color: color.adjust($color-accent, $lightness: -8%);
      transform: translateY(-2px);
      box-shadow: $shadow-md;
    }

    &:disabled {
      background-color: var(--color-border);
      color: var(--color-muted);
      cursor: not-allowed;
    }
  }

  &__tags {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    flex-wrap: wrap;
  }

  &__tags-label {
    font-size: 0.875rem;
    font-weight: 600;
    color: var(--color-muted);
  }

  &__tag {
    font-size: 0.8125rem;
    color: var(--color-muted);
    background-color: var(--color-bg-subtle);
    padding: 0.25rem 0.625rem;
    border-radius: $radius-full;
    border: 1px solid var(--color-border);
  }

  &__description {
    border-top: 1px solid var(--color-border);
    padding-top: 1.25rem;

    &-title {
      font-family: var(--font-heading);
      font-size: 1.125rem;
      font-weight: 700;
      color: var(--color-primary);
      margin-bottom: 0.75rem;
    }

    &-text {
      font-size: 0.9375rem;
      color: var(--color-muted);
      line-height: 1.8;
      white-space: pre-line;
    }
  }
}

.pd-skeleton {
  &__gallery {
    display: flex;
    flex-direction: column;
    gap: 0.875rem;
  }

  &__main {
    aspect-ratio: 1;
    border-radius: $radius-lg;
    background-color: var(--color-border);
    animation: skeleton-pulse 1.5s ease-in-out infinite;
  }

  &__thumbs {
    display: flex;
    gap: 0.5rem;
  }

  &__thumb {
    width: 72px;
    height: 72px;
    border-radius: $radius-sm;
    background-color: var(--color-border);
    animation: skeleton-pulse 1.5s ease-in-out infinite;
  }

  &__info {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding-top: 0.5rem;
  }

  &__line {
    border-radius: $radius-sm;
    background-color: var(--color-border);
    animation: skeleton-pulse 1.5s ease-in-out infinite;
  }
}

.skeleton {
  background-color: var(--color-border);
  animation: skeleton-pulse 1.5s ease-in-out infinite;
}
</style>
