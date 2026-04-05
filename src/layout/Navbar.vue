<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { RouterLink, useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import { useCartStore } from '../stores/cart';
import { useUIStore } from '../stores/ui';

const authStore = useAuthStore();
const cartStore = useCartStore();
const uiStore = useUIStore();
const router = useRouter();

const isScrolled = ref(false);
const isDark = computed(() => uiStore.theme === 'dark');

const totalItems = computed(() => cartStore.totalItems);
const isMenuOpen = computed(() => uiStore.isMenuOpen);

function handleScroll() {
  isScrolled.value = window.scrollY > 20;
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true });
});
onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});

function handleLogout() {
  authStore.logout();
  uiStore.closeMenu();
  router.push('/');
}
</script>

<template>
  <header :class="['navbar', { 'navbar--scrolled': isScrolled }]">
    <div class="container navbar__inner">
      <!-- Logo -->
      <RouterLink to="/" class="navbar__logo" @click="uiStore.closeMenu()">
        <i class="fa-solid fa-mug-hot navbar__logo-icon"></i>
        <div class="navbar__logo-text">
          <span class="navbar__logo-name">Sorbito de Verdad</span>
          <span class="navbar__logo-tagline">Tazas Artesanales</span>
        </div>
      </RouterLink>

      <!-- Desktop Nav -->
      <nav class="navbar__nav">
        <RouterLink to="/" class="navbar__link">Inicio</RouterLink>
        <RouterLink to="/tienda" class="navbar__link">Tienda</RouterLink>
        <RouterLink to="/nosotros" class="navbar__link">Nosotros</RouterLink>
        <RouterLink v-if="authStore.isAdmin" to="/admin" class="navbar__link navbar__link--admin">
          <i class="fa-solid fa-shield-halved"></i> Admin
        </RouterLink>
      </nav>

      <!-- Actions -->
      <div class="navbar__actions">
        <!-- Cart -->
        <button class="navbar__icon-btn" @click="uiStore.toggleCart()" aria-label="Abrir carrito">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
            <line x1="3" y1="6" x2="21" y2="6"/>
            <path d="M16 10a4 4 0 01-8 0"/>
          </svg>
          <span v-if="totalItems > 0" class="navbar__cart-badge">{{ totalItems }}</span>
        </button>

        <!-- User -->
        <RouterLink v-if="authStore.isAuthenticated" to="/perfil" class="navbar__icon-btn" aria-label="Mi perfil">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
            <circle cx="12" cy="7" r="4"/>
          </svg>
        </RouterLink>
        <RouterLink v-else to="/login" class="navbar__icon-btn" aria-label="Iniciar sesión">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <path d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4"/>
            <polyline points="10 17 15 12 10 7"/>
            <line x1="15" y1="12" x2="3" y2="12"/>
          </svg>
        </RouterLink>

        <!-- Theme toggle -->
        <button
          class="navbar__theme-btn"
          @click="uiStore.toggleTheme()"
          :aria-label="isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'"
        >
          <Transition name="theme-icon" mode="out-in">
            <i v-if="isDark" key="sun" class="fa-solid fa-sun"></i>
            <i v-else key="moon" class="fa-solid fa-moon"></i>
          </Transition>
          <span class="navbar__theme-label">{{ isDark ? 'Light' : 'Dark' }}</span>
        </button>

        <!-- Hamburger (mobile) -->
        <button class="navbar__hamburger" @click="uiStore.toggleMenu()" :aria-expanded="isMenuOpen" aria-label="Menú">
          <span :class="['hamburger-line', { 'hamburger-line--top-open': isMenuOpen }]"></span>
          <span :class="['hamburger-line', { 'hamburger-line--mid-open': isMenuOpen }]"></span>
          <span :class="['hamburger-line', { 'hamburger-line--bot-open': isMenuOpen }]"></span>
        </button>
      </div>
    </div>

    <!-- Mobile Drawer -->
    <Transition name="slide-down">
      <div v-if="isMenuOpen" class="navbar__mobile-menu">
        <nav class="navbar__mobile-nav">
          <RouterLink to="/" class="navbar__mobile-link" @click="uiStore.closeMenu()">Inicio</RouterLink>
          <RouterLink to="/tienda" class="navbar__mobile-link" @click="uiStore.closeMenu()">Tienda</RouterLink>
          <RouterLink to="/nosotros" class="navbar__mobile-link" @click="uiStore.closeMenu()">Nosotros</RouterLink>
          <RouterLink to="/carrito" class="navbar__mobile-link" @click="uiStore.closeMenu()">Carrito ({{ totalItems }})</RouterLink>
          <template v-if="authStore.isAuthenticated">
            <RouterLink to="/perfil" class="navbar__mobile-link" @click="uiStore.closeMenu()">Mi Perfil</RouterLink>
            <RouterLink v-if="authStore.isAdmin" to="/admin" class="navbar__mobile-link" @click="uiStore.closeMenu()">
              <i class="fa-solid fa-shield-halved"></i> Panel Admin
            </RouterLink>
            <button class="navbar__mobile-link navbar__mobile-logout" @click="handleLogout">Cerrar Sesión</button>
          </template>
          <template v-else>
            <RouterLink to="/login" class="navbar__mobile-link" @click="uiStore.closeMenu()">Iniciar Sesión</RouterLink>
          </template>
        </nav>
      </div>
    </Transition>
  </header>
</template>

<style lang="scss" scoped>
@use '../styles/colorVariables.module.scss' as *;

