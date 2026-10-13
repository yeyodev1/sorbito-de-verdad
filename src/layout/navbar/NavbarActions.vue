<script setup lang="ts">
import { RouterLink } from 'vue-router';
import { useNavbarSession } from './useNavbarSession';

const { authStore, uiStore, isDark, totalItems, isMenuOpen, confirmLogout } = useNavbarSession();
</script>

<template>
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
</template>

<style lang="scss" scoped>
.navbar {
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
    min-height: 42px;
    min-width: 42px;
    justify-content: center;
    padding: 0 0.75rem;
    margin-left: 0.25rem;
    font-size: 0.875rem;
    font-weight: 600;
    color: var(--color-on-accent);
    background-color: var(--color-accent);
    border-radius: $radius-full;
    transition: transform 0.15s ease, background-color 0.2s ease;

    &:hover { background-color: var(--color-accent-hover); }
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
    color: var(--color-accent);
    background-color: var(--color-on-accent);
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
