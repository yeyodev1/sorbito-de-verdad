<script setup lang="ts">
defineProps<{ sent: boolean; loading: boolean }>();
defineEmits<{ submit: []; back: [] }>();

const email = defineModel<string>('email', { required: true });
</script>

<template>
  <!-- Forgot password — success state -->
  <div v-if="sent" class="login-card__success">
    <div class="login-card__success-icon" aria-hidden="true">
      <i class="fa-solid fa-envelope-open-text"></i>
    </div>
    <button type="button" class="btn-outline btn-block" @click="$emit('back')">
      <i class="fa-solid fa-arrow-left"></i>
      Volver al inicio de sesión
    </button>
  </div>

  <!-- Forgot password form -->
  <form v-else class="login-form" @submit.prevent="$emit('submit')" novalidate>
    <div class="field">
      <label class="field__label" for="forgot-email">Correo electrónico</label>
      <input
        id="forgot-email"
        v-model="email"
        type="email"
        class="field__input"
        placeholder="tu@email.com"
        required
        autocomplete="email"
      />
    </div>

    <button type="submit" class="btn-primary btn-lg btn-block" :disabled="loading || !email">
      <i v-if="loading" class="fa-solid fa-circle-notch fa-spin"></i>
      <i v-else class="fa-solid fa-paper-plane"></i>
      <span>{{ loading ? 'Enviando...' : 'Enviar enlace de recuperación' }}</span>
    </button>

    <button type="button" class="login-form__back" @click="$emit('back')">
      <i class="fa-solid fa-arrow-left"></i>
      Volver al inicio de sesión
    </button>
  </form>
</template>

<style lang="scss" scoped>
.login-card {
  &__success {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1.25rem;
  }

  &__success-icon {
    width: 76px;
    height: 76px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.75rem;
    color: var(--color-success);
    background-color: var(--color-success-light);
    border-radius: 50%;
  }
}

.login-form {
  &__back {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.4rem;
    min-height: 44px;
    font-size: 0.875rem;
    font-weight: 500;
    color: var(--color-muted);

    &:hover { color: var(--color-primary); }
  }
}
</style>
