import { ref } from 'vue';
import { adminService } from '../../../services/admin.service';
import { useUIStore } from '../../../stores/ui';
import type { Order } from './types';
import { statusLabels } from './constants';
import { useUploadDraft } from './useUploadDraft';

/** Modal de comprobante al marcar una orden como "delivered". */
export function useReceiptModal() {
  const ui = useUIStore();

  const receiptModal = ref<{
    show: boolean;
    order: Order | null;
    targetStatus: string;
    filePreview: string;
    uploadedUrl: string;
    dragging: boolean;
    uploading: boolean;
    saving: boolean;
  }>({
    show: false,
    order: null,
    targetStatus: '',
    filePreview: '',
    uploadedUrl: '',
    dragging: false,
    uploading: false,
    saving: false,
  });

  const upload = useUploadDraft(receiptModal);

  function openReceiptModal(order: Order, targetStatus: string) {
    receiptModal.value = {
      show: true,
      order,
      targetStatus,
      filePreview: '',
      uploadedUrl: '',
      dragging: false,
      uploading: false,
      saving: false,
    };
  }

  async function cancelReceiptModal() {
    if (receiptModal.value.saving || receiptModal.value.uploading) return;
    upload.discardUploaded();
    receiptModal.value.show = false;
  }

  async function confirmReceiptModal() {
    const { order, targetStatus, uploadedUrl } = receiptModal.value;
    if (!order) return;
    receiptModal.value.saving = true;
    try {
      await adminService.updateOrderStatus(order._id, targetStatus);
      order.status = targetStatus;
      if (uploadedUrl) {
        await adminService.updateOrderReceipt(order._id, uploadedUrl);
        order.paymentReceiptUrl = uploadedUrl;
      }
      ui.success(`Estado → ${statusLabels[targetStatus] || targetStatus}${uploadedUrl ? ' · Comprobante adjuntado ✓' : ''}`);
      receiptModal.value.show = false;
    } catch {
      ui.error('Error al actualizar la orden');
    } finally {
      receiptModal.value.saving = false;
    }
  }

  return {
    receiptModal,
    openReceiptModal,
    cancelReceiptModal,
    removeReceiptModalPreview: upload.removePreview,
    handleReceiptDrop: upload.handleDrop,
    handleReceiptFileInput: upload.handleFileInput,
    confirmReceiptModal,
  };
}
