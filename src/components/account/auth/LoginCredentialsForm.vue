<script setup lang="ts">
import type { AuthMode, LoginFormData } from '../../../composables/account/useLoginForm';

defineProps<{ mode: AuthMode; loading: boolean }>();
defineEmits<{ submit: []; forgot: [] }>();

const form = defineModel<LoginFormData>('form', { required: true });
</script>

<template>
  <form class="login-form" @submit.prevent="$emit('submit')" novalidate>
    <div v-if="mode === 'register'" class="field">
      <label class="field__label" for="login-name">Nombre completo</label>
      <input
        id="login-name"
        v-model="form.name"
        type="text"
        class="field__input"
        placeholder="Juan Pérez"
        required
        autocomplete="name"
      />
    </div>

    <div class="field">
      <label class="field__label" for="login-email">Correo electrónico</label>
      <input
        id="login-email"
        v-model="form.email"
        type="email"
        class="field__input"
        placeholder="tu@email.com"
        required
        autocomplete="email"
      />
    </div>

    <div class="field">
      <div class="login-form__label-row">
        <label class="field__label" for="login-password">Contraseña</label>
        <button
          v-if="mode === 'login'"
          type="button"
          class="login-form__forgot-link"
          @click="$emit('forgot')"
        >
          ¿La olvidaste?
        </button>
      </div>
      <input
        id="login-password"
        v-model="form.password"
        type="password"
        class="field__input"
        placeholder="••••••••"
        required
        minlength="6"
        :autocomplete="mode === 'login' ? 'current-password' : 'new-password'"
      />
      <p v-if="mode === 'register'" class="login-form__hint">Mínimo 6 caracteres.</p>
    </div>

    <button type="submit" class="btn-primary btn-lg btn-block login-form__submit" :disabled="loading">
      <i v-if="loading" class="fa-solid fa-circle-notch fa-spin"></i>
      <span v-if="loading">{{ mode === 'login' ? 'Ingresando...' : 'Creando cuenta...' }}</span>
      <span v-else>{{ mode === 'login' ? 'Iniciar sesión' : 'Crear cuenta' }}</span>
    </button>
  </form>
</template>

<style lang="scss" scoped>
.login-form {
  &__label-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.5rem;
  }

  &__forgot-link {
    font-size: 0.8125rem;
    font-weight: 500;
    color: var(--color-accent);

    &:hover { text-decoration: underline; }
  }

  &__hint {
    font-size: 0.75rem;
  }

  &__submit {
    margin-top: 0.5rem;
  }
}
</style>
