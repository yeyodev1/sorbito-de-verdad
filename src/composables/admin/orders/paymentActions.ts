import type { Ref } from 'vue';
import { adminService } from '../../../services/admin.service';
import { useUIStore } from '../../../stores/ui';
import type { Order } from './types';
import type { ShowConfirm } from './useConfirmDialog';

interface PaymentCtx {
  showConfirm: ShowConfirm;
  updatingPayment: Ref<string | null>;
  openPaymentModal: (order: Order, newStatus: string) => void;
  labels: Record<string, string>;
}

export function confirmMarkPaidAction(ctx: PaymentCtx, order: Order) {
  const ui = useUIStore();
  const isWhatsApp = order.source === 'whatsapp_bot';
  ctx.showConfirm({
    title: 'Confirmar pago',
    message: isWhatsApp
      ? `Se marcará como pagado y se NOTIFICARÁ al cliente vía WhatsApp. ¿Continuar?`
      : '¿Estás seguro de marcar esta orden como pagada?',
    action: async () => {
      ctx.updatingPayment.value = order._id;
      try {
        await adminService.updateOrderPaymentStatus(order._id, 'paid');
        order.paymentStatus = 'paid';
        if (order.status === 'review') {
          order.status = 'confirmed';
        }
        ui.success(isWhatsApp
          ? 'Pago confirmado ✓ · Cliente notificado vía WhatsApp'
          : 'Orden marcada como pagada');
      } catch {
        ui.error('Error al actualizar el estado de pago');
      } finally {
        ctx.updatingPayment.value = null;
      }
    },
  });
}

export function confirmMarkPendingAction(ctx: PaymentCtx, order: Order) {
  const ui = useUIStore();
  ctx.showConfirm({
    title: 'Revertir pago',
    message: '¿Estás seguro de marcar esta orden como pendiente de pago?',
    action: async () => {
      ctx.updatingPayment.value = order._id;
      try {
        await adminService.updateOrderPaymentStatus(order._id, 'pending');
        order.paymentStatus = 'pending';
        ui.success('Estado de pago revertido a pendiente');
      } catch {
        ui.error('Error al actualizar el estado de pago');
      } finally {
        ctx.updatingPayment.value = null;
      }
    },
  });
}

export function updatePaymentStatusWithConfirm(ctx: PaymentCtx, order: Order, newPaymentStatus: string) {
  const ui = useUIStore();
  if (newPaymentStatus === order.paymentStatus) return;

  if (newPaymentStatus === 'paid' || newPaymentStatus === 'failed') {
    ctx.openPaymentModal(order, newPaymentStatus);
    return;
  }

  ctx.showConfirm({
    title: 'Cambiar estado de pago',
    message: `¿Estás seguro de marcar como "${ctx.labels[newPaymentStatus] || newPaymentStatus}"?`,
    action: async () => {
      ctx.updatingPayment.value = order._id;
      try {
        await adminService.updateOrderPaymentStatus(order._id, newPaymentStatus);
        order.paymentStatus = newPaymentStatus;
        ui.success(`Pago → ${ctx.labels[newPaymentStatus] || newPaymentStatus}`);
      } catch {
        ui.error('Error al actualizar el estado de pago');
      } finally {
        ctx.updatingPayment.value = null;
      }
    },
  });
}
