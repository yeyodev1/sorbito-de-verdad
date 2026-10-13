<script setup lang="ts">
import type { Order } from '../../../composables/admin/orders/types';
import { useOrdersContext } from '../../../composables/admin/orders/context';

defineProps<{ order: Order }>();

const { updatingPayment, uploadingReceipt, confirmMarkPaid, confirmMarkPending, confirmRemoveReceipt, handleReceiptFile } = useOrdersContext();
</script>

<template>
  <div class="om__details-section om__details-section--full">
    <h4 class="om__details-title">
      <i class="fa-solid fa-credit-card"></i>
      Estado de pago
    </h4>
    <div class="om__pay-row">
      <span :class="['status-badge', order.paymentStatus === 'paid' ? 'status-badge--success' : 'status-badge--warning']">
        {{ order.paymentStatus === 'paid' ? 'Pagado' : order.paymentStatus === 'failed' ? 'Fallido' : 'Pendiente' }}
      </span>
      <button
        v-if="order.paymentStatus !== 'paid'"
        class="om__pay-btn"
        :disabled="updatingPayment === order._id"
        @click="confirmMarkPaid(order)"
      >
        <i v-if="updatingPayment === order._id" class="fa-solid fa-circle-notch fa-spin"></i>
        <i v-else class="fa-solid fa-circle-check"></i>
        Marcar como Pagada
      </button>
      <button
        v-else
        class="om__pay-btn om__pay-btn--outline"
        :disabled="updatingPayment === order._id"
        @click="confirmMarkPending(order)"
      >
        <i v-if="updatingPayment === order._id" class="fa-solid fa-circle-notch fa-spin"></i>
        <i v-else class="fa-solid fa-clock-rotate-left"></i>
        Revertir a Pendiente
      </button>

      <!-- Comprobante -->
      <div class="om__receipt">
        <span class="om__receipt-label">Comprobante:</span>
        <div v-if="order.paymentReceiptUrl" class="om__receipt-preview">
          <a :href="order.paymentReceiptUrl" target="_blank" rel="noopener">
            <img :src="order.paymentReceiptUrl" alt="Comprobante" class="om__receipt-img" />
          </a>
          <button class="om__receipt-remove" @click="confirmRemoveReceipt(order)" title="Quitar comprobante">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>
        <div v-else>
          <input
            type="file"
            accept="image/*"
            :id="`receipt-${order._id}`"
            style="display:none"
            @change="e => handleReceiptFile(order, e)"
          />
          <label
            :for="`receipt-${order._id}`"
            class="om__receipt-upload-btn"
            :class="{ 'om__receipt-upload-btn--loading': uploadingReceipt === order._id }"
          >
            <i v-if="uploadingReceipt === order._id" class="fa-solid fa-circle-notch fa-spin"></i>
            <i v-else class="fa-solid fa-upload"></i>
            {{ uploadingReceipt === order._id ? 'Subiendo...' : 'Subir comprobante' }}
          </label>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped src="./OrderPaymentSection.scss"></style>
