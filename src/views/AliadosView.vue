<script setup lang="ts">
import { RouterLink } from 'vue-router';
import MainLayout from '../layout/MainLayout.vue';

// ── Images ────────────────────────────────────────────────────────────────
const BAKANO_LOGO     = 'https://res.cloudinary.com/dpjzfua3n/image/upload/q_auto,f_auto/v1775355499/sorbito-de-verdad/collaborators/bakano-logo-real.png';
const BAKANO_TEAM_IMG = 'https://res.cloudinary.com/dpjzfua3n/image/upload/q_auto,f_auto,w_1600/v1775356753/IMG_8099_sgqrlb.jpg';
// Equipo real de Bakano (founders/team section, NOT testimonios)
const BAKANO_LUIS     = 'https://res.cloudinary.com/dpjzfua3n/image/upload/q_auto,f_auto,w_400/v1775356094/sorbito-de-verdad/collaborators/bakano-team-luis.webp';
const BAKANO_DENISSE  = 'https://res.cloudinary.com/dpjzfua3n/image/upload/q_auto,f_auto,w_400/v1775356095/sorbito-de-verdad/collaborators/bakano-team-denisse.webp';
const BAKANO_DIEGO    = 'https://res.cloudinary.com/dpjzfua3n/image/upload/q_auto,f_auto,w_400/v1775355501/sorbito-de-verdad/collaborators/bakano-team-diego.webp';
const HEADER_IMG      = 'https://res.cloudinary.com/dpjzfua3n/image/upload/q_auto,f_auto,w_1400/v1775351861/sorbito-de-verdad/products/i465dbepm8eiumhj5qc9.jpg';
const SENEFELDER_LOGO = 'https://res.cloudinary.com/dpjzfua3n/image/upload/q_auto,f_auto/v1775354051/sorbito-de-verdad/collaborators/senefelder-logo.png';
const FRANZ_IMG       = 'https://res.cloudinary.com/dpjzfua3n/image/upload/q_auto,f_auto,w_600/v1775351847/sorbito-de-verdad/products/ergzx1oqfuyxjdr07jpc.jpg';
const DOGA_IMG        = 'https://res.cloudinary.com/dpjzfua3n/image/upload/q_auto,f_auto,w_600/v1775351850/sorbito-de-verdad/products/mgw2nzrguzruderiy2dn.jpg';

const otherPartners = [
  {
    id: 'senefelder',
    eyebrow: 'Packaging & Artes Gráficas',
    name: 'Senefelder',
    tagline: 'Más de 100 años imprimiendo historia.',
    description: 'Industria gráfica ecuatoriana certificada ISO 9001:2015. Dan vida al packaging que protege y presenta cada taza con la misma elegancia con la que fue creada.',
    url: 'https://www.senefelder.com',
    logo: SENEFELDER_LOGO,
    bgImg: null,
    bgColor: '#0D1117',
    accent: '#E8B84B',
    country: 'Ecuador 🇪🇨',
    cta: 'senefelder.com',
    icon: 'fa-solid fa-box-open',
  },
  {
    id: 'franz',
    eyebrow: 'Diseño & Identidad Visual',
    name: 'Franz Del Castillo',
    tagline: 'El trazo detrás de cada colección.',
    description: 'El artista que dibujó las gafas de Boscan y las pestañas de La Moni. Diseño venezolano con propósito y alma, visible en cada taza.',
    url: 'https://www.instagram.com/franzdelcastillo/',
    logo: null,
    bgImg: FRANZ_IMG,
    bgColor: null,
    accent: '#A855F7',
    country: 'Venezuela 🇻🇪',
    cta: '@franzdelcastillo',
    icon: 'fa-solid fa-palette',
  },
  {
    id: 'doga',
    eyebrow: 'Artesanía & Cerámica',
    name: 'Doga Designs',
    tagline: 'Las manos que dan vida a cada pieza.',
    description: 'Las artesanas que moldean, pintan y hornean cada taza de manera individual. Tradición cerámica ecuatoriana hecha arte funcional e irrepetible.',
    url: 'https://www.instagram.com/doga.designs/',
    logo: null,
    bgImg: DOGA_IMG,
    bgColor: null,
    accent: '#C8956C',
    country: 'Ecuador 🇪🇨',
    cta: '@doga.designs',
    icon: 'fa-solid fa-hands',
  },
];

