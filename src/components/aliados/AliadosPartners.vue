<script setup lang="ts">
import AllyCard from './AllyCard.vue';
import { otherPartners } from '../../data/aliados';
</script>

<template>
  <section class="other-partners">
    <div class="container">
      <div class="other-partners__header">
        <span class="eyebrow">También parte de la familia</span>
        <h2 class="other-partners__title">El resto del equipo creativo</h2>
      </div>

      <div class="other-partners__grid">
        <AllyCard v-for="p in otherPartners" :key="p.id" :partner="p" />
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
// ── Other partners ──────────────────────────────
.other-partners {
  padding: 4.5rem 0;
  background-color: var(--color-bg-subtle);

  @media (min-width: 768px) {
    padding: 7rem 0;
  }

  &__header {
    display: flex;
    flex-direction: column;
    gap: 0.625rem;
    margin-bottom: 2.5rem;

    @media (min-width: 768px) {
      margin-bottom: 3.5rem;
    }
  }

  &__title {
    font-weight: 500;
  }

  &__grid {
    display: grid;
    gap: 1.25rem;

    @media (min-width: 760px) {
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 1.5rem;
    }
  }
}
</style>
