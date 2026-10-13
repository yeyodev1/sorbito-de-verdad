<script setup lang="ts">
import type { Order } from '../../../composables/admin/orders/types';
import { formatDate } from '../../../composables/admin/orders/formatters';

defineProps<{ order: Order }>();
</script>

<template>
  <div
    v-if="order.transferVerification"
    class="om__details-section om__details-section--full"
  >
    <h4 class="om__details-title">
      <i class="fa-solid fa-file-invoice"></i>
      Verificación de transferencia
      <span
        :class="['status-badge', order.transferVerification.status === 'match' ? 'status-badge--success' : 'status-badge--error']"
        style="margin-left: 0.5rem;"
      >
        {{ order.transferVerification.status === 'match' ? 'Coincide' : 'No coincide' }}
      </span>
    </h4>
    <p class="om__tv-summary">{{ order.transferVerification.summary }}</p>
    <div class="om__tv-details">
      <span class="om__address-key">Monto detectado:</span>
      <strong>${{ order.transferVerification.detectedAmount?.toFixed(2) }}</strong>
    </div>
    <div class="om__tv-details">
      <span class="om__address-key">Cuenta destino:</span>
      <strong>{{ order.transferVerification.detectedDestination }}</strong>
    </div>
    <div class="om__tv-details">
      <span class="om__address-key">Analizado:</span>
      {{ formatDate(order.transferVerification.analyzedAt) }}
    </div>
  </div>
</template>

<style lang="scss" scoped src="./OrderTransferVerification.scss"></style>
