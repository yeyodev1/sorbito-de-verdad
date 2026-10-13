<script setup lang="ts">
import type { otherPartners } from '../../data/aliados';

defineProps<{ partner: (typeof otherPartners)[number] }>();
</script>

<template>
  <a
    :href="partner.url"
    target="_blank"
    rel="noopener noreferrer"
    class="partner-card"
  >
    <div class="partner-card__media">
      <img v-if="partner.bgImg" :src="partner.bgImg" :alt="partner.name" class="partner-card__img" loading="lazy" />
      <div v-else class="partner-card__logo-wrap">
        <img v-if="partner.logo" :src="partner.logo" :alt="partner.name" class="partner-card__logo" loading="lazy" />
      </div>
      <span class="partner-card__role">
        <i :class="partner.icon" aria-hidden="true"></i>
        {{ partner.eyebrow }}
      </span>
    </div>

    <div class="partner-card__content">
      <span class="partner-card__country">{{ partner.country }}</span>
      <h3 class="partner-card__name">{{ partner.name }}</h3>
      <p class="partner-card__tagline">"{{ partner.tagline }}"</p>
      <p class="partner-card__desc">{{ partner.description }}</p>
      <span class="partner-card__cta">
        {{ partner.cta }} <i class="fa-solid fa-arrow-up-right-from-square" aria-hidden="true"></i>
      </span>
    </div>
  </a>
</template>

<style lang="scss" scoped>
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
</style>
