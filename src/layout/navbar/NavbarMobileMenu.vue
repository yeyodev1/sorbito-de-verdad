<script setup lang="ts">
import { RouterLink } from 'vue-router';
import { useNavbarSession } from './useNavbarSession';

const { authStore, uiStore, isDark, totalItems, isMenuOpen, confirmLogout } = useNavbarSession();
</script>

<template>
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
</template>

<style lang="scss" scoped>
.navbar {
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
</style>
