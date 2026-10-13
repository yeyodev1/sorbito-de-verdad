<script setup lang="ts">
import type { AuthMode } from '../../../composables/account/useLoginForm';

defineProps<{ mode: AuthMode }>();
defineEmits<{ select: [mode: AuthMode] }>();
</script>

<template>
  <div class="login-tabs" role="tablist" aria-label="Acceso">
    <button
      type="button"
      role="tab"
      :aria-selected="mode === 'login'"
      :class="['login-tabs__tab', { 'login-tabs__tab--active': mode === 'login' }]"
      @click="mode !== 'login' && $emit('select', 'login')"
    >
      Iniciar sesión
    </button>
    <button
      type="button"
      role="tab"
      :aria-selected="mode === 'register'"
      :class="['login-tabs__tab', { 'login-tabs__tab--active': mode === 'register' }]"
      @click="mode !== 'register' && $emit('select', 'register')"
    >
      Crear cuenta
    </button>
  </div>
</template>

<style lang="scss" scoped>
.login-tabs {
  display: flex;
  gap: 4px;
  padding: 4px;
  background-color: var(--color-bg-subtle);
  border-radius: $radius-full;

  &__tab {
    flex: 1 1 0;
    min-width: 0;
    min-height: 42px;
    font-size: 0.875rem;
    font-weight: 600;
    color: var(--color-muted);
    border-radius: $radius-full;
    transition: background-color 0.2s ease, color 0.2s ease, box-shadow 0.2s ease;

    &:hover { color: var(--color-primary); }

    &--active {
      color: var(--color-primary);
      background-color: var(--color-bg-card);
      box-shadow: var(--shadow-sm);
    }
  }
}
</style>
