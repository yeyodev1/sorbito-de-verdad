<script setup lang="ts">
import { paymentStatusColors, paymentStatusLabels } from '../../../composables/admin/orders/constants';
import { formatCurrency } from '../../../composables/admin/orders/formatters';
import { useOrdersContext } from '../../../composables/admin/orders/context';

const { paymentModal, closePaymentModal, confirmPaymentChange } = useOrdersContext();
</script>

<template>
  <Teleport to="body">
    <Transition name="pm-overlay">
      <div v-if="paymentModal.show" class="pm-overlay" @click.self="closePaymentModal">
        <div class="pm-box pm-box--compact">
          <!-- Header -->
          <div class="pm-header">
            <div class="pm-header-icon">
              <i class="fa-solid fa-credit-card"></i>
            </div>
            <div class="pm-header-text">
              <h3 class="pm-title">Confirmar estado de pago</h3>
              <p class="pm-subtitle">
                <strong>{{ paymentModal.order?.orderNumber || '#' + paymentModal.order?._id?.slice(-6).toUpperCase() }}</strong>
                &nbsp;·&nbsp;{{ formatCurrency(paymentModal.order?.total) }}
                &nbsp;·&nbsp;{{ paymentModal.order?.user?.name || '—' }}
              </p>
            </div>
            <button class="pm-close" @click="closePaymentModal" :disabled="paymentModal.saving">
              <i class="fa-solid fa-xmark"></i>
            </button>
          </div>

          <div class="pm-body">
            <div class="pm-change-summary">
              <div class="pm-change-col">
                <span class="pm-change-label">Actual</span>
                <span :class="['status-badge', `status-badge--${paymentStatusColors[paymentModal.order?.paymentStatus || ''] || 'warning'}`]">
                  {{ paymentStatusLabels[paymentModal.order?.paymentStatus || ''] || '—' }}
                </span>
              </div>
              <div class="pm-change-arrow">
                <i class="fa-solid fa-arrow-right"></i>
              </div>
              <div class="pm-change-col">
                <span class="pm-change-label">Nuevo</span>
                <span :class="['status-badge', `status-badge--${paymentStatusColors[paymentModal.newStatus] || 'warning'}`]">
                  <template v-if="paymentModal.newStatus === 'paid'"><i class="fa-solid fa-check-circle" style="margin-right: 0.25rem;"></i></template>
                  {{ paymentStatusLabels[paymentModal.newStatus] || paymentModal.newStatus }}
                </span>
              </div>
            </div>

            <div
              v-if="paymentModal.order?.source === 'whatsapp_bot' && paymentModal.newStatus === 'paid'"
              class="pm-notice"
            >
              <i class="fa-solid fa-bell"></i>
              <span>Se <strong>notificará al cliente</strong> vía WhatsApp confirmando el pago</span>
            </div>

            <div v-if="paymentModal.order?.paymentReceiptUrl" class="pm-receipt-info">
              <i class="fa-solid fa-receipt"></i>
              <span>Tiene comprobante adjunto —</span>
              <a :href="paymentModal.order.paymentReceiptUrl" target="_blank" rel="noopener">Ver comprobante</a>
            </div>
          </div>

          <div class="pm-footer">
            <button class="pm-btn-no" @click="closePaymentModal" :disabled="paymentModal.saving">
              Cancelar
            </button>
            <button class="pm-btn-yes" @click="confirmPaymentChange" :disabled="paymentModal.saving">
              <i v-if="paymentModal.saving" class="fa-solid fa-circle-notch fa-spin"></i>
              <i v-else class="fa-solid fa-check-circle"></i>
              {{ paymentModal.saving ? 'Guardando...' : 'Confirmar' }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style lang="scss" scoped src="./PaymentStatusModal.scss"></style>
