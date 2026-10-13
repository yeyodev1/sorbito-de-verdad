<script setup lang="ts">
import { HERO_IMG } from '../../data/about';
</script>

<template>
  <section class="about-hero">
    <img :src="HERO_IMG" alt="Sorbito de Verdad" class="about-hero__bg" fetchpriority="high" />
    <div class="about-hero__overlay"></div>
    <div class="container about-hero__content">
      <span class="about-hero__eyebrow">Nuestra historia</span>
      <h1 class="about-hero__title">
        Dos personas, una pasión,
        <em>mil historias en barro</em>
      </h1>
      <p class="about-hero__subtitle">
        Todo comenzó en una cocina pequeña con mucho café, mucho amor
        y la certeza de que cada taza puede contar una historia única.
      </p>
      <dl class="about-hero__stats">
        <div class="about-hero__stat">
          <dt class="about-hero__stat-label">Hecho a mano</dt>
          <dd class="about-hero__stat-num">100%</dd>
        </div>
        <div class="about-hero__stat">
          <dt class="about-hero__stat-label">Colecciones únicas</dt>
          <dd class="about-hero__stat-num">3</dd>
        </div>
        <div class="about-hero__stat">
          <dt class="about-hero__stat-label">Sorbos con alma</dt>
          <dd class="about-hero__stat-num">∞</dd>
        </div>
      </dl>
    </div>
  </section>
</template>

<style lang="scss" scoped>
// ── Hero ────────────────────────────────────────
.about-hero {
  position: relative;
  min-height: min(88vh, 760px);
  display: flex;
  align-items: flex-end;
  overflow: hidden;
  isolation: isolate;
  color: #F7F2EA;

  &__bg {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    z-index: -2;
  }

  &__overlay {
    position: absolute;
    inset: 0;
    z-index: -1;
    background:
      linear-gradient(to top, rgba(20, 14, 10, 0.88) 0%, rgba(20, 14, 10, 0.45) 55%, rgba(20, 14, 10, 0.25) 100%);
  }

  &__content {
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
    padding-top: 6rem;
    padding-bottom: 3rem;

    @media (min-width: 768px) {
      padding-bottom: 4.5rem;
    }
  }

  &__eyebrow {
    font-size: 0.75rem;
    font-weight: 600;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: #F1DCCB;
  }

  &__title {
    max-width: 16ch;
    font-size: clamp(2.25rem, 6.5vw, 4.5rem);
    font-weight: 500;
    color: #F7F2EA;

    em {
      display: block;
      font-style: italic;
      color: #F1DCCB;
    }
  }

  &__subtitle {
    max-width: 52ch;
    font-size: 1.0625rem;
    color: rgba(247, 242, 234, 0.82);
  }

  &__stats {
    display: flex;
    gap: 1rem;
    max-width: 520px;
    margin-top: 1rem;
    padding-top: 1.5rem;
    border-top: 1px solid rgba(247, 242, 234, 0.22);
  }

  &__stat {
    flex: 1 1 0;
    min-width: 0;
    display: flex;
    flex-direction: column-reverse;
    gap: 0.125rem;
  }

  &__stat-num {
    font-family: var(--font-heading);
    font-size: clamp(1.75rem, 4vw, 2.5rem);
    font-weight: 500;
    line-height: 1;
    color: #F7F2EA;
  }

  &__stat-label {
    font-size: 0.75rem;
    color: rgba(247, 242, 234, 0.7);
  }
}
</style>
