<script setup lang="ts">
import { RouterLink } from 'vue-router';
import MainLayout from '../layout/MainLayout.vue';

const HERO_IMG      = 'https://res.cloudinary.com/dpjzfua3n/image/upload/q_auto,f_auto,w_1600/v1775351861/sorbito-de-verdad/products/i465dbepm8eiumhj5qc9.jpg';
const STORY_IMG     = 'https://res.cloudinary.com/dpjzfua3n/image/upload/q_auto,f_auto,w_900/v1775351862/sorbito-de-verdad/products/fdpqf502iugjgcv9ta2w.jpg';
const BOSCAN_IMG    = 'https://res.cloudinary.com/dpjzfua3n/image/upload/q_auto,f_auto,w_600/v1775351847/sorbito-de-verdad/products/ergzx1oqfuyxjdr07jpc.jpg';
const MONI_IMG      = 'https://res.cloudinary.com/dpjzfua3n/image/upload/q_auto,f_auto,w_600/v1775351849/sorbito-de-verdad/products/embdf62dtn0smhsefjqo.jpg';
const RUSTICA_IMG   = 'https://res.cloudinary.com/dpjzfua3n/image/upload/q_auto,f_auto,w_600/v1775351850/sorbito-de-verdad/products/mgw2nzrguzruderiy2dn.jpg';

const values = [
  {
    icon: 'fa-solid fa-hands',
    color: '#C8956C',
    title: 'Artesanía Real',
    text: 'Cada taza es hecha a mano. No hay dos iguales. Eso no es un defecto, es la firma del artesano.',
  },
  {
    icon: 'fa-solid fa-leaf',
    color: '#22C55E',
    title: 'Materiales con Alma',
    text: 'Arcillas y materiales cuidadosamente seleccionados, pensando en la durabilidad y en el planeta.',
  },
  {
    icon: 'fa-solid fa-heart',
    color: '#D4879A',
    title: 'Hecho con Amor',
    text: 'Cada pedido lleva nuestro cuidado personal. Empacamos como si se lo entregáramos a un amigo.',
  },
  {
    icon: 'fa-solid fa-star',
    color: '#F59E0B',
    title: 'Orgullo Venezolano',
    text: 'Nacimos en Venezuela, donde el café no es solo bebida, es identidad. Eso vive en cada pieza.',
  },
];
</script>

