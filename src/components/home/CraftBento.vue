<script setup lang="ts">
import { RouterLink } from 'vue-router';

const CRAFT_IMG = 'https://res.cloudinary.com/dpjzfua3n/image/upload/q_auto,f_auto,w_900/v1775351853/sorbito-de-verdad/products/zz1hijsvu1a6npoty3sn.jpg';
const SPLASH_IMG = 'https://res.cloudinary.com/dpjzfua3n/image/upload/q_auto,f_auto,w_700/v1775351858/sorbito-de-verdad/products/zrl0xmlbrhduqdwma6mh.jpg';
</script>

<template>
  <section class="bento" aria-labelledby="bento-title">
    <div class="container">
      <h2 id="bento-title" class="bento__title">Artesanía <em>con alma</em></h2>

      <div class="bento__grid">
        <figure class="bento__cell bento__cell--photo">
          <img :src="CRAFT_IMG" alt="Tazas artesanales apiladas" loading="lazy" decoding="async" />
        </figure>

        <div class="bento__side">
        <div class="bento__row">
        <blockquote class="bento__cell bento__cell--quote">
          <i class="fa-solid fa-quote-left" aria-hidden="true"></i>
          <p>Cada taza nace de manos que conocen el barro, el fuego y la paciencia.</p>
        </blockquote>

        <div class="bento__cell bento__cell--stat bento__cell--sage">
          <strong>100%</strong>
          <span>hecho a mano en Ecuador</span>
        </div>
        </div>

        <div class="bento__row">

        <div class="bento__cell bento__cell--stat bento__cell--butter">
          <strong>2</strong>
          <span>tamaños: Estándar 250 ml y XXL</span>
        </div>

        <figure class="bento__cell bento__cell--splash">
          <img :src="SPLASH_IMG" alt="" loading="lazy" decoding="async" />
        </figure>

        <RouterLink to="/nosotros" class="bento__cell bento__cell--cta">
          <span>Conoce la historia detrás de cada pieza</span>
          <span class="bento__cta-icon" aria-hidden="true"><i class="fa-solid fa-arrow-right"></i></span>
        </RouterLink>
        </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.bento {
  padding: 1rem 0 3rem;

  @media (min-width: 768px) {
    padding: 1rem 0 5rem;
  }

  &__title {
    margin-bottom: 1.25rem;
    font-size: clamp(2rem, 5vw, 3.5rem);
  }

  // Móvil: todas las celdas fluyen en un solo flex-wrap (side/row "desaparecen").
  // Escritorio: foto a la izquierda y dos filas flex a la derecha.
  &__grid {
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;

    @media (min-width: 900px) {
      flex-wrap: nowrap;
      gap: 1rem;
    }
  }

  &__side,
  &__row {
    display: contents;

    @media (min-width: 900px) {
      display: flex;
      gap: 1rem;
      min-width: 0;
    }
  }

  &__side {
    @media (min-width: 900px) {
      flex: 3 1 0;
      flex-direction: column;
    }
  }

  &__row {
    @media (min-width: 900px) {
      flex: 1 1 0;
      min-height: 210px;

      > * { flex: 1 1 0; min-width: 0; }
    }
  }

  &__cell {
    position: relative;
    margin: 0;
    overflow: hidden;
    border-radius: $radius-xl;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    &--photo {
      flex: 1 1 100%;
      aspect-ratio: 4 / 3;

      @media (min-width: 900px) {
        flex: 1 1 0;
        min-width: 0;
        aspect-ratio: auto;
      }
    }

    &--quote {
      flex: 1 1 100%;

      display: flex;
      flex-direction: column;
      justify-content: space-between;
      gap: 1.5rem;
      padding: 1.5rem;
      color: var(--tile-ink);
      background-color: var(--tile-peach);

      @media (min-width: 900px) { flex: 2 1 0 !important; }

      i { font-size: 1.5rem; opacity: 0.4; }

      p {
        font-family: var(--font-accent);
        font-size: clamp(1.5rem, 3vw, 2.25rem);
        font-style: italic;
        line-height: 1.15;
        color: inherit;
      }
    }

    &--stat {
      flex: 1 1 calc(50% - 0.375rem);
      min-width: 0;
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
      gap: 0.25rem;
      min-height: 160px;
      padding: 1.25rem;
      color: var(--tile-ink);

      @media (min-width: 900px) { flex: 1 1 0; }

      strong {
        font-family: var(--font-heading);
        font-size: clamp(2.5rem, 6vw, 4rem);
        font-weight: 700;
        line-height: 1;
        letter-spacing: -0.05em;
      }

      span { font-size: 0.85rem; opacity: 0.75; }
    }

    &--sage { background-color: var(--tile-sage); }
    &--butter { background-color: var(--tile-butter); }

    &--splash {
      display: none;

      @media (min-width: 900px) {
        display: block;
      }
    }

    &--cta {
      flex: 1 1 100%;

      display: flex;
      align-items: flex-end;
      justify-content: space-between;
      gap: 1rem;
      min-height: 140px;
      padding: 1.25rem;
      font-family: var(--font-heading);
      font-size: 1.25rem;
      font-weight: 600;
      line-height: 1.2;
      letter-spacing: -0.02em;
      color: var(--color-on-accent);
      background-color: var(--color-accent);
      transition: background-color 0.2s ease;

      @media (min-width: 900px) { flex: 1 1 0; min-width: 0; }

      &:hover { background-color: var(--color-accent-hover); }

    }
  }

  &__cta-icon {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 44px;
    height: 44px;
    color: var(--color-accent);
    background-color: var(--color-on-accent);
    border-radius: 50%;
    transform: rotate(-45deg);
    transition: transform 0.25s ease;

    .bento__cell--cta:hover & { transform: rotate(0deg); }
  }
}
</style>
