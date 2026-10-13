<script setup lang="ts">
import { useCheckoutContext } from '../../composables/checkout/useCheckout';
import { formatPrice } from '../../composables/checkout/constants';

const { zones, zonesLoading, selectedZoneId, err } = useCheckoutContext();
</script>

<template>
  <div class="co__zones" role="radiogroup" aria-label="Zona de envío">
    <p class="field__label">Método de envío</p>
    <div v-if="zonesLoading" class="co__zone co__zone--loading">
      <i class="fa-solid fa-circle-notch fa-spin"></i> Calculando envío…
    </div>
    <label
      v-for="zone in zones"
      :key="zone._id"
      :class="['co__zone', { 'co__zone--active': selectedZoneId === zone._id }]"
    >
      <input type="radio" v-model="selectedZoneId" :value="zone._id" class="sr-only" />
      <span class="co__radio" aria-hidden="true"></span>
      <span class="co__zone-info">
        <span class="co__zone-name">{{ zone.name }}</span>
        <span class="co__zone-eta">{{ zone.estimatedDays }}</span>
      </span>
      <span :class="['co__zone-price', { 'co__zone-price--free': zone.price === 0 }]">
        {{ zone.price === 0 ? 'Gratis' : formatPrice(zone.price) }}
      </span>
    </label>
    <p v-if="err('zone')" class="co__msg">{{ err('zone') }}</p>
  </div>
</template>

<style lang="scss" scoped>
.co {
  &__zones {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  &__zone {
    display: flex;
    align-items: center;
    gap: 0.875rem;
    min-height: 60px;
    padding: 0.75rem 1rem;
    border: 1.5px solid var(--color-border);
    border-radius: $radius-md;
    cursor: pointer;
    transition: border-color 0.2s ease, background-color 0.2s ease;

    &:hover { border-color: var(--color-border-strong); }

    &--active {
      border-color: var(--color-accent);
      background-color: color-mix(in srgb, var(--color-accent) 6%, transparent);
    }

    &--loading {
      justify-content: center;
      color: var(--color-muted);
      font-size: 0.875rem;
      cursor: default;
    }

    &:has(input:focus-visible) {
      box-shadow: var(--focus-ring);
    }
  }

  &__radio {
    flex-shrink: 0;
    width: 20px;
    height: 20px;
    border: 2px solid var(--color-border-strong);
    border-radius: 50%;
    transition: all 0.2s ease;

    .co__zone--active & {
      border-color: var(--color-accent);
      box-shadow: inset 0 0 0 4px var(--color-bg-card);
      background-color: var(--color-accent);
    }
  }

  &__zone-info {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
  }

  &__zone-name {
    font-size: 0.9375rem;
    font-weight: 600;
  }

  &__zone-eta {
    font-size: 0.75rem;
    color: var(--color-muted);
  }

  &__zone-price {
    font-weight: 700;
    font-variant-numeric: tabular-nums;

    &--free { color: var(--color-success); }
  }

  &__msg {
    font-size: 0.75rem;
    font-weight: 500;
    color: var(--color-error);
  }
}
</style>
