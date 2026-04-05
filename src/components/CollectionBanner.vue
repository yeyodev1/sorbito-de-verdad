<script setup lang="ts">
import { RouterLink } from 'vue-router';

const BOSCAN_IMG = 'https://res.cloudinary.com/dpjzfua3n/image/upload/q_auto,f_auto,w_900/v1775351847/sorbito-de-verdad/products/ergzx1oqfuyxjdr07jpc.jpg';
const MONI_IMG   = 'https://res.cloudinary.com/dpjzfua3n/image/upload/q_auto,f_auto,w_900/v1775351849/sorbito-de-verdad/products/embdf62dtn0smhsefjqo.jpg';
const RUSTICA_IMG = 'https://res.cloudinary.com/dpjzfua3n/image/upload/q_auto,f_auto,w_900/v1775351850/sorbito-de-verdad/products/mgw2nzrguzruderiy2dn.jpg';
</script>

<template>
  <section class="collection-banner">

    <!-- Boscan -->
    <div class="collection-banner__card collection-banner__card--boscan">
      <div class="collection-banner__bg">
        <img :src="BOSCAN_IMG" alt="Taza Boscan" class="collection-banner__bg-img" loading="lazy" />
        <div class="collection-banner__bg-overlay collection-banner__bg-overlay--boscan"></div>
      </div>
      <div class="collection-banner__content">
        <span class="collection-banner__tag">Colección</span>
        <h2 class="collection-banner__heading">Boscan</h2>
        <p class="collection-banner__desc">
          Para el hombre con estilo y carácter. Gafas, barba y tinta negra
          que celebran la esencia masculina con elegancia artesanal.
        </p>
        <RouterLink to="/tienda?collection=boscan" class="collection-banner__cta collection-banner__cta--boscan">
          Explorar Boscan
          <i class="fa-solid fa-arrow-right"></i>
        </RouterLink>
      </div>
    </div>

    <!-- La Moni -->
    <div class="collection-banner__card collection-banner__card--moni">
      <div class="collection-banner__bg">
        <img :src="MONI_IMG" alt="Taza La Moni" class="collection-banner__bg-img" loading="lazy" />
        <div class="collection-banner__bg-overlay collection-banner__bg-overlay--moni"></div>
      </div>
      <div class="collection-banner__content">
        <span class="collection-banner__tag collection-banner__tag--moni">Colección</span>
        <h2 class="collection-banner__heading">La Moni</h2>
        <p class="collection-banner__desc collection-banner__desc--moni">
          Para la mujer que se niega a un café sin glamour. Pestañas,
          labios rojos y feminidad en cada detalle artesanal.
        </p>
        <RouterLink to="/tienda?collection=moni" class="collection-banner__cta collection-banner__cta--moni">
          Explorar La Moni
          <i class="fa-solid fa-arrow-right"></i>
        </RouterLink>
      </div>
    </div>

    <!-- Artesanal Rústica — full width -->
    <div class="collection-banner__card collection-banner__card--rustica">
      <div class="collection-banner__bg">
        <img :src="RUSTICA_IMG" alt="Taza Artesanal Rústica" class="collection-banner__bg-img" loading="lazy" />
        <div class="collection-banner__bg-overlay collection-banner__bg-overlay--rustica"></div>
      </div>
      <div class="collection-banner__content">
        <span class="collection-banner__tag">Colección</span>
        <h2 class="collection-banner__heading">Artesanal Rústica</h2>
        <p class="collection-banner__desc">
          Cerámica crema con relieves que evocan montañas, ciudades y raíces.
          Cada taza lleva la huella de las manos que la crearon.
        </p>
        <RouterLink to="/tienda?collection=rustica" class="collection-banner__cta collection-banner__cta--boscan">
          Explorar Rústica
          <i class="fa-solid fa-arrow-right"></i>
        </RouterLink>
      </div>
    </div>

  </section>
</template>

<style lang="scss" scoped>
@use '../styles/colorVariables.module.scss' as *;

.collection-banner {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: auto auto;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }

  &__card {
    position: relative;
    overflow: hidden;
    min-height: 480px;
    display: flex;
    align-items: flex-end;

    &--rustica {
      grid-column: 1 / -1;
      min-height: 380px;
    }

    @media (max-width: 768px) {
      min-height: 360px;

      &--rustica {
        grid-column: 1;
        min-height: 320px;
      }
    }

    // Zoom on hover
    &:hover .collection-banner__bg-img {
      transform: scale(1.06);
    }
  }

  // ── Background image ──────────────────────────────

  &__bg {
    position: absolute;
    inset: 0;
  }

  &__bg-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
    display: block;
    transition: transform 0.7s cubic-bezier(0.4, 0, 0.2, 1);
  }

  &__bg-overlay {
    position: absolute;
    inset: 0;

    &--boscan {
      background: linear-gradient(
        to top,
        rgba($color-primary, 0.88) 0%,
        rgba($color-primary, 0.4) 50%,
        transparent 100%
      );
    }

    &--moni {
      background: linear-gradient(
        to top,
        rgba(#3a1a25, 0.82) 0%,
        rgba($color-rose, 0.3) 50%,
        transparent 100%
      );
    }

    &--rustica {
      background: linear-gradient(
        to right,
        rgba($color-primary, 0.9) 0%,
        rgba($color-primary, 0.5) 50%,
        transparent 100%
      );
    }
  }

  // ── Content ───────────────────────────────────────

  &__content {
    position: relative;
    z-index: 1;
    padding: 3rem;
    display: flex;
    flex-direction: column;
    gap: 0.875rem;
    max-width: 440px;

    .collection-banner__card--rustica & {
      max-width: 520px;

      @media (max-width: 768px) {
        max-width: 100%;
      }
    }

    @media (max-width: 600px) {
      padding: 2rem 1.5rem;
    }
  }

  &__tag {
    display: inline-block;
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.14em;
    padding: 0.3rem 0.875rem;
    border-radius: $radius-full;
    width: fit-content;
    background-color: rgba(white, 0.15);
    color: rgba(white, 0.85);
    backdrop-filter: blur(4px);

    &--moni {
      background-color: rgba($color-rose, 0.25);
      color: rgba(white, 0.9);
    }
  }

  &__heading {
    font-family: var(--font-heading);
    font-size: clamp(2rem, 4vw, 2.875rem);
    font-weight: 700;
    color: white;
    line-height: 1.1;
    text-shadow: 0 2px 12px rgba(0,0,0,0.3);
  }

  &__desc {
    font-size: 0.9375rem;
    color: rgba(white, 0.78);
    line-height: 1.7;
    text-shadow: 0 1px 6px rgba(0,0,0,0.2);

    &--moni {
      color: rgba(white, 0.8);
    }
  }

  &__cta {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1.5rem;
    border-radius: $radius-md;
    font-size: 0.9375rem;
    font-weight: 600;
    text-decoration: none;
    transition: all 0.25s ease;
    width: fit-content;
    margin-top: 0.25rem;

    &--boscan {
      background-color: white;
      color: $color-primary;

      &:hover {
        background-color: $color-accent;
        color: white;
        transform: translateY(-2px);
        box-shadow: $shadow-md;
      }
    }

    &--moni {
      background-color: $color-rose;
      color: white;

      &:hover {
        filter: brightness(1.1);
        transform: translateY(-2px);
        box-shadow: $shadow-md;
      }
    }
  }
}
</style>
