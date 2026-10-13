import { ref } from 'vue';

export interface ConfirmDialogState {
  show: boolean;
  title: string;
  message: string;
  loading: boolean;
  previewUrl?: string;
  action: (() => Promise<void>) | null;
}

export function useConfirmDialog() {
  const confirmDialog = ref<ConfirmDialogState>({
    show: false,
    title: '',
    message: '',
    loading: false,
    action: null,
  });

  function showConfirm(opts: {
    title: string;
    message: string;
    action: () => Promise<void>;
    previewUrl?: string;
  }) {
    confirmDialog.value = { show: true, loading: false, previewUrl: opts.previewUrl, title: opts.title, message: opts.message, action: opts.action };
  }

  async function handleConfirm() {
    if (!confirmDialog.value.action) return;
    confirmDialog.value.loading = true;
    try {
      await confirmDialog.value.action();
    } finally {
      confirmDialog.value.loading = false;
      confirmDialog.value.show = false;
      confirmDialog.value.action = null;
    }
  }

  function closeConfirm() {
    confirmDialog.value.show = false;
    confirmDialog.value.action = null;
  }

  return { confirmDialog, showConfirm, handleConfirm, closeConfirm };
}

export type ShowConfirm = ReturnType<typeof useConfirmDialog>['showConfirm'];
