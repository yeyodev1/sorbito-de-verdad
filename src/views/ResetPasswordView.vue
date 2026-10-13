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
    <section class="rp-page">
      <div class="rp-page__wrap">
        <div class="rp-card">

          <!-- Brand -->
          <RouterLink to="/" class="rp-logo" aria-label="Sorbito de Verdad — inicio">
            <span class="rp-logo__mark" aria-hidden="true">
              <i class="fa-solid fa-mug-hot"></i>
            </span>
            <span class="rp-logo__text">
              <span class="rp-logo__name">Sorbito de Verdad</span>
              <span class="rp-logo__tagline">Tazas artesanales · Ecuador</span>
            </span>
          </RouterLink>

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

            <form v-if="token" class="rp-form" @submit.prevent="handleReset" novalidate>
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

.rp-logo {
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  align-self: flex-start;

  &__mark {
    width: 44px;
    height: 44px;
    display: grid;
    place-items: center;
    font-size: 1.125rem;
    color: var(--color-on-accent);
    background-color: var(--color-accent);
    border-radius: 50%;
  }

  &__text {
    display: flex;
    flex-direction: column;
    line-height: 1.2;
  }

  &__name {
    font-family: var(--font-heading);
    font-size: 1.125rem;
    font-weight: 600;
    color: var(--color-primary);
  }

  &__tagline {
    font-size: 0.75rem;
    color: var(--color-muted);
  }
}

.rp-success-icon {
  width: 76px;
  height: 76px;
  display: grid;
  place-items: center;
  margin-bottom: 0.25rem;
  font-size: 1.75rem;
  color: var(--color-success);
  background-color: var(--color-success-light);
  border-radius: 50%;
}

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
