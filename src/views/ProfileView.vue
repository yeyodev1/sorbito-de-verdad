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
  review:     'En revisión',
  confirmed:  'Confirmado',
  processing: 'En proceso',
  shipped:    'Enviado',
  delivered:  'Entregado',
  cancelled:  'Cancelado',
};

const statusColors: Record<string, string> = {
  pending:    'warning',
  review:     'info',
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
      <div :class="isAdmin ? 'container admin-profile__inner' : 'container'">

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
          <header class="profile-page__header">
            <div class="profile-avatar" aria-hidden="true">
              {{ user?.name?.charAt(0)?.toUpperCase() || '?' }}
            </div>
            <div class="profile-page__header-info">
              <span class="eyebrow">Mi cuenta</span>
              <h1 class="profile-page__name">{{ user?.name }}</h1>
              <p class="profile-page__email">{{ user?.email }}</p>
            </div>
            <button class="btn-outline btn-sm profile-page__logout" @click="handleLogout">
              <i class="fa-solid fa-right-from-bracket"></i>
              <span>Cerrar sesión</span>
            </button>
          </header>

          <div class="profile-page__layout">
            <!-- Orders section -->
            <section class="profile-orders" aria-labelledby="profile-orders-title">
              <div class="profile-orders__head">
                <h2 id="profile-orders-title" class="profile-orders__title">Mis pedidos</h2>
                <span v-if="!loadingOrders && orders.length" class="profile-orders__count">{{ orders.length }}</span>
              </div>

              <div v-if="loadingOrders" class="profile-orders__loading">
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

            <!-- Account / security -->
            <aside class="profile-side">
              <div class="profile-section">
                <button
                  type="button"
                  class="profile-section__header"
                  :aria-expanded="changingPassword"
                  @click="changingPassword = !changingPassword"
                >
                  <span class="profile-section__icon" aria-hidden="true"><i class="fa-solid fa-lock"></i></span>
                  <span class="profile-section__header-text">
                    <span class="profile-section__title">Cambiar contraseña</span>
                    <span class="profile-section__sub">Actualiza tu contraseña de acceso</span>
                  </span>
                  <i :class="['fa-solid fa-chevron-down profile-section__chevron', { 'profile-section__chevron--open': changingPassword }]"></i>
                </button>
                <Transition name="slide-fade">
                  <div v-if="changingPassword" class="profile-section__body">
                    <div v-if="pwdError" class="pwd-alert pwd-alert--error" role="alert">
                      <i class="fa-solid fa-circle-exclamation"></i> {{ pwdError }}
                    </div>
                    <div v-if="pwdSuccess" class="pwd-alert pwd-alert--success" role="status">
                      <i class="fa-solid fa-circle-check"></i> {{ pwdSuccess }}
                    </div>
                    <form class="pwd-form" @submit.prevent="handleChangePassword" novalidate>
                      <div class="field">
                        <label class="field__label" for="pwd-current">Contraseña actual</label>
                        <input id="pwd-current" v-model="pwdForm.current" type="password" class="field__input" placeholder="••••••••" autocomplete="current-password" required />
                      </div>
                      <div class="field">
                        <label class="field__label" for="pwd-new">Nueva contraseña</label>
                        <input id="pwd-new" v-model="pwdForm.new" type="password" class="field__input" placeholder="Mínimo 6 caracteres" autocomplete="new-password" required minlength="6" />
                      </div>
                      <div class="field">
                        <label class="field__label" for="pwd-confirm">Confirmar nueva contraseña</label>
                        <input id="pwd-confirm" v-model="pwdForm.confirm" type="password" class="field__input" placeholder="Repite la nueva contraseña" autocomplete="new-password" required />
                        <span v-if="pwdForm.confirm && pwdForm.new !== pwdForm.confirm" class="pwd-mismatch">
                          <i class="fa-solid fa-triangle-exclamation"></i> Las contraseñas no coinciden
                        </span>
                      </div>
                      <div class="pwd-form__actions">
                        <button type="button" class="btn-ghost btn-sm" @click="changingPassword = false">Cancelar</button>
                        <button type="submit" class="btn-primary btn-sm" :disabled="savingPwd">
                          <i v-if="savingPwd" class="fa-solid fa-circle-notch fa-spin"></i>
                          {{ savingPwd ? 'Guardando...' : 'Actualizar' }}
                        </button>
                      </div>
                    </form>
                  </div>
                </Transition>
              </div>

              <div class="profile-help">
                <p class="profile-help__title">¿Buscas un pedido?</p>
                <p class="profile-help__text">Rastréalo con tu número de pedido o tu correo.</p>
                <RouterLink to="/rastrear" class="btn-outline btn-sm btn-block">
                  <i class="fa-solid fa-truck-fast"></i>
                  Rastrear pedido
                </RouterLink>
              </div>
            </aside>
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
  border-radius: $radius-sm;
  animation: skeleton-pulse 1.5s ease-in-out infinite;
}

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

