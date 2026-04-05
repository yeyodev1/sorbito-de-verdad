<script setup lang="ts">
import { computed } from 'vue';
import { RouterLink, useRouter } from 'vue-router';
import MainLayout from '../layout/MainLayout.vue';
import { useCartStore } from '../stores/cart';
import { useAuthStore } from '../stores/auth';

const cartStore = useCartStore();
const authStore = useAuthStore();
const router = useRouter();

const items = computed(() => cartStore.items);
const subtotal = computed(() => cartStore.subtotal);
const isEmpty = computed(() => cartStore.isEmpty);
const shipping = computed(() => subtotal.value >= 50 ? 0 : 5.99);
const total = computed(() => subtotal.value + shipping.value);

function goToCheckout() {
  if (!authStore.isAuthenticated) {
    router.push('/login?redirect=/checkout');
  } else {
    router.push('/checkout');
  }
}

function formatPrice(val: number) {
  return `$${val.toFixed(2)}`;
}
</script>

<template>
  <MainLayout>
    <div class="cart-view">
      <div class="container">
        <h1 class="cart-view__title">Mi Carrito</h1>

        <!-- Empty -->
        <div v-if="isEmpty" class="cart-view__empty">
          <div class="cart-view__empty-icon"><i class="fa-solid fa-cart-shopping"></i></div>
          <h2 class="cart-view__empty-title">Tu carrito está vacío</h2>
          <p class="cart-view__empty-text">Descubre nuestras tazas artesanales y encuentra la que más te inspire.</p>
          <RouterLink to="/tienda" class="cart-view__empty-btn">Explorar Tienda</RouterLink>
        </div>

        <!-- Cart Content -->
        <div v-else class="cart-view__layout">
          <!-- Items -->
          <div class="cart-view__items">
            <div class="cart-view__items-header">
              <span>Producto</span>
              <span>Precio</span>
              <span>Cantidad</span>
              <span>Subtotal</span>
              <span></span>
            </div>
            <div v-for="item in items" :key="item.product._id" class="cart-row">
              <div class="cart-row__product">
                <RouterLink :to="`/tienda/${item.product.slug}`" class="cart-row__image-link">
                  <img
                    :src="item.product.mainImage || '/placeholder-cup.jpg'"
                    :alt="item.product.name"
                    class="cart-row__image"
                  />
                </RouterLink>
                <div class="cart-row__info">
                  <RouterLink :to="`/tienda/${item.product.slug}`" class="cart-row__name">{{ item.product.name }}</RouterLink>
                  <span class="cart-row__collection">{{ item.product.collection }}</span>
                </div>
              </div>
              <span class="cart-row__price">{{ formatPrice(item.product.price) }}</span>
              <div class="cart-row__qty">
                <button class="cart-row__qty-btn" @click="cartStore.updateQuantity(item.product._id, item.quantity - 1)">−</button>
                <span class="cart-row__qty-value">{{ item.quantity }}</span>
                <button class="cart-row__qty-btn" @click="cartStore.updateQuantity(item.product._id, item.quantity + 1)">+</button>
              </div>
              <span class="cart-row__subtotal">{{ formatPrice(item.product.price * item.quantity) }}</span>
              <button class="cart-row__remove" @click="cartStore.removeFromCart(item.product._id)" aria-label="Eliminar">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a1 1 0 011-1h4a1 1 0 011 1v2"/>
                </svg>
              </button>
            </div>

            <div class="cart-view__actions">
              <RouterLink to="/tienda" class="cart-view__continue">← Seguir comprando</RouterLink>
              <button class="cart-view__clear" @click="cartStore.clearCart()">Vaciar carrito</button>
            </div>
          </div>

          <!-- Summary -->
          <aside class="cart-summary">
            <h2 class="cart-summary__title">Resumen del Pedido</h2>
            <div class="cart-summary__row">
              <span>Subtotal</span>
              <span>{{ formatPrice(subtotal) }}</span>
            </div>
            <div class="cart-summary__row">
              <span>Envío</span>
              <span :class="{ 'cart-summary__free': shipping === 0 }">
                {{ shipping === 0 ? 'Gratis' : formatPrice(shipping) }}
              </span>
            </div>
            <p v-if="subtotal < 50" class="cart-summary__shipping-note">
              Agrega {{ formatPrice(50 - subtotal) }} más para obtener envío gratis
            </p>
            <div class="cart-summary__divider"></div>
            <div class="cart-summary__total-row">
              <span>Total</span>
              <span>{{ formatPrice(total) }}</span>
            </div>
            <button class="cart-summary__checkout-btn" @click="goToCheckout">
              Proceder al Pago
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="9 18 15 12 9 6"/>
              </svg>
            </button>
            <p v-if="!authStore.isAuthenticated" class="cart-summary__auth-note">
              Deberás <RouterLink to="/login" class="cart-summary__auth-link">iniciar sesión</RouterLink> para continuar.
            </p>
          </aside>
        </div>
      </div>
    </div>
  </MainLayout>
