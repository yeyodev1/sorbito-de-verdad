<script setup lang="ts">
import { RouterLink } from 'vue-router';
</script>

<template>
  <footer class="footer">
    <div class="container footer__inner">
      <div class="footer__brand">
        <div class="footer__logo">
          <i class="fa-solid fa-mug-hot footer__logo-icon"></i>
          <span class="footer__logo-name">Sorbito de Verdad</span>
        </div>
        <p class="footer__tagline">Un sorbito con alma venezolana</p>
        <div class="footer__social">
          <a href="https://instagram.com/sorbitodeverdad" target="_blank" rel="noopener" class="footer__social-link" aria-label="Instagram">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"/>
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
            </svg>
          </a>
          <a href="https://wa.me/584140000000" target="_blank" rel="noopener" class="footer__social-link" aria-label="WhatsApp">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"/>
            </svg>
          </a>
        </div>
      </div>

      <div class="footer__links">
        <h4 class="footer__links-title">Tienda</h4>
        <nav>
          <RouterLink to="/tienda" class="footer__link">Todos los productos</RouterLink>
          <RouterLink to="/tienda?collection=boscan" class="footer__link">Colección Boscan</RouterLink>
          <RouterLink to="/tienda?collection=moni" class="footer__link">Colección La Moni</RouterLink>
          <RouterLink to="/tienda?collection=rustica" class="footer__link">Artesanal Rústica</RouterLink>
          <RouterLink to="/tienda?collection=set" class="footer__link">Sets de Colección</RouterLink>
        </nav>
      </div>

      <div class="footer__links">
        <h4 class="footer__links-title">Nosotros</h4>
        <nav>
          <RouterLink to="/nosotros" class="footer__link">Nuestra Historia</RouterLink>
          <RouterLink to="/nosotros#valores" class="footer__link">Valores</RouterLink>
        </nav>
      </div>

      <div class="footer__links">
        <h4 class="footer__links-title">Cuenta</h4>
        <nav>
          <RouterLink to="/login" class="footer__link">Iniciar Sesión</RouterLink>
          <RouterLink to="/perfil" class="footer__link">Mi Perfil</RouterLink>
          <RouterLink to="/carrito" class="footer__link">Carrito</RouterLink>
        </nav>
      </div>
    </div>

    <div class="footer__bottom">
      <div class="container footer__bottom-inner">
        <p class="footer__copyright">
          © 2026 Sorbito de Verdad. Hecho con amor en Venezuela.
        </p>
        <div class="footer__credits-group">
          <span class="footer__credits-item">
            <i class="fa-solid fa-mug-hot footer__credits-icon"></i>
            Tazas por
            <a href="https://www.instagram.com/franzdelcastillo/" target="_blank" rel="noopener" class="footer__credits-link">Franz Del Castillo</a>
          </span>
          <span class="footer__credits-sep">·</span>
          <span class="footer__credits-item">
            <i class="fa-solid fa-globe footer__credits-icon"></i>
            Web por
            <a href="https://yeyo.dev/" target="_blank" rel="noopener" class="footer__credits-link">yeyo.dev</a>
          </span>
          <span class="footer__credits-sep">·</span>
          <span class="footer__credits-item">
            <i class="fa-solid fa-rocket footer__credits-icon"></i>
            Agencia
            <a href="https://bakano.ec/" target="_blank" rel="noopener" class="footer__credits-link">Bakano</a>
          </span>
        </div>
      </div>
    </div>
  </footer>
</template>

<style lang="scss" scoped>
@use '../styles/colorVariables.module.scss' as *;

.footer {
  background-color: $color-primary;
  color: rgba(white, 0.7);
  margin-top: auto;

  &__inner {
    display: grid;
    grid-template-columns: 1.5fr repeat(3, 1fr);
    gap: 3rem;
    padding-top: 4rem;
    padding-bottom: 3rem;

    @media (max-width: 1024px) {
      grid-template-columns: repeat(2, 1fr);
      gap: 2.5rem;
    }

    @media (max-width: 600px) {
      grid-template-columns: 1fr;
      gap: 2rem;
      padding-top: 2.5rem;
      padding-bottom: 2rem;
    }
  }

  &__brand {
    display: flex;
    flex-direction: column;
    gap: 0.875rem;
  }

  &__logo {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  &__logo-icon {
    font-size: 1.5rem;
  }

  &__logo-name {
    font-family: var(--font-heading);
    font-size: 1.125rem;
    font-weight: 700;
    color: white;
  }

  &__tagline {
    font-size: 0.9375rem;
    color: rgba(white, 0.6);
    font-style: italic;
    line-height: 1.5;
  }

  &__social {
    display: flex;
    gap: 0.75rem;
    margin-top: 0.25rem;
  }

  &__social-link {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 38px;
    height: 38px;
    border-radius: $radius-sm;
    background-color: rgba(white, 0.08);
    color: rgba(white, 0.7);
    text-decoration: none;
    transition: all 0.2s ease;

    &:hover {
      background-color: $color-accent;
      color: white;
      transform: translateY(-2px);
    }
  }

  &__links-title {
    font-family: var(--font-heading);
    font-size: 0.9375rem;
    font-weight: 700;
    color: white;
    margin-bottom: 1rem;
    letter-spacing: 0.02em;
  }

  &__links nav {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  &__link {
    font-size: 0.9rem;
    color: rgba(white, 0.6);
    text-decoration: none;
    transition: color 0.2s ease;
    line-height: 1.5;

    &:hover {
      color: $color-accent-light;
    }
  }

  &__bottom {
    border-top: 1px solid rgba(white, 0.08);
  }

  &__bottom-inner {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    padding-top: 1.25rem;
    padding-bottom: 1.25rem;
    flex-wrap: wrap;

    @media (max-width: 768px) {
      flex-direction: column;
      gap: 0.5rem;
      text-align: center;
    }
  }

  &__copyright {
    font-size: 0.875rem;
    color: rgba(white, 0.5);
  }

  &__credits-group {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 0.375rem 0.75rem;

    @media (max-width: 600px) {
      justify-content: center;
      gap: 0.25rem 0.5rem;
    }
  }

  &__credits-item {
    display: inline-flex;
    align-items: center;
    gap: 0.3rem;
    font-size: 0.8125rem;
    color: rgba(white, 0.4);
  }

  &__credits-icon {
    font-size: 0.7rem;
    color: rgba($color-accent, 0.7);
  }

  &__credits-link {
    color: rgba(white, 0.55);
    text-decoration: none;
    font-weight: 500;
    transition: color 0.2s ease;

    &:hover {
      color: $color-accent;
    }
  }

  &__credits-sep {
    color: rgba(white, 0.2);
    font-size: 0.875rem;

    @media (max-width: 480px) {
      display: none;
    }
  }
}
</style>
