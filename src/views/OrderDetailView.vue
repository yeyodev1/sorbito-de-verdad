<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter, RouterLink } from 'vue-router';
import MainLayout from '../layout/MainLayout.vue';
import { orderService } from '../services/order.service';
import type { Order } from '../types';

const route = useRoute();
const router = useRouter();

const order = ref<Order | null>(null);
const loading = ref(true);
const error = ref('');

const statusLabels: Record<string, string> = {
  pending:    'Pendiente',
  confirmed:  'Confirmado',
  processing: 'En proceso',
  shipped:    'Enviado',
  delivered:  'Entregado',
  cancelled:  'Cancelado',
};

const paymentStatusLabels: Record<string, string> = {
  pending:  'Pendiente',
  paid:     'Pagado',
  failed:   'Fallido',
  refunded: 'Reembolsado',
};

const statusSteps = ['confirmed', 'processing', 'shipped', 'delivered'];
const stepLabels = ['Confirmado', 'En proceso', 'Enviado', 'Entregado'];
const stepIcons = [
  'fa-solid fa-circle-check',
  'fa-solid fa-gear',
  'fa-solid fa-truck',
  'fa-solid fa-house',
];

function getStepState(step: string, currentStatus: string) {
  const idx = statusSteps.indexOf(step);
  const curIdx = statusSteps.indexOf(currentStatus);
  if (curIdx === -1) return 'pending';
  if (idx < curIdx) return 'done';
  if (idx === curIdx) return 'active';
  return 'pending';
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('es-ES', {
    year: 'numeric', month: 'long', day: 'numeric',
  });
}

function googleMapsUrl(addr: Order['shippingAddress']) {
  if (addr.mapsUrl) return addr.mapsUrl;
  const query = encodeURIComponent(`${addr.street}, ${addr.city}, ${addr.country}`);
  return `https://www.google.com/maps/search/?api=1&query=${query}`;
}

function formatPrice(val: number) {
  return `$${val.toFixed(2)}`;
}

