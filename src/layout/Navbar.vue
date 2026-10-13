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

function confirmLogout() {
  uiStore.openConfirm({
    title: 'Cerrar sesión',
    message: '¿Seguro que deseas cerrar tu sesión? Tendrás que volver a iniciar sesión para acceder a tu cuenta.',
    type: 'danger',
    confirmLabel: 'Cerrar sesión',
    cancelLabel: 'Cancelar',
    onConfirm: handleLogout,
  });
}
</script>

<template>
  <header :class="['navbar', { 'navbar--scrolled': isScrolled || isMenuOpen }]">
    <div class="container navbar__inner">
      <!-- Logo -->
      <RouterLink to="/" class="navbar__logo" @click="uiStore.closeMenu()" aria-label="Sorbito de Verdad — inicio">
        <span class="navbar__logo-mark" aria-hidden="true"><i class="fa-solid fa-mug-hot"></i></span>
        <span class="navbar__logo-text">
          <span class="navbar__logo-name">Sorbito de Verdad</span>
          <span class="navbar__logo-tagline">Tazas artesanales</span>
        </span>
      </RouterLink>

      <!-- Desktop Nav -->
      <nav class="navbar__nav" aria-label="Principal">
        <RouterLink to="/" class="navbar__link">Inicio</RouterLink>
        <RouterLink to="/tienda" class="navbar__link">Tienda</RouterLink>
        <RouterLink to="/nosotros" class="navbar__link">Nosotros</RouterLink>
        <RouterLink to="/aliados" class="navbar__link">Aliados</RouterLink>
        <RouterLink to="/rastrear" class="navbar__link">Rastrear pedido</RouterLink>
        <RouterLink v-if="authStore.isAdmin" to="/admin" class="navbar__link navbar__link--admin">
          <i class="fa-solid fa-shield-halved"></i> Admin
        </RouterLink>
      </nav>

      <!-- Actions -->
      <div class="navbar__actions">
        <!-- Theme toggle -->
        <button
          class="navbar__icon-btn navbar__icon-btn--desktop"
          @click="uiStore.toggleTheme()"
          :aria-label="isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'"
          :title="isDark ? 'Modo claro' : 'Modo oscuro'"
        >
          <Transition name="theme-icon" mode="out-in">
            <i v-if="isDark" key="sun" class="fa-solid fa-sun"></i>
            <i v-else key="moon" class="fa-solid fa-moon"></i>
          </Transition>
        </button>

        <!-- Account (desktop) -->
        <template v-if="authStore.isAuthenticated">
          <RouterLink
            v-if="authStore.isAdmin"
            to="/perfil"
            class="navbar__role-chip"
            :aria-label="authStore.isOwner ? 'Panel Owner' : 'Panel Admin'"
          >
            <i :class="authStore.isOwner ? 'fa-solid fa-crown' : 'fa-solid fa-shield-halved'"></i>
            <span>{{ authStore.isOwner ? 'Owner' : 'Admin' }}</span>
          </RouterLink>
          <RouterLink v-else to="/perfil" class="navbar__icon-btn navbar__icon-btn--desktop" aria-label="Mi perfil" title="Mi perfil">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
              <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
          </RouterLink>
          <button
            class="navbar__icon-btn navbar__icon-btn--desktop"
            @click="confirmLogout()"
            aria-label="Cerrar sesión"
            title="Cerrar sesión"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
              <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/>
              <polyline points="16 17 21 12 16 7"/>
              <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
          </button>
        </template>
        <RouterLink v-else to="/login" class="navbar__icon-btn navbar__icon-btn--desktop" aria-label="Iniciar sesión" title="Iniciar sesión">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
            <circle cx="12" cy="7" r="4"/>
          </svg>
        </RouterLink>

        <!-- Cart (always visible) -->
        <button class="navbar__cart" @click="uiStore.toggleCart()" :aria-label="`Abrir carrito (${totalItems})`">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
            <line x1="3" y1="6" x2="21" y2="6"/>
            <path d="M16 10a4 4 0 01-8 0"/>
          </svg>
          <span class="navbar__cart-label">Carrito</span>
          <span v-if="totalItems > 0" class="navbar__cart-badge">{{ totalItems }}</span>
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
        <nav class="container navbar__mobile-nav" aria-label="Menú móvil">
          <RouterLink to="/" class="navbar__mobile-link" @click="uiStore.closeMenu()">Inicio</RouterLink>
          <RouterLink to="/tienda" class="navbar__mobile-link" @click="uiStore.closeMenu()">Tienda</RouterLink>
          <RouterLink to="/nosotros" class="navbar__mobile-link" @click="uiStore.closeMenu()">Nosotros</RouterLink>
          <RouterLink to="/aliados" class="navbar__mobile-link" @click="uiStore.closeMenu()">Aliados</RouterLink>
          <RouterLink to="/carrito" class="navbar__mobile-link" @click="uiStore.closeMenu()">
            Carrito <span class="navbar__mobile-count">{{ totalItems }}</span>
          </RouterLink>
          <RouterLink to="/rastrear" class="navbar__mobile-link" @click="uiStore.closeMenu()">
            Rastrear pedido <i class="fa-solid fa-truck-fast"></i>
          </RouterLink>

          <div class="navbar__mobile-sep" aria-hidden="true"></div>

          <template v-if="authStore.isAuthenticated">
            <RouterLink to="/perfil" class="navbar__mobile-sub" @click="uiStore.closeMenu()">
              <i class="fa-regular fa-user"></i> Mi perfil
            </RouterLink>
            <RouterLink v-if="authStore.isAdmin" to="/admin" class="navbar__mobile-sub" @click="uiStore.closeMenu()">
              <i class="fa-solid fa-shield-halved"></i> Panel Admin
            </RouterLink>
            <button class="navbar__mobile-sub navbar__mobile-sub--danger" @click="confirmLogout()">
              <i class="fa-solid fa-right-from-bracket"></i> Cerrar sesión
            </button>
          </template>
          <RouterLink v-else to="/login" class="navbar__mobile-sub" @click="uiStore.closeMenu()">
            <i class="fa-regular fa-user"></i> Iniciar sesión
          </RouterLink>
          <button class="navbar__mobile-sub" @click="uiStore.toggleTheme()">
            <i :class="isDark ? 'fa-solid fa-sun' : 'fa-solid fa-moon'"></i>
            {{ isDark ? 'Modo claro' : 'Modo oscuro' }}
          </button>
        </nav>
      </div>
    </Transition>
  </header>
