<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import MainLayout from '../layout/MainLayout.vue';
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

const statusLabels: Record<string, string> = {
  pending: 'Pendiente',
  confirmed: 'Confirmado',
  processing: 'En proceso',
  shipped: 'Enviado',
  delivered: 'Entregado',
  cancelled: 'Cancelado',
};

const statusColors: Record<string, string> = {
  pending: 'warning',
  confirmed: 'info',
  processing: 'info',
  shipped: 'accent',
  delivered: 'success',
  cancelled: 'error',
};

async function loadOrders() {
  loadingOrders.value = true;
  try {
    const response = await orderService.getMyOrders();
    orders.value = response.data;
  } catch {
    // silent
  } finally {
    loadingOrders.value = false;
  }
}

function handleLogout() {
  authStore.logout();
  uiStore.showNotification('Sesión cerrada', 'info');
  router.push('/');
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' });
}

function formatPrice(val: number) {
  return `$${val.toFixed(2)}`;
}

onMounted(() => {
  loadOrders();
});
</script>

<template>
  <MainLayout>
    <div class="profile-view">
      <div class="container">
        <h1 class="profile-view__title">Mi Perfil</h1>

        <div class="profile-view__layout">
          <!-- User Info -->
          <aside class="profile-sidebar">
            <div class="profile-card">
              <div class="profile-card__avatar" aria-hidden="true">
                {{ user?.name?.charAt(0)?.toUpperCase() || '?' }}
              </div>
              <div class="profile-card__info">
                <h2 class="profile-card__name">{{ user?.name }}</h2>
                <p class="profile-card__email">{{ user?.email }}</p>
                <span v-if="user?.role === 'admin'" class="profile-card__role">Administrador</span>
              </div>
              <button class="profile-card__logout" @click="handleLogout">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/>
                  <polyline points="16 17 21 12 16 7"/>
                  <line x1="21" y1="12" x2="9" y2="12"/>
                </svg>
                Cerrar Sesión
              </button>
            </div>
          </aside>

          <!-- Orders -->
          <div class="profile-orders">
            <h2 class="profile-orders__title">Mis Pedidos</h2>

            <div v-if="loadingOrders" class="profile-orders__loading">
              <div v-for="i in 3" :key="i" class="order-skeleton">
                <div class="order-skeleton__line skeleton" style="width: 40%"></div>
                <div class="order-skeleton__line skeleton" style="width: 25%"></div>
                <div class="order-skeleton__line skeleton" style="width: 60%"></div>
              </div>
            </div>

            <div v-else-if="orders.length === 0" class="profile-orders__empty">
              <div class="profile-orders__empty-icon"><i class="fa-solid fa-box"></i></div>
              <h3>Aún no tienes pedidos</h3>
              <p>Cuando realices tu primer pedido, aparecerá aquí.</p>
              <router-link to="/tienda" class="profile-orders__shop-btn">Explorar Tienda</router-link>
            </div>

            <div v-else class="profile-orders__list">
              <div v-for="order in orders" :key="order._id" class="order-card">
                <div class="order-card__header">
                  <div>
                    <span class="order-card__number">#{{ order.orderNumber }}</span>
                    <span class="order-card__date">{{ formatDate(order.createdAt) }}</span>
                  </div>
                  <span :class="['order-card__status', `order-card__status--${statusColors[order.status] || 'info'}`]">
                    {{ statusLabels[order.status] || order.status }}
                  </span>
                </div>
                <div class="order-card__items">
                  <span v-for="item in order.items" :key="item.product" class="order-card__item">
                    {{ item.name }} × {{ item.quantity }}
                  </span>
                </div>
                <div class="order-card__footer">
                  <span class="order-card__total">Total: <strong>{{ formatPrice(order.total) }}</strong></span>
                  <span class="order-card__address">{{ order.shippingAddress.city }}, {{ order.shippingAddress.country }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </MainLayout>
</template>

<style lang="scss" scoped>
@use '../styles/colorVariables.module.scss' as *;
@use "sass:color";

@keyframes skeleton-pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
}

.profile-view {
  padding: 3rem 0 5rem;

  &__title {
    font-family: var(--font-heading);
    font-size: clamp(1.75rem, 3.5vw, 2.5rem);
    font-weight: 700;
    color: $color-primary;
    margin-bottom: 2.5rem;
  }

  &__layout {
    display: grid;
    grid-template-columns: 280px 1fr;
    gap: 3rem;
    align-items: start;

    @media (max-width: 900px) {
      grid-template-columns: 1fr;
      gap: 2rem;
    }
  }
}

