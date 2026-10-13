<script setup lang="ts">
import { RouterLink } from 'vue-router';
import type { Order, User } from '../../../types';
import CustomerOrders from './CustomerOrders.vue';
import CustomerPasswordCard from './CustomerPasswordCard.vue';

defineProps<{
  user: User | null;
  orders: Order[];
  loadingOrders: boolean;
}>();

defineEmits<{ logout: [] }>();
</script>

<template>
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
    <button class="btn-outline btn-sm profile-page__logout" @click="$emit('logout')">
      <i class="fa-solid fa-right-from-bracket"></i>
      <span>Cerrar sesión</span>
    </button>
  </header>

  <div class="profile-page__layout">
    <CustomerOrders :orders="orders" :loading="loadingOrders" />

    <!-- Account / security -->
    <aside class="profile-side">
      <CustomerPasswordCard />

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

<style lang="scss" scoped>
.profile-page {
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
    display: flex;
    flex-direction: column;
    gap: 2rem;

    > * { min-width: 0; }

    @media (min-width: 960px) {
      flex-direction: row;
      align-items: flex-start;
      gap: 2.5rem;

      > :first-child { flex: 1 1 auto; }
      > :last-child { flex: 0 0 340px; }
    }
  }
}

.profile-avatar {
  flex-shrink: 0;
  width: 72px;
  height: 72px;
  display: flex;
  align-items: center;
  justify-content: center;
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
</style>
