import { ref, type Ref } from 'vue';
import { adminService } from '../../../services/admin.service';
import { useUIStore } from '../../../stores/ui';
import type { Order } from './types';
import { statusLabels, paymentStatusLabels } from './constants';
import { extractCloudinaryPublicId } from './formatters';
import type { ShowConfirm } from './useConfirmDialog';
import { updatePaymentStatusWithConfirm, confirmMarkPaidAction, confirmMarkPendingAction } from './paymentActions';

interface ActionDeps {
  showConfirm: ShowConfirm;
  openPayModal: (order: Order, targetStatus: string) => void;
  openReceiptModal: (order: Order, targetStatus: string) => void;
  openPaymentModal: (order: Order, newStatus: string) => void;
  draftNotes: Ref<Record<string, string>>;
}

/** Acciones de una orden: cambio de estado, pago, comprobante, notas y correo. */
export function useOrderActions(deps: ActionDeps) {
  const ui = useUIStore();
  const { showConfirm } = deps;

  const updatingId = ref<string | null>(null);
  const savingNotes = ref<string | null>(null);
  const resendingEmail = ref<string | null>(null);
  const updatingPayment = ref<string | null>(null);
  const uploadingReceipt = ref<string | null>(null);

  function updateStatus(order: Order, newStatus: string) {
    if (newStatus === order.status) return;
    // "Confirmed" with unpaid order → ask if client paid outside
    if (newStatus === 'confirmed' && order.paymentStatus !== 'paid') {
      deps.openPayModal(order, newStatus);
      return;
    }
    // "Delivered" opens the receipt upload modal
    if (newStatus === 'delivered') {
      deps.openReceiptModal(order, newStatus);
      return;
    }
    showConfirm({
      title: 'Cambiar estado de orden',
      message: `¿Estás seguro de cambiar el estado a "${statusLabels[newStatus] || newStatus}"?`,
      action: async () => {
        updatingId.value = order._id;
        try {
          await adminService.updateOrderStatus(order._id, newStatus);
          order.status = newStatus;
          ui.success(`Estado → ${statusLabels[newStatus] || newStatus} · Email enviado al cliente`);
        } catch (e: unknown) {
          const err = e as { response?: { data?: { message?: string } }; message?: string };
          ui.error(err?.response?.data?.message || 'Error al actualizar la orden');
        } finally {
          updatingId.value = null;
        }
      },
    });
  }

  const paymentCtx = { showConfirm, updatingPayment, openPaymentModal: deps.openPaymentModal, labels: paymentStatusLabels };
  const confirmMarkPaid = (order: Order) => confirmMarkPaidAction(paymentCtx, order);
  const confirmMarkPending = (order: Order) => confirmMarkPendingAction(paymentCtx, order);
  const updatePaymentStatus = (order: Order, status: string) => updatePaymentStatusWithConfirm(paymentCtx, order, status);

  function confirmRemoveReceipt(order: Order) {
    showConfirm({
      title: 'Quitar comprobante',
      message: '¿Estás seguro de quitar el comprobante? Se eliminará permanentemente del servidor.',
      action: async () => {
        try {
          // Delete from Cloudinary first
          if (order.paymentReceiptUrl) {
            const publicId = extractCloudinaryPublicId(order.paymentReceiptUrl);
            if (publicId) await adminService.deleteImage(publicId).catch(() => {});
          }
          await adminService.updateOrderReceipt(order._id, '');
          order.paymentReceiptUrl = undefined;
          ui.success('Comprobante eliminado del servidor');
        } catch {
          ui.error('Error al eliminar el comprobante');
        }
      },
    });
  }

  async function handleReceiptFile(order: Order, event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;
    uploadingReceipt.value = order._id;
    let uploadedUrl = '';
    try {
      const result = await adminService.uploadImage(file);
      uploadedUrl = result.url;
    } catch {
      ui.error('Error al subir el comprobante');
      uploadingReceipt.value = null;
      return;
    }
    uploadingReceipt.value = null;
    // Reset input so same file can be re-selected
    (event.target as HTMLInputElement).value = '';
    showConfirm({
      title: 'Adjuntar comprobante',
      message: '¿Estás seguro de adjuntar este comprobante a la orden?',
      previewUrl: uploadedUrl,
      action: async () => {
        await adminService.updateOrderReceipt(order._id, uploadedUrl);
        order.paymentReceiptUrl = uploadedUrl;
        ui.success('Comprobante adjuntado correctamente');
      },
    });
  }

  async function resendEmail(order: Order) {
    resendingEmail.value = order._id;
    try {
      await adminService.resendOrderEmail(order._id);
      ui.success(`Correo reenviado a ${order.user?.email || 'el cliente'}`);
    } catch {
      ui.error('Error al reenviar el correo');
    } finally {
      resendingEmail.value = null;
    }
  }

  async function saveNotes(order: Order) {
    savingNotes.value = order._id;
    try {
      const notes = deps.draftNotes.value[order._id] ?? '';
      await adminService.updateOrderStatus(order._id, order.status || 'pending', undefined, notes);
      order.notes = notes;
      ui.success('Nota guardada');
    } catch {
      ui.error('Error al guardar la nota');
    } finally {
      savingNotes.value = null;
    }
  }

  return {
    updatingId, savingNotes, resendingEmail, updatingPayment, uploadingReceipt,
    updateStatus, confirmMarkPaid, confirmMarkPending, updatePaymentStatus,
    confirmRemoveReceipt, handleReceiptFile, resendEmail, saveNotes,
  };
}
