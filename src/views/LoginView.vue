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
      uiStore.success(`¡Bienvenido/a${firstName ? `, ${firstName}` : ''}!`);
      router.push(redirectPath.value);
    } else {
      await authStore.register(form.value.name, form.value.email, form.value.password);
      const firstName = form.value.name.trim().split(' ')[0];
      uiStore.success(`¡Bienvenido/a a Sorbito, ${firstName}!`);
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
    <section class="login-page">
      <div class="login-page__wrap">
        <div class="login-card">

          <!-- Brand -->
          <RouterLink to="/" class="login-logo" aria-label="Sorbito de Verdad — inicio">
            <span class="login-logo__mark" aria-hidden="true">
              <i class="fa-solid fa-mug-hot"></i>
            </span>
            <span class="login-logo__text">
              <span class="login-logo__name">Sorbito de Verdad</span>
              <span class="login-logo__tagline">Tazas artesanales · Ecuador</span>
            </span>
          </RouterLink>

          <!-- Mode switch -->
          <div v-if="mode !== 'forgot'" class="login-tabs" role="tablist" aria-label="Acceso">
            <button
              type="button"
              role="tab"
              :aria-selected="mode === 'login'"
              :class="['login-tabs__tab', { 'login-tabs__tab--active': mode === 'login' }]"
              @click="mode !== 'login' && setMode('login')"
            >
              Iniciar sesión
            </button>
            <button
              type="button"
              role="tab"
              :aria-selected="mode === 'register'"
              :class="['login-tabs__tab', { 'login-tabs__tab--active': mode === 'register' }]"
              @click="mode !== 'register' && setMode('register')"
            >
              Crear cuenta
            </button>
          </div>

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

          <!-- Forgot password — success state -->
          <div v-if="mode === 'forgot' && forgotSent" class="login-card__success">
            <div class="login-card__success-icon" aria-hidden="true">
              <i class="fa-solid fa-envelope-open-text"></i>
            </div>
            <button type="button" class="btn-outline btn-block" @click="setMode('login')">
              <i class="fa-solid fa-arrow-left"></i>
              Volver al inicio de sesión
            </button>
          </div>

          <!-- Forgot password form -->
          <form v-else-if="mode === 'forgot'" class="login-form" @submit.prevent="handleForgot" novalidate>
            <div class="field">
              <label class="field__label" for="forgot-email">Correo electrónico</label>
              <input
                id="forgot-email"
                v-model="forgotEmail"
                type="email"
                class="field__input"
                placeholder="tu@email.com"
                required
                autocomplete="email"
              />
            </div>

            <button type="submit" class="btn-primary btn-lg btn-block" :disabled="loading || !forgotEmail">
              <i v-if="loading" class="fa-solid fa-circle-notch fa-spin"></i>
              <i v-else class="fa-solid fa-paper-plane"></i>
              <span>{{ loading ? 'Enviando...' : 'Enviar enlace de recuperación' }}</span>
            </button>

            <button type="button" class="login-form__back" @click="setMode('login')">
              <i class="fa-solid fa-arrow-left"></i>
              Volver al inicio de sesión
            </button>
          </form>

          <!-- Login / Register form -->
          <form v-else class="login-form" @submit.prevent="handleSubmit" novalidate>
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
                  @click="setMode('forgot')"
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

  &__success {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1.25rem;
  }

  &__success-icon {
    width: 76px;
    height: 76px;
    display: grid;
    place-items: center;
    font-size: 1.75rem;
    color: var(--color-success);
    background-color: var(--color-success-light);
    border-radius: 50%;
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

.login-logo {
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

.login-tabs {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4px;
  padding: 4px;
  background-color: var(--color-bg-subtle);
  border-radius: $radius-full;

  &__tab {
    min-height: 42px;
    font-size: 0.875rem;
    font-weight: 600;
    color: var(--color-muted);
    border-radius: $radius-full;
    transition: background-color 0.2s ease, color 0.2s ease, box-shadow 0.2s ease;

    &:hover { color: var(--color-primary); }

    &--active {
      color: var(--color-primary);
      background-color: var(--color-bg-card);
      box-shadow: var(--shadow-sm);
    }
  }
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;

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
