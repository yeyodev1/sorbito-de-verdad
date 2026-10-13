<script setup lang="ts">
import { HEADER_IMG } from '../../data/aliados';
</script>

<template>
  <section class="aliados-hero">
    <img :src="HEADER_IMG" alt="" class="aliados-hero__bg" fetchpriority="high" />
    <div class="aliados-hero__overlay"></div>
    <div class="container aliados-hero__content">
      <span class="aliados-hero__eyebrow">Un producto, muchos talentos</span>
      <h1 class="aliados-hero__title">
        Las manos que hacen <em>posible cada sorbo</em>
      </h1>
      <p class="aliados-hero__subtitle">
        Sorbito de Verdad es el resultado de una red de talentos extraordinarios.
        Conoce a quienes hacen posible que cada taza llegue a tus manos.
      </p>
    </div>
  </section>
</template>

<style lang="scss" scoped>
// ── Hero ────────────────────────────────────────
.aliados-hero {
  position: relative;
  min-height: min(78vh, 680px);
  display: flex;
  align-items: flex-end;
  overflow: hidden;
  isolation: isolate;

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
    background: linear-gradient(to top, rgba(20, 14, 10, 0.9) 0%, rgba(20, 14, 10, 0.45) 60%, rgba(20, 14, 10, 0.25) 100%);
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
    max-width: 15ch;
    font-size: clamp(2.25rem, 6.5vw, 4.5rem);
    font-weight: 500;
    color: #F7F2EA;

    em {
      font-style: italic;
      color: #F1DCCB;
    }
  }

  &__subtitle {
    max-width: 54ch;
    font-size: 1.0625rem;
    color: rgba(247, 242, 234, 0.82);
  }
}
</style>
