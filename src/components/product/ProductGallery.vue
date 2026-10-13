<script setup lang="ts">
import type { Product } from '../../types';

defineProps<{
  product: Product;
  gallery: string[];
  discount: number | null;
}>();

const activeImage = defineModel<string>('activeImage', { required: true });
</script>

<template>
  <div class="pd-gallery">
    <div class="pd-gallery__main">
      <img :src="activeImage || product.mainImage" :alt="product.name" />
      <span v-if="discount" class="pd-gallery__discount">-{{ discount }}%</span>
    </div>
    <div v-if="gallery.length > 1" class="pd-gallery__thumbs">
      <button
        v-for="(img, idx) in gallery"
        :key="img"
        type="button"
        :class="['pd-gallery__thumb', { 'pd-gallery__thumb--active': activeImage === img }]"
        :aria-label="`Ver imagen ${idx + 1}`"
        @click="activeImage = img"
      >
        <img :src="img" :alt="`${product.name} imagen ${idx + 1}`" loading="lazy" />
      </button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.pd-gallery {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;

  @media (min-width: 960px) {
    position: sticky;
    top: 96px;
  }

  &__main {
    position: relative;
    aspect-ratio: 1;
    overflow: hidden;
    background-color: var(--color-bg-subtle);
    border-radius: $radius-xl;
    margin: 0 -1rem;

    @media (min-width: 640px) {
      margin: 0;
    }

    @media (max-width: 639px) {
      border-radius: 0;
    }

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  &__discount {
    position: absolute;
    top: 1rem;
    left: 1rem;
    padding: 0.375rem 0.75rem;
    font-size: 0.8125rem;
    font-weight: 700;
    color: var(--color-on-accent);
    background-color: var(--color-accent);
    border-radius: $radius-full;
  }

  &__thumbs {
    display: flex;
    gap: 0.5rem;
    overflow-x: auto;
    scrollbar-width: none;

    &::-webkit-scrollbar { display: none; }
  }

  &__thumb {
    flex-shrink: 0;
    width: 72px;
    height: 72px;
    overflow: hidden;
    border: 2px solid transparent;
    border-radius: $radius-md;
    opacity: 0.65;
    transition: opacity 0.2s ease, border-color 0.2s ease;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    &:hover { opacity: 1; }

    &--active {
      opacity: 1;
      border-color: var(--color-accent);
    }
  }
}
</style>
