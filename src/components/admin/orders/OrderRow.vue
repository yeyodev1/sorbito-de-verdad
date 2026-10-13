<script setup lang="ts">
import OrderDetails from './OrderDetails.vue';
import type { Order } from '../../../composables/admin/orders/types';
import {
  allStatuses, statusColors, statusLabels, paymentStatusColors, paymentStatusLabels,
} from '../../../composables/admin/orders/constants';
import { formatCurrency, formatDate, getItemCount, shareOnWhatsApp } from '../../../composables/admin/orders/formatters';
import { useOrdersContext } from '../../../composables/admin/orders/context';

defineProps<{ order: Order }>();

const { expandedId, updatingId, updatingPayment, openExpand, updateStatus, updatePaymentStatus } = useOrdersContext();
</script>

<template>
  <!-- Main row -->
  <tr :class="['om__row', { 'om__row--expanded': expandedId === order._id }]">
    <td style="padding-left: 1.5rem;">
      <span class="om__order-num">#{{ order.orderNumber || order._id?.slice(-6).toUpperCase() }}</span>
    </td>
    <td>
      <div class="om__user">
        <span class="om__user-name">{{ order.user?.name || '—' }}</span>
        <span class="om__user-email">{{ order.user?.email || '' }}</span>
      </div>
    </td>
    <td>
      <span
        v-if="order.source === 'whatsapp_bot'"
        class="status-badge status-badge--success"
        title="Pedido creado vía bot de WhatsApp"
      >
        <i class="fa-brands fa-whatsapp"></i> Bot
      </span>
      <span v-else-if="order.source" class="status-badge status-badge--muted">{{ order.source }}</span>
      <span v-else class="status-badge status-badge--muted">Web</span>
    </td>
    <td>
        <span class="om__items-count">{{ getItemCount(order) }} ítem(s)</span>
    </td>
    <td class="om__total">{{ formatCurrency(order.total) }}</td>
    <td>
      <div class="om__cell-control">
        <span :class="['status-badge', `status-badge--${statusColors[order.status || ''] || 'muted'}`]">
          {{ statusLabels[order.status || ''] || order.status || '—' }}
        </span>
        <select
          class="om__cell-select"
          :value="order.status"
          :disabled="updatingId === order._id"
          @change="(e) => { updateStatus(order, (e.target as HTMLSelectElement).value); (e.target as HTMLSelectElement).value = order.status || ''; }"
          title="Cambiar estado de la orden"
        >
          <option v-for="s in allStatuses" :key="s" :value="s">{{ statusLabels[s] }}</option>
        </select>
      </div>
    </td>
    <td>
      <div class="om__cell-control">
        <span :class="['status-badge', `status-badge--${paymentStatusColors[order.paymentStatus || ''] || 'warning'}`]">
          <i v-if="order.paymentStatus === 'paid'" class="fa-solid fa-check-circle" style="margin-right: 0.25rem;"></i>
          {{ paymentStatusLabels[order.paymentStatus || ''] || order.paymentStatus || '—' }}
        </span>
        <select
          class="om__cell-select om__cell-select--payment"
          :value="order.paymentStatus"
          :disabled="updatingPayment === order._id"
          @change="(e) => { updatePaymentStatus(order, (e.target as HTMLSelectElement).value); (e.target as HTMLSelectElement).value = order.paymentStatus || ''; }"
          title="Cambiar estado de pago"
        >
          <option value="pending">Pendiente</option>
          <option value="paid">Pagado</option>
          <option value="failed">Fallido</option>
          <option value="refunded">Reembolsado</option>
        </select>
      </div>
    </td>
    <td class="om__date">{{ formatDate(order.createdAt) }}</td>
    <td style="text-align: right; padding-right: 1.5rem;">
      <div class="om__actions">
        <!-- WhatsApp button -->
        <button class="om__wa-btn" @click="shareOnWhatsApp(order)" title="Enviar a WhatsApp de facturación">
          <i class="fa-brands fa-whatsapp"></i>
        </button>
        <!-- Expand button -->
        <button class="om__expand-btn" @click="openExpand(order._id)" :title="expandedId === order._id ? 'Cerrar' : 'Ver detalles'">
          <i :class="['fa-solid', expandedId === order._id ? 'fa-chevron-up' : 'fa-chevron-down']"></i>
        </button>
      </div>
    </td>
  </tr>

  <!-- Expanded details row -->
  <Transition name="expand">
    <tr v-if="expandedId === order._id" class="om__details-row">
      <td colspan="9">
        <OrderDetails :order="order" />
      </td>
    </tr>
  </Transition>
</template>

<style lang="scss" scoped src="./OrderRow.scss"></style>
