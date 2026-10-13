<script setup lang="ts">
import { computed } from 'vue';
import { RouterLink, useRoute } from 'vue-router';

const route = useRoute();
// En carrito y pago no distraemos con otra llamada a comprar
const showCta = computed(() => !['/checkout', '/carrito'].includes(route.path));
</script>

<template>
  <footer class="footer">
    <div class="container">
      <!-- CTA band -->
      <div v-if="showCta" class="footer__cta">
        <div>
          <p class="eyebrow">Hecho a mano en Ecuador</p>
          <h2 class="footer__cta-title">Tu próximo café merece<br /> una taza de verdad.</h2>
        </div>
        <RouterLink to="/tienda" class="btn-primary btn-lg">
          Comprar ahora <i class="fa-solid fa-arrow-right"></i>
        </RouterLink>
      </div>

      <div class="footer__inner">
        <!-- Brand -->
        <div class="footer__brand">
          <RouterLink to="/" class="footer__logo">
            <span class="footer__logo-mark" aria-hidden="true"><i class="fa-solid fa-mug-hot"></i></span>
            <span class="footer__logo-name">Sorbito de Verdad</span>
          </RouterLink>
          <p class="footer__tagline">
            Tazas artesanales hechas con amor en Ecuador. Arcilla, diseño y café en cada pieza.
          </p>
          <div class="footer__social">
            <a href="https://www.instagram.com/anderssonboscan/" target="_blank" rel="noopener" class="footer__social-link" aria-label="Instagram">
              <i class="fa-brands fa-instagram"></i>
            </a>
            <a href="https://api.whatsapp.com/send/?phone=593962861148&text=%C2%A1Hola!%20%F0%9F%91%8B%20Quiero%20ver%20el%20cat%C3%A1logo%20%F0%9F%9B%92&type=phone_number&app_absent=0" target="_blank" rel="noopener" class="footer__social-link" aria-label="WhatsApp">
              <i class="fa-brands fa-whatsapp"></i>
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
            <a href="https://www.instagram.com/anderssonboscan/" target="_blank" rel="noopener" class="footer__link">Instagram del Fundador</a>
          </nav>
        </div>

        <!-- Cuenta -->
        <div class="footer__col">
          <h4 class="footer__col-title">Cuenta</h4>
          <nav class="footer__nav">
            <RouterLink to="/login" class="footer__link">Iniciar Sesión</RouterLink>
            <RouterLink to="/perfil" class="footer__link">Mi Perfil</RouterLink>
            <RouterLink to="/carrito" class="footer__link">Carrito</RouterLink>
            <RouterLink to="/rastrear" class="footer__link">Rastrear pedido</RouterLink>
          </nav>
        </div>
      </div>

      <!-- Bottom bar -->
      <div class="footer__bottom">
        <p class="footer__copyright">
          © 2026 Sorbito de Verdad · Hecho con amor en Ecuador
        </p>
        <div class="footer__credits">
          <span>Tazas por
            <a href="https://www.instagram.com/franzdelcastillo/" target="_blank" rel="noopener" class="footer__credits-link">Franz Del Castillo</a>
          </span>
          <span aria-hidden="true">·</span>
          <span>Web por
            <a href="https://yeyo.dev/" target="_blank" rel="noopener" class="footer__credits-link">yeyo.dev</a>
          </span>
          <span aria-hidden="true">·</span>
          <span>Agencia
            <a href="https://bakano.ec/" target="_blank" rel="noopener" class="footer__credits-link">Bakano</a>
          </span>
        </div>
      </div>
    </div>
  </footer>
</template>

<style lang="scss" scoped>
.footer {
  margin-top: auto;
  background-color: var(--color-bg-subtle);
  border-top: 1px solid var(--color-border);

  &__cta {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    padding: 3.5rem 0 3rem;
    border-bottom: 1px solid var(--color-border);

    @media (min-width: 768px) {
      flex-direction: row;
      align-items: flex-end;
      justify-content: space-between;
      padding: 5rem 0 4rem;
    }
  }

  &__cta-title {
    margin-top: 0.75rem;
    font-size: clamp(1.75rem, 4vw, 2.75rem);
    font-weight: 500;
  }

  &__inner {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2.5rem 1.5rem;
    padding: 3rem 0;

    @media (min-width: 1024px) {
      grid-template-columns: 1.6fr repeat(3, 1fr);
      gap: 3rem;
    }
  }

  &__brand {
    grid-column: 1 / -1;

    @media (min-width: 1024px) {
      grid-column: auto;
    }
  }

  &__logo {
    display: inline-flex;
    align-items: center;
    gap: 0.625rem;
  }

  &__logo-mark {
    display: grid;
    place-items: center;
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background-color: var(--color-accent);
    color: var(--color-on-accent);
    font-size: 0.95rem;
  }

  &__logo-name {
    font-family: var(--font-heading);
    font-size: 1.25rem;
    font-weight: 600;
    color: var(--color-primary);
  }

  &__tagline {
    max-width: 34ch;
    margin-top: 1rem;
    font-size: 0.925rem;
  }

  &__social {
    display: flex;
    gap: 0.5rem;
    margin-top: 1.25rem;
  }

  &__social-link {
    display: grid;
    place-items: center;
    width: 44px;
    height: 44px;
    border-radius: 50%;
    border: 1px solid var(--color-border-strong);
    color: var(--color-primary);
    font-size: 1.05rem;
    transition: background-color 0.2s ease, color 0.2s ease, border-color 0.2s ease;

    &:hover {
      background-color: var(--color-accent);
      border-color: var(--color-accent);
      color: var(--color-on-accent);
    }
  }

  &__col-title {
    margin-bottom: 0.75rem;
    font-family: var(--font-body);
    font-size: 0.75rem;
    font-weight: 600;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--color-muted);
  }

  &__nav {
    display: flex;
    flex-direction: column;
  }

  &__link {
    display: inline-flex;
    align-items: center;
    min-height: 36px;
    font-size: 0.925rem;
    color: var(--color-primary);
    transition: color 0.2s ease;

    &:hover { color: var(--color-accent); }
  }

  &__bottom {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    padding: 1.5rem 0 2rem;
    border-top: 1px solid var(--color-border);
    font-size: 0.8125rem;
    color: var(--color-muted);

    @media (min-width: 768px) {
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
    }
  }

  &__copyright {
    font-size: inherit;
  }

  &__credits {
    display: flex;
    flex-wrap: wrap;
    gap: 0.4rem 0.6rem;
  }

  &__credits-link {
    color: var(--color-primary);
    font-weight: 500;
    text-decoration: underline;
    text-decoration-color: var(--color-border-strong);
    text-underline-offset: 3px;

    &:hover { color: var(--color-accent); }
  }
}
</style>
