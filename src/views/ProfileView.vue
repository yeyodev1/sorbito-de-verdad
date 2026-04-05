<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter, RouterLink } from 'vue-router';
import MainLayout from '../layout/MainLayout.vue';
import AdminLayout from '../layout/AdminLayout.vue';
import { useAuthStore } from '../stores/auth';
import { useUIStore } from '../stores/ui';
import { orderService } from '../services/order.service';
import { authService } from '../services/auth.service';
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

const adminLinks = [
  { to: '/admin',            icon: 'fa-solid fa-gauge-high',  label: 'Dashboard',        desc: 'Resumen general y métricas', color: '#C8956C' },
  { to: '/admin/productos',  icon: 'fa-solid fa-mug-hot',     label: 'Gestión de Tazas', desc: 'Subir, editar y eliminar productos', color: '#C8956C' },
  { to: '/admin/categorias', icon: 'fa-solid fa-tags',        label: 'Categorías',       desc: 'Organizar las colecciones', color: '#3B82F6' },
  { to: '/admin/ordenes',    icon: 'fa-solid fa-box',         label: 'Pedidos',          desc: 'Ver y gestionar todas las órdenes', color: '#10B981' },
];
const ownerLinks = [
  { to: '/admin/usuarios',   icon: 'fa-solid fa-users',       label: 'Usuarios',         desc: 'Gestión completa de cuentas', color: '#F59E0B' },
];

const allAdminLinks = computed(() => [...adminLinks, ...(isOwner.value ? ownerLinks : [])]);

const statusLabels: Record<string, string> = {
  pending:    'Pendiente',
  confirmed:  'Confirmado',
  processing: 'En proceso',
  shipped:    'Enviado',
  delivered:  'Entregado',
  cancelled:  'Cancelado',
};

const statusColors: Record<string, string> = {
  pending:    'warning',
  confirmed:  'info',
  processing: 'info',
  shipped:    'accent',
  delivered:  'success',
  cancelled:  'error',
};

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

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' });
}
function formatPrice(val: number) {
  return `$${val.toFixed(2)}`;
}

// ── Change password ──────────────────────────────────────
const changingPassword = ref(false);
const pwdForm = ref({ current: '', new: '', confirm: '' });
const pwdError = ref('');
const pwdSuccess = ref('');
const savingPwd = ref(false);

async function handleChangePassword() {
  pwdError.value = '';
  pwdSuccess.value = '';
  if (!pwdForm.value.current || !pwdForm.value.new) {
    pwdError.value = 'Completa todos los campos.';
    return;
  }
  if (pwdForm.value.new.length < 6) {
    pwdError.value = 'La nueva contraseña debe tener al menos 6 caracteres.';
    return;
  }
  if (pwdForm.value.new !== pwdForm.value.confirm) {
    pwdError.value = 'Las contraseñas no coinciden.';
    return;
  }
  savingPwd.value = true;
  try {
    await authService.changePassword(pwdForm.value.current, pwdForm.value.new);
    pwdSuccess.value = 'Contraseña actualizada correctamente.';
    pwdForm.value = { current: '', new: '', confirm: '' };
    setTimeout(() => { pwdSuccess.value = ''; changingPassword.value = false; }, 2500);
  } catch (err: unknown) {
    pwdError.value = (err as { message?: string })?.message || 'Error al cambiar la contraseña.';
  } finally {
    savingPwd.value = false;
  }
}

onMounted(() => { loadOrders(); });
</script>