const bakanoStats = [
  { num: '+40', label: 'Negocios con experiencia' },
  { num: '+20%', label: 'Más facturación para sus clientes' },
  { num: '#1', label: 'Agencia en Ecuador' },
];
</script>

<template>
  <MainLayout>
    <div class="aliados-page">

      <!-- ── Hero ──────────────────────────────────────── -->
      <section class="aliados-hero">
        <img :src="HEADER_IMG" alt="" class="aliados-hero__bg" />
        <div class="aliados-hero__overlay"></div>
        <div class="container aliados-hero__content">
          <span class="aliados-hero__eyebrow">
            <i class="fa-solid fa-handshake-simple"></i>
            Un producto, muchos talentos
          </span>
          <h1 class="aliados-hero__title">
            Las manos que hacen<br><em>posible cada sorbo</em>
          </h1>
          <p class="aliados-hero__subtitle">
            Sorbito de Verdad es el resultado de una red de talentos extraordinarios.
            Conoce a quienes hacen posible que cada taza llegue a tus manos.
          </p>
        </div>
      </section>

      <!-- ── BAKANO FEATURED ────────────────────────────── -->
      <section class="bakano-feature">
        <div class="bakano-feature__img-wrap">
          <img :src="BAKANO_TEAM_IMG" alt="Equipo Bakano" class="bakano-feature__img" />
          <div class="bakano-feature__img-overlay"></div>
        </div>

        <div class="container bakano-feature__inner">
          <div class="bakano-feature__content">
            <!-- Badge -->
            <div class="bakano-feature__badge">
              <i class="fa-solid fa-star"></i>
              Aliado Digital Oficial
            </div>

            <!-- Logo -->
            <img :src="BAKANO_LOGO" alt="Bakano" class="bakano-feature__logo" />

            <p class="bakano-feature__tagline">
              "Conectamos marcas con personas que las merecen."
            </p>

            <p class="bakano-feature__desc">
              La agencia de marketing digital <strong>#1 en Ecuador</strong> que se obsesiona con
              una sola cosa: que sus clientes <strong>facturen más</strong>. Con más de 40 negocios
              con experiencia real, Bakano combina estrategia data-driven, tecnología y crecimiento
              medible. Son el equipo detrás de que puedas encontrar, conocer y comprar tu taza
              desde aquí. Si estás leyendo esto, fue gracias a ellos.
            </p>

            <!-- Stats -->
            <div class="bakano-feature__stats">
              <div v-for="s in bakanoStats" :key="s.num" class="bakano-feature__stat">
                <span class="bakano-feature__stat-num">{{ s.num }}</span>
                <span class="bakano-feature__stat-label">{{ s.label }}</span>
              </div>
            </div>

            <!-- Team avatars (founders section only) -->
            <div class="bakano-feature__team">
              <span class="bakano-feature__team-label">El equipo:</span>
              <div class="bakano-feature__avatars">
                <img :src="BAKANO_LUIS"    alt="Luis"    class="bakano-feature__avatar" />
                <img :src="BAKANO_DENISSE" alt="Denisse" class="bakano-feature__avatar" />
                <img :src="BAKANO_DIEGO"   alt="Diego"   class="bakano-feature__avatar" />
                <div class="bakano-feature__avatar bakano-feature__avatar--more">+</div>
              </div>
            </div>

            <a
              href="https://bakano.ec/"
              target="_blank"
              rel="noopener noreferrer"
              class="bakano-feature__cta"
            >
              Conocer Bakano
              <i class="fa-solid fa-arrow-up-right-from-square"></i>
            </a>
          </div>
        </div>
      </section>

      <!-- ── Other partners ─────────────────────────────── -->
      <section class="other-partners">
        <div class="container">
          <div class="other-partners__header">
            <span class="other-partners__eyebrow">También parte de la familia</span>
            <h2 class="other-partners__title">El resto del equipo creativo</h2>
          </div>

          <div class="other-partners__grid">
            <a
              v-for="p in otherPartners"
              :key="p.id"
              :href="p.url"
              target="_blank"
              rel="noopener noreferrer"
              class="partner-card"
            >
              <div
                class="partner-card__bg"
                :style="p.bgImg
                  ? { backgroundImage: `url(${p.bgImg})` }
                  : { backgroundColor: p.bgColor ?? '#0D1117' }"
              ></div>
              <div class="partner-card__overlay"></div>

              <div v-if="p.logo" class="partner-card__logo-wrap">
                <img :src="p.logo" :alt="p.name" class="partner-card__logo" style="filter: brightness(0) invert(1)" />
              </div>
              <div v-else class="partner-card__icon-top">
                <i :class="p.icon" :style="{ color: p.accent }"></i>
              </div>

              <div class="partner-card__content">
                <span class="partner-card__country">{{ p.country }}</span>
                <h3 class="partner-card__name">{{ p.name }}</h3>
                <p class="partner-card__tagline" :style="{ color: p.accent }">"{{ p.tagline }}"</p>
                <p class="partner-card__desc">{{ p.description }}</p>
                <span class="partner-card__cta" :style="{ borderColor: p.accent + '66', color: p.accent }">
                  {{ p.cta }} <i class="fa-solid fa-arrow-up-right-from-square"></i>
                </span>
              </div>
            </a>
          </div>
        </div>
      </section>

      <!-- ── CTA → Tienda ───────────────────────────────── -->
      <section class="aliados-bottom-cta">
        <div class="container aliados-bottom-cta__inner">
          <h2 class="aliados-bottom-cta__title">¿Lista/o para tu taza?</h2>
          <p class="aliados-bottom-cta__text">Todos estos talentos se unen en cada pieza.</p>
          <RouterLink to="/tienda" class="aliados-bottom-cta__btn">
            Ver Colecciones <i class="fa-solid fa-arrow-right"></i>
          </RouterLink>
        </div>
      </section>

    </div>
  </MainLayout>
