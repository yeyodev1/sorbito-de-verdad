<script setup lang="ts">
import { computed } from 'vue';
import { RouterLink } from 'vue-router';
import { useProductsStore } from '../../stores/products';

const productsStore = useProductsStore();

const TILES = [
  { value: 'boscan', label: 'Boscan', text: 'La original, de autor', tone: 'peach' },
  { value: 'moni', label: 'La Moni', text: 'Dulce y con carácter', tone: 'butter' },
  { value: 'rustica', label: 'Rústica', text: 'Barro y textura', tone: 'sage' },
  { value: 'set', label: 'Sets', text: 'Para regalar', tone: 'sky' },
];

// Usa la foto de un producto destacado de cada colección, si existe
const tiles = computed(() =>
  TILES.map(t => ({
    ...t,
    image: productsStore.featured.find(p => p.collection === t.value)?.mainImage,
  }))
);
</script>

<template>
  <section class="tiles" aria-labelledby="tiles-title">
    <div class="container">
      <div class="tiles__head">
        <h2 id="tiles-title" class="tiles__title">Compra por <em>colección</em></h2>
        <RouterLink to="/tienda" class="tiles__all">Ver todo <i class="fa-solid fa-arrow-right"></i></RouterLink>
      </div>

      <div class="tiles__grid">
        <RouterLink
          v-for="t in tiles"
          :key="t.value"
          :to="`/tienda?collection=${t.value}`"
          :class="['tile', `tile--${t.tone}`]"
        >
          <span class="tile__text">
            <strong class="tile__name">{{ t.label }}</strong>
            <small class="tile__desc">{{ t.text }}</small>
          </span>
          <span class="tile__media">
            <img v-if="t.image" :src="t.image" :alt="`Colección ${t.label}`" loading="lazy" decoding="async" />
            <i v-else class="fa-solid fa-mug-hot" aria-hidden="true"></i>
          </span>
          <span class="tile__go" aria-hidden="true"><i class="fa-solid fa-arrow-right"></i></span>
        </RouterLink>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.tiles {
  padding: 2rem 0 1rem;

  @media (min-width: 768px) {
    padding: 3.5rem 0 1.5rem;
  }

  &__head {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    gap: 1rem;
    margin-bottom: 1.25rem;
  }

  &__title {
    font-size: clamp(1.75rem, 4vw, 2.75rem);
  }

  &__all {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    min-height: 44px;
    font-size: 0.875rem;
    font-weight: 600;
    white-space: nowrap;

    i { font-size: 0.75rem; transition: transform 0.2s ease; }
    &:hover i { transform: translateX(3px); }
  }

  &__grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 0.75rem;

    @media (min-width: 900px) {
      grid-template-columns: repeat(4, minmax(0, 1fr));
      gap: 1rem;
    }
  }
}

.tile {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 0.75rem;
  min-height: 210px;
  padding: 1rem;
  overflow: hidden;
  color: var(--tile-ink);
  border-radius: $radius-xl;
  transition: transform 0.35s cubic-bezier(0.22, 1, 0.36, 1);

  @media (min-width: 900px) {
    min-height: 300px;
    padding: 1.375rem;
  }

  &--peach { background-color: var(--tile-peach); }
  &--butter { background-color: var(--tile-butter); }
  &--sage { background-color: var(--tile-sage); }
  &--sky { background-color: var(--tile-sky); }

  @media (hover: hover) {
    &:hover { transform: translateY(-4px); }
    &:hover .tile__media img { transform: rotate(-4deg) scale(1.06); }
    &:hover .tile__go { transform: rotate(0deg); }
  }

  &__text {
    position: relative;
    z-index: 1;
    display: flex;
    flex-direction: column;
    gap: 0.15rem;
  }

  &__name {
    font-family: var(--font-heading);
    font-size: clamp(1.25rem, 2.4vw, 1.75rem);
    font-weight: 700;
    letter-spacing: -0.035em;
    line-height: 1.05;
  }

  &__desc {
    font-size: 0.8rem;
    opacity: 0.72;
  }

  &__media {
    align-self: flex-end;
    display: grid;
    place-items: center;
    width: 62%;
    aspect-ratio: 1;
    margin: -0.5rem -0.25rem -0.25rem 0;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: 50%;
      box-shadow: var(--shadow-lg);
      transition: transform 0.5s cubic-bezier(0.22, 1, 0.36, 1);
    }

    i { font-size: 2.5rem; opacity: 0.35; }
  }

  &__go {
    position: absolute;
    left: 1rem;
    bottom: 1rem;
    display: grid;
    place-items: center;
    width: 36px;
    height: 36px;
    font-size: 0.8rem;
    color: var(--color-on-inverse);
    background-color: var(--color-bg-inverse);
    border-radius: 50%;
    transform: rotate(-45deg);
    transition: transform 0.3s ease;

    @media (min-width: 900px) {
      left: 1.375rem;
      bottom: 1.375rem;
      width: 42px;
      height: 42px;
    }
  }
}
</style>