.navbar {
  position: sticky;
  top: 0;
  z-index: 1000;
  height: 70px;
  background-color: var(--navbar-bg);
  border-bottom: 1px solid transparent;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  @media (max-width: 768px) {
    height: 60px;
  }

  &--scrolled {
    background-color: var(--navbar-bg-scrolled);
    border-bottom-color: var(--color-border);
    box-shadow: $shadow-sm;
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
  }

  &__inner {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 2rem;
  }

  &__logo {
    display: flex;
    align-items: center;
    gap: 0.625rem;
    text-decoration: none;
    flex-shrink: 0;
  }

  &__logo-icon {
    font-size: 1.5rem;
    line-height: 1;
  }

  &__logo-text {
    display: flex;
    flex-direction: column;
    line-height: 1;
  }

  &__logo-name {
    font-family: var(--font-heading);
    font-size: 1.125rem;
    font-weight: 700;
    color: var(--color-primary);
    letter-spacing: -0.01em;
  }

  &__logo-tagline {
    font-size: 0.6875rem;
    color: var(--color-muted);
    font-weight: 400;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    margin-top: 2px;

    @media (max-width: 480px) {
      display: none;
    }
  }

  &__nav {
    display: flex;
    align-items: center;
    gap: 0.25rem;

    @media (max-width: 768px) {
      display: none;
    }
  }

  &__link {
    padding: 0.5rem 0.875rem;
    font-size: 0.9375rem;
    font-weight: 500;
    color: var(--color-muted);
    text-decoration: none;
    border-radius: $radius-sm;
    transition: all 0.2s ease;

    &:hover, &.router-link-active {
      color: var(--color-primary);
      background-color: var(--color-bg-subtle);
    }

    &.router-link-exact-active {
      color: $color-accent;
    }

    &--admin {
      display: flex;
      align-items: center;
      gap: 0.375rem;
      color: $color-accent;
      font-weight: 600;

      i {
        font-size: 0.875rem;
      }

      &:hover, &.router-link-active {
        color: $color-accent;
        background-color: rgba($color-accent, 0.08);
      }
    }
  }

  &__actions {
    display: flex;
    align-items: center;
    gap: 0.25rem;
  }

  &__icon-btn {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    border-radius: $radius-sm;
    color: var(--color-muted);
    transition: all 0.2s ease;
    cursor: pointer;
    text-decoration: none;

    &:hover {
      color: var(--color-primary);
      background-color: var(--color-bg-subtle);
    }
  }

  &__cart-badge {
    position: absolute;
    top: 4px;
    right: 4px;
    min-width: 18px;
    height: 18px;
    padding: 0 4px;
    background-color: $color-accent;
    color: white;
    font-size: 0.6875rem;
    font-weight: 600;
    border-radius: $radius-full;
    display: flex;
    align-items: center;
    justify-content: center;
    line-height: 1;
    pointer-events: none;
  }

  &__theme-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.375rem;
    height: 34px;
    padding: 0 0.75rem;
    border-radius: $radius-full;
    color: var(--color-muted);
    font-size: 0.875rem;
    cursor: pointer;
    transition: all 0.2s ease;
    border: 1px solid var(--color-border);
    background: transparent;
    white-space: nowrap;

    i {
      font-size: 0.875rem;
      line-height: 1;
    }

    &:hover {
      color: $color-accent;
      border-color: $color-accent;
      background-color: rgba($color-accent, 0.08);
    }
  }

  &__theme-label {
    font-size: 0.75rem;
    font-weight: 600;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    line-height: 1;

    @media (max-width: 480px) {
      display: none;
    }
  }

  &__hamburger {
    display: none;
    flex-direction: column;
    justify-content: center;
    gap: 5px;
    width: 40px;
    height: 40px;
    padding: 8px;
    cursor: pointer;
    border-radius: $radius-sm;
    transition: background-color 0.2s ease;

    @media (max-width: 768px) {
      display: flex;
    }

    &:hover {
      background-color: var(--color-bg-subtle);
    }
  }

  &__mobile-menu {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background-color: var(--color-bg-card);
    border-bottom: 1px solid var(--color-border);
    box-shadow: $shadow-md;
  }

  &__mobile-nav {
    display: flex;
    flex-direction: column;
    padding: 0.75rem 0;
  }

  &__mobile-link {
    display: block;
    padding: 0.875rem 1.5rem;
    font-size: 1rem;
    font-weight: 500;
    color: var(--color-primary);
    text-decoration: none;
    transition: background-color 0.2s ease;
    border: none;
    background: none;
    text-align: left;
    cursor: pointer;
    font-family: var(--font-body);
    width: 100%;

    &:hover {
      background-color: var(--color-bg-subtle);
      color: $color-accent;
    }

    &.router-link-exact-active {
      color: $color-accent;
    }
  }

  &__mobile-logout {
    color: $color-error;
    &:hover {
      color: $color-error;
    }
  }
}

.hamburger-line {
  display: block;
  width: 100%;
  height: 2px;
  background-color: var(--color-primary);
  border-radius: 2px;
  transform-origin: center;
  transition: all 0.25s ease;

  &--top-open {
    transform: translateY(7px) rotate(45deg);
  }
  &--mid-open {
    opacity: 0;
    transform: scaleX(0);
  }
  &--bot-open {
    transform: translateY(-7px) rotate(-45deg);
  }
}

// Theme icon swap
.theme-icon-enter-active,
.theme-icon-leave-active { transition: opacity 0.15s ease, transform 0.15s ease; }
.theme-icon-enter-from { opacity: 0; transform: rotate(-30deg) scale(0.7); }
.theme-icon-leave-to   { opacity: 0; transform: rotate(30deg) scale(0.7); }

// Slide down transition
.slide-down-enter-active,
.slide-down-leave-active {
  transition: transform 0.25s ease, opacity 0.25s ease;
}
.slide-down-enter-from,
.slide-down-leave-to {
  transform: translateY(-8px);
  opacity: 0;
}
</style>
