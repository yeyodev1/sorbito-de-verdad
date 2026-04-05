import { defineStore } from 'pinia';

type Theme = 'dark' | 'light';

interface Notification {
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  show: boolean;
}

interface UIState {
  isCartOpen: boolean;
  isMenuOpen: boolean;
  notification: Notification;
  theme: Theme;
}

export const useUIStore = defineStore('ui', {
  state: (): UIState => ({
    isCartOpen: false,
    isMenuOpen: false,
    notification: { message: '', type: 'info', show: false },
    theme: (localStorage.getItem('sdv-theme') as Theme) ?? 'dark',
  }),

  actions: {
    openCart() {
      this.isCartOpen = true;
    },
    closeCart() {
      this.isCartOpen = false;
    },
    toggleCart() {
      this.isCartOpen = !this.isCartOpen;
    },
    openMenu() {
      this.isMenuOpen = true;
    },
    closeMenu() {
      this.isMenuOpen = false;
    },
    toggleMenu() {
      this.isMenuOpen = !this.isMenuOpen;
    },
    showNotification(message: string, type: Notification['type'] = 'info') {
      this.notification = { message, type, show: true };
      setTimeout(() => {
        this.notification.show = false;
      }, 3500);
    },
    hideNotification() {
      this.notification.show = false;
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
