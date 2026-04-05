<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter, useRoute, RouterLink } from 'vue-router';
import MainLayout from '../layout/MainLayout.vue';
import { useAuthStore } from '../stores/auth';
import { useUIStore } from '../stores/ui';
import { authService } from '../services/auth.service';

const authStore = useAuthStore();
const uiStore = useUIStore();
const router = useRouter();
const route = useRoute();

// 'login' | 'register' | 'forgot'
const mode = ref<'login' | 'register' | 'forgot'>('login');
const loading = ref(false);
const errorMessage = ref('');
const forgotSent = ref(false);

const form = ref({ name: '', email: '', password: '' });
const forgotEmail = ref('');

const redirectPath = computed(() => {
  const r = route.query.redirect;
  return typeof r === 'string' ? r : '/';
});

async function handleSubmit() {
  if (loading.value) return;
  loading.value = true;
  errorMessage.value = '';
  try {
    if (mode.value === 'login') {
      await authStore.login(form.value.email, form.value.password);
      const firstName = authStore.user?.name?.split(' ')[0] ?? '';
      uiStore.success(`¡Bienvenido/a${firstName ? `, ${firstName}` : ''}! 👋`);
      router.push(redirectPath.value);
    } else {
      await authStore.register(form.value.name, form.value.email, form.value.password);
      const firstName = form.value.name.trim().split(' ')[0];
      uiStore.success(`¡Bienvenido/a a Sorbito, ${firstName}! 🎉`);
      router.push(redirectPath.value);
    }
  } catch (err: unknown) {
    type AxiosErr = { response?: { data?: { message?: string } }; message?: string };
    const e = err as AxiosErr;
    errorMessage.value = e.response?.data?.message || 'Error al procesar. Verifica tus datos.';
  } finally {
    loading.value = false;
  }
}

async function handleForgot() {
  if (loading.value || !forgotEmail.value) return;
  loading.value = true;
  errorMessage.value = '';
  try {
    await authService.forgotPassword(forgotEmail.value);
    forgotSent.value = true;
  } catch (err: unknown) {
    errorMessage.value = (err as { message?: string })?.message || 'Error al enviar. Intenta de nuevo.';
  } finally {
    loading.value = false;
  }
}

function setMode(m: 'login' | 'register' | 'forgot') {
  mode.value = m;
  errorMessage.value = '';
  forgotSent.value = false;
  form.value = { name: '', email: '', password: '' };
  forgotEmail.value = '';
}

const cardTitle = computed(() => {
  if (mode.value === 'forgot') return forgotSent.value ? '¡Revisa tu correo!' : 'Recuperar contraseña';
  return mode.value === 'login' ? 'Bienvenido/a de vuelta' : 'Crear cuenta';
});

const cardSubtitle = computed(() => {
  if (mode.value === 'forgot') {
    return forgotSent.value
      ? `Enviamos un enlace de recuperación a ${forgotEmail.value}. Válido por 1 hora.`
      : 'Ingresa tu correo y te enviaremos un enlace para restablecer tu contraseña.';
  }
  return mode.value === 'login'
    ? 'Inicia sesión para acceder a tus pedidos y favoritos.'
    : 'Únete y descubre el mundo artesanal de Sorbito.';
});
</script>

<template>
  <MainLayout>
    <div class="login-page">
      <div class="login-page__wrap">
        <div class="login-card">

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

          <!-- Header -->
          <div class="login-card__header">
            <h1 class="login-card__title">{{ cardTitle }}</h1>
            <p class="login-card__subtitle">{{ cardSubtitle }}</p>
          </div>

          <!-- Error -->
          <div v-if="errorMessage" class="login-card__error-block" role="alert">
            <div class="login-card__error">
              <i class="fa-solid fa-circle-xmark"></i>
              {{ errorMessage }}
            </div>
            <div v-if="mode === 'login'" class="login-card__error-hints">
              <button class="login-card__hint-btn" @click="setMode('forgot')">
                <i class="fa-solid fa-key"></i>
                ¿Olvidaste tu contraseña?
              </button>
              <button class="login-card__hint-btn" @click="setMode('register')">
                <i class="fa-solid fa-user-plus"></i>
                Crear una cuenta nueva
              </button>
            </div>
          </div>

          <!-- Forgot password — success state -->
          <div v-if="mode === 'forgot' && forgotSent" class="login-card__success">
            <div class="login-card__success-icon">
              <i class="fa-solid fa-envelope-circle-check"></i>
            </div>
            <button class="login-card__toggle-btn" @click="setMode('login')">
              ← Volver al inicio de sesión
            </button>
          </div>

          <!-- Forgot password form -->
          <form v-else-if="mode === 'forgot'" class="login-form" @submit.prevent="handleForgot" novalidate>
            <div class="form-field">
              <label class="form-field__label" for="forgot-email">Correo electrónico</label>
              <input
                id="forgot-email"
                v-model="forgotEmail"
                type="email"
                class="form-field__input"
                placeholder="tu@email.com"
                required
                autocomplete="email"
              />
            </div>

            <button type="submit" class="login-form__submit" :disabled="loading || !forgotEmail">
              <i v-if="loading" class="fa-solid fa-circle-notch fa-spin"></i>
              <i v-else class="fa-solid fa-paper-plane"></i>
              <span>{{ loading ? 'Enviando...' : 'Enviar enlace de recuperación' }}</span>
            </button>

            <button type="button" class="login-form__back" @click="setMode('login')">
              ← Volver al inicio de sesión
            </button>
          </form>

          <!-- Login / Register form -->
          <form v-else class="login-form" @submit.prevent="handleSubmit" novalidate>
            <div v-if="mode === 'register'" class="form-field">
              <label class="form-field__label" for="login-name">Nombre completo</label>
              <input
                id="login-name"
                v-model="form.name"
                type="text"
                class="form-field__input"
                placeholder="Juan Pérez"
                required
                autocomplete="name"
              />
            </div>

            <div class="form-field">
              <label class="form-field__label" for="login-email">Correo electrónico</label>
              <input
                id="login-email"
                v-model="form.email"
                type="email"
                class="form-field__input"
                placeholder="tu@email.com"
                required
                autocomplete="email"
              />
            </div>

            <div class="form-field">
              <div class="form-field__label-row">
                <label class="form-field__label" for="login-password">Contraseña</label>
                <button
                  v-if="mode === 'login'"
                  type="button"
                  class="form-field__forgot-link"
                  @click="setMode('forgot')"
                >
                  ¿Olvidaste tu contraseña?
                </button>
              </div>
              <input
                id="login-password"
                v-model="form.password"
                type="password"
                class="form-field__input"
                placeholder="••••••••"
                required
                minlength="6"
                :autocomplete="mode === 'login' ? 'current-password' : 'new-password'"
              />
            </div>

            <button type="submit" class="login-form__submit" :disabled="loading">
              <i v-if="loading" class="fa-solid fa-circle-notch fa-spin"></i>
              <span v-if="loading">{{ mode === 'login' ? 'Ingresando...' : 'Creando cuenta...' }}</span>
              <span v-else>{{ mode === 'login' ? 'Iniciar Sesión' : 'Crear Cuenta' }}</span>
            </button>
          </form>

          <!-- Footer links -->
          <div v-if="mode !== 'forgot'" class="login-card__footer">
            <p class="login-card__toggle">
              {{ mode === 'login' ? '¿No tienes cuenta?' : '¿Ya tienes cuenta?' }}
              <button class="login-card__toggle-btn" @click="setMode(mode === 'login' ? 'register' : 'login')">
                {{ mode === 'login' ? 'Regístrate gratis' : 'Iniciar Sesión' }}
              </button>
            </p>
            <RouterLink to="/tienda" class="login-card__skip">
              Continuar sin cuenta →
            </RouterLink>
          </div>

        </div>
      </div>
    </div>
  </MainLayout>
