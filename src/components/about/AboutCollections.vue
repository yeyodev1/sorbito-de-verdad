<script setup lang="ts">
import { RouterLink } from 'vue-router';
import AboutSectionHead from './AboutSectionHead.vue';
import { collections } from '../../data/about';
</script>

<template>
  <section class="about-collections">
    <div class="container">
      <AboutSectionHead eyebrow="Nuestras colecciones" title="Cada taza, una personalidad" />
      <div class="about-collections__grid">
        <RouterLink v-for="c in collections" :key="c.to" :to="c.to" class="collection-card">
          <div class="collection-card__img-wrap">
            <img :src="c.img" :alt="c.alt" class="collection-card__img" loading="lazy" />
          </div>
          <div class="collection-card__body">
            <span class="collection-card__label">Colección</span>
            <h3 class="collection-card__name">{{ c.name }}</h3>
            <p class="collection-card__desc">{{ c.desc }}</p>
          </div>
        </RouterLink>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
// ── Collections ─────────────────────────────────
.about-collections {
  padding: 4.5rem 0;
  background-color: var(--color-bg-subtle);

  @media (min-width: 768px) {
    padding: 7rem 0;
  }

  &__grid {
    display: flex;
    flex-direction: column;
    gap: 1.25rem;

    > * { min-width: 0; }

    @media (min-width: 700px) {
      flex-direction: row;
      flex-wrap: wrap;
      gap: 1.5rem;

      > * { flex: 1 1 calc((100% - 3rem) / 3); }
    }
  }
}

.collection-card {
  display: flex;
  flex-direction: column;
  border-radius: $radius-xl;
  overflow: hidden;
  background-color: var(--color-bg-card);
  border: 1px solid var(--color-border);
  transition: transform $transition-smooth, box-shadow $transition-smooth;

  &:hover {
    transform: translateY(-4px);
    box-shadow: var(--shadow-lg);
  }

  &__img-wrap {
    aspect-ratio: 4 / 3;
    overflow: hidden;
    background-color: var(--color-bg-subtle);
  }

  &__img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.6s cubic-bezier(0.22, 1, 0.36, 1);

    .collection-card:hover & { transform: scale(1.04); }
  }

  &__body {
    display: flex;
    flex-direction: column;
    gap: 0.375rem;
    padding: 1.25rem 1.375rem 1.5rem;
  }

  &__label {
    font-size: 0.6875rem;
    font-weight: 600;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--color-accent);
  }

  &__name {
    font-size: 1.5rem;
    font-weight: 500;
  }

  &__desc {
    font-size: 0.9375rem;
  }
}
</style>
