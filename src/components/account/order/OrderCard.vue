<script setup lang="ts">
defineProps<{ title?: string; help?: boolean }>();
</script>

<template>
  <div :class="['od-card', { 'od-card--help': help }]">
    <h2 v-if="title" class="od-card__title">{{ title }}</h2>
    <slot />
  </div>
</template>

<style lang="scss" scoped>
.od-card {
  padding: 1.25rem;
  background-color: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: $radius-lg;

  @media (min-width: 640px) {
    padding: 1.75rem;
  }

  &__title {
    margin-bottom: 1.25rem;
    font-size: 1.25rem;
  }

  &--help {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    background-color: var(--color-bg-subtle);
  }
}
</style>
