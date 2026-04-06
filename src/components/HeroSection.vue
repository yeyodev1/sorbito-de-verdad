<script setup lang="ts">
import { RouterLink } from 'vue-router';

// All mugs with steam — black background, perfectly cinematic
const HERO_BG = 'https://res.cloudinary.com/dpjzfua3n/image/upload/q_auto,f_auto,w_1800/v1775351862/sorbito-de-verdad/products/fdpqf502iugjgcv9ta2w.jpg';
// Vertical stack — dark teal background, portrait
const STACK_IMG = 'https://res.cloudinary.com/dpjzfua3n/image/upload/q_auto,f_auto,w_700/v1775351853/sorbito-de-verdad/products/zz1hijsvu1a6npoty3sn.jpg';
</script>

<template>
  <section class="hero" role="banner">

    <!-- Full-bleed cinematic background -->
    <div class="hero__bg" aria-hidden="true">
      <img :src="HERO_BG" alt="" class="hero__bg-img" fetchpriority="high" loading="eager" />
      <div class="hero__bg-overlay"></div>
    </div>

    <!-- Content -->
    <div class="container hero__inner">

      <!-- LEFT — copy -->
      <div class="hero__content">
        <span class="hero__eyebrow">
          <span class="hero__eyebrow-dot"></span>
          Tazas artesanales
        </span>

        <h1 class="hero__heading">
          Cada sorbo,<br>
          <em>una historia</em>
        </h1>

        <p class="hero__subheading">
          Tazas únicas, hechas a mano en Ecuador.
          Diseñadas para quienes saben que el café merece algo especial.
        </p>

        <div class="hero__ctas">
          <RouterLink to="/tienda" class="hero__cta-primary">
            Explorar colección
            <i class="fa-solid fa-arrow-right"></i>
          </RouterLink>
          <RouterLink to="/nosotros" class="hero__cta-ghost">
            Nuestra historia
          </RouterLink>
        </div>

        <!-- Stats row -->
        <div class="hero__stats">
          <div class="hero__stat">
            <span class="hero__stat-number">100%</span>
            <span class="hero__stat-label">Artesanal</span>
          </div>
          <div class="hero__stat-sep"></div>
          <div class="hero__stat">
            <span class="hero__stat-number">4</span>
            <span class="hero__stat-label">Colecciones</span>
          </div>
          <div class="hero__stat-sep"></div>
          <div class="hero__stat">
            <i class="fa-regular fa-heart hero__stat-heart"></i>
            <span class="hero__stat-label">Hecho con amor</span>
          </div>
        </div>
      </div>

      <!-- RIGHT — floating stack image -->
      <div class="hero__visual" aria-hidden="true">
        <div class="hero__image-frame">
          <img
            :src="STACK_IMG"
            alt="Stack de tazas Sorbito de Verdad"
            class="hero__image"
            loading="eager"
          />
          <!-- Frosted badge -->
          <div class="hero__float-badge">
            <i class="fa-solid fa-certificate"></i>
            <span>Hecho a mano</span>
          </div>
        </div>
        <!-- Decorative ring -->
        <div class="hero__ring"></div>
      </div>

    </div>

    <!-- Scroll cue -->
    <div class="hero__scroll" aria-hidden="true">
      <div class="hero__scroll-track">
        <div class="hero__scroll-thumb"></div>
      </div>
      <span class="hero__scroll-label">Descubrir</span>
    </div>

  </section>
</template>

<style lang="scss" scoped>
@use 'sass:color';

