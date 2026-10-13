import { ref, type Ref } from 'vue';
import { adminService } from '../../../services/admin.service';
import type { ProductFormState } from './productFormUtils';

/** Subida, borrado y selección de imagen principal del producto. */
export function useProductImages(form: Ref<ProductFormState>) {
  const uploadingImages = ref(false);
  const uploadProgress = ref(0);
  const isDragOver = ref(false);
  const fileInputRef = ref<HTMLInputElement | null>(null);

  function onDragOver(e: DragEvent) {
    e.preventDefault();
    isDragOver.value = true;
  }

  function onDragLeave() {
    isDragOver.value = false;
  }

  function onDrop(e: DragEvent) {
    e.preventDefault();
    isDragOver.value = false;
    const files = e.dataTransfer?.files;
    if (files) handleFiles(files);
  }

  function onFileSelect(e: Event) {
    const input = e.target as HTMLInputElement;
    if (input.files) handleFiles(input.files);
  }

  async function handleFiles(files: FileList) {
    const validFiles = Array.from(files).filter((f) =>
      f.type.startsWith('image/') && f.size <= 10 * 1024 * 1024
    );

    if (validFiles.length === 0) return;

    uploadingImages.value = true;
    uploadProgress.value = 0;

    for (let i = 0; i < validFiles.length; i++) {
      const file = validFiles[i];
      if (!file) continue;
      try {
        const result = await adminService.uploadImage(file);
        form.value.images.push({ url: result.url, publicId: result.publicId });
        if (form.value.images.length === 1) {
          form.value.mainImage = result.url;
        }
        uploadProgress.value = Math.round(((i + 1) / validFiles.length) * 100);
      } catch (e) {
        console.error('Upload error:', e);
      }
    }

    uploadingImages.value = false;
    uploadProgress.value = 0;
    if (fileInputRef.value) fileInputRef.value.value = '';
  }

  async function removeImage(index: number) {
    const removed = form.value.images[index];
    form.value.images.splice(index, 1);
    if (removed && form.value.mainImage === removed.url) {
      form.value.mainImage = form.value.images[0]?.url || '';
    }
    // Delete from Cloudinary if we have the publicId
    if (removed?.publicId) {
      adminService.deleteImage(removed.publicId).catch((e) =>
        console.warn('Cloudinary delete failed:', e)
      );
    }
  }

  function setMainImage(url: string) {
    form.value.mainImage = url;
  }

  return {
    uploadingImages,
    uploadProgress,
    isDragOver,
    fileInputRef,
    onDragOver,
    onDragLeave,
    onDrop,
    onFileSelect,
    removeImage,
    setMainImage,
  };
}