</template>

<style lang="scss" scoped>

.login-page {
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

.login-card {
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

  &__error-block {
    display: flex;
    flex-direction: column;
    gap: 0.625rem;
  }

  &__error {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.875rem 1rem;
    background-color: rgba(239, 68, 68, 0.08);
    border: 1px solid rgba(239, 68, 68, 0.25);
    border-radius: $radius-sm;
    font-size: 0.9rem;
    color: var(--color-error);

    i { flex-shrink: 0; }
  }

  &__error-hints {
    display: flex;
    gap: 0.5rem;
  }

  &__hint-btn {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.375rem;
    padding: 0.625rem 0.75rem;
    background: none;
    border: 1px solid var(--color-border);
    border-radius: $radius-sm;
    font-size: 0.8125rem;
    font-weight: 500;
    color: var(--color-muted);
    cursor: pointer;
    font-family: var(--font-body);
    transition: all 0.2s ease;
    text-align: center;
    line-height: 1.3;

    i { font-size: 0.75rem; flex-shrink: 0; }

    &:hover {
      border-color: $color-accent;
      color: $color-accent;
      background-color: rgba($color-accent, 0.06);
    }
  }

  &__success {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1.25rem;
    padding: 1.5rem 0;
    text-align: center;
  }

  &__success-icon {
    width: 72px;
    height: 72px;
    border-radius: 50%;
    background-color: rgba($color-accent, 0.1);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 2rem;
    color: $color-accent;
  }

  &__footer {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.75rem;
  }

  &__toggle {
    font-size: 0.9375rem;
    color: var(--color-muted);
    margin: 0;
  }

  &__toggle-btn {
    background: none;
    border: none;
    color: $color-accent;
    font-weight: 600;
    cursor: pointer;
    font-size: inherit;
    font-family: var(--font-body);
    padding: 0 0.25rem;
    transition: opacity 0.2s ease;

    &:hover { opacity: 0.75; }
  }

  &__skip {
    font-size: 0.875rem;
    color: var(--color-muted);
    text-decoration: none;
    transition: color 0.2s ease;

    &:hover { color: $color-accent; }
  }
}

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

.login-form {
  display: flex;
  flex-direction: column;
  gap: 1.125rem;

  &__submit {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    width: 100%;
    padding: 0.9rem;
    background-color: $color-accent;
    color: white;
    border: none;
    border-radius: $radius-md;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    margin-top: 0.25rem;
    transition: all 0.25s ease;
    font-family: var(--font-body);
    letter-spacing: 0.01em;

    &:hover:not(:disabled) {
      filter: brightness(1.08);
      transform: translateY(-1px);
      box-shadow: 0 6px 18px rgba($color-accent, 0.4);
    }

    &:disabled { opacity: 0.6; cursor: not-allowed; }
  }

  &__back {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    padding: 0.75rem;
    background: none;
    border: 1px solid var(--color-border);
    border-radius: $radius-md;
    font-size: 0.9375rem;
    color: var(--color-muted);
    cursor: pointer;
    font-family: var(--font-body);
    transition: all 0.2s ease;

    &:hover {
      border-color: var(--color-primary);
      color: var(--color-primary);
    }
  }
}

.form-field {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;

  &__label-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  &__label {
    font-size: 0.875rem;
    font-weight: 600;
    color: var(--color-primary);
  }

  &__forgot-link {
    background: none;
    border: none;
    font-size: 0.8125rem;
    color: $color-accent;
    cursor: pointer;
    font-family: var(--font-body);
    padding: 0;
    transition: opacity 0.2s ease;

    &:hover { opacity: 0.75; }
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
}
</style>
