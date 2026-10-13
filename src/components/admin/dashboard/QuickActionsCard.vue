<script setup lang="ts">
import { useRouter } from 'vue-router';

const router = useRouter();
</script>

<template>
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
</template>

<style lang="scss" scoped src="./adminCard.scss"></style>

<style lang="scss" scoped>
@use "sass:color";

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
      background-color: color.adjust(#C8956C, $lightness: -8%);
      border-color: color.adjust(#C8956C, $lightness: -8%);

      i {
        color: #fff;
      }
    }
  }

  &--link {
    color: $admin-text-muted;
  }
}
</style>
