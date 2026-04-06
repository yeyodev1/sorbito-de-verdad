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
    eyebrow: 'Marketing & Tecnología Digital',
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
  <section class="collab">

    <!-- ── Header ────────────────────────────────────────── -->
    <div class="collab__header">
      <div class="container collab__header-content">
        <span class="collab__eyebrow">
          <i class="fa-solid fa-handshake-simple"></i>
          Un producto, muchos talentos
        </span>
        <h2 class="collab__title">
          Las manos que hacen<br>
          <em>posible cada sorbo</em>
        </h2>
        <p class="collab__subtitle">
          Cada taza es el resultado de talento ecuatoriano puro: el diseño, la cerámica, el empaque
          y la tecnología — todo hecho en Ecuador, con orgullo y dedicación.
          <strong style="color: #C8956C; display: block; margin-top: 0.75rem;">100% manos ecuatorianas.</strong>
        </p>
      </div>
    </div>

    <!-- ── Cards ────────────────────────────────────────── -->
    <div class="collab__grid-section">
      <div class="container">

        <!-- Bakano — featured wide card FIRST -->
        <a
          href="https://bakano.ec/"
          target="_blank"
          rel="noopener noreferrer"
          class="collab__card collab__card--featured"
        >
          <div class="collab__card-bg" :style="{ backgroundImage: `url(${BAKANO_TEAM_IMG})` }"></div>
          <div class="collab__card-overlay collab__card-overlay--featured"></div>
          <div class="collab__card-featured-badge">
            <i class="fa-solid fa-star"></i> Aliado Digital Oficial
          </div>
          <div class="collab__card-content collab__card-content--featured">
            <img :src="BAKANO_LOGO" alt="Bakano" class="collab__card-featured-logo" />
            <p class="collab__card-tagline" style="color: #C8956C; font-size: 1.05rem;">"Nosotros hacemos procesos de marketing y ventas. Conectamos a tus clientes potenciales con tu canal de transacción para que tu negocio crezca."</p>
            <p class="collab__card-desc" style="max-width: 560px;">Agencia de marketing digital #1 en Ecuador. Detrás de la estrategia digital y el desarrollo web de Sorbito de Verdad.</p>
            <div class="collab__card-cta" style="border-color: rgba(200,149,108,0.5); color: #C8956C; margin-top: 0.5rem;">
              <span>bakano.ec</span>
              <i class="fa-solid fa-arrow-up-right-from-square"></i>
            </div>
          </div>
        </a>

        <!-- Other 3 collaborators -->
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
              <img :src="c.logo" :alt="c.name + ' logo'" class="collab__card-logo" :style="{ filter: c.logoFilter || 'none' }" />
            </div>
            <div v-else class="collab__card-eyebrow-top">
              <span class="collab__card-badge" :style="{ color: c.accentColor, borderColor: c.accentColor + '55' }">
                <i class="fa-brands fa-instagram"></i>
                {{ c.eyebrow }}
              </span>
            </div>

            <div class="collab__card-content">
              <div class="collab__card-meta">
                <span class="collab__card-country"><i class="fa-solid fa-location-dot"></i> {{ c.country }}</span>
                <span class="collab__card-role">{{ c.eyebrow }}</span>
              </div>
              <h3 class="collab__card-name">{{ c.name }}</h3>
              <p class="collab__card-tagline" :style="{ color: c.accentColor }">"{{ c.tagline }}"</p>
              <p class="collab__card-desc">{{ c.description }}</p>
              <div class="collab__card-cta" :style="{ borderColor: c.accentColor + '66', color: c.accentColor }">
                <span>{{ c.cta }}</span>
                <i class="fa-solid fa-arrow-up-right-from-square"></i>
              </div>
            </div>
          </a>
        </div>

        <!-- Ver todos link -->
        <div class="collab__footer">
          <RouterLink to="/aliados" class="collab__see-all">
            Conocer a todos nuestros aliados
            <i class="fa-solid fa-arrow-right"></i>
          </RouterLink>
        </div>

      </div>
    </div>

  </section>
</template>

<style lang="scss" scoped>

