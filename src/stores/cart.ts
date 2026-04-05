import { defineStore } from 'pinia';
import type { CartItem, Product } from '../types';

const STORAGE_KEY = 'sorbito-cart';

interface CartState {
  items: CartItem[];
}

export const useCartStore = defineStore('cart', {
  state: (): CartState => ({
    items: [],
  }),

  getters: {
    totalItems: (state) => state.items.reduce((sum, item) => sum + item.quantity, 0),
    subtotal: (state) => state.items.reduce((sum, item) => sum + item.product.price * item.quantity, 0),
    isEmpty: (state) => state.items.length === 0,
  },

  actions: {
    addToCart(product: Product, quantity = 1) {
      const existing = this.items.find(item => item.product._id === product._id);
      if (existing) {
        existing.quantity += quantity;
      } else {
        this.items.push({ product, quantity });
      }
      this.saveToStorage();
    },

    removeFromCart(productId: string) {
      this.items = this.items.filter(item => item.product._id !== productId);
      this.saveToStorage();
    },

    updateQuantity(productId: string, quantity: number) {
      if (quantity <= 0) {
        this.removeFromCart(productId);
        return;
      }
      const item = this.items.find(item => item.product._id === productId);
      if (item) {
        item.quantity = quantity;
        this.saveToStorage();
      }
    },

    clearCart() {
      this.items = [];
      this.saveToStorage();
    },

    saveToStorage() {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.items));
      } catch {}
    },

    loadFromStorage() {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          this.items = JSON.parse(stored);
        }
      } catch {
        this.items = [];
      }
    },
  },
});
