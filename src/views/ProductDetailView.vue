<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute, useRouter, RouterLink } from 'vue-router';
import MainLayout from '../layout/MainLayout.vue';
import ProductCard from '../components/ProductCard.vue';
import ProductGallery from '../components/product/ProductGallery.vue';
import ProductBuyBox from '../components/product/ProductBuyBox.vue';
import StickyBuyBar from '../components/product/StickyBuyBar.vue';
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

const displayPrice = computed(() =>
  selectedSize.value?.price ?? product.value?.price ?? 0
);

const discount = computed(() => {
  if (product.value?.compareAtPrice && product.value.compareAtPrice > product.value.price) {
    return Math.round((1 - product.value.price / product.value.compareAtPrice) * 100);
  }
  return null;
});

const isOutOfStock = computed(() => !!product.value && product.value.stock === 0 && !product.value.allowBackorder);
const isPreorder = computed(() => !!product.value && product.value.stock === 0 && product.value.allowBackorder);

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
          <ProductGallery v-model:active-image="activeImage" :product="product" :gallery="gallery" :discount="discount" />

          <ProductBuyBox
            v-model:quantity="quantity"
            v-model:selected-size="selectedSize"
            :product="product"
            :display-price="displayPrice"
            :is-out-of-stock="isOutOfStock"
            :is-preorder="isPreorder"
            @add="addToCart"
            @buy="buyNow"
          />
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

      <StickyBuyBar
        v-if="product && !loading && !isOutOfStock"
        :name="product.name"
        :total="displayPrice * quantity"
        @add="addToCart"
        @buy="buyNow"
      />
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
</style>