<template>
  <component :is="layoutComponent" :title="isAdmin ? 'Mi Perfil' : undefined">
    <div :class="isAdmin ? 'admin-profile' : 'profile-page'">
      <div :class="isAdmin ? '' : 'container'">

        <!-- ══════════════════════════════════════════════
             ADMIN / OWNER PROFILE VIEW
        ══════════════════════════════════════════════ -->
        <template v-if="isAdmin">

          <!-- Admin profile header card -->
          <div class="ap__hero">
            <div class="ap__hero-avatar">
              {{ user?.name?.charAt(0)?.toUpperCase() || '?' }}
            </div>
            <div class="ap__hero-info">
              <div class="ap__hero-name-row">
                <h1 class="ap__hero-name">{{ user?.name }}</h1>
                <span :class="['ap__hero-badge', isOwner ? 'ap__hero-badge--owner' : 'ap__hero-badge--admin']">
                  <i :class="isOwner ? 'fa-solid fa-crown' : 'fa-solid fa-shield-halved'"></i>
                  {{ isOwner ? 'Owner' : 'Admin' }}
                </span>
              </div>
              <p class="ap__hero-email">
                <i class="fa-solid fa-envelope"></i>
                {{ user?.email }}
              </p>
            </div>
            <button class="ap__logout-btn" @click="handleLogout" title="Cerrar sesión">
              <i class="fa-solid fa-right-from-bracket"></i>
              <span>Cerrar sesión</span>
            </button>
          </div>

          <!-- Management quick-access grid -->
          <div class="ap__section">
            <div class="ap__section-header">
              <h2 class="ap__section-title">
                <i class="fa-solid fa-sliders"></i>
                Gestión Rápida
              </h2>
              <span class="ap__section-sub">Accede directamente a cada módulo</span>
            </div>

            <div class="ap__mgmt-grid">
              <RouterLink
                v-for="link in allAdminLinks"
                :key="link.to"
                :to="link.to"
                class="ap__mgmt-card"
              >
                <div class="ap__mgmt-icon" :style="{ backgroundColor: `${link.color}18`, color: link.color }">
                  <i :class="link.icon"></i>
                </div>
                <div class="ap__mgmt-info">
                  <span class="ap__mgmt-label">{{ link.label }}</span>
                  <span class="ap__mgmt-desc">{{ link.desc }}</span>
                </div>
                <div class="ap__mgmt-action">
                  <span class="ap__mgmt-go">Ir →</span>
                </div>
              </RouterLink>
            </div>
          </div>

          <!-- Change password (collapsible) -->
          <div class="ap__section ap__section--card">
            <div class="ap__collapse-header" @click="changingPassword = !changingPassword">
              <div class="ap__collapse-left">
                <div class="ap__collapse-icon"><i class="fa-solid fa-lock"></i></div>
                <div>
                  <h3 class="ap__collapse-title">Cambiar Contraseña</h3>
                  <p class="ap__collapse-sub">Actualiza tu contraseña de acceso</p>
                </div>
              </div>
              <i :class="['fa-solid ap__collapse-chevron', changingPassword ? 'fa-chevron-up' : 'fa-chevron-down']"></i>
            </div>

            <Transition name="slide-fade">
              <div v-if="changingPassword" class="ap__pwd-body">
                <div v-if="pwdError" class="ap__pwd-alert ap__pwd-alert--error">
                  <i class="fa-solid fa-circle-xmark"></i> {{ pwdError }}
                </div>
                <div v-if="pwdSuccess" class="ap__pwd-alert ap__pwd-alert--success">
                  <i class="fa-solid fa-circle-check"></i> {{ pwdSuccess }}
                </div>
                <form class="ap__pwd-form" @submit.prevent="handleChangePassword" novalidate>
                  <div class="ap__pwd-field">
                    <label class="ap__pwd-label">Contraseña actual</label>
                    <input v-model="pwdForm.current" type="password" class="ap__pwd-input" placeholder="••••••••" autocomplete="current-password" required />
                  </div>
                  <div class="ap__pwd-field">
                    <label class="ap__pwd-label">Nueva contraseña</label>
                    <input v-model="pwdForm.new" type="password" class="ap__pwd-input" placeholder="Mínimo 6 caracteres" autocomplete="new-password" required minlength="6" />
                  </div>
                  <div class="ap__pwd-field">
                    <label class="ap__pwd-label">Confirmar nueva contraseña</label>
                    <input v-model="pwdForm.confirm" type="password" class="ap__pwd-input" placeholder="Repite la nueva contraseña" autocomplete="new-password" required />
                    <span v-if="pwdForm.confirm && pwdForm.new !== pwdForm.confirm" class="ap__pwd-mismatch">
                      <i class="fa-solid fa-triangle-exclamation"></i> Las contraseñas no coinciden
                    </span>
                  </div>
                  <div class="ap__pwd-actions">
                    <button type="button" class="ap__pwd-cancel" @click="changingPassword = false">Cancelar</button>
                    <button type="submit" class="ap__pwd-save" :disabled="savingPwd">
                      <i v-if="savingPwd" class="fa-solid fa-circle-notch fa-spin"></i>
                      <i v-else class="fa-solid fa-floppy-disk"></i>
                      {{ savingPwd ? 'Guardando...' : 'Actualizar contraseña' }}
                    </button>
                  </div>
                </form>
              </div>
            </Transition>
          </div>

          <!-- Admin recent orders preview -->
          <div class="ap__section">
            <div class="ap__section-header">
              <h2 class="ap__section-title">
                <i class="fa-solid fa-box-open"></i>
                Mis Pedidos Personales
              </h2>
              <RouterLink to="/admin/ordenes" class="ap__section-link">
                Ver todos los pedidos →
              </RouterLink>
            </div>
            <div v-if="loadingOrders" class="ap__orders-loading">
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
          </div>

        </template>

        <!-- ══════════════════════════════════════════════
             CUSTOMER PROFILE VIEW
        ══════════════════════════════════════════════ -->
        <template v-else>

          <!-- Profile header -->
          <div class="profile-page__header">
            <div class="profile-avatar">
              {{ user?.name?.charAt(0)?.toUpperCase() || '?' }}
            </div>
            <div class="profile-page__header-info">
              <div class="profile-page__header-top">
                <h1 class="profile-page__name">{{ user?.name }}</h1>
                <span class="profile-page__role-badge">
                  <i class="fa-solid fa-user"></i>
                  Cliente
                </span>
              </div>
              <p class="profile-page__email">{{ user?.email }}</p>
            </div>
            <button class="profile-page__logout" @click="handleLogout">
              <i class="fa-solid fa-right-from-bracket"></i>
              <span>Cerrar sesión</span>
            </button>
          </div>

          <!-- Change password collapsible -->
          <div class="profile-section">
            <div class="profile-section__header" @click="changingPassword = !changingPassword">
              <div class="profile-section__header-left">
                <div class="profile-section__icon"><i class="fa-solid fa-lock"></i></div>
                <div>
                  <h2 class="profile-section__title">Cambiar Contraseña</h2>
                  <p class="profile-section__sub">Actualiza tu contraseña de acceso</p>
                </div>
              </div>
              <i :class="['fa-solid profile-section__chevron', changingPassword ? 'fa-chevron-up' : 'fa-chevron-down']"></i>
            </div>
            <Transition name="slide-fade">
              <div v-if="changingPassword" class="profile-section__body">
                <div v-if="pwdError" class="pwd-alert pwd-alert--error">
                  <i class="fa-solid fa-circle-xmark"></i> {{ pwdError }}
                </div>
                <div v-if="pwdSuccess" class="pwd-alert pwd-alert--success">
                  <i class="fa-solid fa-circle-check"></i> {{ pwdSuccess }}
                </div>
                <form class="pwd-form" @submit.prevent="handleChangePassword" novalidate>
                  <div class="pwd-field">
                    <label class="pwd-label">Contraseña actual</label>
                    <input v-model="pwdForm.current" type="password" class="pwd-input" placeholder="••••••••" autocomplete="current-password" required />
                  </div>
                  <div class="pwd-field">
                    <label class="pwd-label">Nueva contraseña</label>
                    <input v-model="pwdForm.new" type="password" class="pwd-input" placeholder="Mínimo 6 caracteres" autocomplete="new-password" required minlength="6" />
                  </div>
                  <div class="pwd-field">
                    <label class="pwd-label">Confirmar nueva contraseña</label>
                    <input v-model="pwdForm.confirm" type="password" class="pwd-input" placeholder="Repite la nueva contraseña" autocomplete="new-password" required />
                    <span v-if="pwdForm.confirm && pwdForm.new !== pwdForm.confirm" class="pwd-mismatch">
                      <i class="fa-solid fa-triangle-exclamation"></i> Las contraseñas no coinciden
                    </span>
                  </div>
                  <div class="pwd-form__actions">
                    <button type="button" class="pwd-btn pwd-btn--cancel" @click="changingPassword = false">Cancelar</button>
                    <button type="submit" class="pwd-btn pwd-btn--save" :disabled="savingPwd">
                      <i v-if="savingPwd" class="fa-solid fa-circle-notch fa-spin"></i>
                      <i v-else class="fa-solid fa-floppy-disk"></i>
                      {{ savingPwd ? 'Guardando...' : 'Actualizar contraseña' }}
                    </button>
                  </div>
                </form>
              </div>
            </Transition>
          </div>

          <!-- Orders section -->
          <div class="profile-orders">
            <h2 class="profile-orders__title">
              <i class="fa-solid fa-box-open"></i>
              Mis Pedidos
            </h2>

            <div v-if="loadingOrders" class="profile-orders__loading">
              <div v-for="i in 3" :key="i" class="order-skeleton">
                <div class="skeleton" style="height:20px; width:40%; border-radius:6px; margin-bottom:8px;"></div>
                <div class="skeleton" style="height:16px; width:60%; border-radius:6px;"></div>
              </div>
            </div>

            <div v-else-if="orders.length === 0" class="profile-orders__empty">
              <i class="fa-solid fa-bag-shopping profile-orders__empty-icon"></i>
              <h3>Aún no tienes pedidos</h3>
              <p>Cuando realices tu primer pedido, aparecerá aquí.</p>
              <RouterLink to="/tienda" class="profile-orders__shop-btn">Explorar Tienda</RouterLink>
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

        </template>

      </div>
    </div>
  </component>