onMounted(async () => {
  try {
    const res = await orderService.getOrderById(route.params.id as string);
    order.value = res.data;
  } catch {
    error.value = 'No pudimos cargar los detalles de tu pedido.';
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <MainLayout>
    <div class="order-detail">
      <div class="container">

        <!-- Back -->
        <RouterLink to="/perfil" class="order-detail__back">
          <i class="fa-solid fa-arrow-left"></i>
          Volver a mis pedidos
        </RouterLink>

        <!-- Loading skeleton -->
        <template v-if="loading">
          <div class="order-detail__skeleton">
            <div class="od-skel od-skel--title"></div>
            <div class="od-skel od-skel--card"></div>
            <div class="od-skel od-skel--card"></div>
          </div>
        </template>

        <!-- Error -->
        <template v-else-if="error">
          <div class="order-detail__error">
            <i class="fa-solid fa-triangle-exclamation"></i>
            <p>{{ error }}</p>
            <button class="order-detail__retry" @click="router.back()">Regresar</button>
          </div>
        </template>

        <!-- Content -->
        <template v-else-if="order">

          <!-- Header -->
          <div class="order-detail__header">
            <div class="order-detail__header-left">
              <h1 class="order-detail__title">Pedido <span>#{{ order.orderNumber }}</span></h1>
              <p class="order-detail__date">Realizado el {{ formatDate(order.createdAt) }}</p>
            </div>
            <div class="order-detail__badges">
              <span :class="['od-badge', `od-badge--${order.status === 'delivered' ? 'success' : order.status === 'cancelled' ? 'error' : 'info'}`]">
                <i class="fa-solid fa-circle-dot"></i>
                {{ statusLabels[order.status] || order.status }}
              </span>
              <span :class="['od-badge', `od-badge--${order.paymentStatus === 'paid' ? 'success' : order.paymentStatus === 'failed' ? 'error' : 'warning'}`]">
                <i class="fa-solid fa-credit-card"></i>
                {{ paymentStatusLabels[order.paymentStatus] || order.paymentStatus }}
              </span>
            </div>
          </div>

          <!-- Progress tracker (only for non-cancelled, non-pending) -->
          <div v-if="!['pending', 'cancelled'].includes(order.status)" class="order-detail__tracker">
            <div
              v-for="(step, i) in statusSteps"
              :key="step"
              :class="['od-step', `od-step--${getStepState(step, order.status)}`]"
            >
              <div class="od-step__circle">
                <i :class="stepIcons[i]"></i>
              </div>
              <span class="od-step__label">{{ stepLabels[i] }}</span>
              <div v-if="i < statusSteps.length - 1" class="od-step__line"></div>
            </div>
          </div>

          <!-- Two-column layout -->
          <div class="order-detail__grid">

            <!-- Products -->
            <div class="od-card">
              <h2 class="od-card__title">
                <i class="fa-solid fa-mug-hot"></i>
                Productos
              </h2>
              <div class="od-items">
                <div v-for="item in order.items" :key="item.product" class="od-item">
                  <div class="od-item__img-wrap">
                    <img
                      v-if="item.image"
                      :src="item.image"
                      :alt="item.name"
                      class="od-item__img"
                    />
                    <div v-else class="od-item__img-placeholder">
                      <i class="fa-solid fa-mug-hot"></i>
                    </div>
                  </div>
                  <div class="od-item__info">
                    <p class="od-item__name">{{ item.name }}</p>
                    <p class="od-item__qty">Cantidad: {{ item.quantity }}</p>
                  </div>
                  <div class="od-item__price">
                    {{ formatPrice(item.price * item.quantity) }}
                  </div>
                </div>
              </div>

              <!-- Totals -->
              <div class="od-totals">
                <div class="od-totals__row">
                  <span>Subtotal</span>
                  <span>{{ formatPrice(order.subtotal) }}</span>
                </div>
                <div class="od-totals__row">
                  <span>Envío</span>
                  <span>{{ order.shipping === 0 ? 'Gratis' : formatPrice(order.shipping) }}</span>
                </div>
                <div class="od-totals__row od-totals__row--total">
                  <span>Total</span>
                  <span>{{ formatPrice(order.total) }}</span>
                </div>
              </div>
            </div>

            <!-- Right column -->
            <div class="od-sidebar">

              <!-- Shipping address -->
              <div class="od-card">
                <h2 class="od-card__title">
                  <i class="fa-solid fa-location-dot"></i>
                  Dirección de Envío
                </h2>
                <div class="od-address-lock">
                  <i class="fa-solid fa-lock"></i>
                  <span>La dirección no puede modificarse una vez realizado el pedido</span>
                </div>
                <div class="od-address">
                  <p class="od-address__name">{{ order.shippingAddress.name }}</p>
                  <p>{{ order.shippingAddress.street }}</p>
                  <p>{{ order.shippingAddress.city }}<span v-if="order.shippingAddress.state">, {{ order.shippingAddress.state }}</span></p>
                  <p>{{ order.shippingAddress.country }}<span v-if="order.shippingAddress.zip"> {{ order.shippingAddress.zip }}</span></p>
                  <p v-if="order.shippingAddress.phone" class="od-address__phone">
                    <i class="fa-solid fa-phone"></i>
                    {{ order.shippingAddress.phone }}
                  </p>
                </div>
                <a
                  :href="googleMapsUrl(order.shippingAddress)"
                  target="_blank"
                  rel="noopener"
                  class="od-maps-btn"
                >
                  <i class="fa-brands fa-google"></i>
                  Ver en Google Maps
                </a>
              </div>

              <!-- Help -->
              <div class="od-card od-card--help">
                <i class="fa-solid fa-headset od-card__help-icon"></i>
                <p class="od-card__help-text">¿Tienes preguntas sobre tu pedido?</p>
                <a
                  href="https://wa.me/593XXXXXXXXX"
                  target="_blank"
                  rel="noopener"
                  class="od-card__help-btn"
                >
                  <i class="fa-brands fa-whatsapp"></i>
                  Contactar por WhatsApp
                </a>
              </div>

            </div>
          </div>

        </template>
      </div>
    </div>
  </MainLayout>
</template>

<style lang="scss" scoped>
.order-detail {
  padding: 3rem 0 5rem;
  min-height: 60vh;

  &__back {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    color: var(--color-muted);
    font-size: 0.875rem;
    text-decoration: none;
    margin-bottom: 2rem;
    transition: color 0.2s;

    &:hover { color: $color-accent; }
  }

  &__skeleton {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  &__error {
    text-align: center;
    padding: 4rem 1rem;
    color: var(--color-muted);

    i { font-size: 2.5rem; color: #ef4444; margin-bottom: 1rem; }
    p { margin-bottom: 1.5rem; }
  }

  &__retry {
    background: $color-accent;
    color: #fff;
    border: none;
    border-radius: 8px;
    padding: 0.625rem 1.5rem;
    cursor: pointer;
    font-size: 0.9375rem;
  }

  &__header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 1rem;
    margin-bottom: 2rem;
  }

  &__header-left {}

  &__title {
    font-family: var(--font-heading);
    font-size: 1.75rem;
    font-weight: 700;
    color: var(--color-primary);
    margin: 0 0 0.25rem;

    span { color: $color-accent; }
  }

  &__date {
    font-size: 0.875rem;
    color: var(--color-muted);
    margin: 0;
  }

  &__badges {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
  }

  &__grid {
    display: grid;
    grid-template-columns: 1fr 340px;
    gap: 1.5rem;
    align-items: start;

    @media (max-width: 900px) {
      grid-template-columns: 1fr;
    }
  }
}

// Progress tracker
.order-detail__tracker {
  display: flex;
  align-items: flex-start;
  gap: 0;
  margin-bottom: 2rem;
  overflow-x: auto;
  padding: 1.5rem;
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: 14px;
}

.od-step {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  position: relative;
  gap: 0.5rem;

  &__circle {
    width: 44px;
    height: 44px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1rem;
    position: relative;
    z-index: 1;
    transition: all 0.2s;
  }

  &__label {
    font-size: 0.75rem;
    font-weight: 500;
    text-align: center;
    white-space: nowrap;
  }

  &__line {
    position: absolute;
    top: 22px;
    left: 50%;
    width: 100%;
    height: 2px;
    z-index: 0;
  }

  &--done {
    .od-step__circle {
      background: rgba($color-accent, 0.15);
      color: $color-accent;
      border: 2px solid $color-accent;
    }
    .od-step__label { color: $color-accent; }
    .od-step__line { background: $color-accent; }
  }

  &--active {
    .od-step__circle {
      background: $color-accent;
      color: #fff;
      border: 2px solid $color-accent;
      box-shadow: 0 0 0 4px rgba($color-accent, 0.2);
    }
    .od-step__label { color: $color-accent; font-weight: 700; }
    .od-step__line { background: var(--color-border); }
  }

  &--pending {
    .od-step__circle {
      background: var(--color-bg);
      color: var(--color-muted);
      border: 2px solid var(--color-border);
    }
    .od-step__label { color: var(--color-muted); }
    .od-step__line { background: var(--color-border); }
  }
}

// Badges
.od-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.375rem 0.75rem;
  border-radius: 999px;
  font-size: 0.8125rem;
  font-weight: 600;

  &--success { background: rgba(16, 185, 129, 0.12); color: #059669; }
  &--error   { background: rgba(239, 68, 68, 0.12);  color: #dc2626; }
  &--warning { background: rgba(245, 158, 11, 0.12); color: #d97706; }
  &--info    { background: rgba(200, 149, 108, 0.12); color: $color-accent; }
}

// Cards
.od-card {
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: 14px;
  padding: 1.5rem;

  &__title {
    font-family: var(--font-heading);
    font-size: 1.0625rem;
    font-weight: 700;
    color: var(--color-primary);
    margin: 0 0 1.25rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;

    i { color: $color-accent; }
  }

  &--help {
    text-align: center;
    padding: 2rem 1.5rem;
    margin-top: 1.5rem;
  }

  &__help-icon {
    font-size: 2rem;
    color: $color-accent;
    display: block;
    margin-bottom: 0.75rem;
  }

  &__help-text {
    font-size: 0.9375rem;
    color: var(--color-muted);
    margin-bottom: 1.25rem;
  }

  &__help-btn {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    background: #25D366;
    color: #fff;
    text-decoration: none;
    padding: 0.625rem 1.25rem;
    border-radius: 8px;
    font-size: 0.9375rem;
    font-weight: 600;
    transition: opacity 0.2s;

    &:hover { opacity: 0.85; }
  }
}

.od-sidebar {
  display: flex;
  flex-direction: column;
}

// Items
.od-items {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.od-item {
  display: flex;
  align-items: center;
  gap: 1rem;

  &__img-wrap {
    flex-shrink: 0;
    width: 64px;
    height: 64px;
    border-radius: 10px;
    overflow: hidden;
    border: 1px solid var(--color-border);
  }

  &__img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  &__img-placeholder {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--color-bg);
    color: var(--color-muted);
    font-size: 1.25rem;
  }

  &__info {
    flex: 1;
    min-width: 0;
  }

  &__name {
    font-size: 0.9375rem;
    font-weight: 600;
    color: var(--color-primary);
    margin: 0 0 0.25rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  &__qty {
    font-size: 0.8125rem;
    color: var(--color-muted);
    margin: 0;
  }

  &__price {
    font-size: 0.9375rem;
    font-weight: 700;
    color: var(--color-primary);
    white-space: nowrap;
  }
}

// Totals
.od-totals {
  border-top: 1px solid var(--color-border);
  padding-top: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  &__row {
    display: flex;
    justify-content: space-between;
    font-size: 0.9375rem;
    color: var(--color-muted);

    &--total {
      font-weight: 700;
      color: var(--color-primary);
      font-size: 1.0625rem;
      border-top: 1px solid var(--color-border);
      padding-top: 0.75rem;
      margin-top: 0.25rem;

      span:last-child { color: $color-accent; }
    }
  }
}

// Address lock notice
.od-address-lock {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  background: rgba(245, 158, 11, 0.08);
  border: 1px solid rgba(245, 158, 11, 0.2);
  border-radius: 6px;
  padding: 0.5rem 0.75rem;
  font-size: 0.75rem;
  color: #92400E;
  margin-bottom: 1rem;

  i { color: #D97706; font-size: 0.6875rem; }
}

// Maps button
.od-maps-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  background: #4285F4;
  color: #fff;
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: 7px;
  font-size: 0.8125rem;
  font-weight: 600;
  margin-top: 0.75rem;
  transition: opacity 0.2s;

  &:hover { opacity: 0.85; }
}

// Address
.od-address {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  font-size: 0.9375rem;
  color: var(--color-muted);

  &__name {
    font-weight: 700;
    color: var(--color-primary);
  }

  &__phone {
    display: flex;
    align-items: center;
    gap: 0.375rem;
    margin-top: 0.25rem;
    color: var(--color-primary);

    i { color: $color-accent; }
  }

  p { margin: 0; }
}

// Skeleton
.od-skel {
  background: var(--color-border);
  border-radius: 10px;
  animation: skeleton-pulse 1.5s ease-in-out infinite;

  &--title { height: 32px; width: 240px; }
  &--card  { height: 200px; }
}

@keyframes skeleton-pulse {
  0%, 100% { opacity: 1; }
  50%       { opacity: 0.4; }
}
</style>