.profile-sidebar {
  position: sticky;
  top: 90px;

  @media (max-width: 900px) { position: static; }
}

.profile-card {
  background-color: $color-bg-card;
  border: 1px solid $color-border;
  border-radius: $radius-lg;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.125rem;
  text-align: center;

  &__avatar {
    width: 72px;
    height: 72px;
    border-radius: 50%;
    background-color: $color-accent;
    color: white;
    font-family: var(--font-heading);
    font-size: 1.75rem;
    font-weight: 700;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &__info { display: flex; flex-direction: column; gap: 0.25rem; }

  &__name {
    font-family: var(--font-heading);
    font-size: 1.125rem;
    font-weight: 700;
    color: $color-primary;
  }

  &__email { font-size: 0.875rem; color: $color-muted; }

  &__role {
    display: inline-block;
    font-size: 0.75rem;
    font-weight: 600;
    color: $color-accent;
    background-color: rgba($color-accent, 0.1);
    padding: 0.2rem 0.625rem;
    border-radius: $radius-full;
    margin-top: 0.25rem;
  }

  &__logout {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.625rem 1.25rem;
    border: 1px solid $color-border;
    border-radius: $radius-sm;
    font-size: 0.875rem;
    color: $color-muted;
    cursor: pointer;
    background: none;
    font-family: var(--font-body);
    transition: all 0.2s ease;
    width: 100%;
    justify-content: center;

    &:hover { border-color: $color-error; color: $color-error; }
  }
}

.profile-orders {
  &__title {
    font-family: var(--font-heading);
    font-size: 1.375rem;
    font-weight: 700;
    color: $color-primary;
    margin-bottom: 1.5rem;
  }

  &__loading { display: flex; flex-direction: column; gap: 1rem; }

  &__empty {
    text-align: center;
    padding: 4rem 2rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.875rem;

    h3 { font-family: var(--font-heading); font-size: 1.25rem; color: $color-primary; }
    p { font-size: 0.9375rem; color: $color-muted; }
  }

  &__empty-icon { font-size: 3rem; opacity: 0.4; }

  &__shop-btn {
    margin-top: 0.5rem;
    padding: 0.75rem 1.75rem;
    background-color: $color-accent;
    color: white;
    border-radius: $radius-md;
    text-decoration: none;
    font-weight: 600;
    transition: background-color 0.2s ease;

    &:hover { background-color: color.adjust($color-accent, $lightness: -8%); }
  }

  &__list { display: flex; flex-direction: column; gap: 1rem; }
}

.order-card {
  background-color: $color-bg-card;
  border: 1px solid $color-border;
  border-radius: $radius-lg;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.875rem;
  transition: box-shadow $transition-smooth;

  &:hover { box-shadow: $shadow-md; }

  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  &__number {
    display: block;
    font-size: 1rem;
    font-weight: 700;
    color: $color-primary;
    font-family: var(--font-heading);
  }

  &__date { font-size: 0.8125rem; color: $color-muted; }

  &__status {
    font-size: 0.8125rem;
    font-weight: 600;
    padding: 0.3rem 0.75rem;
    border-radius: $radius-full;

    &--success { background: rgba($color-success, 0.12); color: $color-success; }
    &--warning { background: rgba($color-warning, 0.15); color: color.adjust($color-warning, $lightness: -20%); }
    &--info { background: rgba(#4299e1, 0.1); color: #2b6cb0; }
    &--accent { background: rgba($color-accent, 0.1); color: $color-accent; }
    &--error { background: rgba($color-error, 0.1); color: $color-error; }
  }

  &__items {
    display: flex;
    flex-wrap: wrap;
    gap: 0.375rem;
  }

  &__item {
    font-size: 0.875rem;
    color: $color-muted;
    background-color: $color-bg-subtle;
    padding: 0.25rem 0.625rem;
    border-radius: $radius-full;
  }

  &__footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-top: 0.75rem;
    border-top: 1px solid $color-border;
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  &__total {
    font-size: 0.9375rem;
    color: $color-muted;

    strong { color: $color-primary; }
  }

  &__address { font-size: 0.875rem; color: $color-muted; }
}

.order-skeleton {
  background-color: $color-bg-card;
  border: 1px solid $color-border;
  border-radius: $radius-lg;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;

  &__line {
    height: 16px;
    border-radius: $radius-sm;
  }
}

.skeleton {
  background-color: $color-border;
  animation: skeleton-pulse 1.5s ease-in-out infinite;
}
</style>
