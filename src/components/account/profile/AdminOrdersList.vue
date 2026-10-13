<script setup lang="ts">
import type { Order } from '../../../types';
import { statusColors, statusLabels, formatDate, formatPrice } from '../../../composables/account/orderFormat';

defineProps<{ orders: Order[]; loading: boolean }>();
</script>

<template>
  <div v-if="loading" class="ap__orders-loading">
    <div v-for="i in 2" :key="i" class="ap__skeleton"></div>
  </div>
  <div v-else-if="orders.length === 0" class="ap__orders-empty">
    <i class="fa-solid fa-inbox"></i>
    <span>Sin pedidos personales</span>
  </div>
  <div v-else class="ap__orders-list">
    <div v-for="order in orders.slice(0, 3)" :key="order._id" class="ap__order-row">
      <span class="ap__order-num">#{{ order.orderNumber }}</span>
      <span class="ap__order-date">{{ formatDate(order.createdAt) }}</span>
      <span :class="['ap__order-status', `ap__order-status--${statusColors[order.status] || 'info'}`]">
        {{ statusLabels[order.status] || order.status }}
      </span>
      <span class="ap__order-total">{{ formatPrice(order.total) }}</span>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@keyframes skeleton-pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
}

.ap {
  // Orders table
  &__orders-loading {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  &__skeleton {
    height: 52px;
    border-radius: 8px;
    background: $admin-border;
    animation: skeleton-pulse 1.5s ease-in-out infinite;
  }

  &__orders-empty {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 1.5rem;
    background-color: $admin-card;
    border: 1px solid $admin-border;
    border-radius: 12px;
    color: $admin-text-muted;
    font-size: 0.9375rem;

    i { font-size: 1.25rem; color: $admin-text-muted; }
  }

  &__orders-list {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  &__order-row {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 0.75rem 1rem;
    padding: 0.875rem 1.25rem;
    background-color: $admin-card;
    border: 1px solid $admin-border;
    border-radius: 10px;
    transition: background-color 0.15s ease;

    &:hover { background-color: $admin-sidebar-hover; }

    @media (max-width: 600px) {
      padding: 0.875rem 1rem;
    }
  }

  &__order-num {
    font-size: 0.9375rem;
    font-weight: 700;
    color: $admin-text;
    font-family: monospace;
  }

  &__order-date {
    font-size: 0.8125rem;
    color: $admin-text-muted;

    flex: 1 1 auto;
    min-width: 0;

    @media (max-width: 600px) {
      flex-basis: 100%;
      order: 3;
    }
  }

  &__order-status {
    font-size: 0.75rem;
    font-weight: 600;
    padding: 0.25rem 0.625rem;
    border-radius: 4px;

    &--success { background-color: rgba($admin-success, 0.15); color: $admin-success; }
    &--error   { background-color: rgba($admin-error, 0.15);   color: $admin-error; }
    &--warning { background-color: rgba(#F59E0B, 0.15);         color: #F59E0B; }
    &--info    { background-color: rgba($admin-info, 0.15);     color: $admin-info; }
    &--accent  { background-color: rgba($admin-accent, 0.15);   color: $admin-accent; }
  }

  &__order-total {
    font-size: 0.9375rem;
    font-weight: 700;
    color: $admin-accent;
  }
}
</style>
