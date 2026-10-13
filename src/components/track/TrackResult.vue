<script setup lang="ts">
import TrackStatusBadge from './TrackStatusBadge.vue';
import TrackProgress from './TrackProgress.vue';
import { formatDate, type TrackResult } from './track';

defineProps<{
  order: TrackResult;
  showBack: boolean;
}>();

const emit = defineEmits<{ back: [] }>();
</script>

<template>
  <div class="track__result">

    <!-- Back button when email search showed multiple -->
    <button v-if="showBack" type="button" class="track__back" @click="emit('back')">
      <i class="fa-solid fa-arrow-left" aria-hidden="true"></i> Ver todos mis pedidos
    </button>

    <!-- Order header -->
    <div class="track__result-header">
      <div class="track__result-id">
        <span class="track__result-label">Pedido</span>
        <h2 class="track__result-num">{{ order.orderNumber }}</h2>
        <p class="track__result-date">{{ formatDate(order.createdAt) }}</p>
      </div>
      <TrackStatusBadge :status="order.status" />
    </div>

    <!-- Progress tracker -->
    <TrackProgress :status="order.status" />

    <!-- Details grid -->
    <div class="track__details">
      <div class="track__card">
        <h3 class="track__card-title">
          <i class="fa-solid fa-mug-hot" aria-hidden="true"></i>
          Productos
        </h3>
        <ul class="track__items">
          <li v-for="(item, i) in order.items" :key="i" class="track__item">
            <span class="track__item-name">{{ item.name }}</span>
            <span class="track__item-qty">× {{ item.quantity }}</span>
          </li>
        </ul>
      </div>

      <div class="track__card">
        <h3 class="track__card-title">
          <i class="fa-solid fa-location-dot" aria-hidden="true"></i>
          Destino
        </h3>
        <p class="track__destination">
          {{ order.shippingAddress.city }}, {{ order.shippingAddress.country }}
        </p>

        <div v-if="order.notes" class="track__note">
          <i class="fa-solid fa-comment-dots" aria-hidden="true"></i>
          <p>{{ order.notes }}</p>
        </div>
      </div>
    </div>

  </div>
</template>

<style lang="scss" scoped>
.track {
  // ── Result ────────────────────────────────
  &__result {
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
    margin-top: 2rem;
  }

  &__back {
    align-self: flex-start;
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    min-height: 44px;
    font-size: 0.875rem;
    font-weight: 600;
    color: var(--color-muted);

    &:hover { color: var(--color-primary); }
  }

  &__result-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 1rem;
    padding: 1.5rem 1.25rem;
    border-radius: $radius-xl;
    background-color: var(--color-bg-card);
    border: 1px solid var(--color-border);

    @media (min-width: 640px) {
      padding: 1.75rem;
    }
  }

  &__result-id {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    min-width: 0;
  }

  &__result-label {
    font-size: 0.6875rem;
    font-weight: 600;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--color-muted);
  }

  &__result-num {
    font-size: clamp(1.125rem, 3.5vw, 1.5rem);
    font-weight: 500;
    overflow-wrap: anywhere;
  }

  &__result-date {
    font-size: 0.875rem;
  }

  &__details {
    display: grid;
    gap: 1rem;

    @media (min-width: 640px) {
      grid-template-columns: 1fr 1fr;
    }
  }

  &__card {
    display: flex;
    flex-direction: column;
    gap: 0.875rem;
    padding: 1.375rem 1.25rem;
    border-radius: $radius-lg;
    background-color: var(--color-bg-card);
    border: 1px solid var(--color-border);
  }

  &__card-title {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-family: var(--font-body);
    font-size: 0.75rem;
    font-weight: 600;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--color-muted);

    i { color: var(--color-accent); }
  }

  &__items {
    display: flex;
    flex-direction: column;
  }

  &__item {
    display: flex;
    justify-content: space-between;
    gap: 1rem;
    padding: 0.625rem 0;
    border-bottom: 1px solid var(--color-border);
    font-size: 0.9375rem;

    &:last-child { border-bottom: none; padding-bottom: 0; }
    &:first-child { padding-top: 0; }
  }

  &__item-name {
    color: var(--color-primary);
    font-weight: 500;
  }

  &__item-qty {
    flex-shrink: 0;
    color: var(--color-muted);
  }

  &__destination {
    font-family: var(--font-heading);
    font-size: 1.25rem;
    color: var(--color-primary);
  }

  &__note {
    display: flex;
    gap: 0.625rem;
    padding: 0.875rem 1rem;
    border-radius: $radius-md;
    background-color: var(--color-accent-light);

    i { color: var(--color-accent); margin-top: 0.25rem; }

    p {
      font-size: 0.875rem;
      color: var(--color-primary);
    }
  }
}
</style>
