<script setup lang="ts">
import { ref, computed } from 'vue';
import { RouterLink, useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';

const props = defineProps<{ title?: string }>();

const authStore = useAuthStore();
const route = useRoute();
const router = useRouter();

const sidebarOpen = ref(false);

const pageTitle = computed(() => props.title || (route.meta?.title as string) || 'Admin');

const userInitials = computed(() => {
  const name = authStore.user?.name || '';
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
});

const userRole = computed(() => authStore.user?.role?.toUpperCase() || '');

const navItems = computed(() => {
  const items = [
    { to: '/admin', name: 'AdminDashboard', icon: 'fa-chart-line', label: 'Dashboard' },
    { to: '/admin/productos', name: 'AdminProducts', icon: 'fa-box', label: 'Productos' },
    { to: '/admin/categorias', name: 'AdminCategories', icon: 'fa-tag', label: 'Categorías' },
    { to: '/admin/ordenes', name: 'AdminOrders', icon: 'fa-clipboard-list', label: 'Órdenes' },
  ];
  if (authStore.isOwner) {
    items.push({ to: '/admin/usuarios', name: 'AdminUsers', icon: 'fa-users', label: 'Usuarios' });
  }
  return items;
});

function isActive(item: { to: string; name: string }) {
  if (item.to === '/admin') return route.path === '/admin';
  return route.path.startsWith(item.to);
}

function closeSidebar() {
  sidebarOpen.value = false;
}

function handleLogout() {
  authStore.logout();
  router.push('/login');
}
</script>

<template>
  <div class="admin-layout">
    <!-- Overlay (mobile) -->
    <Transition name="fade">
      <div v-if="sidebarOpen" class="admin-layout__overlay" @click="closeSidebar" />
    </Transition>

    <!-- Sidebar -->
    <aside :class="['admin-layout__sidebar', { 'admin-layout__sidebar--open': sidebarOpen }]">
      <!-- Logo -->
      <div class="admin-sidebar__logo">
        <i class="fa-solid fa-mug-hot admin-sidebar__logo-icon"></i>
        <div class="admin-sidebar__logo-text">
          <span class="admin-sidebar__logo-name">Sorbito</span>
          <span class="admin-sidebar__logo-sub">Admin Panel</span>
        </div>
      </div>

      <div class="admin-sidebar__divider"></div>

      <!-- Nav -->
      <nav class="admin-sidebar__nav">
        <RouterLink
          v-for="item in navItems"
          :key="item.to"
          :to="item.to"
          :class="['admin-sidebar__nav-item', { 'admin-sidebar__nav-item--active': isActive(item) }]"
          @click="closeSidebar"
        >
          <i :class="['fa-solid', item.icon, 'admin-sidebar__nav-icon']"></i>
          <span>{{ item.label }}</span>
        </RouterLink>
      </nav>

      <!-- Sidebar Footer -->
      <div class="admin-sidebar__footer">
        <div class="admin-sidebar__divider"></div>
        <div class="admin-sidebar__user">
          <div class="admin-sidebar__avatar">{{ userInitials }}</div>
          <div class="admin-sidebar__user-info">
            <span class="admin-sidebar__user-name">{{ authStore.user?.name }}</span>
            <span class="admin-sidebar__user-role">{{ userRole }}</span>
          </div>
        </div>
        <a href="/" target="_blank" class="admin-sidebar__store-link">
          <i class="fa-solid fa-store"></i>
          <span>Ver tienda</span>
          <i class="fa-solid fa-arrow-up-right-from-square admin-sidebar__store-link-arrow"></i>
        </a>
      </div>
    </aside>

    <!-- Main content -->
    <div class="admin-layout__main">
      <!-- TopBar -->
      <header class="admin-topbar">
        <div class="admin-topbar__left">
          <button class="admin-topbar__menu-btn" @click="sidebarOpen = !sidebarOpen" aria-label="Toggle menu">
            <i class="fa-solid fa-bars"></i>
          </button>
          <h1 class="admin-topbar__title">{{ pageTitle }}</h1>
        </div>
        <div class="admin-topbar__right">
          <span :class="['admin-topbar__role-badge', `admin-topbar__role-badge--${authStore.user?.role}`]">
            {{ userRole }}
          </span>
          <div class="admin-topbar__avatar">{{ userInitials }}</div>
          <button class="admin-topbar__logout" @click="handleLogout" title="Cerrar sesión">
            <i class="fa-solid fa-right-from-bracket"></i>
          </button>
        </div>
      </header>

      <!-- Page content -->
      <main class="admin-layout__content">
        <slot />
      </main>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use '../styles/colorVariables.module.scss' as *;

.admin-layout {
  display: flex;
  min-height: 100vh;
  background-color: $admin-bg;
  font-family: 'Inter', sans-serif;

  &__overlay {
    position: fixed;
    inset: 0;
    background-color: rgba(0, 0, 0, 0.6);
    z-index: 98;

    @media (min-width: 1024px) {
      display: none;
    }
  }

  &__sidebar {
    width: 280px;
    flex-shrink: 0;
    background-color: $admin-sidebar;
    border-right: 1px solid $admin-border;
    display: flex;
    flex-direction: column;
    position: sticky;
    top: 0;
    height: 100vh;
    overflow-y: auto;

    @media (max-width: 1023px) {
      position: fixed;
      top: 0;
      left: 0;
      height: 100vh;
      z-index: 99;
      transform: translateX(-100%);
      transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);

      &--open {
        transform: translateX(0);
      }
    }
  }

  &__main {
    flex: 1;
    display: flex;
    flex-direction: column;
    min-width: 0;
    overflow: hidden;
  }

  &__content {
    flex: 1;
    padding: 2rem;
    overflow-y: auto;

    @media (max-width: 768px) {
      padding: 1rem;
    }
  }
}

