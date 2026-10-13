<script setup lang="ts">
import TrackStatusBadge from './TrackStatusBadge.vue';
import { formatDate, type TrackResult } from './track';

defineProps<{ orders: TrackResult[] }>();

const emit = defineEmits<{ select: [order: TrackResult] }>();
</script>

<template>
  <div class="track__order-list">
    <h2 class="track__order-list-title">Selecciona tu pedido</h2>
    <button
      v-for="o in orders"
      :key="o.orderNumber"
      type="button"
      class="track__order-pick"
      @click="emit('select', o)"
    >
      <div class="track__order-pick-left">
        <span class="track__order-pick-num">{{ o.orderNumber }}</span>
        <span class="track__order-pick-date">{{ formatDate(o.createdAt) }}</span>
      </div>
      <TrackStatusBadge :status="o.status" />
    </button>
  </div>
</template>

<style lang="scss" scoped>
.track {
  // ── Email multi-result ────────────────────
  &__order-list {
    display: flex;
    flex-direction: column;
    gap: 0.625rem;
    margin-top: 2rem;
  }

  &__order-list-title {
    font-size: 1.25rem;
    font-weight: 500;
    margin-bottom: 0.25rem;
  }

  &__order-pick {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    min-height: 64px;
    padding: 0.875rem 1.125rem;
    border-radius: $radius-lg;
    background-color: var(--color-bg-card);
    border: 1px solid var(--color-border);
    text-align: left;
    transition: border-color 0.2s ease, box-shadow 0.2s ease;

    &:hover {
      border-color: var(--color-border-strong);
      box-shadow: var(--shadow-md);
    }
  }

  &__order-pick-left {
    display: flex;
    flex-direction: column;
    gap: 0.125rem;
    min-width: 0;
  }

  &__order-pick-num {
    font-weight: 600;
    font-size: 0.9375rem;
    color: var(--color-primary);
    overflow-wrap: anywhere;
  }

  &__order-pick-date {
    font-size: 0.8125rem;
    color: var(--color-muted);
  }
}
</style>