<template>
  <MainLayout>
    <div class="about">

      <!-- ── Hero ──────────────────────────────────────── -->
      <section class="about-hero">
        <img :src="HERO_IMG" alt="Sorbito de Verdad" class="about-hero__bg" />
        <div class="about-hero__overlay"></div>
        <div class="container about-hero__content">
          <span class="about-hero__eyebrow">
            <i class="fa-solid fa-mug-hot"></i> Nuestra Historia
          </span>
          <h1 class="about-hero__title">
            Dos personas, una pasión,<br>
            <em>mil historias en barro</em>
          </h1>
          <p class="about-hero__subtitle">
            Todo comenzó en una cocina pequeña con mucho café, mucho amor
            y la certeza de que cada taza puede contar una historia única.
          </p>
          <div class="about-hero__stats">
            <div class="about-hero__stat">
              <span class="about-hero__stat-num">100%</span>
              <span class="about-hero__stat-label">Hecho a mano</span>
            </div>
            <div class="about-hero__stat-divider"></div>
            <div class="about-hero__stat">
              <span class="about-hero__stat-num">3</span>
              <span class="about-hero__stat-label">Colecciones únicas</span>
            </div>
            <div class="about-hero__stat-divider"></div>
            <div class="about-hero__stat">
              <span class="about-hero__stat-num">∞</span>
              <span class="about-hero__stat-label">Sorbos con alma</span>
            </div>
          </div>
        </div>
      </section>

      <!-- ── Story ─────────────────────────────────────── -->
      <section class="about-story">
        <div class="container about-story__inner">
          <div class="about-story__image-col">
            <img :src="STORY_IMG" alt="Tazas con vapor" class="about-story__img" loading="lazy" />
            <div class="about-story__img-badge">
              <i class="fa-solid fa-award"></i>
              Artesanía certificada
            </div>
          </div>
          <div class="about-story__text-col">
            <span class="about-section-eyebrow">¿Cómo comenzó todo?</span>
            <h2 class="about-story__title">Una taza que<br>se convirtió en marca</h2>
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
              <i class="fa-solid fa-quote-left about-story__quote-icon"></i>
              "Cada pieza que sale de nuestras manos lleva una intención: que quien la sostenga sienta que fue hecha para ella."
              <cite>— Boscan &amp; La Moni</cite>
            </blockquote>
          </div>
        </div>
      </section>

      <!-- ── Collections showcase ───────────────────────── -->
      <section class="about-collections">
        <div class="container">
          <div class="about-collections__header">
            <span class="about-section-eyebrow">Nuestras colecciones</span>
            <h2 class="about-collections__title">Cada taza, una personalidad</h2>
          </div>
          <div class="about-collections__grid">
            <div class="collection-card">
              <div class="collection-card__img-wrap">
                <img :src="BOSCAN_IMG" alt="Colección Boscan" class="collection-card__img" loading="lazy" />
              </div>
              <div class="collection-card__body">
                <span class="collection-card__label">Colección</span>
                <h3 class="collection-card__name">Boscan</h3>
                <p class="collection-card__desc">Las gafas y la barba icónica. Para el que se toma el café en serio.</p>
              </div>
            </div>
            <div class="collection-card collection-card--rose">
              <div class="collection-card__img-wrap">
                <img :src="MONI_IMG" alt="Colección La Moni" class="collection-card__img" loading="lazy" />
              </div>
              <div class="collection-card__body">
                <span class="collection-card__label">Colección</span>
                <h3 class="collection-card__name">La Moni</h3>
                <p class="collection-card__desc">Pestañas y labios rojos. Para la mujer que convierte cada sorbo en arte.</p>
              </div>
            </div>
            <div class="collection-card collection-card--rustica">
              <div class="collection-card__img-wrap">
                <img :src="RUSTICA_IMG" alt="Artesanal Rústica" class="collection-card__img" loading="lazy" />
              </div>
              <div class="collection-card__body">
                <span class="collection-card__label">Colección</span>
                <h3 class="collection-card__name">Artesanal Rústica</h3>
                <p class="collection-card__desc">Cerámica crema con relieve. La esencia de la tierra convertida en objeto.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- ── Values ─────────────────────────────────────── -->
      <section id="valores" class="about-values">
        <div class="container">
          <div class="about-values__header">
            <span class="about-section-eyebrow">Lo que nos define</span>
            <h2 class="about-values__title">Nuestros Valores</h2>
            <p class="about-values__subtitle">Los principios detrás de cada pieza que creamos.</p>
          </div>
          <div class="about-values__grid">
            <div
              v-for="v in values"
              :key="v.title"
              class="value-card"
            >
              <div class="value-card__icon-wrap" :style="{ backgroundColor: v.color + '18', color: v.color }">
                <i :class="v.icon"></i>
              </div>
              <h3 class="value-card__title">{{ v.title }}</h3>
              <p class="value-card__text">{{ v.text }}</p>
            </div>
          </div>
        </div>
      </section>

      <!-- ── CTA ────────────────────────────────────────── -->
      <section class="about-cta">
        <div class="about-cta__bg-img-wrap" aria-hidden="true">
          <img :src="HERO_IMG" alt="" class="about-cta__bg-img" />
          <div class="about-cta__bg-overlay"></div>
        </div>
        <div class="container about-cta__content">
          <span class="about-cta__eyebrow">
            <i class="fa-solid fa-shopping-bag"></i> Tienda
          </span>
          <h2 class="about-cta__title">¿Lista/o para encontrar tu taza?</h2>
          <p class="about-cta__text">Explora nuestras colecciones y lleva a casa una pieza que cuente tu historia.</p>
          <RouterLink to="/tienda" class="about-cta__btn">
            Ver Colecciones
            <i class="fa-solid fa-arrow-right"></i>
          </RouterLink>
        </div>
      </section>

    </div>
  </MainLayout>
</template>

<style lang="scss" scoped>
@use "sass:color";

// ── Shared eyebrow ────────────────────────────────────────
.about-section-eyebrow {
  display: inline-block;
  font-size: 0.8rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.14em;
  color: $color-accent;
  margin-bottom: 0.75rem;
}