</template>

<style lang="scss" scoped>
.navbar {
  position: sticky;
  top: 0;
  z-index: 1000;
  height: 64px;
  background-color: var(--navbar-bg);
  border-bottom: 1px solid transparent;
  backdrop-filter: saturate(1.4) blur(14px);
  -webkit-backdrop-filter: saturate(1.4) blur(14px);
  transition: background-color 0.3s ease, border-color 0.3s ease;

  @media (min-width: 1024px) {
    height: 76px;
  }

  &--scrolled {
    background-color: var(--navbar-bg-scrolled);
    border-bottom-color: var(--color-border);
  }

  &__inner {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
  }

  // ── Logo ─────────────────────────────
  &__logo {
    display: flex;
    align-items: center;
    gap: 0.625rem;
    flex-shrink: 0;
    min-height: 44px;
  }

  &__logo-mark {
    display: grid;
    place-items: center;
    width: 38px;
    height: 38px;
    border-radius: 50%;
    background-color: var(--color-accent);
    color: var(--color-on-accent);
    font-size: 1rem;
  }

  &__logo-text {
    display: flex;
    flex-direction: column;
    line-height: 1;
  }

  &__logo-name {
    font-family: var(--font-heading);
    font-size: 1.125rem;
    font-weight: 600;
    color: var(--color-primary);
    letter-spacing: -0.01em;
  }

  &__logo-tagline {
    font-size: 0.625rem;
    font-weight: 600;
    color: var(--color-muted);
    letter-spacing: 0.14em;
    text-transform: uppercase;
    margin-top: 4px;
  }

  // ── Desktop nav ──────────────────────
  &__nav {
    display: none;
    align-items: center;
    gap: 0.25rem;

    @media (min-width: 1024px) {
      display: flex;
    }
  }

  &__link {
    position: relative;
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    padding: 0.5rem 0.85rem;
    font-size: 0.9rem;
    font-weight: 500;
    color: var(--color-muted);
    border-radius: $radius-full;
    transition: color 0.2s ease, background-color 0.2s ease;

    &:hover {
      color: var(--color-primary);
      background-color: var(--color-bg-subtle);
    }

    &.router-link-exact-active {
      color: var(--color-primary);

      &::after {
        content: '';
        position: absolute;
        left: 50%;
        bottom: 2px;
        width: 4px;
        height: 4px;
        border-radius: 50%;
        background-color: var(--color-accent);
        transform: translateX(-50%);
      }
    }

    &--admin {
      color: var(--color-accent);
    }
  }

  // ── Actions ──────────────────────────
  &__actions {
    display: flex;
    align-items: center;
    gap: 0.25rem;
  }

  &__icon-btn {
    display: inline-grid;
    place-items: center;
    width: 44px;
    height: 44px;
    border-radius: 50%;
    color: var(--color-muted);
    transition: color 0.2s ease, background-color 0.2s ease;

    &:hover {
      color: var(--color-primary);
      background-color: var(--color-bg-subtle);
    }

    &--desktop {
      display: none;

      @media (min-width: 1024px) {
        display: inline-grid;
      }
    }
  }

  &__role-chip {
    display: none;
    align-items: center;
    gap: 0.4rem;
    min-height: 36px;
    padding: 0 0.85rem;
    font-size: 0.8rem;
    font-weight: 600;
    color: var(--color-accent);
    background-color: var(--color-accent-light);
    border-radius: $radius-full;

    @media (min-width: 1024px) {
      display: inline-flex;
    }
  }

  &__cart {
    position: relative;
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    min-height: 44px;
    min-width: 44px;
    justify-content: center;
    padding: 0 0.75rem;
    margin-left: 0.25rem;
    font-size: 0.875rem;
    font-weight: 600;
    color: var(--color-on-inverse);
    background-color: var(--color-bg-inverse);
    border-radius: $radius-full;
    transition: transform 0.15s ease, opacity 0.2s ease;

    &:hover { opacity: 0.9; }
    &:active { transform: scale(0.96); }

    @media (min-width: 1024px) {
      padding: 0 1.1rem;
    }
  }

  &__cart-label {
    display: none;

    @media (min-width: 1024px) {
      display: inline;
    }
  }

  &__cart-badge {
    display: inline-grid;
    place-items: center;
    min-width: 20px;
    height: 20px;
    padding: 0 6px;
    font-size: 0.7rem;
    font-weight: 700;
    color: var(--color-on-accent);
    background-color: var(--color-accent);
    border-radius: $radius-full;
  }

  // ── Hamburger ────────────────────────
  &__hamburger {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 5px;
    width: 44px;
    height: 44px;
    border-radius: 50%;

    &:hover { background-color: var(--color-bg-subtle); }

    @media (min-width: 1024px) {
      display: none;
    }
  }

  // ── Mobile menu ──────────────────────
  &__mobile-menu {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    max-height: calc(100dvh - 64px);
    overflow-y: auto;
    background-color: var(--navbar-mobile-bg);
    border-bottom: 1px solid var(--color-border);
    box-shadow: var(--shadow-lg);

    @media (min-width: 1024px) {
      display: none;
    }
  }

  &__mobile-nav {
    display: flex;
    flex-direction: column;
    padding-top: 0.75rem;
    padding-bottom: 1.25rem;
  }

  &__mobile-link {
    display: flex;
    align-items: center;
    justify-content: space-between;
    min-height: 54px;
    font-family: var(--font-heading);
    font-size: 1.375rem;
    font-weight: 500;
    color: var(--color-primary);
    border-bottom: 1px solid var(--color-border);

    i { font-size: 1rem; color: var(--color-muted); }

    &.router-link-exact-active { color: var(--color-accent); }
  }

  &__mobile-count {
    display: inline-grid;
    place-items: center;
    min-width: 28px;
    height: 28px;
    padding: 0 8px;
    font-family: var(--font-body);
    font-size: 0.8rem;
    font-weight: 700;
    color: var(--color-on-accent);
    background-color: var(--color-accent);
    border-radius: $radius-full;
  }

  &__mobile-sep {
    height: 0.75rem;
  }

  &__mobile-sub {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    min-height: 46px;
    font-size: 0.95rem;
    font-weight: 500;
    color: var(--color-muted);
    text-align: left;

    i { width: 18px; text-align: center; }

    &:hover { color: var(--color-primary); }

    &--danger { color: var(--color-error); }
  }
}

.hamburger-line {
  display: block;
  width: 20px;
  height: 1.75px;
  border-radius: 2px;
  background-color: var(--color-primary);
  transition: transform 0.3s ease, opacity 0.2s ease;

  &--top-open { transform: translateY(6.75px) rotate(45deg); }
  &--mid-open { opacity: 0; }
  &--bot-open { transform: translateY(-6.75px) rotate(-45deg); }
}

.theme-icon-enter-active,
.theme-icon-leave-active {
  transition: transform 0.25s ease, opacity 0.2s ease;
}
.theme-icon-enter-from { transform: rotate(-90deg) scale(0.6); opacity: 0; }
.theme-icon-leave-to { transform: rotate(90deg) scale(0.6); opacity: 0; }
</style>
