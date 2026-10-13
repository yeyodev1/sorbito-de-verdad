<script setup lang="ts">
import AboutSectionHead from './AboutSectionHead.vue';
import { values } from '../../data/about';
</script>

<template>
  <section id="valores" class="about-values">
    <div class="container">
      <AboutSectionHead
        eyebrow="Lo que nos define"
        title="Nuestros valores"
        subtitle="Los principios detrás de cada pieza que creamos."
      />
      <div class="about-values__grid">
        <div v-for="(v, i) in values" :key="v.title" class="value-card">
          <span class="value-card__num">0{{ i + 1 }}</span>
          <div class="value-card__icon-wrap">
            <i :class="v.icon" aria-hidden="true"></i>
          </div>
          <h3 class="value-card__title">{{ v.title }}</h3>
          <p class="value-card__text">{{ v.text }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
// ── Values ──────────────────────────────────────
.about-values {
  padding: 4.5rem 0;

  @media (min-width: 768px) {
    padding: 7rem 0;
  }

  &__grid {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;

    > * {
      flex: 1 1 100%;
      min-width: 0;

      @media (min-width: 640px) {
        flex-basis: calc((100% - 1rem) / 2);
      }

      @media (min-width: 1024px) {
        flex-basis: calc((100% - 3.75rem) / 4);
      }
    }

    @media (min-width: 1024px) {
      gap: 1.25rem;
    }
  }
}

.value-card {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: 1.75rem 1.5rem;
  border-radius: $radius-lg;
  background-color: var(--color-bg-card);
  border: 1px solid var(--color-border);

  &__num {
    position: absolute;
    top: 1.5rem;
    right: 1.5rem;
    font-family: var(--font-heading);
    font-size: 0.875rem;
    color: var(--color-muted);
  }

  &__icon-wrap {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 48px;
    height: 48px;
    border-radius: 50%;
    background-color: var(--color-accent-light);
    color: var(--color-accent);
    font-size: 1.125rem;
    margin-bottom: 0.25rem;
  }

  &__title {
    font-size: 1.25rem;
    font-weight: 500;
  }

  &__text {
    font-size: 0.9375rem;
  }
}
</style>
