<script setup lang="ts">
import { computed, ref } from 'vue';
import { RouterLink } from 'vue-router';
import { useProductsStore } from '../stores/products';
import ProductCard from './ProductCard.vue';

const productsStore = useProductsStore();

const featured = computed(() => productsStore.featured);
const loading = computed(() => productsStore.loading);

const rail = ref<HTMLElement | null>(null);

// Desplaza el carrusel casi una "pantalla" de tarjetas
function scrollRail(dir: 1 | -1) {
  const el = rail.value;
  if (!el) return;
  el.scrollBy({ left: dir * el.clientWidth * 0.85, behavior: 'smooth' });
}
</script>

<template>
  <section class="featured" aria-labelledby="featured-title">
    <div class="container">
      <div class="featured__header">
        <div>
          <span class="eyebrow">Lo más pedido</span>
          <h2 id="featured-title" class="featured__title">Nuestras <em>tazas</em></h2>
          <p class="featured__subtitle">Estándar (250 ml) o XXL · IVA y envío incluidos.</p>
        </div>
        <RouterLink to="/tienda" class="featured__all">Ver todo <i class="fa-solid fa-arrow-right"></i></RouterLink>
        <div class="featured__controls">
          <button type="button" class="featured__arrow" aria-label="Anterior" @click="scrollRail(-1)">
            <i class="fa-solid fa-arrow-left"></i>
          </button>
          <button type="button" class="featured__arrow" aria-label="Siguiente" @click="scrollRail(1)">
            <i class="fa-solid fa-arrow-right"></i>
          </button>
        </div>
      </div>
    </div>

    <!-- Carrusel: se sale del contenedor para sentirse más amplio -->
    <div v-if="loading" class="featured__rail">
      <div v-for="i in 4" :key="`sk-${i}`" class="featured__slide">
        <div class="skeleton featured__sk"></div>
      </div>
    </div>

    <div v-else-if="featured.length > 0" ref="rail" class="featured__rail">
      <div v-for="product in featured" :key="product._id" class="featured__slide">
        <ProductCard :product="product" :show-badge="true" />
      </div>
      <RouterLink to="/tienda" class="featured__slide featured__more">
        <span class="featured__more-icon"><i class="fa-solid fa-arrow-right"></i></span>
        Ver toda la tienda
      </RouterLink>
    </div>

    <div v-else class="container">
      <div class="featured__empty">
        <p>Pronto tendremos productos destacados para ti. ¡Vuelve pronto!</p>
        <RouterLink to="/tienda" class="btn-outline">Explorar tienda</RouterLink>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.featured {
  padding: 3rem 0;

  @media (min-width: 768px) {
    padding: 5rem 0;
  }

  &__header {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    gap: 1rem;
    margin-bottom: 1.5rem;
  }

  &__title {
    margin: 0.4rem 0 0.35rem;
    font-size: clamp(2rem, 5vw, 3.5rem);
  }

  &__subtitle {
    font-size: 0.95rem;
  }

  &__controls {
    display: none;
    gap: 0.5rem;

    @media (min-width: 768px) {
      display: flex;
    }

    @media (min-width: 1100px) {
      display: none;
    }
  }

  &__all {
    display: none;
    align-items: center;
    gap: 0.4rem;
    min-height: 44px;
    font-size: 0.875rem;
    font-weight: 600;
    white-space: nowrap;

    i { font-size: 0.75rem; transition: transform 0.2s ease; }
    &:hover i { transform: translateX(3px); }

    @media (min-width: 1100px) { display: inline-flex; }
  }

  &__arrow {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 48px;
    height: 48px;
    color: var(--color-primary);
    border: 1.5px solid var(--color-border-strong);
    border-radius: 50%;
    transition: background-color 0.2s ease, color 0.2s ease, border-color 0.2s ease;

    &:hover {
      color: var(--color-on-inverse);
      background-color: var(--color-bg-inverse);
      border-color: var(--color-bg-inverse);
    }
  }

  // Carril horizontal con scroll-snap; alineado al borde del contenedor
  &__rail {
    --gutter: 1rem;

    display: flex;
    gap: 0.875rem;
    padding: 0.25rem var(--gutter) 1rem;
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    scroll-padding-inline: var(--gutter);
    scrollbar-width: none;

    &::-webkit-scrollbar { display: none; }

    @media (min-width: 768px) {
      --gutter: 2rem;
      gap: 1.25rem;
    }

    // En escritorio deja de ser carrusel: grilla de 4 dentro del contenedor
    @media (min-width: 1100px) {
      flex-wrap: wrap;
      gap: 1.5rem;
      max-width: 1280px;
      margin: 0 auto;
      padding: 0.25rem 2rem 0;
      overflow: visible;
    }

    @media (min-width: 1280px) {
      padding-inline: 2.5rem;
    }
  }

  &__slide {
    flex: 0 0 74%;
    display: flex;
    scroll-snap-align: start;

    > * { flex: 1; }

    @media (min-width: 560px) { flex-basis: 46%; }
    @media (min-width: 900px) { flex-basis: 31%; }
    @media (min-width: 1100px) { flex-basis: calc((100% - 4.5rem) / 4); min-width: 0; }
  }

  &__sk {
    aspect-ratio: 4 / 6;
    border-radius: $radius-xl;
  }

  &__more {
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 0.875rem;
    min-height: 280px;
    font-family: var(--font-heading);
    font-size: 1.25rem;
    font-weight: 600;
    letter-spacing: -0.02em;
    border: 1.5px dashed var(--color-border-strong);
    border-radius: $radius-xl;
    transition: background-color 0.2s ease;

    &:hover { background-color: var(--color-bg-subtle); }

    // En la grilla de escritorio ya hay link "Ver todo" arriba
    @media (min-width: 1100px) { display: none; }
  }

  &__more-icon {
    flex: 0 0 auto !important;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 56px;
    height: 56px;
    color: var(--color-on-accent);
    background-color: var(--color-accent);
    border-radius: 50%;
  }

  &__empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1.5rem;
    padding: 4rem 1rem;
    text-align: center;
    background-color: var(--color-bg-subtle);
    border-radius: $radius-xl;
  }
}
</style>
