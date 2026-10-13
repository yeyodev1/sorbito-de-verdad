<script setup lang="ts">
import { RouterLink } from 'vue-router';

// Prefijo de clases: cada pantalla conserva sus propias clases (login-logo, rp-logo)
defineProps<{ prefix: 'login' | 'rp' }>();
</script>

<template>
  <RouterLink to="/" :class="`${prefix}-logo`" aria-label="Sorbito de Verdad — inicio">
    <span :class="`${prefix}-logo__mark`" aria-hidden="true">
      <i class="fa-solid fa-mug-hot"></i>
    </span>
    <span :class="`${prefix}-logo__text`">
      <span :class="`${prefix}-logo__name`">Sorbito de Verdad</span>
      <span :class="`${prefix}-logo__tagline`">Tazas artesanales · Ecuador</span>
    </span>
  </RouterLink>
</template>

<style lang="scss" scoped>
@each $prefix in login, rp {
  .#{$prefix}-logo {
    display: inline-flex;
    align-items: center;
    gap: 0.75rem;
    align-self: flex-start;

    &__mark {
      width: 44px;
      height: 44px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.125rem;
      color: var(--color-on-accent);
      background-color: var(--color-accent);
      border-radius: 50%;
    }

    &__text {
      display: flex;
      flex-direction: column;
      line-height: 1.2;
    }

    &__name {
      font-family: var(--font-heading);
      font-size: 1.125rem;
      font-weight: 600;
      color: var(--color-primary);
    }

    &__tagline {
      font-size: 0.75rem;
      color: var(--color-muted);
    }
  }
}
</style>
