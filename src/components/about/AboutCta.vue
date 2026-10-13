<script setup lang="ts">
import { RouterLink } from 'vue-router';
import { HERO_IMG } from '../../data/about';
</script>

<template>
  <section class="about-cta">
    <div class="container">
      <div class="about-cta__card">
        <div class="about-cta__bg-img-wrap" aria-hidden="true">
          <img :src="HERO_IMG" alt="" class="about-cta__bg-img" loading="lazy" />
          <div class="about-cta__bg-overlay"></div>
        </div>
        <div class="about-cta__content">
          <span class="about-cta__eyebrow">Tienda</span>
          <h2 class="about-cta__title">¿Lista/o para encontrar tu taza?</h2>
          <p class="about-cta__text">Explora nuestras colecciones y lleva a casa una pieza que cuente tu historia.</p>
          <RouterLink to="/tienda" class="btn-primary btn-lg about-cta__btn">
            Ver colecciones
            <i class="fa-solid fa-arrow-right" aria-hidden="true"></i>
          </RouterLink>
        </div>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
// ── CTA ─────────────────────────────────────────
.about-cta {
  padding: 0 0 5rem;

  @media (min-width: 768px) {
    padding-bottom: 7rem;
  }

  &__card {
    position: relative;
    overflow: hidden;
    isolation: isolate;
    border-radius: $radius-xl;
    padding: 3.5rem 1.5rem;

    @media (min-width: 768px) {
      padding: 5.5rem 4rem;
    }
  }

  &__bg-img-wrap {
    position: absolute;
    inset: 0;
    z-index: -1;
  }

  &__bg-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  &__bg-overlay {
    position: absolute;
    inset: 0;
    background-color: rgba(20, 14, 10, 0.72);
  }

  &__content {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
    max-width: 560px;
  }

  &__eyebrow {
    font-size: 0.75rem;
    font-weight: 600;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: #F1DCCB;
  }

  &__title {
    font-weight: 500;
    color: #F7F2EA;
  }

  &__text {
    color: rgba(247, 242, 234, 0.8);
  }

  &__btn {
    margin-top: 0.5rem;
  }
}
</style>