// ── Animations ────────────────────────────────────────────────
@keyframes hero-fade-up {
  from { opacity: 0; transform: translateY(32px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes badge-float {
  0%, 100% { transform: translateY(0) rotate(-2deg); }
  50%       { transform: translateY(-10px) rotate(-2deg); }
}
@keyframes scroll-anim {
  0%   { transform: translateY(0); opacity: 1; }
  80%  { transform: translateY(20px); opacity: 0; }
  100% { transform: translateY(0); opacity: 0; }
}
@keyframes ring-spin {
  from { transform: translate(-50%, -50%) rotate(0deg); }
  to   { transform: translate(-50%, -50%) rotate(360deg); }
}

// ── Hero shell ────────────────────────────────────────────────
.hero {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  overflow: hidden;
  background-color: #070707;

  @media (max-width: 768px) {
    min-height: auto;
    padding: 6rem 0 4rem;
  }

  // ── Background image ───────────────────────────────────────

  &__bg {
    position: absolute;
    inset: 0;
    z-index: 0;
  }

  &__bg-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center 40%;
    display: block;
    opacity: 0.55;
    transition: opacity 0.5s ease;
  }

  // Gradient: left side dark for text, right reveals image
  &__bg-overlay {
    position: absolute;
    inset: 0;
    background:
      linear-gradient(
        to right,
        rgba(#070707, 0.97) 0%,
        rgba(#070707, 0.80) 35%,
        rgba(#070707, 0.30) 65%,
        transparent 100%
      ),
      linear-gradient(
        to top,
        rgba(#070707, 0.5) 0%,
        transparent 40%
      );
  }

  // ── Content layout ─────────────────────────────────────────

  &__inner {
    position: relative;
    z-index: 1;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 4rem;
    align-items: center;
    padding-top: 5rem;
    padding-bottom: 5rem;

    @media (max-width: 960px) {
      grid-template-columns: 1fr;
      gap: 3.5rem;
      padding-top: 3.5rem;
      padding-bottom: 3.5rem;
    }
  }

  // ── Copy block ─────────────────────────────────────────────

  &__content {
    display: flex;
    flex-direction: column;
    gap: 1.75rem;
    animation: hero-fade-up 0.8s cubic-bezier(0.4, 0, 0.2, 1) both;

    @media (max-width: 960px) {
      align-items: center;
      text-align: center;
    }
  }

  &__eyebrow {
    display: inline-flex;
    align-items: center;
    gap: 0.625rem;
    font-size: 0.75rem;
    font-weight: 700;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: $color-accent;
    width: fit-content;
  }

  &__eyebrow-dot {
    display: inline-block;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background-color: $color-accent;
    flex-shrink: 0;
  }

  &__heading {
    font-family: var(--font-heading);
    font-size: clamp(3rem, 6.5vw, 5rem);
    font-weight: 700;
    color: #FFFFFF;
    line-height: 1.05;
    letter-spacing: -0.025em;

    em {
      display: block;
      font-style: italic;
      color: $color-accent;
      // slight text-shadow to lift off dark bg
      text-shadow: 0 0 80px rgba($color-accent, 0.35);
    }
  }

  &__subheading {
    font-size: 1.0625rem;
    color: rgba(255, 255, 255, 0.62);
    line-height: 1.8;
    max-width: 460px;

    @media (max-width: 960px) {
      max-width: 100%;
    }
  }

  &__ctas {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;

    @media (max-width: 960px) {
      justify-content: center;
    }
  }

  &__cta-primary {
    display: inline-flex;
    align-items: center;
    gap: 0.625rem;
    padding: 1rem 2.25rem;
    background-color: $color-accent;
    color: #FFFFFF;
    border-radius: $radius-md;
    font-size: 0.9375rem;
    font-weight: 600;
    text-decoration: none;
    letter-spacing: 0.01em;
    transition: all 0.25s ease;

    i { font-size: 0.875rem; transition: transform 0.2s ease; }

    &:hover {
      background-color: color.adjust($color-accent, $lightness: 8%);
      transform: translateY(-3px);
      box-shadow: 0 12px 32px rgba($color-accent, 0.4);

      i { transform: translateX(3px); }
    }
  }

  &__cta-ghost {
    display: inline-flex;
    align-items: center;
    padding: 1rem 2rem;
    border: 1.5px solid rgba(255, 255, 255, 0.22);
    color: rgba(255, 255, 255, 0.82);
    border-radius: $radius-md;
    font-size: 0.9375rem;
    font-weight: 500;
    text-decoration: none;
    backdrop-filter: blur(4px);
    transition: all 0.25s ease;

    &:hover {
      border-color: rgba(255, 255, 255, 0.55);
      color: #FFFFFF;
      background-color: rgba(255, 255, 255, 0.07);
    }
  }

  // ── Stats ──────────────────────────────────────────────────

  &__stats {
    display: flex;
    align-items: center;
    gap: 1.75rem;
    padding-top: 1.25rem;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    width: fit-content;

    @media (max-width: 960px) {
      width: 100%;
      justify-content: center;
    }
  }

  &__stat {
    display: flex;
    flex-direction: column;
    gap: 0.2rem;
  }

  &__stat-number {
    font-family: var(--font-heading);
    font-size: 1.5rem;
    font-weight: 700;
    color: #FFFFFF;
    line-height: 1;
  }

  &__stat-heart {
    font-size: 1.25rem;
    color: var(--color-rose);
  }

  &__stat-label {
    font-size: 0.6875rem;
    font-weight: 600;
    color: rgba(255, 255, 255, 0.42);
    text-transform: uppercase;
    letter-spacing: 0.09em;
  }

  &__stat-sep {
    width: 1px;
    height: 32px;
    background-color: rgba(255, 255, 255, 0.1);
    flex-shrink: 0;
  }

  // ── Visual / stack image ───────────────────────────────────

  &__visual {
    position: relative;
    display: flex;
    justify-content: center;
    animation: hero-fade-up 0.8s cubic-bezier(0.4, 0, 0.2, 1) 0.15s both;

    @media (max-width: 960px) {
      max-width: 340px;
      margin: 0 auto;
    }
  }

  &__image-frame {
    position: relative;
    width: 380px;
    max-width: 100%;
    border-radius: $radius-xl;
    overflow: hidden;
    // Subtle border that glows
    box-shadow:
      0 0 0 1px rgba($color-accent, 0.2),
      0 32px 64px rgba(0, 0, 0, 0.7),
      0 0 80px rgba($color-accent, 0.08);

    @media (max-width: 960px) {
      width: 100%;
    }
  }

  &__image {
    display: block;
    width: 100%;
    height: auto;
    object-fit: cover;
    // The image background is dark teal — no border seam
  }

  &__float-badge {
    position: absolute;
    bottom: 1.5rem;
    left: 1.5rem;
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(12px);
    border: 1px solid rgba(255, 255, 255, 0.18);
    border-radius: $radius-md;
    padding: 0.625rem 1rem;
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.875rem;
    font-weight: 600;
    color: #FFFFFF;
    animation: badge-float 3.5s ease-in-out infinite;

    i { color: $color-accent; }
  }

  &__ring {
    position: absolute;
    width: 110%;
    aspect-ratio: 1;
    border-radius: 50%;
    border: 1px dashed rgba($color-accent, 0.15);
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    pointer-events: none;
    z-index: -1;
    animation: ring-spin 30s linear infinite;
  }

  // ── Scroll cue ─────────────────────────────────────────────

  &__scroll {
    position: absolute;
    bottom: 2.5rem;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.625rem;
    z-index: 1;

    @media (max-width: 768px) { display: none; }
  }

  &__scroll-track {
    width: 1.5px;
    height: 48px;
    background: rgba(255, 255, 255, 0.12);
    border-radius: 2px;
    overflow: hidden;
    position: relative;
  }

  &__scroll-thumb {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 50%;
    background: $color-accent;
    border-radius: 2px;
    animation: scroll-anim 2s ease-in-out infinite;
  }

  &__scroll-label {
    font-size: 0.6875rem;
    font-weight: 600;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: rgba(255, 255, 255, 0.35);
  }
}
</style>
