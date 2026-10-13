<script setup lang="ts">
import { statusLabels } from './track';

defineProps<{ status: string }>();
</script>

<template>
  <span :class="['track__status-badge', `track__status-badge--${status}`]">
    {{ statusLabels[status] || status }}
  </span>
</template>

<style lang="scss" scoped>
.track {
  // ── Status badge ──────────────────────────
  &__status-badge {
    flex-shrink: 0;
    display: inline-flex;
    align-items: center;
    padding: 0.375rem 0.75rem;
    border-radius: $radius-full;
    font-size: 0.75rem;
    font-weight: 600;
    white-space: nowrap;
    background-color: var(--color-bg-subtle);
    color: var(--color-muted);

    &--review     { background-color: var(--color-warning-light); color: var(--color-warning); }
    &--confirmed  { background-color: var(--color-accent-light);  color: var(--color-accent); }
    &--processing { background-color: var(--color-accent-light);  color: var(--color-accent); }
    &--shipped    { background-color: var(--color-bg-inverse);    color: var(--color-on-inverse); }
    &--delivered  { background-color: var(--color-success-light); color: var(--color-success); }
  }
}
</style>
