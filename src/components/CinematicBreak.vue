<script setup lang="ts">
import { RouterLink } from 'vue-router';

// Two rustic mugs exploding coffee — dark gray bg
const BG_IMG = 'https://res.cloudinary.com/dpjzfua3n/image/upload/q_auto,f_auto,w_1800/v1775351855/sorbito-de-verdad/products/mofhimqumssejhwwntgb.jpg';
</script>

<template>
  <div class="cinematic">
    <div class="cinematic__bg" aria-hidden="true">
      <img :src="BG_IMG" alt="" class="cinematic__bg-img" loading="lazy" />
      <div class="cinematic__overlay"></div>
    </div>

    <div class="container cinematic__inner">
      <div class="cinematic__text">
        <span class="cinematic__label">Artesanía con alma</span>
        <p class="cinematic__quote">
          "Cada taza nace de manos que conocen el barro, el fuego y la paciencia."
        </p>
      </div>
      <RouterLink to="/tienda" class="cinematic__cta">
        Ver toda la colección
        <i class="fa-solid fa-arrow-right"></i>
      </RouterLink>
    </div>
  </div>
</template>

<style lang="scss" scoped>

.cinematic {
  position: relative;
  min-height: 360px;
  display: flex;
  align-items: center;
  overflow: hidden;

  @media (max-width: 768px) {
    min-height: 280px;
  }

  &__bg {
    position: absolute;
    inset: 0;
  }

  &__bg-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center 40%;
    display: block;
    transition: transform 0.8s ease;

    .cinematic:hover & {
      transform: scale(1.03);
    }
  }

  &__overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(
      90deg,
      rgba(#080808, 0.92) 0%,
      rgba(#080808, 0.72) 45%,
      rgba(#080808, 0.45) 100%
    );
  }

  &__inner {
    position: relative;
    z-index: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 3rem;
    padding-top: 4rem;
    padding-bottom: 4rem;

    @media (max-width: 768px) {
      flex-direction: column;
      align-items: flex-start;
      gap: 2rem;
      padding-top: 3rem;
      padding-bottom: 3rem;
    }
  }

  &__text {
    display: flex;
    flex-direction: column;
    gap: 0.875rem;
    max-width: 560px;
  }

  &__label {
    font-size: 0.6875rem;
    font-weight: 700;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: $color-accent;
  }

  &__quote {
    font-family: var(--font-heading);
    font-size: clamp(1.375rem, 3vw, 2rem);
    font-style: italic;
    font-weight: 600;
    color: rgba(255, 255, 255, 0.9);
    line-height: 1.4;
  }

  &__cta {
    display: inline-flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.875rem 2rem;
    border: 1.5px solid rgba(255, 255, 255, 0.25);
    color: #FFFFFF;
    border-radius: $radius-md;
    font-size: 0.9375rem;
    font-weight: 600;
    text-decoration: none;
    white-space: nowrap;
    flex-shrink: 0;
    transition: all 0.25s ease;
    backdrop-filter: blur(4px);

    i { transition: transform 0.2s ease; }

    &:hover {
      background-color: $color-accent;
      border-color: $color-accent;
      transform: translateY(-2px);
      box-shadow: 0 8px 24px rgba($color-accent, 0.35);

      i { transform: translateX(4px); }
    }
  }
}
</style>
