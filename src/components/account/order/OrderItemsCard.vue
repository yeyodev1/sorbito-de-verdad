<script setup lang="ts">
import type { Order } from '../../../types';
import { formatPrice } from '../../../composables/account/orderFormat';
import OrderCard from './OrderCard.vue';

defineProps<{ order: Order }>();
</script>

<template>
  <OrderCard title="Productos">
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
  </OrderCard>
</template>

<style lang="scss" scoped>
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
</style>
