<script setup lang="ts">
import { RouterLink } from 'vue-router';
</script>

<template>
  <footer class="footer">
    <!-- Top accent line -->
    <div class="footer__accent-line"></div>

    <div class="container footer__inner">
      <!-- Brand -->
      <div class="footer__brand">
        <RouterLink to="/" class="footer__logo">
          <i class="fa-solid fa-mug-hot footer__logo-icon"></i>
          <div class="footer__logo-text">
            <span class="footer__logo-name">Sorbito de Verdad</span>
            <span class="footer__logo-sub">Tazas Artesanales</span>
          </div>
        </RouterLink>
        <p class="footer__tagline">
          Tazas artesanales hechas con amor en Ecuador.<br />
          Arcilla, diseño y café en cada pieza.
        </p>
        <div class="footer__social">
          <a href="https://instagram.com/sorbitodeverdad" target="_blank" rel="noopener" class="footer__social-link" aria-label="Instagram">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
              <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"/>
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
            </svg>
          </a>
          <a href="https://wa.me/584140000000" target="_blank" rel="noopener" class="footer__social-link" aria-label="WhatsApp">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"/>
            </svg>
          </a>
        </div>
      </div>

      <!-- Tienda -->
      <div class="footer__col">
        <h4 class="footer__col-title">Tienda</h4>
        <nav class="footer__nav">
          <RouterLink to="/tienda" class="footer__link">Todos los productos</RouterLink>
          <RouterLink to="/tienda?collection=boscan" class="footer__link">Colección Boscan</RouterLink>
          <RouterLink to="/tienda?collection=moni" class="footer__link">Colección La Moni</RouterLink>
          <RouterLink to="/tienda?collection=rustica" class="footer__link">Artesanal Rústica</RouterLink>
          <RouterLink to="/tienda?collection=set" class="footer__link">Sets de Colección</RouterLink>
        </nav>
      </div>

      <!-- Nosotros -->
      <div class="footer__col">
        <h4 class="footer__col-title">Nosotros</h4>
        <nav class="footer__nav">
          <RouterLink to="/nosotros" class="footer__link">Nuestra Historia</RouterLink>
          <RouterLink to="/nosotros#valores" class="footer__link">Valores</RouterLink>
          <RouterLink to="/aliados" class="footer__link">Aliados</RouterLink>
        </nav>
      </div>

      <!-- Cuenta -->
      <div class="footer__col">
        <h4 class="footer__col-title">Cuenta</h4>
        <nav class="footer__nav">
          <RouterLink to="/login" class="footer__link">Iniciar Sesión</RouterLink>
          <RouterLink to="/perfil" class="footer__link">Mi Perfil</RouterLink>
          <RouterLink to="/carrito" class="footer__link">Carrito</RouterLink>
        </nav>
      </div>
    </div>

    <!-- Bottom bar -->
    <div class="footer__bottom">
      <div class="container footer__bottom-inner">
        <p class="footer__copyright">
          © 2026 Sorbito de Verdad · Hecho con amor en Ecuador <i class="fa-solid fa-location-dot" style="color:#C8956C;font-size:0.75em;"></i>
        </p>
        <div class="footer__credits">
          <span class="footer__credits-item">
            <i class="fa-solid fa-mug-hot"></i>
            Tazas por
            <a href="https://www.instagram.com/franzdelcastillo/" target="_blank" rel="noopener" class="footer__credits-link">Franz Del Castillo</a>
          </span>
          <span class="footer__credits-sep">·</span>
          <span class="footer__credits-item">
            <i class="fa-solid fa-globe"></i>
            Web por
            <a href="https://yeyo.dev/" target="_blank" rel="noopener" class="footer__credits-link">yeyo.dev</a>
          </span>
          <span class="footer__credits-sep">·</span>
          <span class="footer__credits-item">
            <i class="fa-solid fa-rocket"></i>
            Agencia
            <a href="https://bakano.ec/" target="_blank" rel="noopener" class="footer__credits-link">Bakano</a>
          </span>
        </div>
      </div>
    </div>
  </footer>
</template>

<style lang="scss" scoped>

// Footer always uses its own dark palette — theme-independent
$footer-bg:          #0D0C0A;
$footer-bg-bottom:   #080807;
$footer-text:        rgba(255, 255, 255, 0.65);
$footer-text-dim:    rgba(255, 255, 255, 0.35);
$footer-text-bright: rgba(255, 255, 255, 0.9);
$footer-border:      rgba(255, 255, 255, 0.07);
$footer-accent:      #C8956C;

