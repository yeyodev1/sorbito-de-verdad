<script setup lang="ts">
import { STORY_IMG } from '../../data/about';
</script>

<template>
  <section class="about-story">
    <div class="container about-story__inner">
      <figure class="about-story__image-col">
        <img :src="STORY_IMG" alt="Tazas con vapor" class="about-story__img" loading="lazy" />
        <figcaption class="about-story__img-badge">
          <i class="fa-solid fa-award" aria-hidden="true"></i>
          Artesanía certificada
        </figcaption>
      </figure>
      <div class="about-story__text-col">
        <span class="eyebrow">¿Cómo comenzó todo?</span>
        <h2 class="about-story__title">Una taza que se convirtió en marca</h2>
        <div class="about-story__paragraphs">
          <p>
            Boscan siempre fue el del café. Ese hombre que se levantaba antes que el sol, que conocía cada nota de cada grano, que tenía opinión sobre la temperatura del agua. Un día decidió que su taza debía ser tan especial como el ritual que la acompañaba.
          </p>
          <p>
            La Moni, su compañera de vida, artista de corazón, vio en esa idea algo más grande. <strong>"¿Y si hacemos tazas que cuenten quiénes somos?"</strong> Y así nació Sorbito de Verdad.
          </p>
          <p>
            Cada taza es trabajada a mano. Las gafas y la barba de la Colección Boscan rinden homenaje al hombre que se toma el café en serio. Las pestañas y los labios de La Colección Moni celebran a la mujer que convierte cada momento en arte.
          </p>
        </div>
        <blockquote class="about-story__quote">
          <p>"Cada pieza que sale de nuestras manos lleva una intención: que quien la sostenga sienta que fue hecha para ella."</p>
          <cite>Boscan &amp; La Moni</cite>
        </blockquote>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
// ── Story ───────────────────────────────────────
.about-story {
  padding: 4.5rem 0;

  @media (min-width: 768px) {
    padding: 7rem 0;
  }

  &__inner {
    display: flex;
    flex-direction: column;
    gap: 2.5rem;

    @media (min-width: 900px) {
      flex-direction: row;
      align-items: center;
      gap: 5rem;
    }
  }

  &__image-col {
    position: relative;
    min-width: 0;

    @media (min-width: 900px) {
      flex: 5 1 0;
    }
  }

  &__img {
    width: 100%;
    aspect-ratio: 4 / 5;
    object-fit: cover;
    border-radius: $radius-xl;
    box-shadow: var(--shadow-lg);
  }

  &__img-badge {
    position: absolute;
    left: 1rem;
    bottom: 1rem;
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.625rem 1rem;
    border-radius: $radius-full;
    background-color: var(--color-bg-card);
    color: var(--color-primary);
    font-size: 0.8125rem;
    font-weight: 600;
    box-shadow: var(--shadow-md);

    i { color: var(--color-accent); }
  }

  &__text-col {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    min-width: 0;

    @media (min-width: 900px) {
      flex: 6 1 0;
    }
  }

  &__title {
    font-weight: 500;
    max-width: 16ch;
  }

  &__paragraphs {
    display: flex;
    flex-direction: column;
    gap: 1rem;

    strong { color: var(--color-primary); font-weight: 600; }
  }

  &__quote {
    margin-top: 1rem;
    padding: 1.5rem 0 0 1.25rem;
    border-left: 2px solid var(--color-accent);

    p {
      font-family: var(--font-heading);
      font-size: 1.25rem;
      font-style: italic;
      line-height: 1.5;
      color: var(--color-primary);
    }

    cite {
      display: block;
      margin-top: 0.75rem;
      font-style: normal;
      font-size: 0.8125rem;
      font-weight: 600;
      letter-spacing: 0.04em;
      color: var(--color-accent);
    }
  }
}
</style>