.collab {
  // ── Header ───────────────────────────────────────────

  &__header {
    background-color: #1A1A1A;
    display: flex;
    align-items: center;
  }

  &__header-content {
    padding-top: 5rem;
    padding-bottom: 5rem;
    max-width: 660px;
    display: flex;
    flex-direction: column;
    gap: 1.25rem;

    @media (max-width: 768px) {
      padding-top: 3.5rem;
      padding-bottom: 3.5rem;
    }
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

    i { font-size: 0.875rem; }
  }

  &__title {
    font-family: var(--font-heading);
    font-size: clamp(2rem, 4.5vw, 3.25rem);
    font-weight: 700;
    color: #fff;
    line-height: 1.15;
    margin: 0;

    em {
      font-style: italic;
      color: $color-accent;
    }
  }

  &__subtitle {
    font-size: 1.0625rem;
    color: rgba(#fff, 0.7);
    line-height: 1.75;
    margin: 0;
  }

  // ── Grid section ─────────────────────────────────────

  &__grid-section {
    padding: 4rem 0 5rem;
    background-color: var(--color-bg);
  }

  &__grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1.25rem;
    margin-top: 1.25rem;

    @media (max-width: 900px) {
      grid-template-columns: 1fr;
    }
  }

  &__footer {
    display: flex;
    justify-content: center;
    margin-top: 2.5rem;
  }

  &__see-all {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.9rem;
    font-weight: 600;
    color: $color-accent;
    text-decoration: none;
    border: 1.5px solid $color-accent;
    border-radius: $radius-full;
    padding: 0.6rem 1.5rem;
    transition: all 0.22s ease;
    letter-spacing: 0.02em;

    i { font-size: 0.75rem; transition: transform 0.22s ease; }

    &:hover {
      background-color: $color-accent;
      color: white;
      i { transform: translateX(3px); }
    }
  }

  // ── Card ─────────────────────────────────────────────

  &__card {
    position: relative;
    display: flex;
    flex-direction: column;
    border-radius: $radius-lg;
    overflow: hidden;
    text-decoration: none;
    color: inherit;
    min-height: 460px;
    transition: transform 0.35s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.35s ease;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.25);

    @media (max-width: 560px) {
      min-height: 380px;
    }

    &:hover {
      transform: translateY(-10px) scale(1.01);
      box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5);

      .collab__card-bg {
        transform: scale(1.06);
      }

      .collab__card-cta {
        background-color: rgba(#fff, 0.08);
        gap: 0.625rem;
      }
    }
  }

  &__card-bg {
    position: absolute;
    inset: 0;
    background-size: cover;
    background-position: center;
    transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  }

  &__card-overlay {
    position: absolute;
    inset: 0;
    z-index: 1;
    background: linear-gradient(
      180deg,
      rgba(0,0,0,0.15) 0%,
      rgba(0,0,0,0.65) 50%,
      rgba(0,0,0,0.93) 100%
    );

    &--featured {
      background: linear-gradient(
        90deg,
        rgba(#0b0815, 0.95) 0%,
        rgba(#0b0815, 0.80) 45%,
        rgba(#0b0815, 0.45) 75%,
        transparent 100%
      );

      @media (max-width: 768px) {
        background: linear-gradient(180deg, rgba(#0b0815, 0.4) 0%, rgba(#0b0815, 0.95) 100%);
      }
    }
  }

  &__card--featured {
    min-height: 340px;
    border-radius: $radius-xl;
    box-shadow: 0 8px 40px rgba(0, 0, 0, 0.4);

    &:hover {
      transform: translateY(-6px) scale(1.005);
      box-shadow: 0 24px 60px rgba(0, 0, 0, 0.55);
    }
  }

  &__card-featured-badge {
    position: absolute;
    top: 1.5rem;
    left: 1.5rem;
    z-index: 2;
    display: inline-flex;
    align-items: center;
    gap: 0.375rem;
    font-size: 0.7rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: $color-accent;
    background-color: rgba($color-accent, 0.12);
    border: 1px solid rgba($color-accent, 0.35);
    padding: 0.3rem 0.75rem;
    border-radius: $radius-full;
    backdrop-filter: blur(8px);

    i { font-size: 0.6rem; }
  }

  &__card-content--featured {
    padding: 2rem 2.5rem;

    @media (max-width: 768px) { padding: 1.5rem; }
  }

  &__card-featured-logo {
    max-width: 160px;
    max-height: 52px;
    object-fit: contain;
    filter: none;
    margin-bottom: 0.5rem;
    display: block;
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
    padding: 2rem 1.5rem;
    flex: 1;
    height: 55%;
  }

  &__card-logo {
    max-width: 160px;
    max-height: 90px;
    object-fit: contain;
    opacity: 0.95;
    drop-shadow: 0 2px 8px rgba(0,0,0,0.5);
  }

  &__card-eyebrow-top {
    position: absolute;
    top: 1.25rem;
    left: 1.25rem;
    right: 1.25rem;
    z-index: 2;
  }

  &__card-badge {
    display: inline-flex;
    align-items: center;
    gap: 0.375rem;
    font-size: 0.6875rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    padding: 0.3rem 0.625rem;
    border: 1px solid;
    border-radius: $radius-full;
    backdrop-filter: blur(8px);
    background-color: rgba(0, 0, 0, 0.3);

    i { font-size: 0.75rem; }
  }

  &__card-content {
    position: relative;
    z-index: 2;
    margin-top: auto;
    padding: 1.5rem;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  &__card-meta {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin-bottom: 0.25rem;
  }

  &__card-country {
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
    font-size: 0.7rem;
    font-weight: 600;
    color: rgba(#fff, 0.5);
    text-transform: uppercase;
    letter-spacing: 0.08em;

    i { font-size: 0.6rem; }
  }

  &__card-role {
    font-size: 0.7rem;
    color: rgba(#fff, 0.45);
    text-transform: uppercase;
    letter-spacing: 0.08em;
    font-weight: 500;
  }

  &__card-name {
    font-family: var(--font-heading);
    font-size: 1.4375rem;
    font-weight: 700;
    color: #fff;
    line-height: 1.2;
    margin: 0;
  }

  &__card-tagline {
    font-size: 0.875rem;
    font-weight: 500;
    font-style: italic;
    line-height: 1.4;
    margin: 0;
  }

  &__card-desc {
    font-size: 0.8125rem;
    color: rgba(#fff, 0.65);
    line-height: 1.65;
    margin: 0;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  &__card-cta {
    display: inline-flex;
    align-items: center;
    gap: 0.375rem;
    font-size: 0.75rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    border: 1px solid;
    border-radius: $radius-full;
    padding: 0.4rem 0.875rem;
    margin-top: 0.5rem;
    align-self: flex-start;
    transition: all 0.2s ease;
    backdrop-filter: blur(8px);

    i { font-size: 0.65rem; }
  }
}
</style>
