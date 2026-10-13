<script setup lang="ts">
import { RouterLink } from 'vue-router';
</script>

<template>
  <section class="aliados-bottom-cta">
    <div class="container">
      <div class="aliados-bottom-cta__inner">
        <h2 class="aliados-bottom-cta__title">¿Lista/o para tu taza?</h2>
        <p class="aliados-bottom-cta__text">Todos estos talentos se unen en cada pieza.</p>
        <RouterLink to="/tienda" class="btn-primary btn-lg">
          Ver colecciones <i class="fa-solid fa-arrow-right" aria-hidden="true"></i>
        </RouterLink>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
// ── Bottom CTA ──────────────────────────────────
.aliados-bottom-cta {
  padding: 4.5rem 0 5rem;

  @media (min-width: 768px) {
    padding: 6rem 0 7rem;
  }

  &__inner {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 1rem;
    padding: 3rem 1.5rem;
    border-radius: $radius-xl;
    background-color: var(--color-bg-card);
    border: 1px solid var(--color-border);
  }

  &__title {
    font-weight: 500;
  }

  &__text {
    margin-bottom: 0.5rem;
  }
}
</style>
