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
    <div class="container">
      <div class="navbar__inner">
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
    </div>

    <!-- Mobile Drawer -->
    <NavbarMobileMenu />
  </header>
</template>

<style lang="scss" scoped>
// Navbar flotante: una cápsula dentro del contenedor
.navbar {
  position: sticky;
  top: 0;
  z-index: 1000;
  height: 64px;
  padding: 6px 0;

  @media (min-width: 1024px) {
    height: 76px;
    padding: 8px 0;
  }

  &__inner {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    padding: 0 0.375rem 0 0.75rem;
    background-color: var(--navbar-bg);
    border: 1px solid var(--color-border);
    border-radius: $radius-full;
    backdrop-filter: saturate(1.6) blur(16px);
    -webkit-backdrop-filter: saturate(1.6) blur(16px);
    transition: background-color 0.3s ease, box-shadow 0.3s ease;

    @media (min-width: 1024px) {
      padding: 0 0.5rem 0 1rem;
    }
  }

  &--scrolled &__inner {
    background-color: var(--navbar-bg-scrolled);
    box-shadow: var(--shadow-md);
  }

  // ── Logo ─────────────────────────────
  &__logo {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    flex-shrink: 0;
    min-height: 44px;
  }

  &__logo-mark {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 34px;
    height: 34px;
    border-radius: 50%;
    background-color: var(--color-accent);
    color: var(--color-on-accent);
    font-size: 0.9rem;
    transform: rotate(-8deg);
  }

  &__logo-text {
    display: flex;
    flex-direction: column;
    line-height: 1;
  }

  &__logo-name {
    font-family: var(--font-heading);
    font-size: 1.0625rem;
    font-weight: 700;
    color: var(--color-primary);
    letter-spacing: -0.03em;
  }

  &__logo-tagline {
    display: none;
  }

  // ── Desktop nav: control segmentado ──
  &__nav {
    display: none;
    align-items: center;
    gap: 2px;
    padding: 4px;
    background-color: var(--color-bg-subtle);
    border-radius: $radius-full;

    @media (min-width: 1024px) {
      display: flex;
    }
  }

  &__link {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    min-height: 36px;
    padding: 0 0.95rem;
    font-size: 0.875rem;
    font-weight: 500;
    color: var(--color-muted);
    border-radius: $radius-full;
    transition: color 0.2s ease, background-color 0.2s ease, box-shadow 0.2s ease;

    &:hover { color: var(--color-primary); }

    &.router-link-exact-active {
      color: var(--color-primary);
      background-color: var(--color-bg-card);
      box-shadow: var(--shadow-sm);
    }

    &--admin { color: var(--color-accent); }
  }
}
</style>
