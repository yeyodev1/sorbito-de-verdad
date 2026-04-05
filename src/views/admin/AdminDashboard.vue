<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import AdminLayout from '../../layout/AdminLayout.vue';
import { adminService } from '../../services/admin.service';

const router = useRouter();

interface Stats {
  totalProducts?: number;
  activeProducts?: number;
  totalOrders?: number;
  pendingOrders?: number;
  totalUsers?: number;
  totalRevenue?: number;
}

interface Order {
  _id: string;
  orderNumber?: string;
  user?: { name?: string; email?: string };
  total?: number;
  status?: string;
  createdAt?: string;
}

const stats = ref<Stats>({});
const recentOrders = ref<Order[]>([]);
const loading = ref(true);

onMounted(async () => {
  try {
    const [statsRes, ordersRes] = await Promise.allSettled([
      adminService.getStats(),
      adminService.getOrders({ limit: 5, sort: '-createdAt' }),
    ]);

    if (statsRes.status === 'fulfilled') {
      stats.value = statsRes.value?.data || statsRes.value || {};
    }
    if (ordersRes.status === 'fulfilled') {
      const data = ordersRes.value?.data || ordersRes.value;
      recentOrders.value = Array.isArray(data) ? data.slice(0, 5) : (data?.orders || []).slice(0, 5);
    }
  } finally {
    loading.value = false;
  }
});

function formatCurrency(amount?: number) {
  if (!amount) return '$0.00';
  return new Intl.NumberFormat('es-VE', { style: 'currency', currency: 'USD' }).format(amount);
}

function formatDate(dateStr?: string) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('es-VE', { day: '2-digit', month: 'short', year: 'numeric' });
}

const statusColors: Record<string, string> = {
  pending: 'warning',
  confirmed: 'info',
  processing: 'info',
  shipped: 'purple',
  delivered: 'success',
  cancelled: 'error',
};

function getStatusColor(status?: string) {
  return statusColors[status || ''] || 'muted';
}
</script>

<template>
  <AdminLayout title="Dashboard">
    <!-- Pending Orders Alert -->
    <div v-if="!loading && (stats.pendingOrders ?? 0) > 0" class="dashboard__alert">
      <i class="fa-solid fa-triangle-exclamation"></i>
      <span>Tienes <strong>{{ stats.pendingOrders }}</strong> pedido(s) pendiente(s) por atender</span>
      <RouterLink to="/admin/ordenes" class="dashboard__alert-link">Ver órdenes</RouterLink>
    </div>

    <!-- Stats Grid -->
    <div class="dashboard__stats">
      <!-- Skeleton loading -->
      <template v-if="loading">
        <div v-for="n in 4" :key="n" class="stat-card stat-card--skeleton">
          <div class="skeleton-line"></div>
          <div class="skeleton-line skeleton-line--short"></div>
        </div>
      </template>

      <template v-else>
        <div class="stat-card">
          <div class="stat-card__body">
            <div class="stat-card__info">
              <div class="stat-card__number">{{ stats.activeProducts ?? stats.totalProducts ?? 0 }}</div>
              <div class="stat-card__label">Productos Activos</div>
            </div>
            <div class="stat-card__icon-wrap">
              <i class="fa-solid fa-box stat-card__icon"></i>
            </div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-card__body">
            <div class="stat-card__info">
              <div class="stat-card__number">{{ stats.totalOrders ?? 0 }}</div>
              <div class="stat-card__label">Órdenes Totales</div>
            </div>
            <div class="stat-card__icon-wrap">
              <i class="fa-solid fa-shopping-bag stat-card__icon"></i>
            </div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-card__body">
            <div class="stat-card__info">
              <div class="stat-card__number">{{ stats.totalUsers ?? 0 }}</div>
              <div class="stat-card__label">Usuarios</div>
            </div>
            <div class="stat-card__icon-wrap">
              <i class="fa-solid fa-users stat-card__icon"></i>
            </div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-card__body">
            <div class="stat-card__info">
              <div class="stat-card__number">{{ formatCurrency(stats.totalRevenue) }}</div>
              <div class="stat-card__label">Ingresos Totales</div>
            </div>
            <div class="stat-card__icon-wrap">
              <i class="fa-solid fa-dollar-sign stat-card__icon"></i>
            </div>
          </div>
        </div>
      </template>
    </div>

    <!-- Bottom grid -->
    <div class="dashboard__grid">
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

      <!-- Quick Actions -->
      <div class="admin-card">
        <div class="admin-card__header">
          <h2 class="admin-card__title">Acciones Rápidas</h2>
        </div>
        <div class="quick-actions">
          <button class="quick-action-btn quick-action-btn--primary" @click="router.push('/admin/productos/nuevo')">
            <i class="fa-solid fa-plus"></i>
            <span>Nuevo Producto</span>
          </button>
          <button class="quick-action-btn" @click="router.push('/admin/ordenes')">
            <i class="fa-solid fa-clipboard-list"></i>
            <span>Ver Órdenes</span>
          </button>
          <button class="quick-action-btn" @click="router.push('/admin/categorias')">
            <i class="fa-solid fa-tag"></i>
            <span>Categorías</span>
          </button>
          <a href="/" target="_blank" class="quick-action-btn quick-action-btn--link">
            <i class="fa-solid fa-store"></i>
            <span>Ver Tienda</span>
            <i class="fa-solid fa-arrow-up-right-from-square" style="font-size: 0.75rem; margin-left: auto;"></i>
          </a>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>

