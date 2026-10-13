<script setup lang="ts">
defineProps<{ loading: boolean }>();
defineEmits<{ submit: [] }>();

const password = defineModel<string>('password', { required: true });
const confirmPassword = defineModel<string>('confirm', { required: true });
</script>

<template>
  <form class="rp-form" @submit.prevent="$emit('submit')" novalidate>
    <div class="field">
      <label class="field__label" for="rp-password">Nueva contraseña</label>
      <input
        id="rp-password"
        v-model="password"
        type="password"
        class="field__input"
        placeholder="Mínimo 6 caracteres"
        required
        minlength="6"
        autocomplete="new-password"
      />
    </div>

    <div class="field">
      <label class="field__label" for="rp-confirm">Confirmar contraseña</label>
      <input
        id="rp-confirm"
        v-model="confirmPassword"
        type="password"
        :class="['field__input', { 'rp-form__input--error': confirmPassword && password !== confirmPassword }]"
        placeholder="Repite tu contraseña"
        required
        autocomplete="new-password"
      />
      <span v-if="confirmPassword && password !== confirmPassword" class="rp-form__mismatch">
        <i class="fa-solid fa-triangle-exclamation"></i> Las contraseñas no coinciden
      </span>
    </div>

    <button type="submit" class="btn-primary btn-lg btn-block rp-form__submit" :disabled="loading || !password || !confirmPassword">
      <i v-if="loading" class="fa-solid fa-circle-notch fa-spin"></i>
      <i v-else class="fa-solid fa-lock"></i>
      <span>{{ loading ? 'Actualizando...' : 'Establecer nueva contraseña' }}</span>
    </button>
  </form>
</template>

<style lang="scss" scoped>
.rp-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;

  &__input--error {
    border-color: var(--color-error);
  }

  &__mismatch {
    display: inline-flex;
    align-items: center;
    gap: 0.375rem;
    font-size: 0.8125rem;
    color: var(--color-error);
  }

  &__submit {
    margin-top: 0.5rem;
  }
}
</style>