.footer {
  background-color: $footer-bg;
  margin-top: auto;

  &__accent-line {
    height: 3px;
    background: linear-gradient(
      to right,
      transparent 0%,
      rgba($footer-accent, 0.4) 20%,
      $footer-accent 50%,
      rgba($footer-accent, 0.4) 80%,
      transparent 100%
    );
  }

  &__inner {
    display: grid;
    grid-template-columns: 1.6fr repeat(3, 1fr);
    gap: 3rem;
    padding-top: 4rem;
    padding-bottom: 3.5rem;

    @media (max-width: 1024px) {
      grid-template-columns: repeat(2, 1fr);
      gap: 2.5rem 3rem;
    }

    @media (max-width: 600px) {
      grid-template-columns: 1fr;
      gap: 2rem;
      padding-top: 2.5rem;
      padding-bottom: 2rem;
    }
  }

  // ── Brand column ─────────────────────────────────────────
  &__brand {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  &__logo {
    display: inline-flex;
    align-items: center;
    gap: 0.625rem;
    text-decoration: none;
  }

  &__logo-icon {
    font-size: 1.625rem;
    color: $footer-accent;
    filter: drop-shadow(0 0 8px rgba($footer-accent, 0.4));
  }

  &__logo-text {
    display: flex;
    flex-direction: column;
    gap: 1px;
  }

  &__logo-name {
    font-family: var(--font-heading);
    font-size: 1.125rem;
    font-weight: 700;
    color: $footer-text-bright;
    line-height: 1.2;
  }

  &__logo-sub {
    font-size: 0.6875rem;
    font-weight: 500;
    color: $footer-accent;
    letter-spacing: 0.12em;
    text-transform: uppercase;
  }

  &__tagline {
    font-size: 0.875rem;
    color: $footer-text;
    line-height: 1.7;
    font-style: italic;
    max-width: 220px;
  }

  &__social {
    display: flex;
    gap: 0.625rem;
    margin-top: 0.25rem;
  }

  &__social-link {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 38px;
    height: 38px;
    border-radius: $radius-sm;
    background-color: rgba(255, 255, 255, 0.06);
    border: 1px solid $footer-border;
    color: $footer-text;
    text-decoration: none;
    transition: all 0.2s ease;

    &:hover {
      background-color: $footer-accent;
      border-color: $footer-accent;
      color: white;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba($footer-accent, 0.4);
    }
  }

  // ── Link columns ──────────────────────────────────────────
  &__col {
    display: flex;
    flex-direction: column;
  }

  &__col-title {
    font-family: var(--font-heading);
    font-size: 0.75rem;
    font-weight: 700;
    color: $footer-accent;
    margin-bottom: 1.125rem;
    letter-spacing: 0.1em;
    text-transform: uppercase;
  }

  &__nav {
    display: flex;
    flex-direction: column;
    gap: 0.625rem;
  }

  &__link {
    font-size: 0.9rem;
    color: $footer-text;
    text-decoration: none;
    transition: color 0.2s ease, padding-left 0.2s ease;
    line-height: 1.5;
    display: block;

    &:hover {
      color: $footer-text-bright;
      padding-left: 4px;
    }
  }

  // ── Bottom bar ────────────────────────────────────────────
  &__bottom {
    background-color: $footer-bg-bottom;
    border-top: 1px solid $footer-border;
  }

  &__bottom-inner {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    padding-top: 1.125rem;
    padding-bottom: 1.125rem;
    flex-wrap: wrap;

    @media (max-width: 768px) {
      flex-direction: column;
      gap: 0.5rem;
      text-align: center;
    }
  }

  &__copyright {
    font-size: 0.8125rem;
    color: $footer-text-dim;
  }

  &__credits {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 0.25rem 0.75rem;

    @media (max-width: 600px) {
      justify-content: center;
      gap: 0.2rem 0.5rem;
    }
  }

  &__credits-item {
    display: inline-flex;
    align-items: center;
    gap: 0.3rem;
    font-size: 0.8rem;
    color: $footer-text-dim;

    i {
      font-size: 0.6875rem;
      color: rgba($footer-accent, 0.6);
    }
  }

  &__credits-link {
    color: rgba(255, 255, 255, 0.5);
    text-decoration: none;
    font-weight: 500;
    transition: color 0.2s ease;

    &:hover {
      color: $footer-accent;
    }
  }

  &__credits-sep {
    color: rgba(255, 255, 255, 0.15);
    font-size: 0.875rem;

    @media (max-width: 480px) {
      display: none;
    }
  }
}
</style>
