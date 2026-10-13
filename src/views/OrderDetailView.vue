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
  review:     'En revisión',
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

function whatsappUrl(orderNumber: string) {
  const text = `Hola, tengo una consulta sobre mi pedido #${orderNumber}`;
  return `https://api.whatsapp.com/send/?phone=593962861148&text=${encodeURIComponent(text)}&type=phone_number&app_absent=0`;
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
    <section class="order-detail">
      <div class="container order-detail__container">

        <!-- Back -->
        <RouterLink to="/perfil" class="order-detail__back">
          <i class="fa-solid fa-arrow-left"></i>
          Mis pedidos
        </RouterLink>

        <!-- Loading skeleton -->
        <template v-if="loading">
          <div class="order-detail__skeleton" aria-busy="true">
            <div class="skeleton od-skel od-skel--title"></div>
            <div class="skeleton od-skel od-skel--bar"></div>
            <div class="od-skel-grid">
              <div class="skeleton od-skel od-skel--card"></div>
              <div class="skeleton od-skel od-skel--card"></div>
            </div>
          </div>
        </template>

        <!-- Error -->
        <template v-else-if="error">
          <div class="order-detail__error">
            <span class="order-detail__error-icon" aria-hidden="true">
              <i class="fa-solid fa-triangle-exclamation"></i>
            </span>
            <p>{{ error }}</p>
            <button class="btn-outline" @click="router.back()">Regresar</button>
          </div>
        </template>

        <!-- Content -->
        <template v-else-if="order">

          <!-- Header -->
          <header class="order-detail__header">
            <div>
              <span class="eyebrow">Detalle del pedido</span>
              <h1 class="order-detail__title">#{{ order.orderNumber }}</h1>
              <p class="order-detail__date">Realizado el {{ formatDate(order.createdAt) }}</p>
            </div>
            <div class="order-detail__badges">
              <span :class="['od-badge', `od-badge--${order.status === 'delivered' ? 'success' : order.status === 'cancelled' ? 'error' : 'info'}`]">
                <span class="od-badge__dot" aria-hidden="true"></span>
                {{ statusLabels[order.status] || order.status }}
              </span>
              <span :class="['od-badge', `od-badge--${order.paymentStatus === 'paid' ? 'success' : order.paymentStatus === 'failed' ? 'error' : 'warning'}`]">
                <i class="fa-solid fa-credit-card"></i>
                {{ paymentStatusLabels[order.paymentStatus] || order.paymentStatus }}
              </span>
            </div>
          </header>

          <!-- Progress tracker (only for non-cancelled, non-pending) -->
          <ol v-if="!['pending', 'cancelled'].includes(order.status)" class="order-detail__tracker" aria-label="Progreso del pedido">
            <li
              v-for="(step, i) in statusSteps"
              :key="step"
              :class="['od-step', `od-step--${getStepState(step, order.status)}`]"
            >
              <div class="od-step__circle">
                <i :class="getStepState(step, order.status) === 'done' ? 'fa-solid fa-check' : stepIcons[i]"></i>
              </div>
              <span class="od-step__label">{{ stepLabels[i] }}</span>
              <div v-if="i < statusSteps.length - 1" class="od-step__line" aria-hidden="true"></div>
            </li>
          </ol>

          <!-- Two-column layout -->
          <div class="order-detail__grid">

            <!-- Products -->
            <div class="od-card">
              <h2 class="od-card__title">Productos</h2>
              <ul class="od-items">
                <li v-for="item in order.items" :key="item.product" class="od-item">
                  <div class="od-item__img-wrap">
                    <img
                      v-if="item.image"
                      :src="item.image"
                      :alt="item.name"
                      class="od-item__img"
                      loading="lazy"
                    />
                    <div v-else class="od-item__img-placeholder">
                      <i class="fa-solid fa-mug-hot"></i>
                    </div>
                    <span class="od-item__qty-badge">{{ item.quantity }}</span>
                  </div>
                  <div class="od-item__info">
                    <p class="od-item__name">{{ item.name }}</p>
                    <p class="od-item__qty">{{ item.quantity }} × {{ formatPrice(item.price) }}</p>
                  </div>
                  <div class="od-item__price">
                    {{ formatPrice(item.price * item.quantity) }}
                  </div>
                </li>
              </ul>

              <!-- Totals -->
              <dl class="od-totals">
                <div class="od-totals__row">
                  <dt>Subtotal</dt>
                  <dd>{{ formatPrice(order.subtotal) }}</dd>
                </div>
                <div class="od-totals__row">
                  <dt>Envío</dt>
                  <dd :class="{ 'od-totals__free': order.shipping === 0 }">{{ order.shipping === 0 ? 'Gratis' : formatPrice(order.shipping) }}</dd>
                </div>
                <div class="od-totals__row od-totals__row--total">
                  <dt>Total</dt>
                  <dd>{{ formatPrice(order.total) }}</dd>
                </div>
              </dl>
            </div>

            <!-- Right column -->
            <aside class="od-sidebar">

              <!-- Shipping address -->
              <div class="od-card">
                <h2 class="od-card__title">Dirección de envío</h2>
                <address class="od-address">
                  <p class="od-address__name">{{ order.shippingAddress.name }}</p>
                  <p>{{ order.shippingAddress.street }}</p>
                  <p>{{ order.shippingAddress.city }}<span v-if="order.shippingAddress.state">, {{ order.shippingAddress.state }}</span></p>
                  <p>{{ order.shippingAddress.country }}<span v-if="order.shippingAddress.zip"> {{ order.shippingAddress.zip }}</span></p>
                  <p v-if="order.shippingAddress.phone" class="od-address__phone">
                    <i class="fa-solid fa-phone"></i>
                    {{ order.shippingAddress.phone }}
                  </p>
                </address>
                <p class="od-address-lock">
                  <i class="fa-solid fa-lock"></i>
                  <span>La dirección no puede modificarse una vez realizado el pedido.</span>
                </p>
                <a
                  :href="googleMapsUrl(order.shippingAddress)"
                  target="_blank"
                  rel="noopener"
                  class="btn-outline btn-sm btn-block"
                >
                  <i class="fa-solid fa-map-location-dot"></i>
                  Ver en Google Maps
                </a>
              </div>

              <!-- Help -->
              <div class="od-card od-card--help">
                <p class="od-card__help-title">¿Tienes preguntas sobre tu pedido?</p>
                <p class="od-card__help-text">Escríbenos y te respondemos lo antes posible.</p>
                <a
                  :href="whatsappUrl(order.orderNumber)"
                  target="_blank"
                  rel="noopener"
                  class="btn-dark btn-block"
                >
                  <i class="fa-brands fa-whatsapp"></i>
                  Contactar por WhatsApp
                </a>
              </div>

            </aside>
          </div>

        </template>
      </div>
    </section>
  </MainLayout>
</template>

<style lang="scss" scoped>
.order-detail {
  padding: 2rem 0 5rem;
  min-height: 60vh;

  @media (min-width: 768px) {
    padding-top: 3rem;
  }

  &__container {
    max-width: 1080px;
  }

  &__back {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    min-height: 44px;
    margin-bottom: 1rem;
    font-size: 0.875rem;
    font-weight: 500;
    color: var(--color-muted);
    transition: color 0.2s ease;

    &:hover { color: var(--color-primary); }
  }

  &__header {
    display: flex;
    flex-wrap: wrap;
    align-items: flex-end;
    justify-content: space-between;
    gap: 1rem;
    margin-bottom: 2rem;
  }

  &__title {
    margin-top: 0.25rem;
    font-size: clamp(2rem, 6vw, 2.75rem);
    word-break: break-word;
  }

  &__date {
    margin-top: 0.25rem;
    font-size: 0.9375rem;
  }

  &__badges {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  &__tracker {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    margin-bottom: 2rem;
    padding: 1.5rem 0.75rem;
    background-color: var(--color-bg-card);
    border: 1px solid var(--color-border);
    border-radius: $radius-lg;

    @media (min-width: 640px) {
      padding: 1.75rem 1.5rem;
    }
  }

  &__grid {
    display: grid;
    gap: 1.25rem;
    align-items: start;

    @media (min-width: 900px) {
      grid-template-columns: 1fr 340px;
      gap: 1.5rem;
    }
  }

  &__error {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    padding: 4rem 1rem;
    text-align: center;
  }

  &__error-icon {
    width: 64px;
    height: 64px;
    display: grid;
    place-items: center;
    font-size: 1.5rem;
    color: var(--color-error);
    background-color: var(--color-error-light);
    border-radius: 50%;
  }

  &__skeleton {
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
  }
}

.od-skel {
  border-radius: $radius-lg;

  &--title { width: 50%; height: 44px; }
  &--bar { height: 96px; }
  &--card { height: 260px; }
}

.od-skel-grid {
  display: grid;
  gap: 1.25rem;

  @media (min-width: 900px) {
    grid-template-columns: 1fr 340px;
  }
}

.od-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.4rem 0.875rem;
  font-size: 0.8125rem;
  font-weight: 600;
  border-radius: $radius-full;

  i { font-size: 0.75rem; }

  &__dot {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background-color: currentColor;
  }

  &--success { color: var(--color-success); background-color: var(--color-success-light); }
  &--error   { color: var(--color-error);   background-color: var(--color-error-light); }
  &--warning { color: var(--color-warning); background-color: var(--color-warning-light); }
  &--info    { color: var(--color-accent);  background-color: var(--color-accent-light); }
}

.od-step {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  text-align: center;

  &__circle {
    position: relative;
    z-index: 1;
    width: 40px;
    height: 40px;
    display: grid;
    place-items: center;
    font-size: 0.875rem;
    color: var(--color-muted);
    background-color: var(--color-bg-subtle);
    border: 1.5px solid var(--color-border);
    border-radius: 50%;
    transition: all 0.3s ease;

    @media (min-width: 640px) {
      width: 46px;
      height: 46px;
      font-size: 1rem;
    }
  }

  &__label {
    font-size: 0.6875rem;
    font-weight: 600;
    color: var(--color-muted);

    @media (min-width: 640px) {
      font-size: 0.8125rem;
    }
  }

  &__line {
    position: absolute;
    top: 20px;
    left: calc(50% + 24px);
    right: calc(-50% + 24px);
    height: 2px;
    background-color: var(--color-border);
    border-radius: 2px;

    @media (min-width: 640px) {
      top: 23px;
      left: calc(50% + 28px);
      right: calc(-50% + 28px);
    }
  }

  &--done {
    .od-step__circle {
      color: var(--color-on-accent);
      background-color: var(--color-accent);
      border-color: var(--color-accent);
    }
    .od-step__label { color: var(--color-primary); }
    .od-step__line { background-color: var(--color-accent); }
  }

  &--active {
    .od-step__circle {
      color: var(--color-accent);
      background-color: var(--color-accent-light);
      border-color: var(--color-accent);
      box-shadow: var(--focus-ring);
    }
    .od-step__label { color: var(--color-accent); }
  }
}

.od-card {
  padding: 1.25rem;
  background-color: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: $radius-lg;

  @media (min-width: 640px) {
    padding: 1.75rem;
  }

  &__title {
    margin-bottom: 1.25rem;
    font-size: 1.25rem;
  }

  &--help {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    background-color: var(--color-bg-subtle);
  }

  &__help-title {
    font-family: var(--font-heading);
    font-size: 1.0625rem;
    font-weight: 600;
    color: var(--color-primary);
  }

  &__help-text {
    margin-bottom: 0.5rem;
    font-size: 0.875rem;
  }
}

.od-sidebar {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.od-items {
  display: flex;
  flex-direction: column;
}

.od-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.875rem 0;
  border-bottom: 1px solid var(--color-border);

  &:first-child { padding-top: 0; }

  &__img-wrap {
    position: relative;
    flex-shrink: 0;
    width: 64px;
    height: 64px;
  }

  &__img,
  &__img-placeholder {
    width: 100%;
    height: 100%;
    border-radius: $radius-md;
    background-color: var(--color-bg-subtle);
  }

  &__img { object-fit: cover; }

  &__img-placeholder {
    display: grid;
    place-items: center;
    color: var(--color-muted);
  }

  &__qty-badge {
    position: absolute;
    top: -6px;
    right: -6px;
    min-width: 22px;
    height: 22px;
    padding: 0 6px;
    display: grid;
    place-items: center;
    font-size: 0.6875rem;
    font-weight: 700;
    color: var(--color-on-inverse);
    background-color: var(--color-bg-inverse);
    border-radius: $radius-full;
  }

  &__info {
    flex: 1;
    min-width: 0;
  }

  &__name {
    font-size: 0.9375rem;
    font-weight: 600;
    line-height: 1.35;
    color: var(--color-primary);
  }

  &__qty {
    font-size: 0.8125rem;
  }

  &__price {
    font-weight: 600;
    color: var(--color-primary);
    white-space: nowrap;
  }
}

.od-totals {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-top: 1.25rem;

  &__row {
    display: flex;
    justify-content: space-between;
    gap: 1rem;
    font-size: 0.9375rem;
    color: var(--color-muted);

    dd { color: var(--color-primary); }

    &--total {
      margin-top: 0.5rem;
      padding-top: 0.875rem;
      border-top: 1px solid var(--color-border);
      font-family: var(--font-heading);
      font-size: 1.25rem;
      font-weight: 600;
      color: var(--color-primary);
    }
  }

  &__free {
    color: var(--color-success) !important;
    font-weight: 600;
  }
}

.od-address {
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
  font-style: normal;

  p {
    font-size: 0.9375rem;
    line-height: 1.55;
  }

  &__name {
    font-weight: 600;
    color: var(--color-primary);
  }

  &__phone {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    margin-top: 0.375rem;

    i {
      font-size: 0.75rem;
      color: var(--color-accent);
    }
  }
}

.od-address-lock {
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  margin: 1rem 0;
  padding: 0.625rem 0.875rem;
  font-size: 0.8125rem;
  line-height: 1.45;
  color: var(--color-muted);
  background-color: var(--color-bg-subtle);
  border-radius: $radius-md;

  i {
    margin-top: 3px;
    font-size: 0.6875rem;
    color: var(--color-accent);
  }
}
</style>