<style lang="scss" scoped>
@use '../../styles/colorVariables.module.scss' as *;

.dashboard {
  &__alert {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.875rem 1.25rem;
    background-color: rgba($admin-error, 0.12);
    border: 1px solid rgba($admin-error, 0.3);
    border-radius: 10px;
    color: #fff;
    font-size: 0.9375rem;
    margin-bottom: 1.5rem;

    i {
      color: $admin-error;
      flex-shrink: 0;
    }

    strong {
      color: $admin-error;
    }
  }

  &__alert-link {
    margin-left: auto;
    color: $admin-accent;
    text-decoration: none;
    font-weight: 600;
    font-size: 0.875rem;

    &:hover {
      text-decoration: underline;
    }
  }

  &__stats {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 1rem;
    margin-bottom: 1.5rem;

    @media (max-width: 1200px) {
      grid-template-columns: repeat(2, 1fr);
    }

    @media (max-width: 600px) {
      grid-template-columns: 1fr;
    }
  }

  &__grid {
    display: grid;
    grid-template-columns: 1fr 320px;
    gap: 1.5rem;

    @media (max-width: 1100px) {
      grid-template-columns: 1fr;
    }
  }
}

.stat-card {
  background-color: $admin-card;
  border: 1px solid $admin-border;
  border-radius: 12px;
  padding: 1.5rem;
  transition: border-color 0.2s ease;

  &:hover {
    border-color: rgba($admin-accent, 0.3);
  }

  &--skeleton {
    min-height: 100px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 0.75rem;
  }

  &__body {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
  }

  &__number {
    font-size: 2rem;
    font-weight: 700;
    color: $admin-text;
    line-height: 1;
    margin-bottom: 0.375rem;
    font-family: 'Inter', sans-serif;
  }

  &__label {
    font-size: 0.8125rem;
    color: $admin-text-muted;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    font-weight: 500;
  }

  &__icon-wrap {
    width: 46px;
    height: 46px;
    border-radius: 10px;
    background-color: $admin-accent-dim;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  &__icon {
    font-size: 1.25rem;
    color: $admin-accent;
  }
}

.admin-card {
  background-color: $admin-card;
  border: 1px solid $admin-border;
  border-radius: 12px;
  overflow: hidden;

  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1.25rem 1.5rem;
    border-bottom: 1px solid $admin-border;
  }

  &__title {
    font-size: 1rem;
    font-weight: 600;
    color: $admin-text;
    margin: 0;
  }

  &__link {
    font-size: 0.875rem;
    color: $admin-accent;
    text-decoration: none;
    font-weight: 500;

    &:hover {
      text-decoration: underline;
    }
  }

  &__body {
    padding: 1.25rem 1.5rem;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  &__empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.75rem;
    padding: 2.5rem;
    color: $admin-text-muted;
    font-size: 0.9375rem;

    i {
      font-size: 2rem;
      opacity: 0.5;
    }
  }
}

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

  &--muted {
    background-color: rgba($admin-text-muted, 0.15);
    color: $admin-text-muted;
  }
}

.quick-actions {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 1rem;
}

.quick-action-btn {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.875rem 1rem;
  border-radius: 8px;
  background-color: $admin-sidebar-hover;
  border: 1px solid $admin-border;
  color: $admin-text;
  font-size: 0.9375rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s ease;
  text-decoration: none;
  font-family: 'Inter', sans-serif;
  width: 100%;
  text-align: left;

  i {
    color: $admin-text-muted;
    font-size: 1rem;
    flex-shrink: 0;
  }

  &:hover {
    background-color: $admin-sidebar-active;
    border-color: rgba($admin-accent, 0.3);

    i {
      color: $admin-accent;
    }
  }

  &--primary {
    background-color: $admin-accent;
    border-color: $admin-accent;
    color: #fff;

    i {
      color: #fff;
    }

    &:hover {
      background-color: darken(#C8956C, 8%);
      border-color: darken(#C8956C, 8%);

      i {
        color: #fff;
      }
    }
  }

  &--link {
    color: $admin-text-muted;
  }
}

// Skeletons
.skeleton-line {
  height: 18px;
  background: linear-gradient(90deg, $admin-border 25%, lighten(#2A2A2A, 5%) 50%, $admin-border 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 4px;
  width: 70%;

  &--short {
    width: 40%;
    height: 14px;
  }
}

.skeleton-row {
  height: 48px;
  border-bottom: 1px solid $admin-border;
  background: linear-gradient(90deg, $admin-border 25%, lighten(#2A2A2A, 5%) 50%, $admin-border 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}

@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}
</style>