// ── Hero ──────────────────────────────────────────────────
.about-hero {
  position: relative;
  min-height: 620px;
  display: flex;
  align-items: center;
  overflow: hidden;

  @media (max-width: 768px) { min-height: 500px; }

  &__bg {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center 25%;
  }

  &__overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(
      110deg,
      rgba(#070707, 0.96) 0%,
      rgba(#070707, 0.82) 50%,
      rgba(#070707, 0.45) 80%,
      transparent 100%
    );
  }

  &__content {
    position: relative;
    z-index: 1;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    max-width: 680px;
    padding-top: 5rem;
    padding-bottom: 5rem;
  }

  &__eyebrow {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.8rem;
    font-weight: 700;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: $color-accent;
  }

  &__title {
    font-family: var(--font-heading);
    font-size: clamp(2.25rem, 5vw, 3.75rem);
    font-weight: 700;
    color: #fff;
    line-height: 1.12;
    margin: 0;

    em { font-style: italic; color: $color-accent; }
  }

  &__subtitle {
    font-size: 1.0625rem;
    color: rgba(#fff, 0.72);
    line-height: 1.75;
    margin: 0;
    max-width: 520px;
  }

  &__stats {
    display: flex;
    align-items: center;
    gap: 2rem;
    margin-top: 0.5rem;

    @media (max-width: 480px) { gap: 1.25rem; }
  }

  &__stat {
    display: flex;
    flex-direction: column;
    gap: 0.2rem;
  }

  &__stat-num {
    font-family: var(--font-heading);
    font-size: 2rem;
    font-weight: 700;
    color: $color-accent;
    line-height: 1;
  }

  &__stat-label {
    font-size: 0.75rem;
    color: rgba(#fff, 0.55);
    text-transform: uppercase;
    letter-spacing: 0.06em;
    font-weight: 500;
  }

  &__stat-divider {
    width: 1px;
    height: 40px;
    background-color: rgba(#fff, 0.15);
  }
}

// ── Story ─────────────────────────────────────────────────
.about-story {
  padding: 6rem 0;
  background-color: var(--color-bg);

  @media (max-width: 768px) { padding: 4rem 0; }

  &__inner {
    display: grid;
    grid-template-columns: 1fr 1.1fr;
    gap: 5rem;
    align-items: center;

    @media (max-width: 960px) {
      grid-template-columns: 1fr;
      gap: 3rem;
    }
  }

  &__image-col {
    position: relative;

    @media (max-width: 960px) { max-width: 520px; margin: 0 auto; width: 100%; }
  }

  &__img {
    width: 100%;
    border-radius: $radius-xl;
    display: block;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
  }

  &__img-badge {
    position: absolute;
    bottom: -1.25rem;
    right: -1.25rem;
    background-color: $color-accent;
    color: white;
    padding: 0.75rem 1.25rem;
    border-radius: $radius-md;
    font-size: 0.875rem;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    box-shadow: 0 8px 24px rgba($color-accent, 0.4);

    @media (max-width: 960px) { display: none; }
  }

  &__text-col {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  &__title {
    font-family: var(--font-heading);
    font-size: clamp(1.75rem, 3.5vw, 2.75rem);
    font-weight: 700;
    color: var(--color-primary);
    line-height: 1.2;
    margin: 0 0 1.5rem;
  }

  &__paragraphs {
    display: flex;
    flex-direction: column;
    gap: 1.125rem;
    margin-bottom: 2rem;

    p {
      font-size: 1rem;
      color: var(--color-muted);
      line-height: 1.8;
      margin: 0;

      strong { color: var(--color-primary); font-weight: 600; }
    }
  }

  &__quote {
    position: relative;
    background-color: var(--color-bg-subtle);
    border-left: 4px solid $color-accent;
    border-radius: 0 $radius-md $radius-md 0;
    padding: 1.5rem 1.5rem 1.5rem 2rem;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    font-family: var(--font-heading);
    font-size: 1rem;
    font-style: italic;
    color: var(--color-primary);
    line-height: 1.65;

    cite {
      font-size: 0.875rem;
      font-weight: 700;
      font-style: normal;
      color: $color-accent;
    }
  }

  &__quote-icon {
    position: absolute;
    top: -0.75rem;
    left: 1.25rem;
    font-size: 1.5rem;
    color: $color-accent;
    opacity: 0.4;
  }
}

// ── Collections ───────────────────────────────────────────
.about-collections {
  padding: 6rem 0;
  background-color: var(--color-bg-subtle);

  @media (max-width: 768px) { padding: 4rem 0; }

  &__header {
    text-align: center;
    margin-bottom: 3rem;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  &__title {
    font-family: var(--font-heading);
    font-size: clamp(1.5rem, 3vw, 2.5rem);
    font-weight: 700;
    color: var(--color-primary);
    margin: 0;
  }

  &__grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1.5rem;

    @media (max-width: 900px) { grid-template-columns: 1fr; max-width: 420px; margin: 0 auto; }
  }
}

.collection-card {
  background-color: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: $radius-xl;
  overflow: hidden;
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-6px);
    box-shadow: 0 16px 48px rgba(0, 0, 0, 0.14);

    .collection-card__img { transform: scale(1.04); }
  }

  &__img-wrap {
    aspect-ratio: 4 / 3;
    overflow: hidden;
  }

  &__img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  }

  &__body {
    padding: 1.5rem;
    display: flex;
    flex-direction: column;
    gap: 0.375rem;
  }

  &__label {
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: $color-accent;
  }

  &--rose &__label { color: var(--color-rose); }
  &--rustica &__label { color: #A0826D; }

  &__name {
    font-family: var(--font-heading);
    font-size: 1.375rem;
    font-weight: 700;
    color: var(--color-primary);
    margin: 0;
  }

  &__desc {
    font-size: 0.9rem;
    color: var(--color-muted);
    line-height: 1.6;
    margin: 0;
  }
}

// ── Values ────────────────────────────────────────────────
.about-values {
  padding: 6rem 0;
  background-color: var(--color-bg);

  @media (max-width: 768px) { padding: 4rem 0; }

  &__header {
    text-align: center;
    margin-bottom: 3.5rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
  }

  &__title {
    font-family: var(--font-heading);
    font-size: clamp(1.5rem, 3vw, 2.5rem);
    font-weight: 700;
    color: var(--color-primary);
    margin: 0;
  }

  &__subtitle {
    font-size: 1rem;
    color: var(--color-muted);
    margin: 0;
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
  background-color: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: $radius-lg;
  padding: 2rem 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 12px 36px rgba(0, 0, 0, 0.1);
  }

  &__icon-wrap {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 52px;
    height: 52px;
    border-radius: $radius-md;
    font-size: 1.375rem;
    flex-shrink: 0;
  }

  &__title {
    font-family: var(--font-heading);
    font-size: 1.125rem;
    font-weight: 700;
    color: var(--color-primary);
    margin: 0;
  }

  &__text {
    font-size: 0.9375rem;
    color: var(--color-muted);
    line-height: 1.65;
    margin: 0;
  }
}

// ── CTA ───────────────────────────────────────────────────
.about-cta {
  position: relative;
  min-height: 400px;
  display: flex;
  align-items: center;
  overflow: hidden;

  &__bg-img-wrap {
    position: absolute;
    inset: 0;
  }

  &__bg-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center 60%;
  }

  &__bg-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(
      135deg,
      rgba($color-accent, 0.92) 0%,
      rgba(color.adjust($color-accent, $lightness: -15%), 0.88) 100%
    );
  }

  &__content {
    position: relative;
    z-index: 1;
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1.25rem;
    padding: 5rem 0;
  }

  &__eyebrow {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.8rem;
    font-weight: 700;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: rgba(white, 0.75);
  }

  &__title {
    font-family: var(--font-heading);
    font-size: clamp(1.75rem, 4vw, 3rem);
    color: white;
    font-weight: 700;
    margin: 0;
    line-height: 1.2;
  }

  &__text {
    font-size: 1.0625rem;
    color: rgba(white, 0.82);
    margin: 0;
    max-width: 480px;
    line-height: 1.65;
  }

  &__btn {
    display: inline-flex;
    align-items: center;
    gap: 0.625rem;
    padding: 0.9rem 2.25rem;
    background-color: white;
    color: $color-accent;
    border-radius: $radius-md;
    text-decoration: none;
    font-size: 1rem;
    font-weight: 700;
    transition: all 0.25s ease;
    margin-top: 0.5rem;

    i { font-size: 0.875rem; transition: transform 0.22s ease; }

    &:hover {
      background-color: #fff;
      transform: translateY(-2px);
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
      i { transform: translateX(4px); }
    }
  }
}
</style>
