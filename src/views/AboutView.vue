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
    title: 'Artesanía Real',
    text: 'Cada taza es hecha a mano. No hay dos iguales. Eso no es un defecto, es la firma del artesano.',
  },
  {
    icon: 'fa-solid fa-leaf',
    title: 'Materiales con Alma',
    text: 'Arcillas y materiales cuidadosamente seleccionados, pensando en la durabilidad y en el planeta.',
  },
  {
    icon: 'fa-solid fa-heart',
    title: 'Hecho con Amor',
    text: 'Cada pedido lleva nuestro cuidado personal. Empacamos como si se lo entregáramos a un amigo.',
  },
  {
    icon: 'fa-solid fa-flag',
    title: 'Orgullo Ecuatoriano',
    text: '100% hecho en Ecuador. Cada taza, cada empaque, cada diseño — talento ecuatoriano de principio a fin.',
  },
];
</script>

<template>
  <MainLayout>
    <div class="about">

      <!-- ── Hero ──────────────────────────────────────── -->
      <section class="about-hero">
        <img :src="HERO_IMG" alt="Sorbito de Verdad" class="about-hero__bg" fetchpriority="high" />
        <div class="about-hero__overlay"></div>
        <div class="container about-hero__content">
          <span class="about-hero__eyebrow">Nuestra historia</span>
          <h1 class="about-hero__title">
            Dos personas, una pasión,
            <em>mil historias en barro</em>
          </h1>
          <p class="about-hero__subtitle">
            Todo comenzó en una cocina pequeña con mucho café, mucho amor
            y la certeza de que cada taza puede contar una historia única.
          </p>
          <dl class="about-hero__stats">
            <div class="about-hero__stat">
              <dt class="about-hero__stat-label">Hecho a mano</dt>
              <dd class="about-hero__stat-num">100%</dd>
            </div>
            <div class="about-hero__stat">
              <dt class="about-hero__stat-label">Colecciones únicas</dt>
              <dd class="about-hero__stat-num">3</dd>
            </div>
            <div class="about-hero__stat">
              <dt class="about-hero__stat-label">Sorbos con alma</dt>
              <dd class="about-hero__stat-num">∞</dd>
            </div>
          </dl>
        </div>
      </section>

      <!-- ── Story ─────────────────────────────────────── -->
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

      <!-- ── Collections showcase ───────────────────────── -->
      <section class="about-collections">
        <div class="container">
          <div class="about-section-head">
            <span class="eyebrow">Nuestras colecciones</span>
            <h2 class="about-section-head__title">Cada taza, una personalidad</h2>
          </div>
          <div class="about-collections__grid">
            <RouterLink to="/tienda?collection=boscan" class="collection-card">
              <div class="collection-card__img-wrap">
                <img :src="BOSCAN_IMG" alt="Colección Boscan" class="collection-card__img" loading="lazy" />
              </div>
              <div class="collection-card__body">
                <span class="collection-card__label">Colección</span>
                <h3 class="collection-card__name">Boscan</h3>
                <p class="collection-card__desc">Las gafas y la barba icónica. Para el que se toma el café en serio.</p>
              </div>
            </RouterLink>
            <RouterLink to="/tienda?collection=moni" class="collection-card">
              <div class="collection-card__img-wrap">
                <img :src="MONI_IMG" alt="Colección La Moni" class="collection-card__img" loading="lazy" />
              </div>
              <div class="collection-card__body">
                <span class="collection-card__label">Colección</span>
                <h3 class="collection-card__name">La Moni</h3>
                <p class="collection-card__desc">Pestañas y labios rojos. Para la mujer que convierte cada sorbo en arte.</p>
              </div>
            </RouterLink>
            <RouterLink to="/tienda?collection=rustica" class="collection-card">
              <div class="collection-card__img-wrap">
                <img :src="RUSTICA_IMG" alt="Artesanal Rústica" class="collection-card__img" loading="lazy" />
              </div>
              <div class="collection-card__body">
                <span class="collection-card__label">Colección</span>
                <h3 class="collection-card__name">Artesanal Rústica</h3>
                <p class="collection-card__desc">Cerámica crema con relieve. La esencia de la tierra convertida en objeto.</p>
              </div>
            </RouterLink>
          </div>
        </div>
      </section>

      <!-- ── Values ─────────────────────────────────────── -->
      <section id="valores" class="about-values">
        <div class="container">
          <div class="about-section-head">
            <span class="eyebrow">Lo que nos define</span>
            <h2 class="about-section-head__title">Nuestros valores</h2>
            <p class="about-section-head__subtitle">Los principios detrás de cada pieza que creamos.</p>
          </div>
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

      <!-- ── CTA ────────────────────────────────────────── -->
      <section class="about-cta">
        <div class="container">
          <div class="about-cta__card">
            <div class="about-cta__bg-img-wrap" aria-hidden="true">
              <img :src="HERO_IMG" alt="" class="about-cta__bg-img" loading="lazy" />
              <div class="about-cta__bg-overlay"></div>
            </div>
            <div class="about-cta__content">
              <span class="about-cta__eyebrow">Tienda</span>
              <h2 class="about-cta__title">¿Lista/o para encontrar tu taza?</h2>
              <p class="about-cta__text">Explora nuestras colecciones y lleva a casa una pieza que cuente tu historia.</p>
              <RouterLink to="/tienda" class="btn-primary btn-lg about-cta__btn">
                Ver colecciones
                <i class="fa-solid fa-arrow-right" aria-hidden="true"></i>
              </RouterLink>
            </div>
          </div>
        </div>
      </section>

    </div>
  </MainLayout>
