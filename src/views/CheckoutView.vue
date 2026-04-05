<script setup lang="ts">
import { ref, computed } from 'vue';
import { RouterLink } from 'vue-router';
import MainLayout from '../layout/MainLayout.vue';
import { useCartStore } from '../stores/cart';
import { useAuthStore } from '../stores/auth';
import { useUIStore } from '../stores/ui';
import { orderService } from '../services/order.service';

const cartStore = useCartStore();
const authStore = useAuthStore();
const uiStore = useUIStore();
const loading = ref(false);
const confirmedOrder = ref<{ orderNumber: string } | null>(null);
const errorMessage = ref('');

const form = ref({
  name: authStore.user?.name || '',
  email: '',
  phone: '',
  street: '',
  city: '',
  country: 'Venezuela',
});

const items = computed(() => cartStore.items);
const subtotal = computed(() => cartStore.subtotal);
const shipping = computed(() => subtotal.value >= 50 ? 0 : 5.99);
const total = computed(() => subtotal.value + shipping.value);

async function handleSubmit() {
  if (loading.value || items.value.length === 0) return;
  loading.value = true;
  errorMessage.value = '';
  try {
    const response = await orderService.createOrder(
      items.value,
      {
        name: form.value.name,
        phone: form.value.phone,
        street: form.value.street,
        city: form.value.city,
        country: form.value.country,
      },
      form.value.email,
    );
    confirmedOrder.value = { orderNumber: response.data.orderNumber };
    cartStore.clearCart();
    uiStore.showNotification('¡Pedido confirmado!', 'success');
  } catch (err: unknown) {
    errorMessage.value = (err as { message?: string })?.message || 'Error al procesar el pedido. Intenta de nuevo.';
  } finally {
    loading.value = false;
  }
}

function formatPrice(val: number) {
  return `$${val.toFixed(2)}`;
}
</script>

