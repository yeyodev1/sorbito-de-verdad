<script setup lang="ts">
import { computed } from 'vue';
import { RouterLink } from 'vue-router';
import type { Order, User } from '../../../types';
import AdminPasswordCard from './AdminPasswordCard.vue';
import AdminOrdersList from './AdminOrdersList.vue';

const props = defineProps<{
  user: User | null;
  isOwner: boolean;
  orders: Order[];
  loadingOrders: boolean;
}>();

defineEmits<{ logout: [] }>();

const adminLinks = [
  { to: '/admin',            icon: 'fa-solid fa-gauge-high',  label: 'Dashboard',        desc: 'Resumen general y métricas', color: '#C8956C' },
  { to: '/admin/productos',  icon: 'fa-solid fa-mug-hot',     label: 'Gestión de Tazas', desc: 'Subir, editar y eliminar productos', color: '#C8956C' },
  { to: '/admin/categorias', icon: 'fa-solid fa-tags',        label: 'Categorías',       desc: 'Organizar las colecciones', color: '#3B82F6' },
  { to: '/admin/ordenes',    icon: 'fa-solid fa-box',         label: 'Pedidos',          desc: 'Ver y gestionar todas las órdenes', color: '#10B981' },
];
const ownerLinks = [
  { to: '/admin/usuarios',   icon: 'fa-solid fa-users',       label: 'Usuarios',         desc: 'Gestión completa de cuentas', color: '#F59E0B' },
];

const allAdminLinks = computed(() => [...adminLinks, ...(props.isOwner ? ownerLinks : [])]);
</script>

<template>
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
    <button class="ap__logout-btn" @click="$emit('logout')" title="Cerrar sesión">
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

  <AdminPasswordCard />

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
    <AdminOrdersList :orders="orders" :loading="loadingOrders" />
  </div>
</template>

<style lang="scss" scoped src="./AdminProfile.scss"></style>
