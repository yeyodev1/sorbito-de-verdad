<script setup lang="ts">
import { RouterLink } from 'vue-router';
import MainLayout from '../layout/MainLayout.vue';
</script>

<template>
  <MainLayout>
    <div class="about-view">
      <!-- Hero -->
      <section class="about-hero">
        <div class="container about-hero__inner">
          <div class="about-hero__content">
            <span class="about-hero__eyebrow">Nuestra Historia</span>
            <h1 class="about-hero__title">Dos personas, una pasión,<br><em>mil historias en barro</em></h1>
            <p class="about-hero__text">
              Todo comenzó en una cocina pequeña con mucho café, mucho amor y la certeza de que cada taza puede contar una historia única.
            </p>
          </div>
          <div class="about-hero__visual" aria-hidden="true">
            <div class="about-hero__avatar-pair">
              <div class="about-hero__avatar about-hero__avatar--boscan">
                <i class="fa-solid fa-glasses about-hero__avatar-emoji"></i>
                <span class="about-hero__avatar-name">Boscan</span>
              </div>
              <div class="about-hero__connector" aria-hidden="true"><i class="fa-solid fa-mug-hot"></i></div>
              <div class="about-hero__avatar about-hero__avatar--moni">
                <i class="fa-solid fa-wand-sparkles about-hero__avatar-emoji"></i>
                <span class="about-hero__avatar-name">La Moni</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Story -->
      <section class="about-story">
        <div class="container about-story__inner">
          <div class="about-story__text">
            <h2 class="about-story__title">¿Cómo comenzó todo?</h2>
            <p>
              Boscan siempre fue el del café. Ese hombre que se levantaba antes que el sol, que conocía cada nota de cada grano, que tenía opinión sobre la temperatura del agua y el tiempo de extracción. Un día decidió que su taza debía ser tan especial como el ritual que la acompañaba.
            </p>
            <p>
              La Moni, su compañera de vida, artista de corazón, vio en esa idea algo más grande. "¿Y si hacemos tazas que cuenten quiénes somos?" Y así nació Sorbito de Verdad.
            </p>
            <p>
              Cada taza es trabajada a mano. Cada trazo, cada curva, cada textura tiene intención. Las gafas y la barba de la Colección Boscan rinden homenaje al hombre que se toma el café en serio. Las pestañas y los labios de La Colección Moni celebran a la mujer que convierte cada momento en arte.
            </p>
          </div>
          <div class="about-story__quote-block">
            <blockquote class="about-story__quote">
              "Cada pieza que sale de nuestras manos lleva una intención: que quien la sostenga sienta que fue hecha para ella."
            </blockquote>
            <cite class="about-story__quote-author">— Boscan & La Moni</cite>
          </div>
        </div>
      </section>

      <!-- Values -->
      <section id="valores" class="about-values">
        <div class="container">
          <div class="about-values__header">
            <span class="about-values__eyebrow">Lo que nos define</span>
            <h2 class="about-values__title">Nuestros Valores</h2>
          </div>
          <div class="about-values__grid">
            <div class="value-card">
              <i class="fa-solid fa-hands value-card__icon"></i>
              <h3 class="value-card__title">Artesanía Real</h3>
              <p class="value-card__text">Cada taza es hecha a mano. No hay dos iguales. Eso no es un defecto, es la firma del artesano.</p>
            </div>
            <div class="value-card">
              <i class="fa-solid fa-leaf value-card__icon"></i>
              <h3 class="value-card__title">Materiales con Alma</h3>
              <p class="value-card__text">Usamos arcillas y materiales cuidadosamente seleccionados, pensando en la durabilidad y en el planeta.</p>
            </div>
            <div class="value-card">
              <i class="fa-solid fa-heart value-card__icon"></i>
              <h3 class="value-card__title">Hecho con Amor</h3>
              <p class="value-card__text">Cada pedido lleva nuestro cuidado personal. Empacamos como si se lo entregáramos a un amigo.</p>
            </div>
            <div class="value-card">
              <i class="fa-solid fa-star value-card__icon"></i>
              <h3 class="value-card__title">Orgullo Venezolano</h3>
              <p class="value-card__text">Nacimos en Venezuela, donde el café no es solo bebida, es identidad. Eso vive en cada pieza.</p>
            </div>
          </div>
        </div>
      </section>

      <!-- CTA -->
      <section class="about-cta">
        <div class="container about-cta__inner">
          <h2 class="about-cta__title">¿Lista/o para encontrar tu taza?</h2>
          <p class="about-cta__text">Explora nuestras colecciones y lleva a casa una pieza que cuente tu historia.</p>
          <RouterLink to="/tienda" class="about-cta__btn">Ver Tienda</RouterLink>
        </div>
      </section>
    </div>
  </MainLayout>
</template>

<style lang="scss" scoped>
@use '../styles/colorVariables.module.scss' as *;

