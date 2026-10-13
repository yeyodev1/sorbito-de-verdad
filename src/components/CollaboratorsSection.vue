<script setup lang="ts">
import { RouterLink } from 'vue-router';
import CollabCard from './collaborators/CollabCard.vue';
import CollabFeaturedCard from './collaborators/CollabFeaturedCard.vue';
import { collaborators } from '../data/collaborators';
</script>

<template>
  <section class="collab" aria-labelledby="collab-title">
    <div class="container">

      <!-- Header -->
      <div class="collab__header">
        <span class="eyebrow">Un producto, muchos talentos</span>
        <h2 id="collab-title" class="collab__title">
          Las manos que hacen<br>
          <em>posible cada sorbo</em>
        </h2>
        <p class="collab__subtitle">
          Cada taza es el resultado de talento ecuatoriano puro: el diseño, la cerámica, el empaque
          y la tecnología — todo hecho en Ecuador, con orgullo y dedicación.
          <strong>100% manos ecuatorianas.</strong>
        </p>
      </div>

      <!-- Cards -->
      <div class="collab__grid">
        <CollabCard
          v-for="c in collaborators.filter(x => x.id !== 'bakano')"
          :key="c.id"
          :collaborator="c"
        />
      </div>

      <CollabFeaturedCard />

      <div class="collab__footer">
        <RouterLink to="/aliados" class="btn-outline">
          Conocer a todos nuestros aliados
          <i class="fa-solid fa-arrow-right"></i>
        </RouterLink>
      </div>

    </div>
  </section>
</template>

<style lang="scss" scoped>
.collab {
  padding: 3.5rem 0 4rem;
  background-color: var(--color-bg);

  @media (min-width: 768px) {
    padding: 6rem 0;
  }

  &__header {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    max-width: 640px;
    margin-bottom: 2.5rem;
  }

  &__title {
    font-size: clamp(2rem, 4.5vw, 3rem);
    font-weight: 500;

    em {
      font-style: italic;
      font-weight: 400;
      color: var(--color-accent);
    }
  }

  &__subtitle {
    font-size: 1rem;

    strong {
      display: block;
      margin-top: 0.75rem;
      color: var(--color-primary);
      font-weight: 600;
    }
  }

  &__grid {
    display: flex;
    flex-direction: column;
    gap: 1rem;

    > * { min-width: 0; }

    @media (min-width: 900px) {
      flex-direction: row;
      flex-wrap: wrap;
      gap: 1.25rem;

      > * { flex: 1 1 calc((100% - 2.5rem) / 3); }
    }
  }

  &__footer {
    display: flex;
    justify-content: center;
    margin-top: 2.5rem;
  }
}
</style>
