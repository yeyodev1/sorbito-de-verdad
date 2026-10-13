import { ref } from 'vue';
import { adminService } from '../../../services/admin.service';
import { useUIStore } from '../../../stores/ui';
import type { Order } from './types';
import { statusLabels } from './constants';
import { useUploadDraft } from './useUploadDraft';

/** Modal al pasar a "confirmed" una orden sin pago: ¿pagó por fuera? */
export function usePayModal() {
  const ui = useUIStore();

  const payModal = ref<{
    show: boolean;
    order: Order | null;
    targetStatus: string;
    step: 'ask' | 'upload';
    filePreview: string;
    uploadedUrl: string;
    dragging: boolean;
    uploading: boolean;
    saving: boolean;
  }>({
    show: false,
    order: null,
    targetStatus: '',
    step: 'ask',
    filePreview: '',
    uploadedUrl: '',
    dragging: false,
    uploading: false,
    saving: false,
  });

  const upload = useUploadDraft(payModal);

  function openPayModal(order: Order, targetStatus: string) {
    payModal.value = { show: true, order, targetStatus, step: 'ask', filePreview: '', uploadedUrl: '', dragging: false, uploading: false, saving: false };
  }

  async function closePayModal() {
    if (payModal.value.saving || payModal.value.uploading) return;
    upload.discardUploaded();
    payModal.value.show = false;
  }

  async function payModalAnswerNo() {
    const { order, targetStatus } = payModal.value;
    if (!order) return;
    payModal.value.saving = true;
    try {
      await adminService.updateOrderStatus(order._id, targetStatus);
      order.status = targetStatus;
      ui.success(`Estado → ${statusLabels[targetStatus] || targetStatus} · Email enviado al cliente`);
      payModal.value.show = false;
    } catch {
      ui.error('Error al actualizar la orden');
    } finally {
      payModal.value.saving = false;
    }
  }

  function payModalAnswerYes() {
    payModal.value.step = 'upload';
  }

  async function confirmPayModal() {
    const { order, targetStatus, uploadedUrl } = payModal.value;
    if (!order) return;
    payModal.value.saving = true;
    try {
      await adminService.updateOrderStatus(order._id, targetStatus, 'paid');
      order.status = targetStatus;
      order.paymentStatus = 'paid';
      if (uploadedUrl) {
        await adminService.updateOrderReceipt(order._id, uploadedUrl);
        order.paymentReceiptUrl = uploadedUrl;
      }
      ui.success(`Confirmada · Pago externo registrado${uploadedUrl ? ' · Comprobante adjuntado ✓' : ''}`);
      payModal.value.show = false;
    } catch {
      ui.error('Error al actualizar la orden');
    } finally {
      payModal.value.saving = false;
    }
  }

  return {
    payModal,
    openPayModal,
    closePayModal,
    removePayModalPreview: upload.removePreview,
    payModalAnswerNo,
    payModalAnswerYes,
    handlePayModalDrop: upload.handleDrop,
    handlePayModalFileInput: upload.handleFileInput,
    confirmPayModal,
  };
}
