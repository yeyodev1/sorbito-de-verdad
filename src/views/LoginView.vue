<script setup lang="ts">
import { RouterLink } from 'vue-router';
import MainLayout from '../layout/MainLayout.vue';
import AuthBrand from '../components/account/auth/AuthBrand.vue';
import LoginTabs from '../components/account/auth/LoginTabs.vue';
import LoginForgotPanel from '../components/account/auth/LoginForgotPanel.vue';
import LoginCredentialsForm from '../components/account/auth/LoginCredentialsForm.vue';
import { useLoginForm } from '../composables/account/useLoginForm';

const {
  mode, loading, errorMessage, forgotSent, form, forgotEmail,
  handleSubmit, handleForgot, setMode, cardTitle, cardSubtitle,
} = useLoginForm();
</script>

<template>
  <MainLayout>
    <section class="login-page">
      <div class="login-page__wrap">
        <div class="login-card">

          <!-- Brand -->
          <AuthBrand prefix="login" />

          <!-- Mode switch -->
          <LoginTabs v-if="mode !== 'forgot'" :mode="mode" @select="setMode" />

          <!-- Header -->
          <header class="login-card__header">
            <h1 class="login-card__title">{{ cardTitle }}</h1>
            <p class="login-card__subtitle">{{ cardSubtitle }}</p>
          </header>

          <!-- Error -->
          <div v-if="errorMessage" class="login-card__error-block" role="alert">
            <div class="login-card__error">
              <i class="fa-solid fa-circle-exclamation"></i>
              <span>{{ errorMessage }}</span>
            </div>
            <div v-if="mode === 'login'" class="login-card__error-hints">
              <button type="button" class="login-card__hint-btn" @click="setMode('forgot')">
                <i class="fa-solid fa-key"></i>
                ¿Olvidaste tu contraseña?
              </button>
              <button type="button" class="login-card__hint-btn" @click="setMode('register')">
                <i class="fa-solid fa-user-plus"></i>
                Crear una cuenta nueva
              </button>
            </div>
          </div>

          <!-- Forgot password -->
          <LoginForgotPanel
            v-if="mode === 'forgot'"
            v-model:email="forgotEmail"
            :sent="forgotSent"
            :loading="loading"
            @submit="handleForgot"
            @back="setMode('login')"
          />

          <!-- Login / Register form -->
          <LoginCredentialsForm
            v-else
            v-model:form="form"
            :mode="mode"
            :loading="loading"
            @submit="handleSubmit"
            @forgot="setMode('forgot')"
          />

          <!-- Footer -->
          <div v-if="mode !== 'forgot'" class="login-card__footer">
            <p class="login-card__guest-note">
              No necesitas cuenta para comprar: la creamos por ti al pagar.
            </p>
            <RouterLink to="/tienda" class="login-card__skip">
              Continuar sin cuenta
              <i class="fa-solid fa-arrow-right"></i>
            </RouterLink>
          </div>

        </div>
      </div>
    </section>
  </MainLayout>
</template>

<style lang="scss" scoped>
.login-page {
  min-height: calc(100vh - 70px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2.5rem 1rem 4rem;
  background:
    radial-gradient(circle at 15% 10%, color-mix(in srgb, var(--color-accent-light) 70%, transparent), transparent 45%),
    var(--color-bg);

  &__wrap {
    width: 100%;
    max-width: 440px;
  }
}

.login-card {
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
  }

  &__title {
    font-size: clamp(1.625rem, 5vw, 2rem);
  }

  &__subtitle {
    font-size: 0.9375rem;
  }

  &__error-block {
    display: flex;
    flex-direction: column;
    gap: 0.625rem;
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

  &__error-hints {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  &__hint-btn {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    min-height: 40px;
    padding: 0.5rem 0.875rem;
    font-size: 0.8125rem;
    font-weight: 500;
    color: var(--color-primary);
    border: 1px solid var(--color-border);
    border-radius: $radius-full;
    transition: border-color 0.2s ease, color 0.2s ease;

    i { color: var(--color-accent); }

    &:hover {
      border-color: var(--color-accent);
      color: var(--color-accent);
    }
  }


  &__footer {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    padding-top: 1.25rem;
    border-top: 1px solid var(--color-border);
    text-align: center;
  }

  &__guest-note {
    font-size: 0.8125rem;
  }

  &__skip {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    min-height: 44px;
    padding: 0 0.5rem;
    font-size: 0.9375rem;
    font-weight: 600;
    color: var(--color-accent);

    i {
      font-size: 0.75rem;
      transition: transform 0.2s ease;
    }

    &:hover i { transform: translateX(3px); }
  }
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
</style>
