<script setup lang="ts">
import OrderPayphoneInfo from './OrderPayphoneInfo.vue';
import OrderTransferVerification from './OrderTransferVerification.vue';
import OrderPaymentSection from './OrderPaymentSection.vue';
import OrderNotesSection from './OrderNotesSection.vue';
import type { Order } from '../../../composables/admin/orders/types';
import { formatCurrency } from '../../../composables/admin/orders/formatters';

defineProps<{ order: Order }>();
</script>

<template>
  <div class="om__details">
    <div class="om__details-section">
      <h4 class="om__details-title">Productos</h4>
      <table class="om__items-table">
        <thead>
          <tr>
            <th>Producto</th>
            <th>Cant.</th>
            <th>Precio</th>
            <th>Subtotal</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, idx) in (order.items || [])" :key="idx">
            <td>{{ item.name || '—' }}</td>
            <td>{{ item.quantity || 1 }}</td>
            <td>{{ formatCurrency(item.price) }}</td>
            <td>{{ formatCurrency((item.price || 0) * (item.quantity || 1)) }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-if="order.shippingAddress" class="om__details-section">
      <h4 class="om__details-title">Dirección de Envío</h4>
      <div class="om__address">
        <p v-if="order.shippingAddress.name"><span class="om__address-key">Nombre:</span> {{ order.shippingAddress.name }}</p>
        <p v-if="order.identificationNumber"><span class="om__address-key">Cédula / ID:</span> {{ order.identificationNumber }}</p>
        <p v-if="order.shippingAddress.phone"><span class="om__address-key">Teléfono:</span> {{ order.shippingAddress.phone }}</p>
        <p v-if="order.shippingAddress.street"><span class="om__address-key">Dirección:</span> {{ order.shippingAddress.street }}</p>
        <p v-if="order.shippingAddress.city"><span class="om__address-key">Ciudad:</span> {{ order.shippingAddress.city }}<span v-if="order.shippingAddress.state">, {{ order.shippingAddress.state }}</span></p>
        <p v-if="order.shippingAddress.country"><span class="om__address-key">País:</span> {{ order.shippingAddress.country }}<span v-if="order.shippingAddress.zip"> {{ order.shippingAddress.zip }}</span></p>
      </div>
      <a
        :href="order.shippingAddress.mapsUrl || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent([order.shippingAddress.street, order.shippingAddress.city, order.shippingAddress.country].filter(Boolean).join(', '))}`"
        target="_blank"
        rel="noopener"
        class="om__maps-btn"
      >
        <i class="fa-brands fa-google"></i>
        Ver en Google Maps
      </a>
    </div>

    <!-- Payphone / Channel info (when applicable) -->
    <OrderPayphoneInfo :order="order" />

    <!-- Transfer Verification (receipt analysis) -->
    <OrderTransferVerification :order="order" />

    <!-- Payment status + Receipt -->
    <OrderPaymentSection :order="order" />

    <!-- Notes section -->
    <OrderNotesSection :order="order" />
  </div>
</template>

<style lang="scss" scoped src="./OrderDetails.scss"></style>
