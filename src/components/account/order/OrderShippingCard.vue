<script setup lang="ts">
import type { Order } from '../../../types';
import { googleMapsUrl } from '../../../composables/account/orderFormat';
import OrderCard from './OrderCard.vue';

defineProps<{ address: Order['shippingAddress'] }>();
</script>

<template>
  <OrderCard title="Dirección de envío">
    <address class="od-address">
      <p class="od-address__name">{{ address.name }}</p>
      <p>{{ address.street }}</p>
      <p>{{ address.city }}<span v-if="address.state">, {{ address.state }}</span></p>
      <p>{{ address.country }}<span v-if="address.zip"> {{ address.zip }}</span></p>
      <p v-if="address.phone" class="od-address__phone">
        <i class="fa-solid fa-phone"></i>
        {{ address.phone }}
      </p>
    </address>
    <p class="od-address-lock">
      <i class="fa-solid fa-lock"></i>
      <span>La dirección no puede modificarse una vez realizado el pedido.</span>
    </p>
    <a
      :href="googleMapsUrl(address)"
      target="_blank"
      rel="noopener"
      class="btn-outline btn-sm btn-block"
    >
      <i class="fa-solid fa-map-location-dot"></i>
      Ver en Google Maps
    </a>
  </OrderCard>
</template>

<style lang="scss" scoped>
.od-address {
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
  font-style: normal;

  p {
    font-size: 0.9375rem;
    line-height: 1.55;
  }

  &__name {
    font-weight: 600;
    color: var(--color-primary);
  }

  &__phone {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    margin-top: 0.375rem;

    i {
      font-size: 0.75rem;
      color: var(--color-accent);
    }
  }
}

.od-address-lock {
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  margin: 1rem 0;
  padding: 0.625rem 0.875rem;
  font-size: 0.8125rem;
  line-height: 1.45;
  color: var(--color-muted);
  background-color: var(--color-bg-subtle);
  border-radius: $radius-md;

  i {
    margin-top: 3px;
    font-size: 0.6875rem;
    color: var(--color-accent);
  }
}
</style>