</template>

<style lang="scss" scoped>
@use "sass:color";

@keyframes skeleton-pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
}

.skeleton {
  background-color: var(--color-border);
  animation: skeleton-pulse 1.5s ease-in-out infinite;
}

// ══════════════════════════════════════════════════════════
// ADMIN PROFILE STYLES (uses dark AdminLayout)
// ══════════════════════════════════════════════════════════

.admin-profile {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

// Hero card
.ap {
  &__hero {
    display: flex;
    align-items: center;
    gap: 1.25rem;
    background-color: $admin-card;
    border: 1px solid $admin-border;
    border-radius: 14px;
    padding: 1.75rem 2rem;

    @media (max-width: 600px) {
      flex-wrap: wrap;
      padding: 1.25rem;
    }
  }

  &__hero-avatar {
    width: 64px;
    height: 64px;
    border-radius: 50%;
    background-color: $admin-accent;
    color: #fff;
    font-size: 1.625rem;
    font-weight: 700;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    box-shadow: 0 4px 14px rgba($admin-accent, 0.35);
  }

  &__hero-info {
    flex: 1;
    min-width: 0;
  }

  &__hero-name-row {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    flex-wrap: wrap;
    margin-bottom: 0.375rem;
  }

  &__hero-name {
    font-size: 1.375rem;
    font-weight: 700;
    color: $admin-text;
    margin: 0;
  }

  &__hero-badge {
    display: inline-flex;
    align-items: center;
    gap: 0.375rem;
    font-size: 0.6875rem;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    padding: 0.25rem 0.625rem;
    border-radius: 4px;

    i { font-size: 0.625rem; }

    &--owner {
      background-color: rgba(#F59E0B, 0.15);
      color: #F59E0B;
      border: 1px solid rgba(#F59E0B, 0.3);
    }

    &--admin {
      background-color: rgba($admin-accent, 0.15);
      color: $admin-accent;
      border: 1px solid rgba($admin-accent, 0.3);
    }
  }

  &__hero-email {
    font-size: 0.875rem;
    color: $admin-text-muted;
    margin: 0;
    display: flex;
    align-items: center;
    gap: 0.4rem;

    i { font-size: 0.75rem; }
  }

  &__logout-btn {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    border: 1px solid $admin-border;
    border-radius: 8px;
    font-size: 0.875rem;
    color: $admin-text-muted;
    cursor: pointer;
    background: none;
    font-family: 'Inter', sans-serif;
    transition: all 0.15s ease;
    flex-shrink: 0;

    &:hover {
      border-color: $admin-error;
      color: $admin-error;
    }

    @media (max-width: 600px) {
      span { display: none; }
    }
  }

  // Sections
  &__section {
    display: flex;
    flex-direction: column;
    gap: 1rem;

    &--card {
      background-color: $admin-card;
      border: 1px solid $admin-border;
      border-radius: 14px;
      overflow: hidden;
      gap: 0;
    }
  }

  &__section-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin-bottom: 0.25rem;
  }

  &__section-title {
    font-size: 1rem;
    font-weight: 700;
    color: $admin-text;
    margin: 0;
    display: flex;
    align-items: center;
    gap: 0.5rem;

    i { color: $admin-accent; font-size: 0.9375rem; }
  }

  &__section-sub {
    font-size: 0.8125rem;
    color: $admin-text-muted;
    margin: 0;
  }

  &__section-link {
    font-size: 0.8125rem;
    color: $admin-accent;
    text-decoration: none;
    transition: opacity 0.15s ease;

    &:hover { opacity: 0.75; }
  }

  // Management grid
  &__mgmt-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 0.875rem;

    @media (max-width: 640px) { grid-template-columns: 1fr; }
  }

  &__mgmt-card {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1.25rem 1.375rem;
    background-color: $admin-card;
    border: 1px solid $admin-border;
    border-radius: 12px;
    text-decoration: none;
    transition: all 0.15s ease;

    &:hover {
      border-color: $admin-accent;
      background-color: $admin-sidebar-hover;
      transform: translateY(-2px);
      box-shadow: 0 4px 16px rgba(0,0,0,0.15);

      .ap__mgmt-go { opacity: 1; color: $admin-accent; }
    }
  }

  &__mgmt-icon {
    width: 44px;
    height: 44px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.125rem;
    flex-shrink: 0;
    transition: all 0.15s ease;
  }

  &__mgmt-info {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 0.125rem;
  }

  &__mgmt-label {
    font-size: 0.9375rem;
    font-weight: 600;
    color: $admin-text;
    line-height: 1.2;
  }

  &__mgmt-desc {
    font-size: 0.8125rem;
    color: $admin-text-muted;
    line-height: 1.3;
  }

  &__mgmt-action {
    flex-shrink: 0;
  }

  &__mgmt-go {
    font-size: 0.875rem;
    font-weight: 600;
    color: $admin-text-muted;
    opacity: 0.5;
    transition: all 0.15s ease;
    white-space: nowrap;
  }

  // Collapsible
  &__collapse-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1.25rem 1.5rem;
    cursor: pointer;
    transition: background-color 0.15s ease;
    user-select: none;

    &:hover { background-color: $admin-sidebar-hover; }
  }

  &__collapse-left {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  &__collapse-icon {
    width: 38px;
    height: 38px;
    border-radius: 8px;
    background-color: rgba($admin-accent, 0.12);
    color: $admin-accent;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.9375rem;
    flex-shrink: 0;
  }

  &__collapse-title {
    font-size: 0.9375rem;
    font-weight: 600;
    color: $admin-text;
    margin: 0 0 0.125rem;
  }

  &__collapse-sub {
    font-size: 0.8125rem;
    color: $admin-text-muted;
    margin: 0;
  }

  &__collapse-chevron {
    font-size: 0.875rem;
    color: $admin-text-muted;
    transition: transform 0.2s ease;
  }

  // Password form inside card
  &__pwd-body {
    padding: 1.25rem 1.5rem 1.5rem;
    border-top: 1px solid $admin-border;
  }

  &__pwd-alert {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1rem;
    border-radius: 8px;
    font-size: 0.875rem;
    margin-bottom: 0.875rem;

    &--error {
      background-color: rgba($admin-error, 0.1);
      border: 1px solid rgba($admin-error, 0.25);
      color: $admin-error;
    }
    &--success {
      background-color: rgba($admin-success, 0.1);
      border: 1px solid rgba($admin-success, 0.25);
      color: $admin-success;
    }
  }

  &__pwd-form {
    display: flex;
    flex-direction: column;
    gap: 0.875rem;
    max-width: 400px;
  }

  &__pwd-field {
    display: flex;
    flex-direction: column;
    gap: 0.35rem;
  }

  &__pwd-label {
    font-size: 0.8125rem;
    font-weight: 500;
    color: $admin-text-muted;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  &__pwd-input {
    padding: 0.625rem 0.875rem;
    background-color: $admin-sidebar-active;
    border: 1px solid $admin-border;
    border-radius: 8px;
    color: $admin-text;
    font-size: 0.9375rem;
    font-family: 'Inter', sans-serif;
    width: 100%;
    box-sizing: border-box;
    transition: border-color 0.15s ease, box-shadow 0.15s ease;

    &:focus {
      outline: none;
      border-color: $admin-accent;
      box-shadow: 0 0 0 3px rgba($admin-accent, 0.12);
    }

    &::placeholder { color: #555; }
  }

  &__pwd-mismatch {
    font-size: 0.8125rem;
    color: $admin-error;
    display: flex;
    align-items: center;
    gap: 0.25rem;
  }

  &__pwd-actions {
    display: flex;
    gap: 0.75rem;
    margin-top: 0.25rem;
  }

  &__pwd-cancel {
    padding: 0.625rem 1.125rem;
    background: none;
    border: 1px solid $admin-border;
    border-radius: 8px;
    color: $admin-text-muted;
    font-size: 0.9375rem;
    cursor: pointer;
    font-family: 'Inter', sans-serif;
    transition: all 0.15s ease;

    &:hover { border-color: $admin-text; color: $admin-text; }
  }

  &__pwd-save {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.625rem 1.25rem;
    background-color: $admin-accent;
    color: #fff;
    border: none;
    border-radius: 8px;
    font-size: 0.9375rem;
    font-weight: 600;
    cursor: pointer;
    font-family: 'Inter', sans-serif;
    transition: all 0.15s ease;

    &:hover:not(:disabled) { filter: brightness(1.08); }
    &:disabled { opacity: 0.6; cursor: not-allowed; }
  }

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
    align-items: center;
    gap: 1rem;
    padding: 0.875rem 1.25rem;
    background-color: $admin-card;
    border: 1px solid $admin-border;
    border-radius: 10px;
    transition: background-color 0.15s ease;

    &:hover { background-color: $admin-sidebar-hover; }

    @media (max-width: 600px) { flex-wrap: wrap; }
  }

  &__order-num {
    font-size: 0.9375rem;
    font-weight: 700;
    color: $admin-text;
    font-family: monospace;
    flex-shrink: 0;
  }

  &__order-date {
    font-size: 0.8125rem;
    color: $admin-text-muted;
    flex: 1;
  }

  &__order-status {
    font-size: 0.75rem;
    font-weight: 600;
    padding: 0.25rem 0.625rem;
    border-radius: 4px;
    flex-shrink: 0;

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
    flex-shrink: 0;
  }
}

// ══════════════════════════════════════════════════════════
// CUSTOMER PROFILE STYLES (uses MainLayout)
// ══════════════════════════════════════════════════════════
.profile-page {
  padding: 3rem 0 5rem;
  background-color: var(--color-bg);
  min-height: calc(100vh - 70px);

  &__header {
    display: flex;
    align-items: center;
    gap: 1.25rem;
    margin-bottom: 2.5rem;
    padding-bottom: 2rem;
    border-bottom: 1px solid var(--color-border);

    @media (max-width: 600px) { flex-wrap: wrap; }
  }

  &__header-info { flex: 1; min-width: 0; }

  &__header-top {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    flex-wrap: wrap;
  }

  &__name {
    font-family: var(--font-heading);
    font-size: clamp(1.375rem, 3vw, 2rem);
    font-weight: 700;
    color: var(--color-primary);
    margin: 0;
  }

  &__email {
    font-size: 0.9375rem;
    color: var(--color-muted);
    margin: 0.25rem 0 0;
  }

  &__role-badge {
    display: inline-flex;
    align-items: center;
    gap: 0.375rem;
    font-size: 0.75rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    padding: 0.3rem 0.75rem;
    border-radius: $radius-full;
    background-color: rgba($color-accent, 0.1);
    color: $color-accent;
    border: 1px solid rgba($color-accent, 0.25);

    i { font-size: 0.7rem; }
  }

  &__logout {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.6rem 1.125rem;
    border: 1px solid var(--color-border);
    border-radius: $radius-sm;
    font-size: 0.875rem;
    color: var(--color-muted);
    cursor: pointer;
    background: none;
    font-family: var(--font-body);
    transition: all 0.2s ease;
    white-space: nowrap;
    flex-shrink: 0;

    &:hover { border-color: var(--color-error); color: var(--color-error); }

    @media (max-width: 600px) {
      span { display: none; }
      padding: 0.6rem;
    }
  }
}

.profile-avatar {
  width: 68px;
  height: 68px;
  border-radius: 50%;
  background-color: $color-accent;
  color: white;
  font-family: var(--font-heading);
  font-size: 1.75rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-shadow: 0 4px 14px rgba($color-accent, 0.35);
}

// Collapsible section (customer)
.profile-section {
  background-color: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: $radius-xl;
  margin-bottom: 1.5rem;
  overflow: hidden;

  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1.375rem 1.75rem;
    cursor: pointer;
    transition: background-color 0.2s ease;
    user-select: none;

    &:hover { background-color: var(--color-bg-subtle); }
  }

  &__header-left {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  &__icon {
    width: 42px;
    height: 42px;
    border-radius: $radius-sm;
    background-color: rgba($color-accent, 0.1);
    color: $color-accent;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1rem;
    flex-shrink: 0;
  }

  &__title {
    font-size: 1rem;
    font-weight: 700;
    color: var(--color-primary);
    margin: 0 0 0.125rem;
    font-family: var(--font-heading);
  }

  &__sub {
    font-size: 0.8125rem;
    color: var(--color-muted);
    margin: 0;
  }

  &__chevron {
    font-size: 0.875rem;
    color: var(--color-muted);
    transition: transform 0.2s ease;
  }

  &__body {
    padding: 1.5rem 1.75rem;
    border-top: 1px solid var(--color-border);
  }
}

// Password form (customer)
.pwd-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-width: 420px;

  &__actions {
    display: flex;
    gap: 0.75rem;
    margin-top: 0.25rem;

    @media (max-width: 480px) { flex-direction: column; }
  }
}

.pwd-alert {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  border-radius: $radius-sm;
  font-size: 0.875rem;
  margin-bottom: 0.5rem;

  &--error {
    background-color: rgba(var(--color-error), 0.08);
    border: 1px solid rgba(var(--color-error), 0.25);
    color: var(--color-error);
  }

  &--success {
    background-color: rgba(var(--color-success), 0.08);
    border: 1px solid rgba(var(--color-success), 0.25);
    color: var(--color-success);
  }
}

.pwd-field {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
}

.pwd-label {
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--color-primary);
}

