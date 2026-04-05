<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter, useRoute, RouterLink } from 'vue-router';
import MainLayout from '../layout/MainLayout.vue';
import { useAuthStore } from '../stores/auth';
import { useUIStore } from '../stores/ui';

const authStore = useAuthStore();
const uiStore = useUIStore();
const router = useRouter();
const route = useRoute();

const isLogin = ref(true);
const loading = ref(false);
const errorMessage = ref('');

const form = ref({
  name: '',
  email: '',
  password: '',
});

const redirectPath = computed(() => {
  const r = route.query.redirect;
  return typeof r === 'string' ? r : '/';
});

async function handleSubmit() {
  if (loading.value) return;
  loading.value = true;
  errorMessage.value = '';
  try {
    if (isLogin.value) {
      await authStore.login(form.value.email, form.value.password);
    } else {
      await authStore.register(form.value.name, form.value.email, form.value.password);
    }
    uiStore.showNotification(isLogin.value ? '¡Bienvenido/a!' : '¡Cuenta creada exitosamente!', 'success');
    router.push(redirectPath.value);
  } catch (err: unknown) {
    errorMessage.value = (err as { message?: string })?.message || 'Error al iniciar sesión. Verifica tus datos.';
  } finally {
    loading.value = false;
  }
}

function toggleMode() {
  isLogin.value = !isLogin.value;
  errorMessage.value = '';
  form.value = { name: '', email: '', password: '' };
}
</script>

<template>
  <MainLayout>
    <div class="login-page">
      <div class="login-page__wrap">
        <div class="login-card">

          <!-- ── Logo ──────────────────────────────────── -->
          <RouterLink to="/" class="login-logo">
            <div class="login-logo__icon-wrap">
              <i class="fa-solid fa-mug-hot login-logo__icon"></i>
            </div>
            <div class="login-logo__text">
              <span class="login-logo__name">Sorbito de Verdad</span>
              <span class="login-logo__tagline">Tazas Artesanales · Ecuador</span>
            </div>
          </RouterLink>

          <!-- ── Header ────────────────────────────────── -->
          <div class="login-card__header">
            <h1 class="login-card__title">
              {{ isLogin ? 'Bienvenido/a de vuelta' : 'Crear cuenta' }}
            </h1>
            <p class="login-card__subtitle">
              {{ isLogin
                ? 'Inicia sesión para acceder a tus pedidos y favoritos.'
                : 'Únete y descubre el mundo artesanal de Sorbito.' }}
            </p>
          </div>

          <!-- ── Error ─────────────────────────────────── -->
          <div v-if="errorMessage" class="login-card__error" role="alert">
            <i class="fa-solid fa-circle-xmark"></i>
            {{ errorMessage }}
          </div>

          <!-- ── Form ──────────────────────────────────── -->
          <form class="login-form" @submit.prevent="handleSubmit" novalidate>
            <div v-if="!isLogin" class="form-field">
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
              <label class="form-field__label" for="login-password">Contraseña</label>
              <input
                id="login-password"
                v-model="form.password"
                type="password"
                class="form-field__input"
                placeholder="••••••••"
                required
                minlength="6"
                :autocomplete="isLogin ? 'current-password' : 'new-password'"
              />
            </div>

            <button type="submit" class="login-form__submit" :disabled="loading">
              <i v-if="loading" class="fa-solid fa-circle-notch fa-spin"></i>
              <span v-if="loading">{{ isLogin ? 'Ingresando...' : 'Creando cuenta...' }}</span>
              <span v-else>{{ isLogin ? 'Iniciar Sesión' : 'Crear Cuenta' }}</span>
            </button>
          </form>

          <!-- ── Footer links ───────────────────────────── -->
          <div class="login-card__footer">
            <p class="login-card__toggle">
              {{ isLogin ? '¿No tienes cuenta?' : '¿Ya tienes cuenta?' }}
              <button class="login-card__toggle-btn" @click="toggleMode">
                {{ isLogin ? 'Regístrate gratis' : 'Iniciar Sesión' }}
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
@use '../styles/colorVariables.module.scss' as *;

// ── Page wrapper ──────────────────────────────────────────
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

// ── Card ──────────────────────────────────────────────────
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

  &__error {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.875rem 1rem;
    background-color: rgba($color-error, 0.08);
    border: 1px solid rgba($color-error, 0.25);
    border-radius: $radius-sm;
    font-size: 0.9rem;
    color: $color-error;

    i { flex-shrink: 0; }
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

// ── Logo ──────────────────────────────────────────────────
.login-logo {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.875rem;
  text-decoration: none;
  padding-bottom: 0.25rem;
  border-bottom: 1px solid var(--color-border);
  padding-bottom: 1.5rem;

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

// ── Form ──────────────────────────────────────────────────
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
}

// ── Form field ────────────────────────────────────────────
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
}
</style>