<template>
  <MainLayout>
    <div class="checkout-view">
      <div class="container">
        <!-- Breadcrumb -->
        <nav class="breadcrumb">
          <RouterLink to="/" class="breadcrumb__link">Inicio</RouterLink>
          <span class="breadcrumb__sep">/</span>
          <RouterLink to="/carrito" class="breadcrumb__link">Carrito</RouterLink>
          <span class="breadcrumb__sep">/</span>
          <span class="breadcrumb__current">Pago</span>
        </nav>

        <!-- Confirmation -->
        <div v-if="confirmedOrder" class="checkout-success">
          <div class="checkout-success__icon">✓</div>
          <h2 class="checkout-success__title">¡Pedido Confirmado!</h2>
          <p class="checkout-success__text">
            Tu pedido <strong>#{{ confirmedOrder.orderNumber }}</strong> ha sido recibido. Te contactaremos pronto para coordinar la entrega.
          </p>
          <div class="checkout-success__actions">
            <RouterLink to="/perfil" class="checkout-success__btn-primary">Ver mis Pedidos</RouterLink>
            <RouterLink to="/tienda" class="checkout-success__btn-secondary">Seguir Comprando</RouterLink>
          </div>
        </div>

        <!-- Checkout Form -->
        <div v-else class="checkout-view__layout">
          <form class="checkout-form" @submit.prevent="handleSubmit">
            <h1 class="checkout-form__title">Datos de Envío</h1>

            <div v-if="errorMessage" class="checkout-form__error">
              {{ errorMessage }}
            </div>

            <div class="checkout-form__grid">
              <div class="form-group">
                <label class="form-group__label" for="checkout-name">Nombre completo *</label>
                <input id="checkout-name" v-model="form.name" type="text" class="form-group__input" placeholder="Juan Pérez" required />
              </div>
              <div class="form-group">
                <label class="form-group__label" for="checkout-email">Email *</label>
                <input id="checkout-email" v-model="form.email" type="email" class="form-group__input" placeholder="juan@email.com" required />
              </div>
              <div class="form-group">
                <label class="form-group__label" for="checkout-phone">Teléfono *</label>
                <input id="checkout-phone" v-model="form.phone" type="tel" class="form-group__input" placeholder="+58 414 000 0000" required />
              </div>
              <div class="form-group">
                <label class="form-group__label" for="checkout-country">País *</label>
                <input id="checkout-country" v-model="form.country" type="text" class="form-group__input" placeholder="Venezuela" required />
              </div>
              <div class="form-group form-group--full">
                <label class="form-group__label" for="checkout-street">Dirección *</label>
                <input id="checkout-street" v-model="form.street" type="text" class="form-group__input" placeholder="Calle, número, sector" required />
              </div>
              <div class="form-group">
                <label class="form-group__label" for="checkout-city">Ciudad *</label>
                <input id="checkout-city" v-model="form.city" type="text" class="form-group__input" placeholder="Caracas" required />
              </div>
            </div>

            <button type="submit" class="checkout-form__submit-btn" :disabled="loading || items.length === 0">
              <span v-if="loading">Procesando...</span>
              <span v-else>Confirmar Pedido — {{ formatPrice(total) }}</span>
            </button>
          </form>

          <!-- Order Summary -->
          <aside class="checkout-summary">
            <h2 class="checkout-summary__title">Tu Pedido</h2>
            <div class="checkout-summary__items">
              <div v-for="item in items" :key="item.product._id" class="checkout-summary__item">
                <div class="checkout-summary__item-img-wrap">
                  <img :src="item.product.mainImage" :alt="item.product.name" class="checkout-summary__item-img" />
                  <span class="checkout-summary__item-qty">{{ item.quantity }}</span>
                </div>
                <span class="checkout-summary__item-name">{{ item.product.name }}</span>
                <span class="checkout-summary__item-price">{{ formatPrice(item.product.price * item.quantity) }}</span>
              </div>
            </div>
            <div class="checkout-summary__divider"></div>
            <div class="checkout-summary__row">
              <span>Subtotal</span>
              <span>{{ formatPrice(subtotal) }}</span>
            </div>
            <div class="checkout-summary__row">
              <span>Envío</span>
              <span :class="{ 'checkout-summary__free': shipping === 0 }">{{ shipping === 0 ? 'Gratis' : formatPrice(shipping) }}</span>
            </div>
            <div class="checkout-summary__divider"></div>
            <div class="checkout-summary__total">
              <span>Total</span>
              <span>{{ formatPrice(total) }}</span>
            </div>
          </aside>
        </div>
      </div>
    </div>
  </MainLayout>
</template>

<style lang="scss" scoped>
@use '../styles/colorVariables.module.scss' as *;
@use "sass:color";

.checkout-view {
  padding: 3rem 0 5rem;

  .container { max-width: 1100px; }
}

.breadcrumb {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 2.5rem;
  flex-wrap: wrap;

  &__link { font-size: 0.875rem; color: $color-muted; text-decoration: none; &:hover { color: $color-accent; } }
  &__sep { color: $color-border; font-size: 0.875rem; }
  &__current { font-size: 0.875rem; color: $color-primary; font-weight: 500; }
}

.checkout-success {
  text-align: center;
  padding: 5rem 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.25rem;
  max-width: 480px;
  margin: 0 auto;

  &__icon {
    width: 72px;
    height: 72px;
    border-radius: 50%;
    background-color: $color-success;
    color: white;
    font-size: 2rem;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
  }

  &__title {
    font-family: var(--font-heading);
    font-size: 2rem;
    font-weight: 700;
    color: $color-primary;
  }

  &__text {
    font-size: 1rem;
    color: $color-muted;
    line-height: 1.7;

    strong { color: $color-primary; }
  }

  &__actions {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
    justify-content: center;
    margin-top: 0.5rem;
  }

  &__btn-primary {
    padding: 0.75rem 1.75rem;
    background-color: $color-accent;
    color: white;
    border-radius: $radius-md;
    text-decoration: none;
    font-weight: 600;
    transition: background-color 0.2s ease;

    &:hover { background-color: color.adjust($color-accent, $lightness: -8%); }
  }

  &__btn-secondary {
    padding: 0.75rem 1.75rem;
    border: 2px solid $color-border;
    color: $color-primary;
    border-radius: $radius-md;
    text-decoration: none;
    font-weight: 500;
    transition: all 0.2s ease;

    &:hover { border-color: $color-primary; }
  }
}