.pwd-mismatch {
  font-size: 0.8125rem;
  color: var(--color-error);
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.pwd-input {
  padding: 0.7rem 0.875rem;
  border: 1px solid var(--color-border);
  border-radius: $radius-sm;
  font-size: 0.9375rem;
  color: var(--color-primary);
  background-color: var(--color-bg);
  font-family: var(--font-body);
  width: 100%;
  box-sizing: border-box;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;

  &:focus {
    outline: none;
    border-color: $color-accent;
    box-shadow: 0 0 0 3px rgba($color-accent, 0.1);
  }

  &::placeholder { color: var(--color-muted); opacity: 0.7; }
}

.pwd-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.625rem 1.25rem;
  border-radius: $radius-sm;
  font-size: 0.9375rem;
  font-weight: 600;
  cursor: pointer;
  font-family: var(--font-body);
  transition: all 0.2s ease;
  border: none;

  &--save {
    background-color: $color-accent;
    color: white;

    &:hover:not(:disabled) { filter: brightness(1.08); }
    &:disabled { opacity: 0.6; cursor: not-allowed; }
  }

  &--cancel {
    background-color: transparent;
    border: 1px solid var(--color-border);
    color: var(--color-muted);

    &:hover { border-color: var(--color-primary); color: var(--color-primary); }
  }
}

