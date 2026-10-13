import type { Ref } from 'vue';
import { adminService } from '../../../services/admin.service';
import { useUIStore } from '../../../stores/ui';
import { extractCloudinaryPublicId } from './formatters';

/** Estado mínimo de un modal con comprobante arrastrable. */
export interface UploadDraftState {
  filePreview: string;
  uploadedUrl: string;
  dragging: boolean;
  uploading: boolean;
}

/** Lógica compartida de subida/borrado de comprobantes para los modales. */
export function useUploadDraft<T extends UploadDraftState>(state: Ref<T>) {
  const ui = useUIStore();

  /** Si se subió un comprobante pero no se confirmó, se borra de Cloudinary. */
  function discardUploaded() {
    if (state.value.uploadedUrl) {
      const pid = extractCloudinaryPublicId(state.value.uploadedUrl);
      if (pid) adminService.deleteImage(pid).catch(() => {});
      state.value.uploadedUrl = '';
    }
  }

  async function removePreview() {
    if (state.value.uploadedUrl) {
      const pid = extractCloudinaryPublicId(state.value.uploadedUrl);
      if (pid) await adminService.deleteImage(pid).catch(() => {});
    }
    state.value.filePreview = '';
    state.value.uploadedUrl = '';
  }

  async function processFile(file: File) {
    state.value.filePreview = URL.createObjectURL(file);
    state.value.uploading = true;
    state.value.uploadedUrl = '';
    try {
      const result = await adminService.uploadImage(file);
      state.value.uploadedUrl = result.url;
    } catch {
      ui.error('Error al subir el comprobante');
      state.value.filePreview = '';
    } finally {
      state.value.uploading = false;
    }
  }

  function handleDrop(event: DragEvent) {
    state.value.dragging = false;
    const file = event.dataTransfer?.files?.[0];
    if (file && file.type.startsWith('image/')) processFile(file);
  }

  function handleFileInput(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) processFile(file);
    (event.target as HTMLInputElement).value = '';
  }

  return { discardUploaded, removePreview, handleDrop, handleFileInput };
}
