<script setup lang="ts">
import type { Order } from '../../../composables/admin/orders/types';
import { formatDate } from '../../../composables/admin/orders/formatters';

defineProps<{ order: Order }>();
</script>

<template>
  <div
    v-if="order.source === 'whatsapp_bot' || order.payphoneLinkUrl || order.payphoneTransactionId || order.clientTransactionId"
    class="om__details-section om__details-section--full"
  >
    <h4 class="om__details-title">
      <i class="fa-brands fa-whatsapp"></i>
      Pago Payphone / Canal
    </h4>
    <div class="om__address">
      <p v-if="order.source"><span class="om__address-key">Canal:</span> {{ order.source === 'whatsapp_bot' ? 'WhatsApp Bot' : order.source }}</p>
      <p v-if="order.whatsappPhone"><span class="om__address-key">WhatsApp:</span> {{ order.whatsappPhone }}</p>
      <p v-if="order.clientTransactionId"><span class="om__address-key">Client TX ID:</span> {{ order.clientTransactionId }}</p>
      <p v-if="order.payphoneTransactionId"><span class="om__address-key">Payphone TX ID:</span> {{ order.payphoneTransactionId }}</p>
      <p v-if="order.payphoneLinkUrl">
        <span class="om__address-key">Link de pago:</span>
        <a :href="order.payphoneLinkUrl" target="_blank" rel="noopener">{{ order.payphoneLinkUrl }}</a>
        <span v-if="order.payphoneLinkExpiresAt" style="margin-left: 0.5rem; opacity: 0.7;">
          (expira {{ formatDate(order.payphoneLinkExpiresAt) }})
        </span>
      </p>
      <p v-if="order.remindersSent && (order.remindersSent.r15min || order.remindersSent.r1h || order.remindersSent.r24h)">
        <span class="om__address-key">Recordatorios:</span>
        <span v-if="order.remindersSent.r15min">15 min ✓ </span>
        <span v-if="order.remindersSent.r1h">1 h ✓ </span>
        <span v-if="order.remindersSent.r24h">24 h ✓</span>
      </p>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use "./styles/details-section";
</style>