// Orders
.profile-orders {
  &__title {
    display: flex;
    align-items: center;
    gap: 0.625rem;
    font-family: var(--font-heading);
    font-size: 1.375rem;
    font-weight: 700;
    color: var(--color-primary);
    margin-bottom: 1.5rem;

    i { color: $color-accent; font-size: 1.125rem; }
  }

  &__loading { display: flex; flex-direction: column; gap: 1rem; }

  &__empty {
    text-align: center;
    padding: 4rem 2rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.875rem;
    background-color: var(--color-bg-card);
    border: 1px solid var(--color-border);
    border-radius: $radius-xl;

    h3 { font-family: var(--font-heading); font-size: 1.25rem; color: var(--color-primary); margin: 0; }
    p  { font-size: 0.9375rem; color: var(--color-muted); margin: 0; }
  }

  &__empty-icon {
    font-size: 3rem;
    color: var(--color-border);
    margin-bottom: 0.5rem;
  }

  &__shop-btn {
    margin-top: 0.5rem;
    padding: 0.75rem 1.75rem;
    background-color: $color-accent;
    color: white;
    border-radius: $radius-md;
    text-decoration: none;
    font-weight: 600;
    font-size: 0.9375rem;
    transition: filter 0.2s ease, transform 0.2s ease;

    &:hover { filter: brightness(1.1); transform: translateY(-1px); }
  }

  &__list { display: flex; flex-direction: column; gap: 1rem; }
}

