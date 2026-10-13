<script setup lang="ts">
import { ref, onMounted } from 'vue';
import AdminLayout from '../../layout/AdminLayout.vue';
import DashboardStats from '../../components/admin/dashboard/DashboardStats.vue';
import RecentOrdersCard from '../../components/admin/dashboard/RecentOrdersCard.vue';
import QuickActionsCard from '../../components/admin/dashboard/QuickActionsCard.vue';
import { adminService } from '../../services/admin.service';
import type { DashboardStats as Stats, DashboardOrder as Order } from '../../components/admin/dashboard/dashboardUtils';
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
</script>

<template>
  <AdminLayout title="Dashboard">
    <!-- Pending Orders Banner -->
    <div v-if="!loading && (stats.pendingOrders ?? 0) > 0" class="dashboard__alert">
      <i class="fa-solid fa-clock"></i>
      <span><strong>{{ stats.pendingOrders }}</strong> pedido(s) pendiente(s) de pago — requieren seguimiento</span>
      <RouterLink to="/admin/ordenes?filter=pending" class="dashboard__alert-link">
        Revisar <i class="fa-solid fa-arrow-right"></i>
      </RouterLink>
    </div>

    <!-- Stats Grid -->
    <DashboardStats :loading="loading" :stats="stats" />

    <!-- Bottom grid -->
    <div class="dashboard__grid">
      <!-- Recent Orders -->
      <RecentOrdersCard :loading="loading" :recent-orders="recentOrders" />

      <!-- Quick Actions -->
      <QuickActionsCard />
    </div>
  </AdminLayout>
</template>

<style lang="scss" scoped>
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
  &__grid {
    display: flex;
    gap: 1.5rem;
    align-items: stretch;

    > :first-child {
      flex: 1 1 auto;
      min-width: 0;
    }

    > :last-child {
      flex: 0 0 320px;
      min-width: 0;
    }

    @media (max-width: 1100px) {
      flex-direction: column;

      > :last-child { flex-basis: auto; }
    }
  }
}
</style>
