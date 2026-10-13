<script setup lang="ts">
import { RouterLink } from 'vue-router';

// All mugs with steam — black background, perfectly cinematic
const HERO_BG = 'https://res.cloudinary.com/dpjzfua3n/image/upload/q_auto,f_auto,w_1800/v1775351862/sorbito-de-verdad/products/fdpqf502iugjgcv9ta2w.jpg';
// Vertical stack — dark teal background, portrait
const STACK_IMG = 'https://res.cloudinary.com/dpjzfua3n/image/upload/q_auto,f_auto,w_300/v1775351853/sorbito-de-verdad/products/zz1hijsvu1a6npoty3sn.jpg';
</script>

<template>
  <section class="hero" aria-labelledby="hero-title">
    <div class="container">
      <div class="hero__card">
        <img :src="HERO_BG" alt="Tazas artesanales Sorbito de Verdad con café humeante" class="hero__bg" fetchpriority="high" loading="eager" />
        <div class="hero__shade" aria-hidden="true"></div>

        <div class="hero__content">
          <span class="hero__pill">
            <span class="hero__dot" aria-hidden="true"></span>
            Tazas artesanales · Ecuador
          </span>

          <h1 id="hero-title" class="hero__heading">
            Cada sorbo, <em>una historia.</em>
          </h1>

          <p class="hero__subheading">
            Tazas únicas, hechas a mano en Ecuador. Elige la tuya y págala en un minuto.
          </p>

          <div class="hero__ctas">
            <RouterLink to="/tienda" class="btn-primary btn-lg">
              Comprar ahora
              <i class="fa-solid fa-arrow-right"></i>
            </RouterLink>
            <RouterLink to="/nosotros" class="hero__ghost">
              Nuestra historia
            </RouterLink>
          </div>
        </div>

        <RouterLink to="/tienda" class="hero__float" aria-label="Ver las 4 colecciones">
          <img :src="STACK_IMG" alt="" class="hero__float-img" loading="eager" />
          <span>
            <strong>4 colecciones</strong>
            <small>hechas a mano</small>
          </span>
          <i class="fa-solid fa-arrow-right hero__float-arrow" aria-hidden="true"></i>
        </RouterLink>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
@keyframes hero-rise {
  from { opacity: 0; transform: translateY(28px); }
  to   { opacity: 1; transform: translateY(0); }
}

@keyframes hero-zoom {
  from { transform: scale(1.08); }
  to   { transform: scale(1); }
}

.hero {
  padding: 0.75rem 0 1.5rem;

  @media (min-width: 1024px) {
    padding: 0.5rem 0 2rem;
  }

  // Tarjeta con la foto a todo lo ancho
  &__card {
    position: relative;
    display: flex;
    align-items: flex-end;
    min-height: min(78svh, 680px);
    overflow: hidden;
    border-radius: $radius-xl;
    background-color: #120c08;
    isolation: isolate;

    @media (min-width: 1024px) {
      min-height: min(calc(100svh - 140px), 760px);
    }
  }

  &__bg {
    position: absolute;
    inset: 0;
    z-index: -2;
    width: 100%;
    height: 100%;
    object-fit: cover;
    animation: hero-zoom 1.6s cubic-bezier(0.22, 1, 0.36, 1) both;
  }

  &__shade {
    position: absolute;
    inset: 0;
    z-index: -1;
    background:
      linear-gradient(to top, rgba(18, 12, 8, 0.9) 0%, rgba(18, 12, 8, 0.45) 45%, rgba(18, 12, 8, 0.05) 75%),
      linear-gradient(to right, rgba(18, 12, 8, 0.45), transparent 60%);
  }

  &__content {
    display: flex;
    flex-direction: column;
    gap: 1.125rem;
    width: 100%;
    max-width: 720px;
    padding: 1.5rem 1.25rem 1.75rem;
    color: #fff;
    animation: hero-rise 0.8s 0.15s cubic-bezier(0.22, 1, 0.36, 1) both;

    @media (min-width: 768px) {
      padding: 3rem;
    }

    @media (min-width: 1024px) {
      padding: 4rem;
    }
  }

  &__pill {
    align-self: flex-start;
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.4rem 0.85rem;
    font-size: 0.75rem;
    font-weight: 600;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: #fff;
    background-color: rgba(255, 255, 255, 0.14);
    border: 1px solid rgba(255, 255, 255, 0.22);
    border-radius: $radius-full;
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
  }

  &__dot {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background-color: #F0A27A;
    box-shadow: 0 0 0 4px rgba(240, 162, 122, 0.25);
  }

  &__heading {
    font-size: clamp(2.75rem, 9vw, 6rem);
    font-weight: 700;
    line-height: 0.98;
    letter-spacing: -0.045em;
    color: #fff;

    em {
      color: #F0A27A;
      letter-spacing: -0.02em;
    }
  }

  &__subheading {
    max-width: 40ch;
    font-size: clamp(1rem, 1.6vw, 1.175rem);
    color: rgba(255, 255, 255, 0.82);
  }

  &__ctas {
    display: flex;
    flex-wrap: wrap;
    gap: 0.625rem;
    padding-top: 0.25rem;

    > * {
      flex: 1 1 auto;

      @media (min-width: 480px) {
        flex: 0 0 auto;
      }
    }
  }

  &__ghost {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-height: 52px;
    padding: 0 1.5rem;
    font-weight: 600;
    color: #fff;
    border: 1.5px solid rgba(255, 255, 255, 0.4);
    border-radius: $radius-full;
    transition: background-color 0.2s ease, border-color 0.2s ease;

    &:hover {
      background-color: rgba(255, 255, 255, 0.12);
      border-color: #fff;
    }
  }

  // Mini tarjeta flotante (solo escritorio)
  &__float {
    position: absolute;
    right: 1.5rem;
    bottom: 1.5rem;
    display: none;
    align-items: center;
    gap: 0.875rem;
    padding: 0.5rem 1.125rem 0.5rem 0.5rem;
    color: #fff;
    background-color: rgba(255, 255, 255, 0.14);
    border: 1px solid rgba(255, 255, 255, 0.22);
    border-radius: $radius-lg;
    backdrop-filter: blur(14px);
    -webkit-backdrop-filter: blur(14px);
    animation: hero-rise 0.8s 0.35s cubic-bezier(0.22, 1, 0.36, 1) both;
    transition: background-color 0.2s ease;

    &:hover { background-color: rgba(255, 255, 255, 0.22); }

    @media (min-width: 900px) {
      display: inline-flex;
    }

    span {
      display: flex;
      flex-direction: column;
      line-height: 1.2;
    }

    strong { font-size: 0.95rem; }
    small { font-size: 0.75rem; opacity: 0.75; }
  }

  &__float-arrow {
    transform: rotate(-45deg);
    transition: transform 0.2s ease;

    .hero__float:hover & { transform: rotate(0deg); }
  }

  &__float-img {
    width: 56px;
    height: 56px;
    object-fit: cover;
    border-radius: $radius-md;
  }
}
</style>
