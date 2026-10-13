<script setup lang="ts">
import type { SearchMode } from './track';

defineProps<{
  mode: SearchMode;
  loading: boolean;
  error: string;
}>();

const query = defineModel<string>('query', { required: true });

const emit = defineEmits<{
  'switch-mode': [mode: SearchMode];
  submit: [];
}>();
</script>

<template>
  <div class="track__panel">
    <!-- Mode toggle -->
    <div class="track__mode-tabs" role="tablist" aria-label="Buscar por">
      <button
        type="button"
        role="tab"
        :aria-selected="mode === 'number'"
        :class="['track__mode-tab', { 'track__mode-tab--active': mode === 'number' }]"
        @click="emit('switch-mode', 'number')"
      >
        <i class="fa-solid fa-hashtag" aria-hidden="true"></i>
        Nº de pedido
      </button>
      <button
        type="button"
        role="tab"
        :aria-selected="mode === 'email'"
        :class="['track__mode-tab', { 'track__mode-tab--active': mode === 'email' }]"
        @click="emit('switch-mode', 'email')"
      >
        <i class="fa-solid fa-envelope" aria-hidden="true"></i>
        Correo
      </button>
    </div>

    <!-- Search form -->
    <form class="track__form" @submit.prevent="emit('submit')">
      <label class="track__input-wrap">
        <span class="sr-only">{{ mode === 'email' ? 'Correo electrónico' : 'Número de pedido' }}</span>
        <i :class="['track__input-icon', mode === 'email' ? 'fa-solid fa-envelope' : 'fa-solid fa-hashtag']" aria-hidden="true"></i>
        <input
          v-model="query"
          :type="mode === 'email' ? 'email' : 'text'"
          :inputmode="mode === 'email' ? 'email' : 'text'"
          class="track__input"
          :placeholder="mode === 'email' ? 'tu@correo.com' : 'Ej: SDV-1775430455700-123'"
          autocomplete="off"
          spellcheck="false"
        />
      </label>
      <button type="submit" class="btn-primary track__btn" :disabled="loading || !query.trim()">
        <i v-if="loading" class="fa-solid fa-circle-notch fa-spin" aria-hidden="true"></i>
        <i v-else class="fa-solid fa-magnifying-glass" aria-hidden="true"></i>
        {{ loading ? 'Buscando...' : 'Rastrear' }}
      </button>
    </form>

    <!-- Error -->
    <div v-if="error" class="track__error" role="alert">
      <i class="fa-solid fa-triangle-exclamation" aria-hidden="true"></i>
      {{ error }}
    </div>
  </div>
</template>

<style lang="scss" scoped>
.track {
  // ── Panel ─────────────────────────────────
  &__panel {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding: 1.25rem;
    border-radius: $radius-xl;
    background-color: var(--color-bg-card);
    border: 1px solid var(--color-border);
    box-shadow: var(--shadow-sm);

    @media (min-width: 640px) {
      padding: 1.75rem;
    }
  }

  &__mode-tabs {
    display: flex;
    gap: 0.25rem;
    padding: 0.25rem;
    border-radius: $radius-full;
    background-color: var(--color-bg-subtle);
  }

  &__mode-tab {
    flex: 1 1 0;
    min-width: 0;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    min-height: 44px;
    border-radius: $radius-full;
    font-size: 0.875rem;
    font-weight: 600;
    color: var(--color-muted);
    transition: background-color 0.2s ease, color 0.2s ease, box-shadow 0.2s ease;

    i { font-size: 0.75rem; }

    &:hover { color: var(--color-primary); }

    &--active,
    &--active:hover {
      background-color: var(--color-bg-card);
      color: var(--color-primary);
      box-shadow: var(--shadow-sm);
    }
  }

  &__form {
    display: flex;
    flex-direction: column;
    gap: 0.625rem;

    @media (min-width: 560px) {
      flex-direction: row;
    }
  }

  &__input-wrap {
    position: relative;
    flex: 1;
    min-width: 0;
  }

  &__input-icon {
    position: absolute;
    left: 1rem;
    top: 50%;
    transform: translateY(-50%);
    font-size: 0.8125rem;
    color: var(--color-muted);
    pointer-events: none;
  }

  &__input {
    width: 100%;
    min-height: 52px;
    padding: 0 1rem 0 2.5rem;
    font-size: 1rem;
    color: var(--color-primary);
    background-color: var(--color-bg);
    border: 1.5px solid var(--color-border);
    border-radius: $radius-full;
    outline: none;
    transition: border-color 0.2s ease, box-shadow 0.2s ease;

    &::placeholder { color: var(--color-muted); opacity: 0.75; }

    &:focus {
      border-color: var(--color-accent);
      box-shadow: var(--focus-ring);
    }
  }

  &__btn {
    min-height: 52px;
  }

  &__error {
    display: flex;
    align-items: flex-start;
    gap: 0.625rem;
    padding: 0.875rem 1rem;
    border-radius: $radius-md;
    background-color: var(--color-error-light);
    color: var(--color-error);
    font-size: 0.875rem;
    font-weight: 500;

    i { margin-top: 0.2rem; }
  }
}
</style>
