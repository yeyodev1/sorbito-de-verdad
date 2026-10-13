<script setup lang="ts">
import { computed, watch, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import CartDrawerItem from './cart/CartDrawerItem.vue';
import { useCartStore } from '../stores/cart';
import { useUIStore } from '../stores/ui';

const cartStore = useCartStore();
const uiStore = useUIStore();
const router = useRouter();

const isOpen = computed(() => uiStore.isCartOpen);
const items = computed(() => cartStore.items);
const subtotal = computed(() => cartStore.subtotal);
const totalItems = computed(() => cartStore.totalItems);
const isEmpty = computed(() => cartStore.isEmpty);

function goToCheckout() {
  uiStore.closeCart();
  router.push('/checkout');
}

function goToShop() {
  uiStore.closeCart();
  router.push('/tienda');
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape' && isOpen.value) uiStore.closeCart();
}

watch(isOpen, (open) => {
  document.body.style.overflow = open ? 'hidden' : '';
});

onMounted(() => window.addEventListener('keydown', onKeydown));
onUnmounted(() => {
  window.removeEventListener('keydown', onKeydown);
  document.body.style.overflow = '';
});

function formatPrice(val: number) {
  return `$${val.toFixed(2)}`;
}
</script>

<template>
  <Teleport to="body">
    <Transition name="fade">
      <div v-if="isOpen" class="cd-overlay" @click="uiStore.closeCart()" />
    </Transition>

    <Transition name="slide-right">
      <aside v-if="isOpen" class="cd" role="dialog" aria-modal="true" aria-label="Carrito de compras">
        <header class="cd__header">
          <h2 class="cd__title">
            Tu carrito
            <span v-if="!isEmpty" class="cd__count">{{ totalItems }}</span>
          </h2>
          <button class="cd__close" @click="uiStore.closeCart()" aria-label="Cerrar carrito">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </header>

        <div v-if="isEmpty" class="cd__empty">
          <div class="cd__empty-icon"><i class="fa-solid fa-mug-hot"></i></div>
          <h3 class="cd__empty-title">Tu carrito está vacío</h3>
          <p class="cd__empty-text">Descubre nuestras tazas artesanales y elige la que más te inspire.</p>
          <button class="btn-primary" @click="goToShop">Ver tienda</button>
        </div>

        <template v-else>
          <ul class="cd__list">
            <CartDrawerItem
              v-for="item in items"
              :key="`${item.product._id}-${item.selectedSize?.name}`"
              :item="item"
              @navigate="uiStore.closeCart()"
            />
          </ul>

          <footer class="cd__footer">
            <div class="cd__subtotal">
              <span>Subtotal</span>
              <strong>{{ formatPrice(subtotal) }}</strong>
            </div>
            <p class="cd__note">El envío se calcula según tu país en el siguiente paso.</p>
            <button class="btn-primary btn-lg btn-block cd__pay" @click="goToCheckout">
              <i class="fa-solid fa-lock"></i>
              Pagar ahora · {{ formatPrice(subtotal) }}
            </button>
            <button class="cd__continue" @click="uiStore.closeCart()">Seguir comprando</button>
            <div class="cd__trust">
              <span><i class="fa-solid fa-shield-halved"></i> Pago seguro</span>
              <span><i class="fa-solid fa-truck-fast"></i> Envío a todo el país</span>
            </div>
          </footer>
        </template>
      </aside>
    </Transition>
  </Teleport>
</template>

<style lang="scss" scoped src="./CartDrawer.scss"></style>
