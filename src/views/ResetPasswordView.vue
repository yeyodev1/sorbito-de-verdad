<script setup lang="ts">
import { RouterLink } from 'vue-router';
import MainLayout from '../layout/MainLayout.vue';
import AuthBrand from '../components/account/auth/AuthBrand.vue';
import ResetPasswordForm from '../components/account/auth/ResetPasswordForm.vue';
import { useResetPassword } from '../composables/account/useResetPassword';

const { token, password, confirmPassword, loading, errorMessage, success, handleReset } = useResetPassword();
</script>

<template>
  <MainLayout>
    <section class="rp-page">
      <div class="rp-page__wrap">
        <div class="rp-card">

          <!-- Brand -->
          <AuthBrand prefix="rp" />

          <!-- Success state -->
          <template v-if="success">
            <div class="rp-card__header rp-card__header--center">
              <div class="rp-success-icon" aria-hidden="true">
                <i class="fa-solid fa-check"></i>
              </div>
              <h1 class="rp-card__title">¡Contraseña actualizada!</h1>
              <p class="rp-card__subtitle">
                Tu nueva contraseña está activa. Redirigiendo a tu perfil...
              </p>
            </div>
            <RouterLink to="/perfil" class="btn-primary btn-lg btn-block">
              Ir a mi perfil
            </RouterLink>
          </template>

          <!-- Form state -->
          <template v-else>
            <div class="rp-card__header">
              <span class="eyebrow">Recuperar acceso</span>
              <h1 class="rp-card__title">Nueva contraseña</h1>
              <p class="rp-card__subtitle">
                Elige una contraseña segura de al menos 6 caracteres.
              </p>
            </div>

            <!-- Error -->
            <div v-if="errorMessage" class="rp-card__error" role="alert">
              <i class="fa-solid fa-circle-exclamation"></i>
              <span>{{ errorMessage }}</span>
            </div>

            <ResetPasswordForm
              v-if="token"
              v-model:password="password"
              v-model:confirm="confirmPassword"
              :loading="loading"
              @submit="handleReset"
            />

            <div class="rp-card__footer">
              <RouterLink to="/login" class="rp-back-link">
                <i class="fa-solid fa-arrow-left"></i>
                Volver al inicio de sesión
              </RouterLink>
            </div>
          </template>

        </div>
      </div>
    </section>
  </MainLayout>
</template>

<style lang="scss" scoped>
.rp-page {
  min-height: calc(100vh - 70px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2.5rem 1rem 4rem;
  background:
    radial-gradient(circle at 85% 10%, color-mix(in srgb, var(--color-accent-light) 70%, transparent), transparent 45%),
    var(--color-bg);

  &__wrap {
    width: 100%;
    max-width: 440px;
  }
}

.rp-card {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding: 2rem 1.25rem;
  background-color: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: $radius-xl;
  box-shadow: var(--shadow-lg);

  @media (min-width: 480px) {
    padding: 2.5rem 2.25rem;
  }

  &__header {
    display: flex;
    flex-direction: column;
    gap: 0.375rem;

    &--center {
      align-items: center;
      text-align: center;
      gap: 0.625rem;
    }
  }

  &__title {
    font-size: clamp(1.625rem, 5vw, 2rem);
  }

  &__subtitle {
    font-size: 0.9375rem;
  }

  &__error {
    display: flex;
    align-items: flex-start;
    gap: 0.625rem;
    padding: 0.75rem 1rem;
    font-size: 0.875rem;
    font-weight: 500;
    color: var(--color-error);
    background-color: var(--color-error-light);
    border-radius: $radius-md;

    i { margin-top: 3px; }
  }

  &__footer {
    display: flex;
    justify-content: center;
    padding-top: 1.25rem;
    border-top: 1px solid var(--color-border);
  }
}


.rp-success-icon {
  width: 76px;
  height: 76px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 0.25rem;
  font-size: 1.75rem;
  color: var(--color-success);
  background-color: var(--color-success-light);
  border-radius: 50%;
}


.rp-back-link {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  min-height: 44px;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--color-muted);

  &:hover { color: var(--color-primary); }
}
</style>