.order-card {
  background-color: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: $radius-lg;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.875rem;
  transition: box-shadow 0.3s ease;

  &:hover { box-shadow: 0 4px 12px rgba(0,0,0,0.08); }

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
    color: var(--color-primary);
    font-family: var(--font-heading);
  }

  &__date { font-size: 0.8125rem; color: var(--color-muted); }

  &__status {
    font-size: 0.8125rem;
    font-weight: 600;
    padding: 0.3rem 0.75rem;
    border-radius: $radius-full;

    &--success { background: rgba(var(--color-success), 0.12); color: var(--color-success); }
    &--error   { background: rgba(var(--color-error), 0.12);   color: var(--color-error); }
    &--warning { background: rgba(var(--color-warning), 0.12); color: var(--color-warning); }
    &--info    { background: rgba(#3B82F6, 0.12);        color: #3B82F6; }
    &--accent  { background: rgba($color-accent, 0.12);  color: $color-accent; }
  }

  &__items {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  &__item {
    font-size: 0.875rem;
    color: var(--color-muted);
    background-color: var(--color-bg-subtle);
    padding: 0.25rem 0.625rem;
    border-radius: $radius-sm;
  }

  &__footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 0.5rem;
    padding-top: 0.75rem;
    border-top: 1px solid var(--color-border);
  }

  &__total {
    font-size: 0.9375rem;
    color: var(--color-muted);

    strong { color: var(--color-primary); font-weight: 700; }
  }

  &__address { font-size: 0.8125rem; color: var(--color-muted); }
}

// Transitions
.slide-fade-enter-active,
.slide-fade-leave-active { transition: opacity 0.2s ease, transform 0.2s ease; }
.slide-fade-enter-from,
.slide-fade-leave-to { opacity: 0; transform: translateY(-6px); }
</style>