.admin-sidebar {
  &__logo {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 1.5rem 1.25rem;
    flex-shrink: 0;
  }

  &__logo-icon {
    font-size: 1.75rem;
    color: $admin-accent;
    line-height: 1;
  }

  &__logo-text {
    display: flex;
    flex-direction: column;
    line-height: 1.2;
  }

  &__logo-name {
    font-size: 1.25rem;
    font-weight: 700;
    color: $admin-text;
    letter-spacing: -0.02em;
  }

  &__logo-sub {
    font-size: 0.6875rem;
    color: $admin-text-muted;
    font-weight: 400;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    margin-top: 2px;
  }

  &__divider {
    height: 1px;
    background-color: $admin-border;
    margin: 0 1.25rem;
    flex-shrink: 0;
  }

  &__nav {
    flex: 1;
    padding: 1rem 0.75rem;
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  &__nav-item {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.75rem 0.875rem;
    border-radius: 8px;
    text-decoration: none;
    color: $admin-text-muted;
    font-size: 0.9375rem;
    font-weight: 500;
    transition: all 0.15s ease;
    border-left: 3px solid transparent;

    &:hover {
      background-color: $admin-sidebar-hover;
      color: $admin-text;
    }

    &--active {
      background-color: $admin-sidebar-active;
      color: $admin-text;
      border-left-color: $admin-accent;

      .admin-sidebar__nav-icon {
        color: $admin-accent;
      }
    }
  }

  &__nav-icon {
    font-size: 1rem;
    width: 1rem;
    text-align: center;
    flex-shrink: 0;
  }

  &__footer {
    flex-shrink: 0;
    padding: 0.75rem;
  }

  &__user {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.875rem 0.5rem;
  }

  &__avatar {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background-color: $admin-accent;
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.8125rem;
    font-weight: 700;
    flex-shrink: 0;
  }

  &__user-info {
    display: flex;
    flex-direction: column;
    min-width: 0;
  }

  &__user-name {
    font-size: 0.875rem;
    font-weight: 600;
    color: $admin-text;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  &__user-role {
    font-size: 0.6875rem;
    color: $admin-text-muted;
    text-transform: uppercase;
    letter-spacing: 0.06em;
  }

  &__store-link {
    display: flex;
    align-items: center;
    gap: 0.625rem;
    padding: 0.625rem 0.875rem;
    border-radius: 8px;
    color: $admin-text-muted;
    text-decoration: none;
    font-size: 0.875rem;
    transition: all 0.15s ease;

    &:hover {
      background-color: $admin-sidebar-hover;
      color: $admin-text;
    }
  }

  &__store-link-arrow {
    margin-left: auto;
    font-size: 0.6875rem;
  }
}

.admin-topbar {
  height: 60px;
  background-color: $admin-card;
  border-bottom: 1px solid $admin-border;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1.5rem;
  flex-shrink: 0;
  gap: 1rem;

  @media (max-width: 768px) {
    padding: 0 1rem;
  }

  &__left {
    display: flex;
    align-items: center;
    gap: 1rem;
    min-width: 0;
  }

  &__menu-btn {
    display: none;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    border-radius: 8px;
    color: $admin-text-muted;
    cursor: pointer;
    transition: all 0.15s ease;
    flex-shrink: 0;

    @media (max-width: 1023px) {
      display: flex;
    }

    &:hover {
      background-color: $admin-sidebar-hover;
      color: $admin-text;
    }

    i {
      font-size: 1.125rem;
    }
  }

  &__title {
    font-size: 1.125rem;
    font-weight: 600;
    color: $admin-text;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    margin: 0;
  }

  &__right {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    flex-shrink: 0;
  }

  &__role-badge {
    padding: 0.25rem 0.625rem;
    border-radius: 4px;
    font-size: 0.6875rem;
    font-weight: 700;
    letter-spacing: 0.06em;
    text-transform: uppercase;

    &--owner {
      background-color: rgba($admin-accent, 0.18);
      color: $admin-accent;
    }

    &--admin {
      background-color: rgba($admin-info, 0.18);
      color: $admin-info;
    }

    &--customer {
      background-color: rgba($admin-text-muted, 0.18);
      color: $admin-text-muted;
    }
  }

  &__avatar {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background-color: $admin-accent;
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.8125rem;
    font-weight: 700;
  }

  &__logout {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    border-radius: 8px;
    color: $admin-text-muted;
    cursor: pointer;
    transition: all 0.15s ease;

    &:hover {
      background-color: rgba($admin-error, 0.15);
      color: $admin-error;
    }

    i {
      font-size: 1rem;
    }
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
