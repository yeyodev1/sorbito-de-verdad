<script setup lang="ts">
import { RouterLink } from 'vue-router';

// ── Card images ───────────────────────────────────────────────────────────
const SENEFELDER_LOGO = 'https://res.cloudinary.com/dpjzfua3n/image/upload/q_auto,f_auto/v1775354051/sorbito-de-verdad/collaborators/senefelder-logo.png';
const FRANZ_IMG       = 'https://res.cloudinary.com/dpjzfua3n/image/upload/q_auto,f_auto,w_800/v1775351847/sorbito-de-verdad/products/ergzx1oqfuyxjdr07jpc.jpg';
const DOGA_IMG        = 'https://res.cloudinary.com/dpjzfua3n/image/upload/q_auto,f_auto,w_800/v1775351850/sorbito-de-verdad/products/mgw2nzrguzruderiy2dn.jpg';
// Real Bakano logo (white version) + team group photo as background
const BAKANO_LOGO     = 'https://res.cloudinary.com/dpjzfua3n/image/upload/q_auto,f_auto/v1775355499/sorbito-de-verdad/collaborators/bakano-logo-real.png';
const BAKANO_TEAM_IMG = 'https://res.cloudinary.com/dpjzfua3n/image/upload/q_auto,f_auto,w_800/v1775355503/sorbito-de-verdad/collaborators/bakano-team-photo.jpg';

