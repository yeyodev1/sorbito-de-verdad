<script setup lang="ts">
import { computed } from 'vue';
import { RouterLink, useRouter } from 'vue-router';
import { useCartStore } from '../stores/cart';
import { useUIStore } from '../stores/ui';

const cartStore = useCartStore();
const uiStore = useUIStore();
const router = useRouter();

const isOpen = computed(() => uiStore.isCartOpen);
const items = computed(() => cartStore.items);
const subtotal = computed(() => cartStore.subtotal);
const isEmpty = computed(() => cartStore.isEmpty);

function goToCheckout() {
  uiStore.closeCart();
  router.push('/checkout');
}

function goToShop() {
  uiStore.closeCart();
  router.push('/tienda');
}

function formatPrice(val: number) {
  return `$${val.toFixed(2)}`;
}
</script>

<template>
  <Teleport to="body">
    <Transition name="fade">
      <div v-if="isOpen" class="cart-overlay" @click="uiStore.closeCart()" />
    </Transition>

    <Transition name="slide-right">
      <aside v-if="isOpen" class="cart-drawer" aria-label="Carrito de compras">
        <!-- Header -->
        <div class="cart-drawer__header">
          <h2 class="cart-drawer__title">Mi Carrito</h2>
          <button class="cart-drawer__close" @click="uiStore.closeCart()" aria-label="Cerrar carrito">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <!-- Empty state -->
        <div v-if="isEmpty" class="cart-drawer__empty">
          <div class="cart-drawer__empty-icon"><i class="fa-solid fa-cart-shopping"></i></div>
          <h3 class="cart-drawer__empty-title">Tu carrito está vacío</h3>
          <p class="cart-drawer__empty-text">Descubre nuestras tazas artesanales y elige la que más te inspire.</p>
          <button class="btn-primary" @click="goToShop">Ver Tienda</button>
        </div>

        <!-- Items -->
        <div v-else class="cart-drawer__body">
          <ul class="cart-drawer__list">
            <li v-for="item in items" :key="item.product._id" class="cart-item">
              <div class="cart-item__image-wrap">
                <img
                  :src="item.product.mainImage || '/placeholder-cup.jpg'"
                  :alt="item.product.name"
                  class="cart-item__image"
                  loading="lazy"
                />
              </div>
              <div class="cart-item__info">
                <RouterLink :to="`/tienda/${item.product.slug}`" class="cart-item__name" @click="uiStore.closeCart()">
                  {{ item.product.name }}
                </RouterLink>
                <span class="cart-item__price">{{ formatPrice(item.product.price) }}</span>
                <div class="cart-item__controls">
                  <button class="cart-item__qty-btn" @click="cartStore.updateQuantity(item.product._id, item.quantity - 1)" aria-label="Reducir cantidad">−</button>
                  <span class="cart-item__qty">{{ item.quantity }}</span>
                  <button class="cart-item__qty-btn" @click="cartStore.updateQuantity(item.product._id, item.quantity + 1)" aria-label="Aumentar cantidad">+</button>
                </div>
              </div>
              <div class="cart-item__right">
                <span class="cart-item__subtotal">{{ formatPrice(item.product.price * item.quantity) }}</span>
                <button class="cart-item__remove" @click="cartStore.removeFromCart(item.product._id)" aria-label="Eliminar producto">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="3 6 5 6 21 6"/>
                    <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a1 1 0 011-1h4a1 1 0 011 1v2"/>
                  </svg>
                </button>
              </div>
            </li>
          </ul>
        </div>

        <!-- Footer -->
        <div v-if="!isEmpty" class="cart-drawer__footer">
          <div class="cart-drawer__subtotal">
            <span class="cart-drawer__subtotal-label">Subtotal</span>
            <span class="cart-drawer__subtotal-value">{{ formatPrice(subtotal) }}</span>
          </div>
          <p class="cart-drawer__shipping-note">Envío calculado al finalizar la compra</p>
          <button class="cart-drawer__checkout-btn" @click="goToCheckout">
            Ir a Pagar
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="9 18 15 12 9 6"/>
            </svg>
          </button>
          <button class="cart-drawer__continue-btn" @click="goToShop">
            Seguir comprando
          </button>
        </div>
      </aside>
    </Transition>
  </Teleport>
</template>

<style lang="scss" scoped>
@use '../styles/colorVariables.module.scss' as *;
@use "sass:color";

.cart-overlay {
  position: fixed;
  inset: 0;
  background-color: rgba(var(--color-primary), 0.45);
  z-index: 1100;
  cursor: pointer;
}

