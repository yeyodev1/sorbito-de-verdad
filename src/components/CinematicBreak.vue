<script setup lang="ts">
import { RouterLink } from 'vue-router';
</script>

<template>
  <div class="cinematic">
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
  background-color: var(--color-bg-subtle);
  border-top: 1px solid var(--color-border);
  border-bottom: 1px solid var(--color-border);
  padding: 4rem 0;

  @media (max-width: 768px) {
    padding: 3rem 0;
  }

  &__inner {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 3rem;

    @media (max-width: 768px) {
      flex-direction: column;
      align-items: flex-start;
      gap: 2rem;
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
    color: var(--color-primary);
    line-height: 1.4;
    margin: 0;
  }

  &__cta {
    display: inline-flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.875rem 2rem;
    border: 1.5px solid $color-accent;
    color: $color-accent;
    border-radius: $radius-md;
    font-size: 0.9375rem;
    font-weight: 600;
    text-decoration: none;
    white-space: nowrap;
    flex-shrink: 0;
    transition: all 0.25s ease;

    i { transition: transform 0.2s ease; }

    &:hover {
      background-color: $color-accent;
      color: white;
      transform: translateY(-2px);
      box-shadow: 0 8px 24px rgba($color-accent, 0.25);

      i { transform: translateX(4px); }
    }
  }
}
</style>