const collaborators = [
  {
    id: 'senefelder',
    eyebrow: 'Empaques & Artes Gráficas',
    name: 'Senefelder',
    tagline: 'Ellos hacen los empaques de cada taza.',
    description: 'Industria gráfica ecuatoriana con más de 100 años de historia, certificada ISO 9001:2015. Cada caja, cada empaque que protege y presenta tu taza lleva su sello de calidad.',
    url: 'https://www.senefelder.com',
    logo: SENEFELDER_LOGO,
    logoFilter: 'brightness(0) invert(1)',
    bgColor: '#0D1117',
    bgImage: null,
    accentColor: '#E8B84B',
    country: 'Ecuador',
    cta: 'senefelder.com',
  },
  {
    id: 'franz',
    eyebrow: 'Diseño de cada taza',
    name: 'Franz Del Castillo',
    tagline: 'Él diseñó cada taza que ves aquí.',
    description: 'Diseñador ecuatoriano que dio vida a los íconos de cada colección: las gafas de Boscan, las pestañas de La Moni. Su trazo convierte cerámica en identidad.',
    url: 'https://www.instagram.com/franzdelcastillo/',
    logo: null,
    logoFilter: null,
    bgImage: FRANZ_IMG,
    bgColor: null,
    accentColor: '#A855F7',
    country: 'Ecuador',
    cta: '@franzdelcastillo',
  },
  {
    id: 'doga',
    eyebrow: 'Las manos artesanas',
    name: 'Doga Designs',
    tagline: 'Sus manos moldean cada taza, una por una.',
    description: 'Las artesanas ecuatorianas que moldean, pintan y hornean cada taza de forma individual. Sin producción en masa — cada pieza es única, hecha a mano con dedicación.',
    url: 'https://www.instagram.com/doga.designs/',
    logo: null,
    logoFilter: null,
    bgImage: DOGA_IMG,
    bgColor: null,
    accentColor: '#C8956C',
    country: 'Ecuador',
    cta: '@doga.designs',
  },
  {
    id: 'bakano',
    eyebrow: 'Consultoría & Tecnología Digital',
    name: 'Bakano',
    tagline: 'Nosotros hacemos procesos de marketing y ventas. Conectamos a tus clientes potenciales con tu canal de transacción para que tu negocio crezca.',
    description: 'La agencia #1 en Ecuador que se obsesiona con que sus clientes facturen más. +40 negocios con experiencia real. Detrás de que puedas encontrar y comprar tu taza desde aquí.',
    url: 'https://bakano.ec/',
    logo: BAKANO_LOGO,
    logoFilter: 'none',                      // already white logo
    bgImage: BAKANO_TEAM_IMG,
    bgColor: null,
    accentColor: '#C8956C',
    country: 'Ecuador',
    cta: 'bakano.ec',
  },
];
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
        <a
          v-for="c in collaborators.filter(x => x.id !== 'bakano')"
          :key="c.id"
          :href="c.url"
          target="_blank"
          rel="noopener noreferrer"
          class="collab__card"
        >
          <div
            class="collab__card-bg"
            :style="c.bgImage
              ? { backgroundImage: `url(${c.bgImage})` }
              : { backgroundColor: c.bgColor ?? '#0D1117' }"
          ></div>
          <div class="collab__card-overlay"></div>

          <div v-if="c.logo" class="collab__card-logo-wrap">
            <img :src="c.logo" :alt="c.name + ' logo'" class="collab__card-logo" :style="{ filter: c.logoFilter || 'none' }" loading="lazy" />
          </div>

          <div class="collab__card-content">
            <span class="collab__card-role">{{ c.eyebrow }}</span>
            <h3 class="collab__card-name">{{ c.name }}</h3>
            <p class="collab__card-tagline">“{{ c.tagline }}”</p>
            <p class="collab__card-desc">{{ c.description }}</p>
            <span class="collab__card-cta">
              {{ c.cta }}
              <i class="fa-solid fa-arrow-up-right-from-square"></i>
            </span>
          </div>
        </a>
      </div>

      <!-- Bakano — featured wide card -->
      <a
        href="https://bakano.ec/"
        target="_blank"
        rel="noopener noreferrer"
        class="collab__card collab__card--featured"
      >
        <div class="collab__card-bg" :style="{ backgroundImage: `url(${BAKANO_TEAM_IMG})` }"></div>
        <div class="collab__card-overlay collab__card-overlay--featured"></div>
        <div class="collab__card-content collab__card-content--featured">
          <span class="collab__card-role">Aliado digital oficial</span>
          <img :src="BAKANO_LOGO" alt="Bakano" class="collab__card-featured-logo" loading="lazy" />
          <p class="collab__card-tagline">“Nosotros hacemos procesos de marketing y ventas. Conectamos a tus clientes potenciales con tu canal de transacción para que tu negocio crezca.”</p>
          <p class="collab__card-desc">Agencia de consultoría #1 en Ecuador. Detrás de la estrategia digital y el desarrollo web de Sorbito de Verdad.</p>
          <span class="collab__card-cta">
            bakano.ec
            <i class="fa-solid fa-arrow-up-right-from-square"></i>
          </span>
        </div>
      </a>

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
// Cards sit on photos with a dark scrim, so their text colors are fixed light tones
$on-photo: #FFFFFF;
$on-photo-soft: rgba(255, 255, 255, 0.72);
$on-photo-accent: #F1C7A8;

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
    display: grid;
    grid-template-columns: 1fr;
    gap: 1rem;

    @media (min-width: 900px) {
      grid-template-columns: repeat(3, 1fr);
      gap: 1.25rem;
    }
  }

  &__footer {
    display: flex;
    justify-content: center;
    margin-top: 2.5rem;
  }

  // ── Card ─────────────────────────
  &__card {
    position: relative;
    display: flex;
    flex-direction: column;
    min-height: 400px;
    overflow: hidden;
    border-radius: $radius-lg;
    color: $on-photo;
    background-color: #1A120D;
    transition: transform 0.35s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.35s ease;

    @media (min-width: 900px) {
      min-height: 460px;
    }

    &:hover {
      transform: translateY(-4px);
      box-shadow: var(--shadow-lg);

      .collab__card-bg { transform: scale(1.04); }
      .collab__card-cta i { transform: translate(2px, -2px); }
    }

    &--featured {
      min-height: 360px;
      margin-top: 1rem;
      border-radius: $radius-xl;

      @media (min-width: 900px) {
        margin-top: 1.25rem;
      }
    }
  }

  &__card-bg {
    position: absolute;
    inset: 0;
    background-size: cover;
    background-position: center;
    transition: transform 0.6s cubic-bezier(0.22, 1, 0.36, 1);
  }

  &__card-overlay {
    position: absolute;
    inset: 0;
    z-index: 1;
    background: linear-gradient(180deg, rgba(20, 12, 8, 0.1) 0%, rgba(20, 12, 8, 0.6) 45%, rgba(20, 12, 8, 0.94) 100%);

    &--featured {
      background: linear-gradient(180deg, rgba(20, 12, 8, 0.35) 0%, rgba(20, 12, 8, 0.94) 100%);

      @media (min-width: 768px) {
        background: linear-gradient(90deg, rgba(20, 12, 8, 0.95) 0%, rgba(20, 12, 8, 0.8) 45%, rgba(20, 12, 8, 0.2) 100%);
      }
    }
  }

  &__card-logo-wrap {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    z-index: 2;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 50%;
    padding: 2rem 1.5rem;
  }

  &__card-logo {
    max-width: 160px;
    max-height: 90px;
    object-fit: contain;
  }

  &__card-content {
    position: relative;
    z-index: 2;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    margin-top: auto;
    padding: 1.5rem;

    &--featured {
      max-width: 620px;

      @media (min-width: 768px) {
        margin: auto 0;
        padding: 2.5rem;
      }
    }
  }

  &__card-role {
    font-size: 0.7rem;
    font-weight: 600;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: $on-photo-accent;
  }

  &__card-name {
    font-size: 1.5rem;
    font-weight: 500;
    color: $on-photo;
  }

  &__card-featured-logo {
    display: block;
    max-width: 150px;
    max-height: 48px;
    margin: 0.25rem 0;
    object-fit: contain;
  }

  &__card-tagline {
    font-family: var(--font-heading);
    font-size: 1rem;
    font-style: italic;
    line-height: 1.4;
    color: $on-photo;
  }

  &__card-desc {
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
    font-size: 0.85rem;
    line-height: 1.6;
    color: $on-photo-soft;
  }

  &__card-cta {
    display: inline-flex;
    align-items: center;
    gap: 0.45rem;
    margin-top: 0.5rem;
    font-size: 0.85rem;
    font-weight: 600;
    color: $on-photo;

    i {
      font-size: 0.7rem;
      color: $on-photo-accent;
      transition: transform 0.2s ease;
    }
  }
}
</style>