</template>

<style lang="scss" scoped>
@use '../styles/colorVariables.module.scss' as *;

// ── Hero ──────────────────────────────────────────────────
.aliados-hero {
  position: relative;
  min-height: 460px;
  display: flex;
  align-items: center;
  overflow: hidden;

  &__bg {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center 30%;
  }

  &__overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(110deg, rgba(#070707, 0.96) 0%, rgba(#070707, 0.75) 55%, rgba(#070707, 0.4) 80%, transparent 100%);
  }

  &__content {
    position: relative;
    z-index: 1;
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
    max-width: 640px;
    padding-top: 4.5rem;
    padding-bottom: 4.5rem;
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
    font-size: clamp(2rem, 4.5vw, 3.5rem);
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
}

// ── Bakano Feature ────────────────────────────────────────
.bakano-feature {
  position: relative;
  min-height: 600px;
  display: flex;
  align-items: center;
  overflow: hidden;

  @media (max-width: 768px) { min-height: auto; }

  &__img-wrap {
    position: absolute;
    inset: 0;

    @media (max-width: 768px) {
      position: relative;
      height: 280px;
    }
  }

  &__img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center center;
  }

  &__img-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(
      90deg,
      rgba(#0b0815, 0.97) 0%,
      rgba(#0b0815, 0.88) 45%,
      rgba(#0b0815, 0.55) 70%,
      rgba(#0b0815, 0.25) 100%
    );

    @media (max-width: 768px) {
      background: linear-gradient(180deg, rgba(#0b0815, 0.5) 0%, rgba(#0b0815, 0.97) 100%);
    }
  }

  &__inner {
    position: relative;
    z-index: 1;
    padding: 5rem 0;

    @media (max-width: 768px) { padding: 2.5rem 0 4rem; }
  }

  &__content {
    max-width: 580px;
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
  }

  &__badge {
    display: inline-flex;
    align-items: center;
    gap: 0.375rem;
    font-size: 0.75rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: $color-accent;
    background-color: rgba($color-accent, 0.12);
    border: 1px solid rgba($color-accent, 0.3);
    padding: 0.35rem 0.875rem;
    border-radius: $radius-full;
    width: fit-content;

    i { font-size: 0.625rem; }
  }

  &__logo {
    max-width: 180px;
    max-height: 60px;
    object-fit: contain;
    filter: none; // already white
    margin-bottom: 0.25rem;
  }

  &__tagline {
    font-family: var(--font-heading);
    font-size: 1.25rem;
    font-style: italic;
    color: rgba(#fff, 0.9);
    line-height: 1.5;
    margin: 0;
  }

  &__desc {
    font-size: 1rem;
    color: rgba(#fff, 0.72);
    line-height: 1.75;
    margin: 0;

    strong { color: $color-accent; font-weight: 700; }
  }

  &__stats {
    display: flex;
    gap: 2rem;
    padding: 1.25rem 0;
    border-top: 1px solid rgba(#fff, 0.1);
    border-bottom: 1px solid rgba(#fff, 0.1);

    @media (max-width: 480px) { gap: 1.25rem; }
  }

  &__stat {
    display: flex;
    flex-direction: column;
    gap: 0.15rem;
  }

  &__stat-num {
    font-family: var(--font-heading);
    font-size: 1.75rem;
    font-weight: 700;
    color: $color-accent;
    line-height: 1;
  }

  &__stat-label {
    font-size: 0.75rem;
    color: rgba(#fff, 0.5);
    text-transform: uppercase;
    letter-spacing: 0.06em;
    font-weight: 500;
  }

  &__team {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  &__team-label {
    font-size: 0.8125rem;
    color: rgba(#fff, 0.5);
    font-weight: 500;
    white-space: nowrap;
  }

  &__avatars {
    display: flex;
    align-items: center;

    > * { margin-left: -10px; }
    > *:first-child { margin-left: 0; }
  }

  &__avatar {
    width: 42px;
    height: 42px;
    border-radius: $radius-full;
    object-fit: cover;
    border: 2px solid rgba(#0b0815, 0.8);

    &--more {
      background-color: rgba($color-accent, 0.2);
      color: $color-accent;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.875rem;
      font-weight: 700;
    }
  }

  &__cta {
    display: inline-flex;
    align-items: center;
    gap: 0.625rem;
    padding: 0.875rem 1.875rem;
    background-color: $color-accent;
    color: white;
    border-radius: $radius-md;
    text-decoration: none;
    font-size: 1rem;
    font-weight: 700;
    transition: all 0.25s ease;
    width: fit-content;
    letter-spacing: 0.01em;

    i { font-size: 0.8rem; transition: transform 0.2s ease; }

    &:hover {
      filter: brightness(1.1);
      transform: translateY(-2px);
      box-shadow: 0 10px 30px rgba($color-accent, 0.4);
      i { transform: translate(2px, -2px); }
    }
  }
}

// ── Other partners ────────────────────────────────────────
.other-partners {
  padding: 5rem 0 6rem;
  background-color: var(--color-bg);

  &__header {
    text-align: center;
    margin-bottom: 3rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
  }

  &__eyebrow {
    font-size: 0.8rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.14em;
    color: $color-accent;
  }

  &__title {
    font-family: var(--font-heading);
    font-size: clamp(1.5rem, 3vw, 2.25rem);
    font-weight: 700;
    color: var(--color-primary);
    margin: 0;
  }

  &__grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1.25rem;

    @media (max-width: 900px) { grid-template-columns: 1fr; max-width: 440px; margin: 0 auto; }
  }
}

.partner-card {
  position: relative;
  display: flex;
  flex-direction: column;
  border-radius: $radius-lg;
  overflow: hidden;
  text-decoration: none;
  min-height: 400px;
  transition: transform 0.35s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.35s ease;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);

  &:hover {
    transform: translateY(-8px) scale(1.01);
    box-shadow: 0 20px 50px rgba(0, 0, 0, 0.4);
    .partner-card__bg { transform: scale(1.05); }
  }

  &__bg {
    position: absolute;
    inset: 0;
    background-size: cover;
    background-position: center;
    transition: transform 0.5s ease;
  }

  &__overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(180deg, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.65) 50%, rgba(0,0,0,0.94) 100%);
    z-index: 1;
  }

  &__logo-wrap {
    position: absolute;
    top: 0; left: 0; right: 0;
    z-index: 2;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 55%;
    padding: 2rem;
  }

  &__logo {
    max-width: 130px;
    max-height: 70px;
    object-fit: contain;
    opacity: 0.9;
  }

  &__icon-top {
    position: absolute;
    top: 1.5rem;
    left: 1.5rem;
    z-index: 2;
    font-size: 1.5rem;
    opacity: 0.9;
  }

  &__content {
    position: relative;
    z-index: 2;
    margin-top: auto;
    padding: 1.25rem;
    display: flex;
    flex-direction: column;
    gap: 0.375rem;
  }

  &__country {
    font-size: 0.7rem;
    color: rgba(#fff, 0.45);
    text-transform: uppercase;
    letter-spacing: 0.08em;
    font-weight: 600;
  }

  &__name {
    font-family: var(--font-heading);
    font-size: 1.375rem;
    font-weight: 700;
    color: #fff;
    margin: 0;
  }

  &__tagline {
    font-size: 0.875rem;
    font-weight: 500;
    font-style: italic;
    margin: 0;
  }

  &__desc {
    font-size: 0.8125rem;
    color: rgba(#fff, 0.62);
    line-height: 1.65;
    margin: 0 0 0.375rem;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  &__cta {
    display: inline-flex;
    align-items: center;
    gap: 0.375rem;
    font-size: 0.75rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    border: 1px solid;
    border-radius: $radius-full;
    padding: 0.375rem 0.75rem;
    align-self: flex-start;
    transition: background-color 0.2s ease;
    backdrop-filter: blur(8px);

    i { font-size: 0.6rem; }
  }
}

// ── Bottom CTA ────────────────────────────────────────────
.aliados-bottom-cta {
  background-color: var(--color-bg-subtle);
  border-top: 1px solid var(--color-border);

  &__inner {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    padding: 4rem 0;
    text-align: center;
  }

  &__title {
    font-family: var(--font-heading);
    font-size: clamp(1.5rem, 3vw, 2.25rem);
    font-weight: 700;
    color: var(--color-primary);
    margin: 0;
  }

  &__text {
    font-size: 1rem;
    color: var(--color-muted);
    margin: 0;
  }

  &__btn {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.875rem 2rem;
    background-color: $color-accent;
    color: white;
    border-radius: $radius-md;
    text-decoration: none;
    font-size: 1rem;
    font-weight: 700;
    transition: all 0.25s ease;
    margin-top: 0.5rem;

    i { font-size: 0.8rem; transition: transform 0.2s ease; }

    &:hover {
      filter: brightness(1.08);
      transform: translateY(-2px);
      box-shadow: 0 8px 24px rgba($color-accent, 0.35);
      i { transform: translateX(3px); }
    }
  }
}
</style>
