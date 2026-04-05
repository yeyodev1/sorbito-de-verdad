<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter, RouterLink } from 'vue-router';
import MainLayout from '../layout/MainLayout.vue';
import { useAuthStore } from '../stores/auth';
import { useUIStore } from '../stores/ui';
import { authService } from '../services/auth.service';

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const uiStore = useUIStore();

const token = ref('');
const password = ref('');
const confirmPassword = ref('');
const loading = ref(false);
const errorMessage = ref('');
const success = ref(false);

onMounted(() => {
  const t = route.query.token;
  if (typeof t === 'string' && t) {
    token.value = t;
  } else {
    errorMessage.value = 'Enlace inválido. Solicita uno nuevo desde la pantalla de login.';
  }
});

async function handleReset() {
  if (loading.value) return;
  errorMessage.value = '';

  if (password.value.length < 6) {
    errorMessage.value = 'La contraseña debe tener al menos 6 caracteres.';
    return;
  }
  if (password.value !== confirmPassword.value) {
    errorMessage.value = 'Las contraseñas no coinciden.';
    return;
  }

  loading.value = true;
  try {
    const res = await authService.resetPassword(token.value, password.value);
    if (res.data?.token) {
      authStore.setFromToken(res.data.token, res.data.user);
    }
    success.value = true;
    uiStore.showNotification('¡Contraseña actualizada!', 'success');
    setTimeout(() => router.push('/perfil'), 2200);
  } catch (err: unknown) {
    errorMessage.value =
      (err as { message?: string })?.message ||
      'Enlace inválido o expirado. Solicita uno nuevo.';
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <MainLayout>
    <div class="rp-page">
      <div class="rp-page__wrap">
        <div class="rp-card">

          <!-- Logo -->
          <RouterLink to="/" class="login-logo">
            <div class="login-logo__icon-wrap">
              <i class="fa-solid fa-mug-hot login-logo__icon"></i>
            </div>
            <div class="login-logo__text">
              <span class="login-logo__name">Sorbito de Verdad</span>
              <span class="login-logo__tagline">Tazas Artesanales · Ecuador</span>
            </div>
          </RouterLink>

          <!-- Success state -->
          <template v-if="success">
            <div class="rp-card__header">
              <div class="rp-success-icon">
                <i class="fa-solid fa-shield-check"></i>
              </div>
              <h1 class="rp-card__title">¡Contraseña actualizada!</h1>
              <p class="rp-card__subtitle">
                Tu nueva contraseña está activa. Redirigiendo a tu perfil...
              </p>
            </div>
            <div class="rp-card__footer">
              <RouterLink to="/perfil" class="rp-btn rp-btn--primary">
                Ir a mi perfil
              </RouterLink>
            </div>
          </template>

          <!-- Form state -->
          <template v-else>
            <div class="rp-card__header">
              <h1 class="rp-card__title">Nueva contraseña</h1>
              <p class="rp-card__subtitle">
                Elige una contraseña segura de al menos 6 caracteres.
              </p>
            </div>

            <!-- Error -->
            <div v-if="errorMessage" class="rp-card__error" role="alert">
              <i class="fa-solid fa-circle-xmark"></i>
              {{ errorMessage }}
            </div>

            <form v-if="token" class="rp-form" @submit.prevent="handleReset" novalidate>
              <div class="form-field">
                <label class="form-field__label" for="rp-password">Nueva contraseña</label>
                <input
                  id="rp-password"
                  v-model="password"
                  type="password"
                  class="form-field__input"
                  placeholder="Mínimo 6 caracteres"
                  required
                  minlength="6"
                  autocomplete="new-password"
                />
              </div>

              <div class="form-field">
                <label class="form-field__label" for="rp-confirm">Confirmar contraseña</label>
                <input
                  id="rp-confirm"
                  v-model="confirmPassword"
                  type="password"
                  class="form-field__input"
                  placeholder="Repite tu contraseña"
                  required
                  autocomplete="new-password"
                />
                <span v-if="confirmPassword && password !== confirmPassword" class="form-field__mismatch">
                  <i class="fa-solid fa-triangle-exclamation"></i> Las contraseñas no coinciden
                </span>
              </div>

              <button type="submit" class="rp-btn rp-btn--primary" :disabled="loading || !password || !confirmPassword">
                <i v-if="loading" class="fa-solid fa-circle-notch fa-spin"></i>
                <i v-else class="fa-solid fa-lock"></i>
                <span>{{ loading ? 'Actualizando...' : 'Establecer nueva contraseña' }}</span>
              </button>
            </form>

            <div class="rp-card__footer">
              <RouterLink to="/login" class="rp-back-link">
                ← Volver al inicio de sesión
              </RouterLink>
            </div>
          </template>

        </div>
      </div>
    </div>
  </MainLayout>
</template>

<style lang="scss" scoped>
@use '../styles/colorVariables.module.scss' as *;

.rp-page {
  min-height: calc(100vh - 70px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 3rem 1.5rem;
  background-color: var(--color-bg-subtle);

  &__wrap {
    width: 100%;
    max-width: 420px;
  }
}

.rp-card {
  background-color: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: $radius-xl;
  padding: 2.5rem;
  box-shadow: 0 8px 40px rgba(0, 0, 0, 0.18);
  display: flex;
  flex-direction: column;
  gap: 1.75rem;

  @media (max-width: 480px) {
    padding: 2rem 1.5rem;
    border-radius: $radius-lg;
  }

  &__header {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    text-align: center;
  }

  &__title {
    font-family: var(--font-heading);
    font-size: 1.625rem;
    font-weight: 700;
    color: var(--color-primary);
    margin: 0;
    line-height: 1.2;
  }

  &__subtitle {
    font-size: 0.9375rem;
    color: var(--color-muted);
    line-height: 1.6;
    margin: 0;
  }

  &__error {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.875rem 1rem;
    background-color: rgba(var(--color-error), 0.08);
    border: 1px solid rgba(var(--color-error), 0.25);
    border-radius: $radius-sm;
    font-size: 0.9rem;
    color: var(--color-error);

    i { flex-shrink: 0; }
  }

  &__footer {
    display: flex;
    justify-content: center;
  }
}

.rp-success-icon {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  background-color: rgba($color-accent, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  color: $color-accent;
  margin-bottom: 0.5rem;
}

.rp-form {
  display: flex;
  flex-direction: column;
  gap: 1.125rem;
}

.rp-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  width: 100%;
  padding: 0.9rem;
  border-radius: $radius-md;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  font-family: var(--font-body);
  text-decoration: none;
  transition: all 0.25s ease;
  border: none;

  &--primary {
    background-color: $color-accent;
    color: white;

    &:hover:not(:disabled) {
      filter: brightness(1.08);
      transform: translateY(-1px);
      box-shadow: 0 6px 18px rgba($color-accent, 0.4);
    }

    &:disabled { opacity: 0.6; cursor: not-allowed; }
  }
}

.rp-back-link {
  font-size: 0.9rem;
  color: var(--color-muted);
  text-decoration: none;
  transition: color 0.2s ease;

  &:hover { color: $color-accent; }
}

// Shared form-field styles
.login-logo {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.875rem;
  text-decoration: none;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid var(--color-border);

  &__icon-wrap {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 48px;
    height: 48px;
    background-color: $color-accent;
    border-radius: $radius-md;
    flex-shrink: 0;
    box-shadow: 0 4px 12px rgba($color-accent, 0.35);
  }

  &__icon {
    font-size: 1.375rem;
    color: white;
    line-height: 1;
  }

  &__text {
    display: flex;
    flex-direction: column;
    line-height: 1;
    gap: 3px;
  }

  &__name {
    font-family: var(--font-heading);
    font-size: 1.1875rem;
    font-weight: 700;
    color: var(--color-primary);
    letter-spacing: -0.01em;
  }

  &__tagline {
    font-size: 0.6875rem;
    color: var(--color-muted);
    font-weight: 500;
    letter-spacing: 0.05em;
    text-transform: uppercase;
  }
}

.form-field {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;

  &__label {
    font-size: 0.875rem;
    font-weight: 600;
    color: var(--color-primary);
  }

  &__input {
    padding: 0.75rem 1rem;
    border: 1px solid var(--color-border);
    border-radius: $radius-sm;
    font-size: 0.9375rem;
    color: var(--color-primary);
    font-family: var(--font-body);
    transition: border-color 0.2s ease, box-shadow 0.2s ease;
    background-color: var(--color-bg);
    width: 100%;
    box-sizing: border-box;

    &:focus {
      outline: none;
      border-color: $color-accent;
      box-shadow: 0 0 0 3px rgba($color-accent, 0.12);
    }

    &::placeholder { color: var(--color-muted); opacity: 0.7; }
  }

  &__mismatch {
    font-size: 0.8125rem;
    color: var(--color-error);
    display: flex;
    align-items: center;
    gap: 0.25rem;
  }
}
</style>
