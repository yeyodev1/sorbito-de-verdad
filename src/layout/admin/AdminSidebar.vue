<script setup lang="ts">
import { computed } from 'vue';
import { RouterLink, useRoute } from 'vue-router';
import { useAdminUser } from '../../composables/admin/useAdminUser';

defineProps<{ open: boolean }>();
const emit = defineEmits<{ (e: 'close'): void }>();

const route = useRoute();
const { authStore, userInitials, userRole } = useAdminUser();

const navItems = computed(() => {
  const items = [
    { to: '/admin', name: 'AdminDashboard', icon: 'fa-chart-line', label: 'Dashboard' },
    { to: '/admin/productos', name: 'AdminProducts', icon: 'fa-mug-hot', label: 'Productos' },
    { to: '/admin/categorias', name: 'AdminCategories', icon: 'fa-tag', label: 'Categorías' },
    { to: '/admin/envios', name: 'AdminShipping', icon: 'fa-truck', label: 'Envíos' },
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
  emit('close');
}
</script>

<template>
  <aside :class="['admin-layout__sidebar', { 'admin-layout__sidebar--open': open }]">
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
      <RouterLink to="/perfil" class="admin-sidebar__user admin-sidebar__user--link" @click="closeSidebar">
        <div class="admin-sidebar__avatar">{{ userInitials }}</div>
        <div class="admin-sidebar__user-info">
          <span class="admin-sidebar__user-name">{{ authStore.user?.name }}</span>
          <span class="admin-sidebar__user-role">{{ userRole }}</span>
        </div>
        <i class="fa-solid fa-circle-user admin-sidebar__user-profile-icon"></i>
      </RouterLink>
      <a href="/" target="_blank" class="admin-sidebar__store-link">
        <i class="fa-solid fa-store"></i>
        <span>Ver tienda</span>
        <i class="fa-solid fa-arrow-up-right-from-square admin-sidebar__store-link-arrow"></i>
      </a>
    </div>
  </aside>
</template>

<style lang="scss" scoped src="./AdminSidebar.scss"></style>
