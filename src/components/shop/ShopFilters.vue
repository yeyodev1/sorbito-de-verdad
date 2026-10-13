<script setup lang="ts">
import { collections, sorts } from '../../data/shop';

const selectedCollection = defineModel<string>('collection', { required: true });
const searchQuery = defineModel<string>('search', { required: true });
const selectedSort = defineModel<string>('sort', { required: true });

const emit = defineEmits<{ 'search-input': [] }>();
</script>

<template>
  <div class="shop__bar">
    <div class="container shop__bar-inner">
      <div class="shop__chips" role="tablist" aria-label="Colecciones">
        <button
          v-for="col in collections"
          :key="col.value"
          type="button"
          role="tab"
          :aria-selected="selectedCollection === col.value"
          :class="['shop__chip', { 'shop__chip--active': selectedCollection === col.value }]"
          @click="selectedCollection = col.value"
        >
          {{ col.label }}
        </button>
      </div>

      <div class="shop__tools">
        <label class="shop__search">
          <span class="sr-only">Buscar tazas</span>
          <i class="fa-solid fa-magnifying-glass shop__search-icon" aria-hidden="true"></i>
          <input
            v-model="searchQuery"
            type="search"
            placeholder="Buscar taza…"
            class="shop__search-input"
            @input="emit('search-input')"
          />
        </label>
        <label class="shop__sort">
          <span class="sr-only">Ordenar por</span>
          <select v-model="selectedSort" class="shop__sort-select">
            <option v-for="s in sorts" :key="s.value" :value="s.value">{{ s.label }}</option>
          </select>
          <i class="fa-solid fa-chevron-down shop__sort-icon" aria-hidden="true"></i>
        </label>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.shop {
  // ── Filter bar ──────────────────────────────
  &__bar {
    position: sticky;
    top: 60px;
    z-index: 50;
    background-color: var(--navbar-bg-scrolled);
    backdrop-filter: blur(14px);
    -webkit-backdrop-filter: blur(14px);
    border-top: 1px solid var(--color-border);
    border-bottom: 1px solid var(--color-border);

    @media (min-width: 768px) {
      top: 70px;
    }
  }

  &__bar-inner {
    display: flex;
    flex-direction: column;
    gap: 0.625rem;
    padding-top: 0.75rem;
    padding-bottom: 0.75rem;

    @media (min-width: 900px) {
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      gap: 1.5rem;
    }
  }

  &__chips {
    display: flex;
    gap: 0.5rem;
    overflow-x: auto;
    scrollbar-width: none;
    margin: 0 -1rem;
    padding: 0 1rem;
    scroll-snap-type: x proximity;

    &::-webkit-scrollbar { display: none; }

    @media (min-width: 768px) {
      margin: 0;
      padding: 0;
    }
  }

  &__chip {
    flex-shrink: 0;
    scroll-snap-align: start;
    min-height: 44px;
    padding: 0 1.125rem;
    border-radius: $radius-full;
    border: 1.5px solid var(--color-border);
    background-color: var(--color-bg-card);
    color: var(--color-primary);
    font-size: 0.875rem;
    font-weight: 500;
    white-space: nowrap;
    transition: background-color 0.2s ease, border-color 0.2s ease, color 0.2s ease;

    &:hover {
      border-color: var(--color-border-strong);
    }

    &--active,
    &--active:hover {
      background-color: var(--color-bg-inverse);
      border-color: var(--color-bg-inverse);
      color: var(--color-on-inverse);
    }
  }

  &__tools {
    display: flex;
    gap: 0.5rem;
    min-width: 0;

    @media (min-width: 900px) {
      flex-shrink: 0;
    }
  }

  &__search {
    position: relative;
    flex: 1;
    min-width: 0;

    @media (min-width: 900px) {
      width: 240px;
      flex: none;
    }
  }

  &__search-icon {
    position: absolute;
    left: 0.95rem;
    top: 50%;
    transform: translateY(-50%);
    font-size: 0.8125rem;
    color: var(--color-muted);
    pointer-events: none;
  }

  &__search-input,
  &__sort-select {
    width: 100%;
    min-height: 44px;
    border-radius: $radius-full;
    border: 1.5px solid var(--color-border);
    background-color: var(--color-bg-card);
    color: var(--color-primary);
    font-size: 1rem;
    outline: none;
    transition: border-color 0.2s ease, box-shadow 0.2s ease;

    &:focus {
      border-color: var(--color-accent);
      box-shadow: var(--focus-ring);
    }

    @media (min-width: 900px) {
      font-size: 0.875rem;
    }
  }

  &__search-input {
    padding: 0 1rem 0 2.4rem;

    &::placeholder { color: var(--color-muted); opacity: 0.8; }
  }

  &__sort {
    position: relative;
    flex-shrink: 0;
    width: 44%;
    max-width: 180px;

    @media (min-width: 900px) {
      width: 180px;
    }
  }

  &__sort-select {
    appearance: none;
    -webkit-appearance: none;
    padding: 0 2.25rem 0 1rem;
    cursor: pointer;

    option { background-color: var(--color-bg-card); color: var(--color-primary); }
  }

  &__sort-icon {
    position: absolute;
    right: 0.95rem;
    top: 50%;
    transform: translateY(-50%);
    font-size: 0.6875rem;
    color: var(--color-muted);
    pointer-events: none;
  }
}
</style>