.checkout-view__layout {
  display: grid;
  grid-template-columns: 1fr 380px;
  gap: 3rem;
  align-items: start;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    gap: 2.5rem;
  }
}

.checkout-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;

  &__title {
    font-family: var(--font-heading);
    font-size: 1.5rem;
    font-weight: 700;
    color: $color-primary;
  }

  &__error {
    padding: 0.875rem 1.125rem;
    background-color: rgba($color-error, 0.08);
    border: 1px solid rgba($color-error, 0.3);
    border-radius: $radius-sm;
    font-size: 0.9375rem;
    color: $color-error;
  }

  &__grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;

    @media (max-width: 600px) { grid-template-columns: 1fr; }
  }

  &__submit-btn {
    width: 100%;
    padding: 1rem;
    background-color: $color-accent;
    color: white;
    border: none;
    border-radius: $radius-md;
    font-size: 1.0625rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.25s ease;
    font-family: var(--font-body);

    &:hover:not(:disabled) {
      background-color: color.adjust($color-accent, $lightness: -8%);
      transform: translateY(-1px);
      box-shadow: $shadow-md;
    }

    &:disabled { opacity: 0.6; cursor: not-allowed; }
  }
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;

  &--full { grid-column: 1 / -1; }

  &__label {
    font-size: 0.875rem;
    font-weight: 600;
    color: $color-primary;
  }

  &__input {
    padding: 0.75rem 1rem;
    border: 1px solid $color-border;
    border-radius: $radius-sm;
    font-size: 0.9375rem;
    color: $color-primary;
    font-family: var(--font-body);
    transition: border-color 0.2s ease;
    background-color: $color-bg;

    &:focus { outline: none; border-color: $color-accent; }
    &::placeholder { color: $color-muted; }
  }
}

.checkout-summary {
  background-color: $color-bg-card;
  border: 1px solid $color-border;
  border-radius: $radius-lg;
  padding: 1.75rem;
  display: flex;
  flex-direction: column;
  gap: 0.875rem;
  position: sticky;
  top: 90px;

  &__title {
    font-family: var(--font-heading);
    font-size: 1.125rem;
    font-weight: 700;
    color: $color-primary;
    margin-bottom: 0.25rem;
  }

  &__items {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  &__item {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  &__item-img-wrap {
    position: relative;
    width: 52px;
    height: 52px;
    flex-shrink: 0;
  }

  &__item-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: $radius-sm;
    border: 1px solid $color-border;
  }

  &__item-qty {
    position: absolute;
    top: -8px;
    right: -8px;
    min-width: 20px;
    height: 20px;
    background-color: $color-muted;
    color: white;
    font-size: 0.6875rem;
    font-weight: 600;
    border-radius: $radius-full;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 4px;
  }

  &__item-name {
    flex: 1;
    font-size: 0.875rem;
    color: $color-primary;
    line-height: 1.4;
  }

  &__item-price {
    font-size: 0.875rem;
    font-weight: 600;
    color: $color-primary;
    white-space: nowrap;
  }

  &__divider { height: 1px; background-color: $color-border; }

  &__row {
    display: flex;
    justify-content: space-between;
    font-size: 0.9375rem;
    color: $color-muted;
  }

  &__free { color: $color-success; font-weight: 600; }

  &__total {
    display: flex;
    justify-content: space-between;
    font-size: 1.125rem;
    font-weight: 700;
    color: $color-primary;
    font-family: var(--font-heading);
  }
}
</style>
