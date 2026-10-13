<script setup lang="ts">
defineProps<{
  page: number;
  pages: number;
}>();

const emit = defineEmits<{ go: [page: number] }>();
</script>

<template>
  <nav class="shop__pagination" aria-label="Paginación">
    <button
      type="button"
      class="shop__page"
      :disabled="page <= 1"
      aria-label="Página anterior"
      @click="emit('go', page - 1)"
    ><i class="fa-solid fa-chevron-left" aria-hidden="true"></i></button>
    <button
      v-for="p in pages"
      :key="p"
      type="button"
      :class="['shop__page', { 'shop__page--active': p === page }]"
      :aria-current="p === page ? 'page' : undefined"
      @click="emit('go', p)"
    >{{ p }}</button>
    <button
      type="button"
      class="shop__page"
      :disabled="page >= pages"
      aria-label="Página siguiente"
      @click="emit('go', page + 1)"
    ><i class="fa-solid fa-chevron-right" aria-hidden="true"></i></button>
  </nav>
</template>

<style lang="scss" scoped>
.shop {
  // ── Pagination ──────────────────────────────
  &__pagination {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    gap: 0.375rem;
    margin-top: 3rem;
  }

  &__page {
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 44px;
    height: 44px;
    padding: 0 0.75rem;
    border-radius: $radius-full;
    border: 1.5px solid var(--color-border);
    background-color: var(--color-bg-card);
    color: var(--color-primary);
    font-size: 0.875rem;
    font-weight: 500;
    transition: border-color 0.2s ease, background-color 0.2s ease, color 0.2s ease;

    &:hover:not(:disabled) {
      border-color: var(--color-border-strong);
    }

    &--active,
    &--active:hover:not(:disabled) {
      background-color: var(--color-bg-inverse);
      border-color: var(--color-bg-inverse);
      color: var(--color-on-inverse);
    }

    &:disabled {
      opacity: 0.4;
      cursor: not-allowed;
    }
  }
}
</style>
