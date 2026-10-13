<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useAdminUser } from '../../composables/admin/useAdminUser';

defineProps<{ title: string }>();
const emit = defineEmits<{ (e: 'toggle-menu'): void }>();

const router = useRouter();
const { authStore, userInitials, userRole } = useAdminUser();

function handleLogout() {
  authStore.logout();
  router.push('/login');
}
</script>

<template>
  <header class="admin-topbar">
    <div class="admin-topbar__left">
      <button class="admin-topbar__menu-btn" @click="emit('toggle-menu')" aria-label="Toggle menu">
        <i class="fa-solid fa-bars"></i>
      </button>
      <h1 class="admin-topbar__title">{{ title }}</h1>
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
</template>

<style lang="scss" scoped>
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
</style>
