<script setup lang="ts">
import { whatsappUrl } from '../../../composables/account/orderFormat';
import OrderCard from './OrderCard.vue';

defineProps<{ orderNumber: string }>();
</script>

<template>
  <OrderCard help>
    <p class="od-card__help-title">¿Tienes preguntas sobre tu pedido?</p>
    <p class="od-card__help-text">Escríbenos y te respondemos lo antes posible.</p>
    <a
      :href="whatsappUrl(orderNumber)"
      target="_blank"
      rel="noopener"
      class="btn-dark btn-block"
    >
      <i class="fa-brands fa-whatsapp"></i>
      Contactar por WhatsApp
    </a>
  </OrderCard>
</template>

<style lang="scss" scoped>
.od-card {
  &__help-title {
    font-family: var(--font-heading);
    font-size: 1.0625rem;
    font-weight: 600;
    color: var(--color-primary);
  }

  &__help-text {
    margin-bottom: 0.5rem;
    font-size: 0.875rem;
  }
}
</style>
