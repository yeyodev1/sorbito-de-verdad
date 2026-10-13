import { ref } from 'vue';
import { adminService } from '../../../services/admin.service';
import { useUIStore } from '../../../stores/ui';
import type { Order } from './types';
import { paymentStatusLabels } from './constants';

/** Modal de confirmación al cambiar directamente el estado de pago. */
export function usePaymentModal(updateCountsAfterChange: (order: Order) => void) {
  const ui = useUIStore();

  const paymentModal = ref<{
    show: boolean;
    order: Order | null;
    newStatus: string;
    saving: boolean;
  }>({
    show: false,
    order: null,
    newStatus: 'paid',
    saving: false,
  });

  function openPaymentModal(order: Order, newStatus: string) {
    paymentModal.value = { show: true, order, newStatus, saving: false };
  }

  function closePaymentModal() {
    if (paymentModal.value.saving) return;
    paymentModal.value.show = false;
  }

  async function confirmPaymentChange() {
    const { order, newStatus } = paymentModal.value;
    if (!order || paymentModal.value.saving) return;
    paymentModal.value.saving = true;
    try {
      await adminService.updateOrderPaymentStatus(order._id, newStatus);
      order.paymentStatus = newStatus;
      if (newStatus === 'paid' && order.status === 'review') {
        order.status = 'confirmed';
      }
      const isWhatsApp = order.source === 'whatsapp_bot';
      updateCountsAfterChange(order);
      closePaymentModal();
      ui.success(isWhatsApp
        ? 'Pago confirmado ✓ · Cliente notificado vía WhatsApp'
        : `Pago → ${paymentStatusLabels[newStatus] || newStatus}`);
    } catch {
      ui.error('Error al actualizar el estado de pago');
    } finally {
      paymentModal.value.saving = false;
    }
  }

  return { paymentModal, openPaymentModal, closePaymentModal, confirmPaymentChange };
}
