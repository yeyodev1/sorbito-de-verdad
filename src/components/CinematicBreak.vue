<script setup lang="ts">
import { RouterLink } from 'vue-router';
</script>

<template>
  <section class="cinematic">
    <div class="container cinematic__inner">
      <span class="eyebrow">Artesanía con alma</span>
      <blockquote class="cinematic__quote">
        “Cada taza nace de manos que conocen el barro, el fuego y la paciencia.”
      </blockquote>
      <RouterLink to="/tienda" class="btn-dark btn-lg">
        Ver toda la colección
        <i class="fa-solid fa-arrow-right"></i>
      </RouterLink>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.cinematic {
  padding: 4rem 0;
  background-color: var(--color-bg-subtle);
  border-top: 1px solid var(--color-border);
  border-bottom: 1px solid var(--color-border);

  @media (min-width: 768px) {
    padding: 6.5rem 0;
  }

  &__inner {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1.75rem;
    text-align: center;
  }

  &__quote {
    max-width: 22ch;
    margin: 0;
    font-family: var(--font-heading);
    font-size: clamp(1.75rem, 4.5vw, 3.25rem);
    font-style: italic;
    font-weight: 400;
    line-height: 1.2;
    letter-spacing: -0.02em;
    color: var(--color-primary);
    text-wrap: balance;
  }
}
</style>
