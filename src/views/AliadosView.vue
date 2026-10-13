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
    eyebrow: 'Empaque',
    name: 'Senefelder',
    tagline: 'El empaque que protege y presenta tu taza.',
    description: 'Industria gráfica ecuatoriana certificada ISO 9001:2015, con más de 100 años de experiencia. Ellos diseñaron y fabricaron la caja que recibe tu taza: el primer toque de magia antes de abrirla.',
    url: 'https://www.senefelder.com',
    logo: SENEFELDER_LOGO,
    bgImg: null,
    bgColor: '#0D1117',
    accent: '#E8B84B',
    country: 'Ecuador',
    cta: 'senefelder.com',
    icon: 'fa-solid fa-box-open',
  },
  {
    id: 'franz',
    eyebrow: 'Diseñó las tazas',
    name: 'Franz Del Castillo',
    tagline: 'El artista detrás de cada trazo.',
    description: 'Uno de los artistas pictóricos más reconocidos del Ecuador. Franz dibujó las gafas y el bigote de Boscan, las pestañas y los labios de La Moni — cada línea en cada taza lleva su firma.',
    url: 'https://www.instagram.com/franzdelcastillo/',
    logo: null,
    bgImg: FRANZ_IMG,
    bgColor: null,
    accent: '#A855F7',
    country: 'Ecuador',
    cta: '@franzdelcastillo',
    icon: 'fa-solid fa-palette',
  },
  {
    id: 'doga',
    eyebrow: 'Fabricó las tazas',
    name: 'Doga Designs',
    tagline: 'Las manos que moldean cada pieza.',
    description: 'Los artesanos que fabrican cada taza a mano: moldean la arcilla, pintan el diseño y hornean una a una. Sin ellos, los dibujos de Franz nunca habrían cobrado vida en cerámica.',
    url: 'https://www.instagram.com/doga.designs/',
    logo: null,
    bgImg: DOGA_IMG,
    bgColor: null,
    accent: '#C8956C',
    country: 'Ecuador',
    cta: '@doga.designs',
    icon: 'fa-solid fa-hands',
  },
];

const bakanoStats = [
  { num: '+40', label: 'Negocios con experiencia' },
  { num: '+20%', label: 'Más facturación para sus clientes' },
  { num: '#1', label: 'Agencia de Consultoría en Ecuador' },
];
</script>

