<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import MainLayout from '../layout/MainLayout.vue';
import AdminLayout from '../layout/AdminLayout.vue';
import AdminProfile from '../components/account/profile/AdminProfile.vue';
import CustomerProfile from '../components/account/profile/CustomerProfile.vue';
import { useAuthStore } from '../stores/auth';
import { useUIStore } from '../stores/ui';
import { orderService } from '../services/order.service';
import type { Order } from '../types';

const authStore = useAuthStore();
const uiStore = useUIStore();
const router = useRouter();

const orders = ref<Order[]>([]);
const loadingOrders = ref(false);

const user = computed(() => authStore.user);
const isAdmin = computed(() => user.value?.role === 'admin' || user.value?.role === 'owner');
const isOwner = computed(() => user.value?.role === 'owner');

// Layout switch: admin/owner use AdminLayout, customers use MainLayout
const layoutComponent = computed(() => isAdmin.value ? AdminLayout : MainLayout);

async function loadOrders() {
  loadingOrders.value = true;
  try {
    const response = await orderService.getMyOrders();
    orders.value = response.data;
  } catch { /* silent */ } finally {
    loadingOrders.value = false;
  }
}

function handleLogout() {
  authStore.logout();
  uiStore.showNotification('Sesión cerrada', 'info');
  router.push('/');
}

onMounted(() => { loadOrders(); });
</script>

<template>
  <component :is="layoutComponent" :title="isAdmin ? 'Mi Perfil' : undefined">
    <div :class="isAdmin ? 'admin-profile' : 'profile-page'">
      <div :class="isAdmin ? 'container admin-profile__inner' : 'container'">
        <AdminProfile
          v-if="isAdmin"
          :user="user"
          :is-owner="isOwner"
          :orders="orders"
          :loading-orders="loadingOrders"
          @logout="handleLogout"
        />
        <CustomerProfile
          v-else
          :user="user"
          :orders="orders"
          :loading-orders="loadingOrders"
          @logout="handleLogout"
        />
      </div>
    </div>
  </component>
</template>

<style lang="scss" scoped>
// ══════════════════════════════════════════════════════════
// ADMIN PROFILE STYLES (uses dark AdminLayout)
// ══════════════════════════════════════════════════════════

.admin-profile {
  padding: 2rem 0 4rem;

  &__inner {
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }
}

// ══════════════════════════════════════════════════════════
// CUSTOMER PROFILE STYLES (uses MainLayout)
// ══════════════════════════════════════════════════════════
.profile-page {
  padding: 2rem 0 5rem;
  min-height: 60vh;

  @media (min-width: 768px) {
    padding-top: 3rem;
  }
}
</style>
