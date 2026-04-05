import { defineStore } from 'pinia';

type Theme = 'dark' | 'light';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ConfirmOptions {
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  type?: 'danger' | 'warning' | 'info';
  onConfirm: () => void;
  onCancel?: () => void;
}

export interface ToastAction {
  label: string;
  to: string;
}

export interface Toast {
  id: number;
  message: string;
  type: ToastType;
  duration: number;
  image?: string;
  action?: ToastAction;
}

// Keep legacy single notification for any existing consumers
interface Notification {
  message: string;
  type: ToastType;
  show: boolean;
}

interface UIState {
  isCartOpen: boolean;
  isMenuOpen: boolean;
  notification: Notification;
  toasts: Toast[];
  theme: Theme;
  _toastCounter: number;
  confirm: {
    open: boolean;
    options: ConfirmOptions | null;
  };
}

export const useUIStore = defineStore('ui', {
  state: (): UIState => ({
    isCartOpen: false,
    isMenuOpen: false,
    notification: { message: '', type: 'info', show: false },
    toasts: [],
    theme: (localStorage.getItem('sdv-theme') as Theme) ?? 'dark',
    _toastCounter: 0,
    confirm: { open: false, options: null },
  }),

  actions: {
    openCart() { this.isCartOpen = true; },
    closeCart() { this.isCartOpen = false; },
    toggleCart() { this.isCartOpen = !this.isCartOpen; },
    openMenu() { this.isMenuOpen = true; },
    closeMenu() { this.isMenuOpen = false; },
    toggleMenu() { this.isMenuOpen = !this.isMenuOpen; },

    /** Push a toast. Returns the id so callers can dismiss early if needed. */
    toast(
      message: string,
      type: ToastType = 'info',
      duration = 4000,
      options?: { image?: string; action?: ToastAction }
    ): number {
      const id = ++this._toastCounter;
      this.toasts.push({ id, message, type, duration, ...options });
      setTimeout(() => this.dismiss(id), duration);
      return id;
    },

    /** Shorthand helpers */
    success(message: string, duration?: number, options?: { image?: string; action?: ToastAction }) {
      return this.toast(message, 'success', duration ?? 4000, options);
    },
    error(message: string, duration?: number, options?: { image?: string; action?: ToastAction }) {
      return this.toast(message, 'error', duration ?? 4500, options);
    },
    warning(message: string, duration?: number, options?: { image?: string; action?: ToastAction }) {
      return this.toast(message, 'warning', duration ?? 4000, options);
    },
    info(message: string, duration?: number, options?: { image?: string; action?: ToastAction }) {
      return this.toast(message, 'info', duration ?? 4000, options);
    },

    dismiss(id: number) {
      const idx = this.toasts.findIndex((t) => t.id === id);
      if (idx !== -1) this.toasts.splice(idx, 1);
    },

    // Legacy compat — kept so existing code that calls showNotification still works
    showNotification(message: string, type: ToastType = 'info') {
      this.toast(message, type);
      this.notification = { message, type, show: true };
      setTimeout(() => { this.notification.show = false; }, 3500);
    },
    hideNotification() { this.notification.show = false; },

    /** Open a global confirmation modal */
    openConfirm(options: ConfirmOptions) {
      this.confirm = { open: true, options };
    },
    closeConfirm() {
      this.confirm = { open: false, options: null };
    },
    resolveConfirm(confirmed: boolean) {
      const opts = this.confirm.options;
      this.closeConfirm();
      if (confirmed) opts?.onConfirm();
      else opts?.onCancel?.();
    },

    toggleTheme() {
      this.theme = this.theme === 'dark' ? 'light' : 'dark';
      localStorage.setItem('sdv-theme', this.theme);
      document.documentElement.setAttribute('data-theme', this.theme);
    },
    applyTheme() {
      document.documentElement.setAttribute('data-theme', this.theme);
    },
  },
});