</template>

<style lang="scss" scoped>
.about {
  background-color: var(--color-bg);
}

// ── Shared section head ─────────────────────────
.about-section-head {
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
  margin-bottom: 2.5rem;

  @media (min-width: 768px) {
    margin-bottom: 3.5rem;
  }

  &__title {
    font-weight: 500;
  }

  &__subtitle {
    max-width: 48ch;
  }
}

// ── Hero ────────────────────────────────────────
.about-hero {
  position: relative;
  min-height: min(88vh, 760px);
  display: flex;
  align-items: flex-end;
  overflow: hidden;
  isolation: isolate;
  color: #F7F2EA;

  &__bg {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    z-index: -2;
  }

  &__overlay {
    position: absolute;
    inset: 0;
    z-index: -1;
    background:
      linear-gradient(to top, rgba(20, 14, 10, 0.88) 0%, rgba(20, 14, 10, 0.45) 55%, rgba(20, 14, 10, 0.25) 100%);
  }

  &__content {
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
    padding-top: 6rem;
    padding-bottom: 3rem;

    @media (min-width: 768px) {
      padding-bottom: 4.5rem;
    }
  }

  &__eyebrow {
    font-size: 0.75rem;
    font-weight: 600;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: #F1DCCB;
  }

  &__title {
    max-width: 16ch;
    font-size: clamp(2.25rem, 6.5vw, 4.5rem);
    font-weight: 500;
    color: #F7F2EA;

    em {
      display: block;
      font-style: italic;
      color: #F1DCCB;
    }
  }

  &__subtitle {
    max-width: 52ch;
    font-size: 1.0625rem;
    color: rgba(247, 242, 234, 0.82);
  }

  &__stats {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 1rem;
    max-width: 520px;
    margin-top: 1rem;
    padding-top: 1.5rem;
    border-top: 1px solid rgba(247, 242, 234, 0.22);
  }

  &__stat {
    display: flex;
    flex-direction: column-reverse;
    gap: 0.125rem;
  }

  &__stat-num {
    font-family: var(--font-heading);
    font-size: clamp(1.75rem, 4vw, 2.5rem);
    font-weight: 500;
    line-height: 1;
    color: #F7F2EA;
  }

  &__stat-label {
    font-size: 0.75rem;
    color: rgba(247, 242, 234, 0.7);
  }
}

// ── Story ───────────────────────────────────────
.about-story {
  padding: 4.5rem 0;

  @media (min-width: 768px) {
    padding: 7rem 0;
  }

  &__inner {
    display: grid;
    gap: 2.5rem;
    align-items: center;

    @media (min-width: 900px) {
      grid-template-columns: 5fr 6fr;
      gap: 5rem;
    }
  }

  &__image-col {
    position: relative;
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

// ── Collections ─────────────────────────────────
.about-collections {
  padding: 4.5rem 0;
  background-color: var(--color-bg-subtle);

  @media (min-width: 768px) {
    padding: 7rem 0;
  }

  &__grid {
    display: grid;
    gap: 1.25rem;

    @media (min-width: 700px) {
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 1.5rem;
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

// ── Values ──────────────────────────────────────
.about-values {
  padding: 4.5rem 0;

  @media (min-width: 768px) {
    padding: 7rem 0;
  }

  &__grid {
    display: grid;
    gap: 1rem;

    @media (min-width: 640px) {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    @media (min-width: 1024px) {
      grid-template-columns: repeat(4, minmax(0, 1fr));
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
    display: grid;
    place-items: center;
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

// ── CTA ─────────────────────────────────────────
.about-cta {
  padding: 0 0 5rem;

  @media (min-width: 768px) {
    padding-bottom: 7rem;
  }

  &__card {
    position: relative;
    overflow: hidden;
    isolation: isolate;
    border-radius: $radius-xl;
    padding: 3.5rem 1.5rem;

    @media (min-width: 768px) {
      padding: 5.5rem 4rem;
    }
  }

  &__bg-img-wrap {
    position: absolute;
    inset: 0;
    z-index: -1;
  }

  &__bg-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  &__bg-overlay {
    position: absolute;
    inset: 0;
    background-color: rgba(20, 14, 10, 0.72);
  }

  &__content {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
    max-width: 560px;
  }

  &__eyebrow {
    font-size: 0.75rem;
    font-weight: 600;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: #F1DCCB;
  }

  &__title {
    font-weight: 500;
    color: #F7F2EA;
  }

  &__text {
    color: rgba(247, 242, 234, 0.8);
  }

  &__btn {
    margin-top: 0.5rem;
  }
}
</style>
