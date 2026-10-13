<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { RouterLink } from 'vue-router';
import NavbarActions from './navbar/NavbarActions.vue';
import NavbarMobileMenu from './navbar/NavbarMobileMenu.vue';
import { useNavbarSession } from './navbar/useNavbarSession';

const { authStore, uiStore, isMenuOpen } = useNavbarSession();

const isScrolled = ref(false);

function handleScroll() {
  isScrolled.value = window.scrollY > 20;
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true });
});
onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});
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
      <NavbarActions />
    </div>

    <!-- Mobile Drawer -->
    <NavbarMobileMenu />
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
}
</style>
