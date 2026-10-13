<script setup lang="ts">
import {
  BAKANO_LOGO,
  BAKANO_TEAM_IMG,
  BAKANO_LUIS,
  BAKANO_DENISSE,
  BAKANO_DIEGO,
  bakanoStats,
} from '../../data/aliados';
</script>

<template>
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
</template>

<style lang="scss" scoped>
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
</style>