</template>

<style lang="scss" scoped>
@use '../styles/colorVariables.module.scss' as *;
@use "sass:color";

.cart-view {
  padding: 3rem 0 5rem;

  &__title {
    font-family: var(--font-heading);
    font-size: clamp(1.75rem, 3.5vw, 2.5rem);
    font-weight: 700;
    color: var(--color-primary);
    margin-bottom: 2.5rem;
  }

  &__empty {
    text-align: center;
    padding: 5rem 2rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
  }

  &__empty-icon {
    font-size: 3.5rem;
    opacity: 0.35;
    color: var(--color-muted);
  }

  &__empty-title {
    font-family: var(--font-heading);
    font-size: 1.5rem;
    color: var(--color-primary);
  }

  &__empty-text {
    font-size: 1rem;
    color: var(--color-muted);
    max-width: 300px;
  }

  &__empty-btn {
    margin-top: 0.5rem;
    padding: 0.75rem 2rem;
    background-color: var(--color-accent);
    color: white;
    border-radius: $radius-md;
    text-decoration: none;
    font-weight: 600;
    transition: background-color 0.2s ease, transform 0.2s ease;

    &:hover {
      background-color: color.adjust($color-accent, $lightness: -8%);
      transform: translateY(-1px);
    }
  }

  &__layout {
    display: grid;
    grid-template-columns: 1fr 340px;
    gap: 3rem;
    align-items: start;

    @media (max-width: 900px) {
      grid-template-columns: 1fr;
      gap: 2.5rem;
    }
  }

  &__items-header {
    display: grid;
    grid-template-columns: 1fr auto auto auto auto;
    gap: 1rem;
    padding: 0.75rem 0;
    border-bottom: 2px solid var(--color-border);
    font-size: 0.8125rem;
    font-weight: 600;
    color: var(--color-muted);
    text-transform: uppercase;
    letter-spacing: 0.06em;

    @media (max-width: 640px) { display: none; }
  }

  &__actions {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-top: 1.5rem;
    flex-wrap: wrap;
    gap: 1rem;
  }

  &__continue {
    font-size: 0.9375rem;
    color: var(--color-muted);
    text-decoration: none;
    transition: color 0.2s ease;

    &:hover { color: var(--color-accent); }
  }

  &__clear {
    font-size: 0.875rem;
    color: var(--color-muted);
    background: none;
    border: 1px solid var(--color-border);
    padding: 0.5rem 1rem;
    border-radius: $radius-sm;
    cursor: pointer;
    transition: all 0.2s ease;
    font-family: var(--font-body);

    &:hover {
      border-color: var(--color-error);
      color: var(--color-error);
    }
  }
}

