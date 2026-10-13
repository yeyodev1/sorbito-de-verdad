<script setup lang="ts">
import { RouterLink } from 'vue-router';
import { formatCurrency, formatDate, getStatusColor, type DashboardOrder } from './dashboardUtils';

defineProps<{ loading: boolean; recentOrders: DashboardOrder[] }>();
</script>

<template>
  <!-- Recent Orders -->
  <div class="admin-card">
    <div class="admin-card__header">
      <h2 class="admin-card__title">Órdenes Recientes</h2>
      <RouterLink to="/admin/ordenes" class="admin-card__link">Ver todas</RouterLink>
    </div>

    <div v-if="loading" class="admin-card__body">
      <div v-for="n in 4" :key="n" class="skeleton-row"></div>
    </div>

    <div v-else-if="recentOrders.length === 0" class="admin-card__empty">
      <i class="fa-solid fa-inbox"></i>
      <span>No hay órdenes recientes</span>
    </div>

    <div v-else class="admin-table-wrap">
      <table class="admin-table">
        <thead>
          <tr>
            <th>Orden</th>
            <th>Cliente</th>
            <th>Total</th>
            <th>Estado</th>
            <th>Fecha</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="order in recentOrders" :key="order._id">
            <td class="admin-table__order-num">#{{ order.orderNumber || order._id?.slice(-6).toUpperCase() }}</td>
            <td>{{ order.user?.name || order.user?.email || '—' }}</td>
            <td>{{ formatCurrency(order.total) }}</td>
            <td>
              <span :class="['status-badge', `status-badge--${getStatusColor(order.status)}`]">
                {{ order.status || '—' }}
              </span>
            </td>
            <td class="admin-table__date">{{ formatDate(order.createdAt) }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style lang="scss" scoped src="./adminCard.scss"></style>

<style lang="scss" scoped>
@use "sass:color";

.admin-table-wrap {
  overflow-x: auto;
}

.admin-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.875rem;

  thead tr th {
    background-color: $admin-sidebar-active;
    color: $admin-text-muted;
    text-transform: uppercase;
    font-size: 0.75rem;
    letter-spacing: 0.06em;
    font-weight: 600;
    padding: 0.75rem 1rem;
    text-align: left;
    white-space: nowrap;

    &:first-child {
      padding-left: 1.5rem;
    }
  }

  tbody tr {
    border-bottom: 1px solid $admin-border;
    transition: background-color 0.15s ease;

    &:last-child {
      border-bottom: none;
    }

    &:hover {
      background-color: $admin-sidebar-hover;
    }

    td {
      padding: 0.875rem 1rem;
      color: $admin-text;
      white-space: nowrap;

      &:first-child {
        padding-left: 1.5rem;
      }
    }
  }

  &__order-num {
    font-family: monospace;
    font-weight: 600;
    color: $admin-accent !important;
  }

  &__date {
    color: $admin-text-muted !important;
    font-size: 0.8125rem !important;
  }
}

.status-badge {
  display: inline-flex;
  align-items: center;
  padding: 0.2rem 0.6rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: capitalize;

  &--warning {
    background-color: rgba($admin-warning, 0.15);
    color: $admin-warning;
  }

  &--info, &--blue {
    background-color: rgba($admin-info, 0.15);
    color: $admin-info;
  }

  &--success {
    background-color: rgba($admin-success, 0.15);
    color: $admin-success;
  }

  &--error {
    background-color: rgba($admin-error, 0.15);
    color: $admin-error;
  }

  &--purple {
    background-color: rgba(167, 139, 250, 0.15);
    color: #a78bfa;
  }

  &--review {
    background-color: rgba(251, 146, 60, 0.15);
    color: #fb923c;
  }

  &--muted {
    background-color: rgba($admin-text-muted, 0.15);
    color: $admin-text-muted;
  }
}

.skeleton-row {
  height: 48px;
  border-bottom: 1px solid $admin-border;
  background: linear-gradient(90deg, $admin-border 25%, color.adjust(#2A2A2A, $lightness: 5%) 50%, $admin-border 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}

@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}
</style>
