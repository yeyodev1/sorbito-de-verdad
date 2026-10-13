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
          <p class="footer__cta-eyebrow">Hecho a mano en Ecuador</p>
          <h2 class="footer__cta-title">Tu próximo café merece <em>una taza de verdad.</em></h2>
        </div>
        <RouterLink to="/tienda" class="footer__cta-btn">
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

      <!-- Marca en grande -->
      <p class="footer__wordmark" aria-hidden="true">Sorbito <em>de Verdad</em></p>

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

<style lang="scss" scoped src="./Footer.scss"></style>