.cart-row {
  display: grid;
  grid-template-columns: 1fr auto auto auto auto;
  gap: 1rem;
  padding: 1.25rem 0;
  border-bottom: 1px solid var(--color-border);
  align-items: center;

  @media (max-width: 640px) {
    grid-template-columns: 1fr auto;
    grid-template-rows: auto auto;
  }

  &__product {
    display: flex;
    gap: 1rem;
    align-items: center;
    grid-column: 1;
  }

  &__image-link {
    width: 72px;
    height: 72px;
    flex-shrink: 0;
    border-radius: $radius-sm;
    overflow: hidden;
    background-color: var(--color-bg-subtle);
    border: 1px solid var(--color-border);
  }

  &__image {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  &__info {
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
    transition: color 0.2s ease;

    &:hover { color: var(--color-accent); }
  }

  &__collection {
    font-size: 0.8125rem;
    color: var(--color-muted);
    text-transform: capitalize;
  }

  &__price, &__subtotal {
    font-size: 0.9375rem;
    font-weight: 500;
    color: var(--color-primary);
  }

  &__subtotal {
    font-weight: 700;
    font-family: var(--font-heading);
    color: var(--color-accent);
  }

  &__qty {
    display: flex;
    align-items: center;
    gap: 0.375rem;
    border: 1px solid var(--color-border);
    border-radius: $radius-sm;
    padding: 0.25rem;
    background-color: var(--color-bg-subtle);
  }

  &__qty-btn {
    width: 28px;
    height: 28px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1rem;
    color: var(--color-primary);
    cursor: pointer;
    border-radius: $radius-sm;
    border: none;
    background: none;
    transition: background-color 0.15s ease, color 0.15s ease;

    &:hover {
      background-color: var(--color-accent-light);
      color: var(--color-accent);
    }
  }

  &__qty-value {
    font-size: 0.9375rem;
    font-weight: 600;
    min-width: 24px;
    text-align: center;
    color: var(--color-primary);
  }

  &__remove {
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--color-muted);
    cursor: pointer;
    padding: 6px;
    border: none;
    background: none;
    border-radius: $radius-sm;
    transition: color 0.2s ease, background-color 0.2s ease;

    &:hover {
      color: var(--color-error);
      background-color: rgba(229, 62, 62, 0.08);
    }
  }
}

.cart-summary {
  background-color: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: $radius-lg;
  padding: 1.75rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  position: sticky;
  top: 1.5rem;

  &__title {
    font-family: var(--font-heading);
    font-size: 1.25rem;
    font-weight: 700;
    color: var(--color-primary);
    padding-bottom: 1rem;
    border-bottom: 1px solid var(--color-border);
    margin-bottom: 0;
  }

  &__row {
    display: flex;
    justify-content: space-between;
    font-size: 0.9375rem;
    color: var(--color-muted);

    span:last-child {
      color: var(--color-primary);
      font-weight: 500;
    }
  }

  &__free {
    color: var(--color-success) !important;
    font-weight: 600;
  }

  &__shipping-note {
    font-size: 0.8125rem;
    color: var(--color-muted);
    background-color: var(--color-bg-subtle);
    border: 1px solid var(--color-border);
    padding: 0.625rem 0.875rem;
    border-radius: $radius-sm;
    line-height: 1.5;
  }

  &__divider {
    height: 1px;
    background-color: var(--color-border);
    margin: 0.25rem 0;
  }

  &__total-row {
    display: flex;
    justify-content: space-between;
    font-size: 1.125rem;
    font-weight: 700;
    color: var(--color-primary);
    font-family: var(--font-heading);

    span:last-child {
      color: var(--color-accent);
      font-size: 1.375rem;
    }
  }

  &__checkout-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    width: 100%;
    padding: 0.9rem;
    background-color: var(--color-accent);
    color: white;
    border: none;
    border-radius: $radius-md;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
    font-family: var(--font-body);
    margin-top: 0.25rem;

    &:hover {
      background-color: color.adjust($color-accent, $lightness: -8%);
      transform: translateY(-1px);
      box-shadow: 0 6px 20px rgba(200, 149, 108, 0.35);
    }
  }

  &__auth-note {
    font-size: 0.875rem;
    color: var(--color-muted);
    text-align: center;
  }

  &__auth-link {
    color: var(--color-accent);
    font-weight: 500;

    &:hover { text-decoration: underline; }
  }
}
</style>
