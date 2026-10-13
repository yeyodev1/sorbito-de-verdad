<script setup lang="ts">
import { RouterLink } from 'vue-router';
import MainLayout from '../layout/MainLayout.vue';
import ContactSection from '../components/checkout/ContactSection.vue';
import ShippingSection from '../components/checkout/ShippingSection.vue';
import PaySection from '../components/checkout/PaySection.vue';
import OrderSummary from '../components/checkout/OrderSummary.vue';
import { provideCheckout } from '../composables/checkout/useCheckout';
import { formatPrice } from '../composables/checkout/constants';

const {
  loading, redirecting, errorMessage, items, totalItems, total, summaryOpen, handleSubmit,
} = provideCheckout();
</script>

<template>
  <MainLayout>
    <div class="co">
      <!-- Redirigiendo a PayPhone -->
      <div v-if="redirecting" class="co__redirect">
        <i class="fa-solid fa-circle-notch fa-spin"></i>
        <h1>Abriendo el pago seguro…</h1>
        <p>Te estamos llevando a PayPhone para que ingreses tu tarjeta.</p>
      </div>

      <!-- Carrito vacío -->
      <div v-else-if="items.length === 0" class="container co__empty">
        <div class="co__empty-icon"><i class="fa-solid fa-mug-hot"></i></div>
        <h1>Tu carrito está vacío</h1>
        <p>Elige tu taza favorita y vuelve aquí para pagar en un minuto.</p>
        <RouterLink to="/tienda" class="btn-primary btn-lg">Ir a la tienda</RouterLink>
      </div>

      <div v-else class="container co__container">
        <!-- Resumen móvil (colapsable) -->
        <button type="button" class="co__mobile-summary" :aria-expanded="summaryOpen" @click="summaryOpen = !summaryOpen">
          <span>
            <i class="fa-solid fa-bag-shopping"></i>
            {{ summaryOpen ? 'Ocultar' : 'Ver' }} resumen ({{ totalItems }})
            <i :class="['fa-solid fa-chevron-down co__chev', { 'co__chev--open': summaryOpen }]"></i>
          </span>
          <strong>{{ formatPrice(total) }}</strong>
        </button>

        <div class="co__layout">
          <form class="co__form" @submit.prevent="handleSubmit" novalidate>
            <header class="co__header">
              <span class="eyebrow">Pago seguro</span>
              <h1 class="co__title">Finalizar compra</h1>
              <p class="co__subtitle">Solo tus datos de envío y listo. El pago con tarjeta se hace en PayPhone.</p>
            </header>

            <div v-if="errorMessage" class="co__error" role="alert">
              <i class="fa-solid fa-circle-exclamation"></i>
              {{ errorMessage }}
            </div>

            <ContactSection />

            <ShippingSection />

            <PaySection />

            <div class="co__submit-bar">
              <button type="submit" class="btn-primary btn-lg btn-block co__submit" :disabled="loading">
                <template v-if="loading">
                  <i class="fa-solid fa-circle-notch fa-spin"></i> Procesando…
                </template>
                <template v-else>
                  <i class="fa-solid fa-lock"></i> Pagar {{ formatPrice(total) }}
                </template>
              </button>
              <p class="co__secure"><i class="fa-solid fa-shield-halved"></i> Pago cifrado y protegido por PayPhone</p>
            </div>
          </form>

          <OrderSummary />
        </div>
      </div>
    </div>
  </MainLayout>
</template>

<style lang="scss" scoped src="./CheckoutView.scss"></style>
