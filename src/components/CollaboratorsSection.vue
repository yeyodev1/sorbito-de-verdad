<script setup lang="ts">
// ── Cinematic header images ───────────────────────────────────────────────
const HEADER_IMG = 'https://res.cloudinary.com/dpjzfua3n/image/upload/q_auto,f_auto,w_1400/v1775351861/sorbito-de-verdad/products/i465dbepm8eiumhj5qc9.jpg';

// ── Collaborator card visuals ─────────────────────────────────────────────
// Senefelder: dark bg + their logo
const SENEFELDER_LOGO = 'https://res.cloudinary.com/dpjzfua3n/image/upload/q_auto,f_auto/v1775354051/sorbito-de-verdad/collaborators/senefelder-logo.png';
// Franz: his design work — the Boscan taza is literally his creation
const FRANZ_IMG = 'https://res.cloudinary.com/dpjzfua3n/image/upload/q_auto,f_auto,w_800/v1775351847/sorbito-de-verdad/products/ergzx1oqfuyxjdr07jpc.jpg';
// Doga: the rustic artisan taza they handcraft
const DOGA_IMG = 'https://res.cloudinary.com/dpjzfua3n/image/upload/q_auto,f_auto,w_800/v1775351850/sorbito-de-verdad/products/mgw2nzrguzruderiy2dn.jpg';
// Bakano: their brand image
const BAKANO_IMG = 'https://res.cloudinary.com/dpjzfua3n/image/upload/q_auto,f_auto,w_800/v1775354052/sorbito-de-verdad/collaborators/bakano-logo.png';

const collaborators = [
  {
    id: 'senefelder',
    eyebrow: 'Packaging & Artes Gráficas',
    name: 'Senefelder',
    tagline: 'Más de 100 años imprimiendo historia.',
    description: 'Industria gráfica ecuatoriana certificada ISO 9001:2015. Dan vida al packaging que protege cada taza con la misma elegancia con la que fue creada.',
    url: 'https://www.senefelder.com',
    logo: SENEFELDER_LOGO,
    bgColor: '#0D1117',
    accentColor: '#E8B84B',
    country: 'Ecuador',
    cta: 'senefelder.com',
  },
  {
    id: 'franz',
    eyebrow: 'Diseño & Identidad Visual',
    name: 'Franz Del Castillo',
    tagline: 'El trazo detrás de cada colección.',
    description: 'El artista que dibujó las gafas de Boscan y las pestañas de La Moni. Diseño venezolano con propósito y alma, visible en cada taza.',
    url: 'https://www.instagram.com/franzdelcastillo/',
    logo: null,
    bgImage: FRANZ_IMG,
    accentColor: '#A855F7',
    country: 'Venezuela',
    cta: '@franzdelcastillo',
  },
  {
    id: 'doga',
    eyebrow: 'Artesanía & Cerámica',
    name: 'Doga Designs',
    tagline: 'Las manos que dan vida a cada pieza.',
    description: 'Las artesanas que moldean, pintan y hornean cada taza de manera individual. Tradición cerámica ecuatoriana hecha arte funcional.',
    url: 'https://www.instagram.com/doga.designs/',
    logo: null,
    bgImage: DOGA_IMG,
    accentColor: '#C8956C',
    country: 'Ecuador',
    cta: '@doga.designs',
  },
  {
    id: 'bakano',
    eyebrow: 'Marketing & Tecnología Digital',
    name: 'Bakano',
    tagline: 'Conectamos marcas con personas.',
    description: 'Agencia de marketing digital #1 en Ecuador. Responsables de que puedas encontrar, conocer y comprar tu taza desde aquí.',
    url: 'https://bakano.ec/',
    logo: BAKANO_IMG,
    bgColor: '#0b0815',
    accentColor: '#C8956C',
    country: 'Ecuador',
    cta: 'bakano.ec',
  },
];
</script>

<template>
  <section class="collab">

    <!-- ── Cinematic header ──────────────────────────────── -->
    <div class="collab__header">
      <img :src="HEADER_IMG" alt="" class="collab__header-bg" loading="lazy" />
      <div class="collab__header-overlay"></div>
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
          Desde las artes gráficas ecuatorianas hasta el diseño venezolano,
          pasando por las artesanas que dan forma a cada taza.
          Sorbito de Verdad es el encuentro extraordinario de estos talentos.
        </p>
      </div>
    </div>

    <!-- ── Cards ────────────────────────────────────────── -->
    <div class="collab__grid-section">
      <div class="container">
        <div class="collab__grid">
          <a
            v-for="c in collaborators"
            :key="c.id"
            :href="c.url"
            target="_blank"
            rel="noopener noreferrer"
            class="collab__card"
          >
            <!-- Background: image or solid color -->
            <div
              class="collab__card-bg"
              :style="c.bgImage
                ? { backgroundImage: `url(${c.bgImage})` }
                : { backgroundColor: c.bgColor }"
            ></div>
            <!-- Dark gradient overlay always -->
            <div
              class="collab__card-overlay"
              :style="{ background: `linear-gradient(180deg, rgba(0,0,0,0.18) 0%, rgba(0,0,0,0.72) 55%, rgba(0,0,0,0.95) 100%)` }"
            ></div>

            <!-- Logo badge (for Senefelder and Bakano) -->
            <div v-if="c.logo" class="collab__card-logo-wrap">
              <img :src="c.logo" :alt="c.name + ' logo'" class="collab__card-logo" />
            </div>

            <!-- Eyebrow (for cards without logo) -->
            <div v-else class="collab__card-eyebrow-top">
              <span class="collab__card-badge" :style="{ color: c.accentColor, borderColor: c.accentColor + '55' }">
                <i class="fa-brands fa-instagram"></i>
                {{ c.eyebrow }}
              </span>
            </div>

            <!-- Content at bottom -->
            <div class="collab__card-content">
              <div class="collab__card-meta">
                <span class="collab__card-country">
                  <i class="fa-solid fa-location-dot"></i>
                  {{ c.country }}
                </span>
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
      </div>
    </div>

  </section>
</template>

<style lang="scss" scoped>
@use '../styles/colorVariables.module.scss' as *;

.collab {
  // ── Header ───────────────────────────────────────────

  &__header {
    position: relative;
    min-height: 500px;
    overflow: hidden;
    display: flex;
    align-items: center;

    @media (max-width: 768px) {
      min-height: 400px;
    }
  }

  &__header-bg {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center 30%;
  }

  &__header-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(
      110deg,
      rgba(#070707, 0.95) 0%,
      rgba(#070707, 0.78) 45%,
      rgba(#070707, 0.4) 70%,
      transparent 100%
    );
  }

  &__header-content {
    position: relative;
    z-index: 1;
    padding-top: 5rem;
    padding-bottom: 5rem;
    max-width: 660px;
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
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
    grid-template-columns: repeat(4, 1fr);
    gap: 1.25rem;

    @media (max-width: 1100px) {
      grid-template-columns: repeat(2, 1fr);
    }

    @media (max-width: 560px) {
      grid-template-columns: 1fr;
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
    max-width: 140px;
    max-height: 80px;
    object-fit: contain;
    filter: brightness(0) invert(1);
    opacity: 0.92;
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