.about-hero {
  background-color: $color-bg-subtle;
  padding: 5rem 0;

  @media (max-width: 768px) { padding: 3.5rem 0; }

  &__inner {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 4rem;
    align-items: center;

    @media (max-width: 900px) {
      grid-template-columns: 1fr;
      gap: 3rem;
      text-align: center;
    }
  }

  &__content { display: flex; flex-direction: column; gap: 1.25rem; }

  &__eyebrow {
    display: inline-block;
    font-size: 0.8125rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.12em;
    color: $color-accent;
    background-color: rgba($color-accent, 0.1);
    padding: 0.375rem 1rem;
    border-radius: $radius-full;
    width: fit-content;

    @media (max-width: 900px) { align-self: center; }
  }

  &__title {
    font-family: var(--font-heading);
    font-size: clamp(2rem, 4vw, 3rem);
    font-weight: 700;
    color: $color-primary;
    line-height: 1.15;

    em { font-style: italic; color: $color-accent; }
  }

  &__text { font-size: 1.0625rem; color: $color-muted; line-height: 1.7; max-width: 480px; }

  &__visual {
    display: flex;
    align-items: center;
    justify-content: center;

    @media (max-width: 900px) { display: none; }
  }

  &__avatar-pair {
    display: flex;
    align-items: center;
    gap: 2rem;
  }

  &__avatar {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.75rem;
    padding: 2rem;
    border-radius: $radius-xl;
    border: 1px solid $color-border;
    background-color: $color-bg-card;
    box-shadow: $shadow-md;
    width: 150px;

    &--boscan { }
    &--moni { border-color: rgba($color-rose, 0.3); }
  }

  &__avatar-emoji { font-size: 3rem; }

  &__avatar-name {
    font-family: var(--font-heading);
    font-size: 1rem;
    font-weight: 700;
    color: $color-primary;
  }

  &__connector {
    font-size: 2rem;
    opacity: 0.5;
  }
}

.about-story {
  padding: 5rem 0;
  background-color: $color-bg;

  @media (max-width: 768px) { padding: 3.5rem 0; }

  &__inner {
    display: grid;
    grid-template-columns: 1.5fr 1fr;
    gap: 4rem;
    align-items: center;

    @media (max-width: 900px) {
      grid-template-columns: 1fr;
      gap: 2.5rem;
    }
  }

  &__text {
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
  }

  &__title {
    font-family: var(--font-heading);
    font-size: clamp(1.5rem, 3vw, 2.25rem);
    font-weight: 700;
    color: $color-primary;
    margin-bottom: 0.5rem;
  }

  p { font-size: 1rem; color: $color-muted; line-height: 1.8; }

  &__quote-block {
    background-color: $color-bg-subtle;
    border-left: 4px solid $color-accent;
    border-radius: $radius-md;
    padding: 2rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  &__quote {
    font-family: var(--font-heading);
    font-size: 1.125rem;
    font-style: italic;
    color: $color-primary;
    line-height: 1.6;
    font-weight: 400;
  }

  &__quote-author {
    font-size: 0.875rem;
    font-weight: 600;
    color: $color-accent;
    font-style: normal;
  }
}

.about-values {
  padding: 5rem 0;
  background-color: $color-bg-subtle;

  @media (max-width: 768px) { padding: 3.5rem 0; }

  &__header {
    text-align: center;
    margin-bottom: 3rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
  }

  &__eyebrow {
    font-size: 0.8125rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.12em;
    color: $color-accent;
  }

  &__title {
    font-family: var(--font-heading);
    font-size: clamp(1.5rem, 3vw, 2.25rem);
    font-weight: 700;
    color: $color-primary;
  }

  &__grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 1.5rem;

    @media (max-width: 900px) { grid-template-columns: repeat(2, 1fr); }
    @media (max-width: 480px) { grid-template-columns: 1fr; }
  }
}

.value-card {
  background-color: $color-bg-card;
  border: 1px solid $color-border;
  border-radius: $radius-lg;
  padding: 2rem 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.875rem;
  text-align: center;
  transition: transform $transition-smooth, box-shadow $transition-smooth;

  &:hover {
    transform: translateY(-4px);
    box-shadow: $shadow-md;
  }

  &__icon { font-size: 2.25rem; }

  &__title {
    font-family: var(--font-heading);
    font-size: 1.0625rem;
    font-weight: 700;
    color: $color-primary;
  }

  &__text { font-size: 0.9375rem; color: $color-muted; line-height: 1.6; }
}

.about-cta {
  background-color: $color-accent;
  padding: 5rem 0;

  &__inner {
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1.25rem;
  }

  &__title {
    font-family: var(--font-heading);
    font-size: clamp(1.5rem, 3vw, 2.25rem);
    color: white;
    font-weight: 700;
  }

  &__text { font-size: 1rem; color: rgba(white, 0.8); }

  &__btn {
    padding: 0.9rem 2.25rem;
    background-color: white;
    color: $color-accent;
    border-radius: $radius-md;
    text-decoration: none;
    font-size: 1rem;
    font-weight: 600;
    transition: all 0.2s ease;

    &:hover {
      background-color: $color-primary;
      color: white;
      transform: translateY(-2px);
    }
  }
}
</style>
