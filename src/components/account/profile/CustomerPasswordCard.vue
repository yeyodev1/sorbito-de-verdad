<script setup lang="ts">
import { useChangePassword } from '../../../composables/account/useChangePassword';

const { changingPassword, pwdForm, pwdError, pwdSuccess, savingPwd, handleChangePassword } = useChangePassword();
</script>

<template>
  <div class="profile-section">
    <button
      type="button"
      class="profile-section__header"
      :aria-expanded="changingPassword"
      @click="changingPassword = !changingPassword"
    >
      <span class="profile-section__icon" aria-hidden="true"><i class="fa-solid fa-lock"></i></span>
      <span class="profile-section__header-text">
        <span class="profile-section__title">Cambiar contraseña</span>
        <span class="profile-section__sub">Actualiza tu contraseña de acceso</span>
      </span>
      <i :class="['fa-solid fa-chevron-down profile-section__chevron', { 'profile-section__chevron--open': changingPassword }]"></i>
    </button>
    <Transition name="slide-fade">
      <div v-if="changingPassword" class="profile-section__body">
        <div v-if="pwdError" class="pwd-alert pwd-alert--error" role="alert">
          <i class="fa-solid fa-circle-exclamation"></i> {{ pwdError }}
        </div>
        <div v-if="pwdSuccess" class="pwd-alert pwd-alert--success" role="status">
          <i class="fa-solid fa-circle-check"></i> {{ pwdSuccess }}
        </div>
        <form class="pwd-form" @submit.prevent="handleChangePassword" novalidate>
          <div class="field">
            <label class="field__label" for="pwd-current">Contraseña actual</label>
            <input id="pwd-current" v-model="pwdForm.current" type="password" class="field__input" placeholder="••••••••" autocomplete="current-password" required />
          </div>
          <div class="field">
            <label class="field__label" for="pwd-new">Nueva contraseña</label>
            <input id="pwd-new" v-model="pwdForm.new" type="password" class="field__input" placeholder="Mínimo 6 caracteres" autocomplete="new-password" required minlength="6" />
          </div>
          <div class="field">
            <label class="field__label" for="pwd-confirm">Confirmar nueva contraseña</label>
            <input id="pwd-confirm" v-model="pwdForm.confirm" type="password" class="field__input" placeholder="Repite la nueva contraseña" autocomplete="new-password" required />
            <span v-if="pwdForm.confirm && pwdForm.new !== pwdForm.confirm" class="pwd-mismatch">
              <i class="fa-solid fa-triangle-exclamation"></i> Las contraseñas no coinciden
            </span>
          </div>
          <div class="pwd-form__actions">
            <button type="button" class="btn-ghost btn-sm" @click="changingPassword = false">Cancelar</button>
            <button type="submit" class="btn-primary btn-sm" :disabled="savingPwd">
              <i v-if="savingPwd" class="fa-solid fa-circle-notch fa-spin"></i>
              {{ savingPwd ? 'Guardando...' : 'Actualizar' }}
            </button>
          </div>
        </form>
      </div>
    </Transition>
  </div>
</template>

<style lang="scss" scoped>
// Collapsible section (customer)
.profile-section {
  background-color: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: $radius-lg;
  overflow: hidden;

  &__header {
    width: 100%;
    display: flex;
    align-items: center;
    gap: 0.875rem;
    min-height: 64px;
    padding: 1rem 1.25rem;
    text-align: left;
    transition: background-color 0.2s ease;

    &:hover { background-color: var(--color-bg-subtle); }
  }

  &__icon {
    flex-shrink: 0;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--color-accent);
    background-color: var(--color-accent-light);
    border-radius: 50%;
  }

  &__header-text {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
  }

  &__title {
    font-size: 0.9375rem;
    font-weight: 600;
    color: var(--color-primary);
  }

  &__sub {
    font-size: 0.8125rem;
    color: var(--color-muted);
  }

  &__chevron {
    font-size: 0.75rem;
    color: var(--color-muted);
    transition: transform 0.25s ease;

    &--open { transform: rotate(180deg); }
  }

  &__body {
    padding: 0.25rem 1.25rem 1.25rem;
  }
}

// Password form (customer)
.pwd-form {
  display: flex;
  flex-direction: column;
  gap: 0.875rem;

  &__actions {
    display: flex;
    justify-content: flex-end;
    gap: 0.5rem;
    margin-top: 0.25rem;
  }
}

.pwd-alert {
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  margin-bottom: 0.875rem;
  padding: 0.625rem 0.875rem;
  font-size: 0.8125rem;
  font-weight: 500;
  border-radius: $radius-md;

  i { margin-top: 2px; }

  &--error {
    color: var(--color-error);
    background-color: var(--color-error-light);
  }

  &--success {
    color: var(--color-success);
    background-color: var(--color-success-light);
  }
}

.pwd-mismatch {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.75rem;
  color: var(--color-error);
}

// Transitions
.slide-fade-enter-active,
.slide-fade-leave-active { transition: opacity 0.2s ease, transform 0.2s ease; }
.slide-fade-enter-from,
.slide-fade-leave-to { opacity: 0; transform: translateY(-6px); }
</style>