// Hero card
.ap {
  &__hero {
    display: flex;
    align-items: center;
    gap: 1.25rem;
    background-color: $admin-card;
    border: 1px solid $admin-border;
    border-radius: 16px;
    padding: 2rem 2.5rem;

    @media (max-width: 600px) {
      flex-direction: column;
      align-items: stretch;
      padding: 1.25rem;
      gap: 1rem;
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

    @media (max-width: 600px) {
      width: 52px;
      height: 52px;
      font-size: 1.375rem;
    }
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
    justify-content: center;
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
      width: 100%;
      padding: 0.625rem;
      font-size: 0.9375rem;
    }
  }

  // Sections
  &__section {
    display: flex;
    flex-direction: column;
    gap: 1.25rem;

    &--card {
      background-color: $admin-card;
      border: 1px solid $admin-border;
      border-radius: 16px;
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
    padding-bottom: 0.5rem;
    border-bottom: 1px solid $admin-border;
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
    gap: 1rem;

    @media (max-width: 640px) { grid-template-columns: 1fr; gap: 0.75rem; }
  }

  &__mgmt-card {
    display: flex;
    align-items: center;
    gap: 1.125rem;
    padding: 1.5rem 1.75rem;
    background-color: $admin-card;
    border: 1px solid $admin-border;
    border-radius: 14px;
    text-decoration: none;
    transition: all 0.18s ease;

    @media (max-width: 640px) {
      padding: 1.125rem 1.25rem;
    }

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
    display: grid;
    grid-template-columns: auto 1fr auto auto;
    align-items: center;
    gap: 0.75rem 1rem;
    padding: 0.875rem 1.25rem;
    background-color: $admin-card;
    border: 1px solid $admin-border;
    border-radius: 10px;
    transition: background-color 0.15s ease;

    &:hover { background-color: $admin-sidebar-hover; }

    @media (max-width: 600px) {
      grid-template-columns: 1fr auto;
      grid-template-rows: auto auto;
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

    @media (max-width: 600px) {
      grid-column: 1 / -1;
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

// Password form max-width fix on mobile
.ap__pwd-form {
  max-width: 400px;
  @media (max-width: 600px) { max-width: 100%; }
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

  &__header {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 1rem 1.25rem;
    margin-bottom: 2rem;
    padding-bottom: 2rem;
    border-bottom: 1px solid var(--color-border);
  }

  &__header-info {
    flex: 1;
    min-width: 0;
  }

  &__name {
    margin-top: 0.125rem;
    font-size: clamp(1.75rem, 5vw, 2.5rem);
    word-break: break-word;
  }

  &__email {
    font-size: 0.9375rem;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  &__logout {
    @media (max-width: 559px) {
      width: 100%;
    }
  }

  &__layout {
    display: grid;
    gap: 2rem;
    align-items: start;

    @media (min-width: 960px) {
      grid-template-columns: 1fr 340px;
      gap: 2.5rem;
    }
  }
}

.profile-avatar {
  flex-shrink: 0;
  width: 72px;
  height: 72px;
  display: grid;
  place-items: center;
  font-family: var(--font-heading);
  font-size: 1.875rem;
  font-weight: 600;
  color: var(--color-on-accent);
  background-color: var(--color-accent);
  border-radius: 50%;
  box-shadow: 0 0 0 6px var(--color-accent-light);
}

.profile-side {
  display: flex;
  flex-direction: column;
  gap: 1rem;

  @media (min-width: 960px) {
    position: sticky;
    top: 96px;
  }
}

// Collapsible section (customer)
.profile-section {
  background-color: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: $radius-lg;
  overflow: hidden;

  &__header {
    width: 100%;
    display: flex;
    align-items: center;
    gap: 0.875rem;
    min-height: 64px;
    padding: 1rem 1.25rem;
    text-align: left;
    transition: background-color 0.2s ease;

    &:hover { background-color: var(--color-bg-subtle); }
  }

  &__icon {
    flex-shrink: 0;
    width: 40px;
    height: 40px;
    display: grid;
    place-items: center;
    color: var(--color-accent);
    background-color: var(--color-accent-light);
    border-radius: 50%;
  }

  &__header-text {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
  }

  &__title {
    font-size: 0.9375rem;
    font-weight: 600;
    color: var(--color-primary);
  }

  &__sub {
    font-size: 0.8125rem;
    color: var(--color-muted);
  }

  &__chevron {
    font-size: 0.75rem;
    color: var(--color-muted);
    transition: transform 0.25s ease;

    &--open { transform: rotate(180deg); }
  }

  &__body {
    padding: 0.25rem 1.25rem 1.25rem;
  }
}

// Password form (customer)
.pwd-form {
  display: flex;
  flex-direction: column;
  gap: 0.875rem;

  &__actions {
    display: flex;
    justify-content: flex-end;
    gap: 0.5rem;
    margin-top: 0.25rem;
  }
}

.pwd-alert {
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  margin-bottom: 0.875rem;
  padding: 0.625rem 0.875rem;
  font-size: 0.8125rem;
  font-weight: 500;
  border-radius: $radius-md;

  i { margin-top: 2px; }

  &--error {
    color: var(--color-error);
    background-color: var(--color-error-light);
  }

  &--success {
    color: var(--color-success);
    background-color: var(--color-success-light);
  }
}

.pwd-mismatch {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.75rem;
  color: var(--color-error);
}

.profile-help {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
  padding: 1.25rem;
  background-color: var(--color-bg-subtle);
  border-radius: $radius-lg;

  &__title {
    font-family: var(--font-heading);
    font-size: 1.0625rem;
    font-weight: 600;
    color: var(--color-primary);
  }

  &__text {
    margin-bottom: 0.5rem;
    font-size: 0.875rem;
  }
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
    display: grid;
    place-items: center;
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
    display: grid;
    place-items: center;
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

// Transitions
.slide-fade-enter-active,
.slide-fade-leave-active { transition: opacity 0.2s ease, transform 0.2s ease; }
.slide-fade-enter-from,
.slide-fade-leave-to { opacity: 0; transform: translateY(-6px); }
</style>