<template>
  <MainLayout>
    <div class="aliados-page">

      <!-- ── Hero ──────────────────────────────────────── -->
      <section class="aliados-hero">
        <img :src="HEADER_IMG" alt="" class="aliados-hero__bg" fetchpriority="high" />
        <div class="aliados-hero__overlay"></div>
        <div class="container aliados-hero__content">
          <span class="aliados-hero__eyebrow">Un producto, muchos talentos</span>
          <h1 class="aliados-hero__title">
            Las manos que hacen <em>posible cada sorbo</em>
          </h1>
          <p class="aliados-hero__subtitle">
            Sorbito de Verdad es el resultado de una red de talentos extraordinarios.
            Conoce a quienes hacen posible que cada taza llegue a tus manos.
          </p>
        </div>
      </section>

      <!-- ── BAKANO FEATURED ────────────────────────────── -->
      <section class="bakano-feature">
        <div class="container bakano-feature__inner">
          <div class="bakano-feature__media">
            <img :src="BAKANO_TEAM_IMG" alt="Equipo Bakano" class="bakano-feature__img" loading="lazy" />
          </div>

          <div class="bakano-feature__content">
            <span class="eyebrow">
              <i class="fa-solid fa-chart-line" aria-hidden="true"></i>
              Estrategia digital
            </span>

            <div class="bakano-feature__logo-wrap">
              <img :src="BAKANO_LOGO" alt="Bakano" class="bakano-feature__logo" />
            </div>

            <p class="bakano-feature__tagline">
              "Nosotros hacemos procesos de marketing y ventas. Conectamos a tus clientes potenciales con tu canal de transacción para que tu negocio crezca."
            </p>

            <p class="bakano-feature__desc">
              La agencia de <strong>consultoría #1 en Ecuador</strong> detrás de Sorbito de Verdad.
              Bakano diseñó toda la presencia online: desde esta tienda hasta la estrategia
              que hizo que llegaras aquí. Si estás leyendo esto, fue gracias a ellos.
              Trabajan con más de 40 negocios en Ecuador combinando consultoría estratégica,
              tecnología y <strong>crecimiento real y medible</strong>.
            </p>

            <dl class="bakano-feature__stats">
              <div v-for="s in bakanoStats" :key="s.num" class="bakano-feature__stat">
                <dt class="bakano-feature__stat-label">{{ s.label }}</dt>
                <dd class="bakano-feature__stat-num">{{ s.num }}</dd>
              </div>
            </dl>

            <div class="bakano-feature__footer">
              <div class="bakano-feature__team">
                <div class="bakano-feature__avatars">
                  <img :src="BAKANO_LUIS"    alt="Luis"    class="bakano-feature__avatar" loading="lazy" />
                  <img :src="BAKANO_DENISSE" alt="Denisse" class="bakano-feature__avatar" loading="lazy" />
                  <img :src="BAKANO_DIEGO"   alt="Diego"   class="bakano-feature__avatar" loading="lazy" />
                  <div class="bakano-feature__avatar bakano-feature__avatar--more" aria-hidden="true">+</div>
                </div>
                <span class="bakano-feature__team-label">El equipo</span>
              </div>

              <a
                href="https://bakano.ec/"
                target="_blank"
                rel="noopener noreferrer"
                class="btn-dark"
              >
                Conocer Bakano
                <i class="fa-solid fa-arrow-up-right-from-square" aria-hidden="true"></i>
              </a>
            </div>
          </div>
        </div>
      </section>

      <!-- ── Other partners ─────────────────────────────── -->
      <section class="other-partners">
        <div class="container">
          <div class="other-partners__header">
            <span class="eyebrow">También parte de la familia</span>
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
              <div class="partner-card__media">
                <img v-if="p.bgImg" :src="p.bgImg" :alt="p.name" class="partner-card__img" loading="lazy" />
                <div v-else class="partner-card__logo-wrap">
                  <img v-if="p.logo" :src="p.logo" :alt="p.name" class="partner-card__logo" loading="lazy" />
                </div>
                <span class="partner-card__role">
                  <i :class="p.icon" aria-hidden="true"></i>
                  {{ p.eyebrow }}
                </span>
              </div>

              <div class="partner-card__content">
                <span class="partner-card__country">{{ p.country }}</span>
                <h3 class="partner-card__name">{{ p.name }}</h3>
                <p class="partner-card__tagline">"{{ p.tagline }}"</p>
                <p class="partner-card__desc">{{ p.description }}</p>
                <span class="partner-card__cta">
                  {{ p.cta }} <i class="fa-solid fa-arrow-up-right-from-square" aria-hidden="true"></i>
                </span>
              </div>
            </a>
          </div>
        </div>
      </section>

      <!-- ── CTA → Tienda ───────────────────────────────── -->
      <section class="aliados-bottom-cta">
        <div class="container">
          <div class="aliados-bottom-cta__inner">
            <h2 class="aliados-bottom-cta__title">¿Lista/o para tu taza?</h2>
            <p class="aliados-bottom-cta__text">Todos estos talentos se unen en cada pieza.</p>
            <RouterLink to="/tienda" class="btn-primary btn-lg">
              Ver colecciones <i class="fa-solid fa-arrow-right" aria-hidden="true"></i>
            </RouterLink>
          </div>
        </div>
      </section>

    </div>
  </MainLayout>
</template>

<style lang="scss" scoped>
.aliados-page {
  background-color: var(--color-bg);
}

// ── Hero ────────────────────────────────────────
.aliados-hero {
  position: relative;
  min-height: min(78vh, 680px);
  display: flex;
  align-items: flex-end;
  overflow: hidden;
  isolation: isolate;

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
    background: linear-gradient(to top, rgba(20, 14, 10, 0.9) 0%, rgba(20, 14, 10, 0.45) 60%, rgba(20, 14, 10, 0.25) 100%);
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
    max-width: 15ch;
    font-size: clamp(2.25rem, 6.5vw, 4.5rem);
    font-weight: 500;
    color: #F7F2EA;

    em {
      font-style: italic;
      color: #F1DCCB;
    }
  }

  &__subtitle {
    max-width: 54ch;
    font-size: 1.0625rem;
    color: rgba(247, 242, 234, 0.82);
  }
}

