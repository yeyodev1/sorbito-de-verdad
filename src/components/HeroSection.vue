<script setup lang="ts">
import { RouterLink } from 'vue-router';

// All mugs with steam — black background, perfectly cinematic
const HERO_BG = 'https://res.cloudinary.com/dpjzfua3n/image/upload/q_auto,f_auto,w_1400/v1775351862/sorbito-de-verdad/products/fdpqf502iugjgcv9ta2w.jpg';
// Vertical stack — dark teal background, portrait
const STACK_IMG = 'https://res.cloudinary.com/dpjzfua3n/image/upload/q_auto,f_auto,w_600/v1775351853/sorbito-de-verdad/products/zz1hijsvu1a6npoty3sn.jpg';
</script>

<template>
  <section class="hero" aria-labelledby="hero-title">
    <div class="container hero__inner">

      <!-- Copy -->
      <div class="hero__content">
        <span class="eyebrow">
          <span class="hero__dot" aria-hidden="true"></span>
          Tazas artesanales · Ecuador
        </span>

        <h1 id="hero-title" class="hero__heading">
          Cada sorbo,<br>
          <em>una historia.</em>
        </h1>

        <p class="hero__subheading">
          Tazas únicas, hechas a mano en Ecuador. Diseñadas para quienes saben
          que el café merece algo especial.
        </p>

        <div class="hero__ctas">
          <RouterLink to="/tienda" class="btn-primary btn-lg">
            Comprar ahora
            <i class="fa-solid fa-arrow-right"></i>
          </RouterLink>
          <RouterLink to="/nosotros" class="btn-outline btn-lg">
            Nuestra historia
          </RouterLink>
        </div>

        <ul class="hero__trust">
          <li><i class="fa-solid fa-hand-sparkles"></i> 100% artesanal</li>
          <li><i class="fa-solid fa-truck-fast"></i> Envío a todo Ecuador</li>
          <li><i class="fa-solid fa-lock"></i> Pago seguro con tarjeta</li>
        </ul>
      </div>

      <!-- Visual -->
      <div class="hero__visual">
        <div class="hero__frame">
          <img :src="HERO_BG" alt="Tazas artesanales Sorbito de Verdad con café humeante" class="hero__img" fetchpriority="high" loading="eager" />
        </div>
        <div class="hero__stack" aria-hidden="true">
          <img :src="STACK_IMG" alt="" class="hero__img" loading="eager" />
        </div>
        <div class="hero__badge" aria-hidden="true">
          <span class="hero__badge-num">4</span>
          <span class="hero__badge-label">colecciones<br>hechas a mano</span>
        </div>
      </div>

    </div>
  </section>
</template>

<style lang="scss" scoped>
@keyframes hero-fade-up {
  from { opacity: 0; transform: translateY(24px); }
  to   { opacity: 1; transform: translateY(0); }
}

.hero {
  position: relative;
  overflow: hidden;
  background-color: var(--color-bg);

  &__inner {
    display: grid;
    grid-template-columns: 1fr;
    gap: 2.5rem;
    padding-top: 2.5rem;
    padding-bottom: 3.5rem;

    @media (min-width: 960px) {
      grid-template-columns: 1.05fr 1fr;
      gap: 4rem;
      align-items: center;
      min-height: calc(100vh - 76px);
      padding-top: 3rem;
      padding-bottom: 4rem;
    }
  }

  &__content {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    animation: hero-fade-up 0.7s cubic-bezier(0.22, 1, 0.36, 1) both;
  }

  &__dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background-color: var(--color-accent);
  }

  &__heading {
    font-size: clamp(2.75rem, 8vw, 5.25rem);
    font-weight: 500;
    line-height: 1.02;
    letter-spacing: -0.03em;

    em {
      font-style: italic;
      font-weight: 400;
      color: var(--color-accent);
    }
  }

  &__subheading {
    max-width: 44ch;
    font-size: clamp(1rem, 1.6vw, 1.15rem);
  }

  &__ctas {
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;

    > * {
      flex: 1 1 auto;

      @media (min-width: 480px) {
        flex: 0 0 auto;
      }
    }
  }

  &__trust {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem 1.25rem;
    padding-top: 0.5rem;
    font-size: 0.85rem;
    color: var(--color-muted);

    li {
      display: inline-flex;
      align-items: center;
      gap: 0.45rem;
    }

    i { color: var(--color-accent); }
  }

  // ── Visual ─────────────────────────
  &__visual {
    position: relative;
    animation: hero-fade-up 0.8s 0.1s cubic-bezier(0.22, 1, 0.36, 1) both;
  }

  &__frame {
    aspect-ratio: 4 / 3;
    border-radius: $radius-xl;
    overflow: hidden;
    background-color: var(--color-bg-subtle);
    box-shadow: var(--shadow-lg);

    @media (min-width: 960px) {
      aspect-ratio: 4 / 5;
    }
  }

  &__img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  &__stack {
    display: none;
    position: absolute;
    left: -2.5rem;
    bottom: -1.5rem;
    width: 34%;
    aspect-ratio: 3 / 4;
    border-radius: $radius-lg;
    overflow: hidden;
    border: 6px solid var(--color-bg);
    box-shadow: var(--shadow-lg);

    @media (min-width: 960px) {
      display: block;
    }
  }

  &__badge {
    position: absolute;
    top: 1rem;
    right: 1rem;
    display: flex;
    align-items: center;
    gap: 0.625rem;
    padding: 0.625rem 1rem 0.625rem 0.75rem;
    background-color: var(--color-bg-card);
    border-radius: $radius-full;
    box-shadow: var(--shadow-md);
  }

  &__badge-num {
    display: grid;
    place-items: center;
    width: 34px;
    height: 34px;
    border-radius: 50%;
    font-family: var(--font-heading);
    font-size: 1.1rem;
    font-weight: 600;
    color: var(--color-on-accent);
    background-color: var(--color-accent);
  }

  &__badge-label {
    font-size: 0.72rem;
    font-weight: 600;
    line-height: 1.25;
    color: var(--color-primary);
  }
}
</style>