.cart-drawer {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  width: 420px;
  max-width: 100vw;
  background-color: var(--color-bg-card);
  z-index: 1101;
  display: flex;
  flex-direction: column;
  box-shadow: $shadow-xl;

  @media (max-width: 480px) {
    width: 100%;
  }

  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1.25rem 1.5rem;
    border-bottom: 1px solid var(--color-border);
    flex-shrink: 0;
  }

  &__title {
    font-family: var(--font-heading);
    font-size: 1.25rem;
    font-weight: 700;
    color: var(--color-primary);
  }

  &__close {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    border-radius: $radius-sm;
    color: var(--color-muted);
    transition: all 0.2s ease;
    cursor: pointer;

    &:hover {
      background-color: var(--color-bg-subtle);
      color: var(--color-primary);
    }
  }

  &__empty {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 3rem 2rem;
    text-align: center;
    gap: 1rem;
  }

  &__empty-icon {
    font-size: 3.5rem;
    line-height: 1;
    opacity: 0.4;
  }

  &__empty-title {
    font-family: var(--font-heading);
    font-size: 1.25rem;
    color: var(--color-primary);
  }

  &__empty-text {
    font-size: 0.9375rem;
    color: var(--color-muted);
    max-width: 260px;
    line-height: 1.6;
  }

  &__body {
    flex: 1;
    overflow-y: auto;
    padding: 0.75rem 0;
  }

  &__list {
    display: flex;
    flex-direction: column;
    gap: 0;
  }

  &__footer {
    border-top: 1px solid var(--color-border);
    padding: 1.25rem 1.5rem;
    display: flex;
    flex-direction: column;
    gap: 0.875rem;
    flex-shrink: 0;
  }

  &__subtotal {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  &__subtotal-label {
    font-size: 1rem;
    font-weight: 500;
    color: var(--color-primary);
  }

  &__subtotal-value {
    font-family: var(--font-heading);
    font-size: 1.25rem;
    font-weight: 700;
    color: var(--color-primary);
  }

  &__shipping-note {
    font-size: 0.8125rem;
    color: var(--color-muted);
    text-align: center;
  }

  &__checkout-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    width: 100%;
    padding: 0.9rem 1.5rem;
    background-color: $color-accent;
    color: white;
    border: none;
    border-radius: $radius-md;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
    font-family: var(--font-body);

    &:hover {
      background-color: color.adjust($color-accent, $lightness: -8%);
      transform: translateY(-1px);
      box-shadow: $shadow-md;
    }
  }

  &__continue-btn {
    width: 100%;
    padding: 0.75rem;
    background: none;
    border: 1px solid var(--color-border);
    border-radius: $radius-md;
    font-size: 0.9375rem;
    color: var(--color-muted);
    cursor: pointer;
    transition: all 0.2s ease;
    font-family: var(--font-body);

    &:hover {
      border-color: var(--color-primary);
      color: var(--color-primary);
    }
  }
}

.cart-item {
  display: flex;
  gap: 1rem;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid var(--color-border);

  &:last-child {
    border-bottom: none;
  }

  &__image-wrap {
    width: 72px;
    height: 72px;
    flex-shrink: 0;
    border-radius: $radius-sm;
    overflow: hidden;
    background-color: var(--color-bg-subtle);
  }

  &__image {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  &__info {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    min-width: 0;
  }

  &__name {
    font-size: 0.9375rem;
    font-weight: 500;
    color: var(--color-primary);
    text-decoration: none;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    display: block;

    &:hover {
      color: $color-accent;
    }
  }

  &__price {
    font-size: 0.875rem;
    color: var(--color-muted);
  }

  &__controls {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-top: 0.25rem;
  }

  &__qty-btn {
    width: 28px;
    height: 28px;
    border: 1px solid var(--color-border);
    border-radius: $radius-sm;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1rem;
    color: var(--color-primary);
    cursor: pointer;
    transition: all 0.2s ease;
    background: none;

    &:hover {
      border-color: $color-accent;
      color: $color-accent;
    }
  }

  &__qty {
    font-size: 0.9375rem;
    font-weight: 500;
    color: var(--color-primary);
    min-width: 20px;
    text-align: center;
  }

  &__right {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    justify-content: space-between;
    gap: 0.5rem;
    flex-shrink: 0;
  }

  &__subtotal {
    font-weight: 600;
    font-size: 0.9375rem;
    color: var(--color-primary);
    font-family: var(--font-heading);
  }

  &__remove {
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--color-muted);
    cursor: pointer;
    transition: color 0.2s ease;
    padding: 4px;

    &:hover {
      color: var(--color-error);
    }
  }
}

// Transitions
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

.slide-right-enter-active, .slide-right-leave-active {
  transition: transform 0.35s cubic-bezier(0.4, 0, 0.2, 1);
}
.slide-right-enter-from { transform: translateX(100%); }
.slide-right-leave-to { transform: translateX(100%); }
</style>
