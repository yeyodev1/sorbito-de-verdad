<script setup lang="ts">
import type { Order } from '../../../types';
import { statusLabels, paymentStatusLabels, formatDate } from '../../../composables/account/orderFormat';

defineProps<{ order: Order }>();
</script>

<template>
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
</template>

<style lang="scss" scoped>
.order-detail {
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
</style>
