<script setup lang="ts">
import { computed } from 'vue';
import { RouterLink, useRouter } from 'vue-router';
import MainLayout from '../layout/MainLayout.vue';
import { useCartStore } from '../stores/cart';
import { useUIStore } from '../stores/ui';
import CartLineItem from '../components/cart/CartLineItem.vue';
import CartSummary from '../components/cart/CartSummary.vue';

const cartStore = useCartStore();
const uiStore = useUIStore();
const router = useRouter();

const items = computed(() => cartStore.items);
const subtotal = computed(() => cartStore.subtotal);
const totalItems = computed(() => cartStore.totalItems);
const isEmpty = computed(() => cartStore.isEmpty);

function goToCheckout() {
  router.push('/checkout');
}

function confirmClear() {
  uiStore.openConfirm({
    title: 'Vaciar carrito',
    message: '¿Seguro que quieres quitar todos los productos del carrito?',
    type: 'danger',
    confirmLabel: 'Vaciar',
    cancelLabel: 'Cancelar',
    onConfirm: () => cartStore.clearCart(),
  });
}
</script>

<template>
  <MainLayout>
    <div class="cv">
      <div class="container">
        <header class="cv__header">
          <h1 class="cv__title">Tu carrito</h1>
          <span v-if="!isEmpty" class="cv__count">{{ totalItems }} {{ totalItems === 1 ? 'producto' : 'productos' }}</span>
        </header>

        <div v-if="isEmpty" class="cv__empty">
          <div class="cv__empty-icon"><i class="fa-solid fa-mug-hot"></i></div>
          <h2>Tu carrito está vacío</h2>
          <p>Descubre nuestras tazas artesanales y encuentra la que más te inspire.</p>
          <RouterLink to="/tienda" class="btn-primary btn-lg">Explorar tienda</RouterLink>
        </div>

        <div v-else class="cv__layout">
          <div>
            <ul class="cv__list">
              <CartLineItem v-for="item in items" :key="`${item.product._id}-${item.selectedSize?.name}`" :item="item" />
            </ul>

            <div class="cv__actions">
              <RouterLink to="/tienda" class="cv__link"><i class="fa-solid fa-arrow-left"></i> Seguir comprando</RouterLink>
              <button class="cv__link cv__link--muted" @click="confirmClear">Vaciar carrito</button>
            </div>
          </div>

          <CartSummary :subtotal="subtotal" @checkout="goToCheckout" />
        </div>
      </div>
    </div>
  </MainLayout>
</template>

<style lang="scss" scoped src="./CartView.scss"></style>
