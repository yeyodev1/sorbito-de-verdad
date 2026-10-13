<script setup lang="ts">
import { RouterLink } from 'vue-router';
import type { Order } from '../../../types';
import { statusColors, statusLabels, formatDate, formatPrice } from '../../../composables/account/orderFormat';

defineProps<{ orders: Order[]; loading: boolean }>();
</script>

<template>
  <section class="profile-orders" aria-labelledby="profile-orders-title">
    <div class="profile-orders__head">
      <h2 id="profile-orders-title" class="profile-orders__title">Mis pedidos</h2>
      <span v-if="!loading && orders.length" class="profile-orders__count">{{ orders.length }}</span>
    </div>

    <div v-if="loading" class="profile-orders__loading">
      <div v-for="i in 3" :key="i" class="order-skeleton">
        <div class="skeleton" style="height:18px; width:40%; margin-bottom:10px;"></div>
        <div class="skeleton" style="height:14px; width:65%;"></div>
      </div>
    </div>

    <div v-else-if="orders.length === 0" class="profile-orders__empty">
      <span class="profile-orders__empty-icon" aria-hidden="true">
        <i class="fa-solid fa-mug-hot"></i>
      </span>
      <h3>Aún no tienes pedidos</h3>
      <p>Cuando realices tu primer pedido, aparecerá aquí.</p>
      <RouterLink to="/tienda" class="btn-primary">Explorar tienda</RouterLink>
    </div>

    <ul v-else class="profile-orders__list">
      <li v-for="order in orders" :key="order._id">
        <RouterLink :to="`/mis-pedidos/${order._id}`" class="order-card">
          <div class="order-card__header">
            <div class="order-card__id">
              <span class="order-card__number">#{{ order.orderNumber }}</span>
              <span class="order-card__date">{{ formatDate(order.createdAt) }}</span>
            </div>
            <span :class="['order-card__status', `order-card__status--${statusColors[order.status] || 'info'}`]">
              {{ statusLabels[order.status] || order.status }}
            </span>
          </div>
          <p class="order-card__items">
            <span v-for="(item, idx) in order.items" :key="item.product">{{ item.name }} × {{ item.quantity }}<template v-if="idx < order.items.length - 1"> · </template></span>
          </p>
          <div class="order-card__footer">
            <span class="order-card__total">{{ formatPrice(order.total) }}</span>
            <span class="order-card__detail-btn">
              Ver detalle <i class="fa-solid fa-arrow-right"></i>
            </span>
          </div>
        </RouterLink>
      </li>
    </ul>
  </section>
</template>

<style lang="scss" scoped>
@keyframes skeleton-pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
}

.skeleton {
  background-color: var(--color-border);
  border-radius: $radius-sm;
  animation: skeleton-pulse 1.5s ease-in-out infinite;
}

// Orders
.profile-orders {
  min-width: 0;

  &__head {
    display: flex;
    align-items: center;
    gap: 0.625rem;
    margin-bottom: 1.25rem;
  }

  &__title {
    font-size: 1.5rem;
  }

  &__count {
    min-width: 28px;
    height: 28px;
    padding: 0 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.8125rem;
    font-weight: 600;
    color: var(--color-muted);
    background-color: var(--color-bg-subtle);
    border-radius: $radius-full;
  }

  &__loading {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  &__empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    padding: 3.5rem 1.5rem;
    text-align: center;
    background-color: var(--color-bg-card);
    border: 1px dashed var(--color-border-strong);
    border-radius: $radius-lg;

    h3 { font-size: 1.25rem; }

    p {
      margin-bottom: 0.75rem;
      font-size: 0.9375rem;
    }
  }

  &__empty-icon {
    width: 64px;
    height: 64px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 0.5rem;
    font-size: 1.5rem;
    color: var(--color-accent);
    background-color: var(--color-accent-light);
    border-radius: 50%;
  }

  &__list {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }
}

.order-skeleton {
  padding: 1.25rem;
  background-color: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: $radius-lg;
}

.order-card {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: 1.125rem 1.25rem;
  background-color: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: $radius-lg;
  transition: border-color 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease;

  &:hover {
    border-color: var(--color-border-strong);
    box-shadow: var(--shadow-md);
    transform: translateY(-1px);

    .order-card__detail-btn i { transform: translateX(3px); }
  }

  &__header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 0.75rem;
  }

  &__id {
    display: flex;
    flex-direction: column;
    min-width: 0;
  }

  &__number {
    font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
    font-size: 0.9375rem;
    font-weight: 600;
    color: var(--color-primary);
  }

  &__date {
    font-size: 0.8125rem;
    color: var(--color-muted);
  }

  &__status {
    flex-shrink: 0;
    padding: 0.3rem 0.75rem;
    font-size: 0.75rem;
    font-weight: 600;
    border-radius: $radius-full;

    &--warning { color: var(--color-warning); background-color: var(--color-warning-light); }
    &--info    { color: var(--color-primary); background-color: var(--color-bg-subtle); }
    &--accent  { color: var(--color-accent);  background-color: var(--color-accent-light); }
    &--success { color: var(--color-success); background-color: var(--color-success-light); }
    &--error   { color: var(--color-error);   background-color: var(--color-error-light); }
  }

  &__items {
    font-size: 0.875rem;
    line-height: 1.5;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  &__footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    padding-top: 0.75rem;
    border-top: 1px solid var(--color-border);
  }

  &__total {
    font-family: var(--font-heading);
    font-size: 1.125rem;
    font-weight: 600;
    color: var(--color-primary);
  }

  &__detail-btn {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    font-size: 0.875rem;
    font-weight: 600;
    color: var(--color-accent);

    i {
      font-size: 0.75rem;
      transition: transform 0.2s ease;
    }
  }
}
</style>