// ── Bakano feature ──────────────────────────────
.bakano-feature {
  padding: 4.5rem 0;

  @media (min-width: 768px) {
    padding: 7rem 0;
  }

  &__inner {
    display: grid;
    gap: 2.5rem;
    align-items: center;

    @media (min-width: 960px) {
      grid-template-columns: 1fr 1fr;
      gap: 4.5rem;
    }
  }

  &__media {
    border-radius: $radius-xl;
    overflow: hidden;
    box-shadow: var(--shadow-lg);
    background-color: var(--color-bg-subtle);
  }

  &__img {
    width: 100%;
    aspect-ratio: 4 / 3;
    object-fit: cover;

    @media (min-width: 960px) {
      aspect-ratio: 4 / 5;
    }
  }

  &__content {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 1.25rem;
  }

  &__logo-wrap {
    padding: 0.875rem 1.25rem;
    border-radius: $radius-md;
    background-color: #14100D;
  }

  &__logo {
    height: 34px;
    width: auto;
  }

  &__tagline {
    font-family: var(--font-heading);
    font-size: clamp(1.25rem, 2.4vw, 1.5rem);
    font-style: italic;
    line-height: 1.45;
    color: var(--color-primary);
  }

  &__desc {
    strong { color: var(--color-primary); font-weight: 600; }
  }

  &__stats {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 1rem;
    width: 100%;
    padding: 1.25rem 0;
    border-top: 1px solid var(--color-border);
    border-bottom: 1px solid var(--color-border);
  }

  &__stat {
    display: flex;
    flex-direction: column-reverse;
    gap: 0.25rem;
  }

  &__stat-num {
    font-family: var(--font-heading);
    font-size: clamp(1.5rem, 3.5vw, 2rem);
    font-weight: 500;
    line-height: 1;
    color: var(--color-accent);
  }

  &__stat-label {
    font-size: 0.75rem;
    line-height: 1.4;
    color: var(--color-muted);
  }

  &__footer {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 1.25rem;
    width: 100%;
  }

  &__team {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  &__team-label {
    font-size: 0.8125rem;
    font-weight: 600;
    color: var(--color-muted);
  }

  &__avatars {
    display: flex;
  }

  &__avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    object-fit: cover;
    border: 2px solid var(--color-bg);
    background-color: var(--color-bg-subtle);

    & + & { margin-left: -10px; }

    &--more {
      display: grid;
      place-items: center;
      font-weight: 600;
      color: var(--color-accent);
      background-color: var(--color-accent-light);
    }
  }
}

// ── Other partners ──────────────────────────────
.other-partners {
  padding: 4.5rem 0;
  background-color: var(--color-bg-subtle);

  @media (min-width: 768px) {
    padding: 7rem 0;
  }

  &__header {
    display: flex;
    flex-direction: column;
    gap: 0.625rem;
    margin-bottom: 2.5rem;

    @media (min-width: 768px) {
      margin-bottom: 3.5rem;
    }
  }

  &__title {
    font-weight: 500;
  }

  &__grid {
    display: grid;
    gap: 1.25rem;

    @media (min-width: 760px) {
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 1.5rem;
    }
  }
}

.partner-card {
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

  &__media {
    position: relative;
    aspect-ratio: 4 / 3;
    overflow: hidden;
    background-color: #14100D;
  }

  &__img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.6s cubic-bezier(0.22, 1, 0.36, 1);

    .partner-card:hover & { transform: scale(1.04); }
  }

  &__logo-wrap {
    display: grid;
    place-items: center;
    width: 100%;
    height: 100%;
    padding: 2rem;
  }

  &__logo {
    max-width: 70%;
    max-height: 60%;
    object-fit: contain;
    filter: brightness(0) invert(1);
  }

  &__role {
    position: absolute;
    left: 0.875rem;
    top: 0.875rem;
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    padding: 0.4rem 0.8rem;
    border-radius: $radius-full;
    background-color: var(--color-bg-card);
    color: var(--color-primary);
    font-size: 0.75rem;
    font-weight: 600;

    i { color: var(--color-accent); }
  }

  &__content {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    flex: 1;
    padding: 1.375rem 1.375rem 1.5rem;
  }

  &__country {
    font-size: 0.6875rem;
    font-weight: 600;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--color-muted);
  }

  &__name {
    font-size: 1.5rem;
    font-weight: 500;
  }

  &__tagline {
    font-family: var(--font-heading);
    font-style: italic;
    color: var(--color-accent);
  }

  &__desc {
    font-size: 0.9375rem;
    flex: 1;
  }

  &__cta {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    margin-top: 0.5rem;
    font-size: 0.875rem;
    font-weight: 600;
    color: var(--color-primary);

    i { font-size: 0.7rem; color: var(--color-accent); }
  }
}

// ── Bottom CTA ──────────────────────────────────
.aliados-bottom-cta {
  padding: 4.5rem 0 5rem;

  @media (min-width: 768px) {
    padding: 6rem 0 7rem;
  }

  &__inner {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 1rem;
    padding: 3rem 1.5rem;
    border-radius: $radius-xl;
    background-color: var(--color-bg-card);
    border: 1px solid var(--color-border);
  }

  &__title {
    font-weight: 500;
  }

  &__text {
    margin-bottom: 0.5rem;
  }
}
</style>
