import { defineStore } from 'pinia';
import type { CartItem, Product, ProductSize } from '../types';

const STORAGE_KEY = 'sorbito-cart';

interface CartState {
  items: CartItem[];
}

function cartKey(productId: string, sizeName?: string): string {
  return sizeName ? `${productId}-${sizeName}` : productId;
}

export const useCartStore = defineStore('cart', {
  state: (): CartState => ({
    items: [],
  }),

  getters: {
    totalItems: (state) => state.items.reduce((sum, item) => sum + item.quantity, 0),
    subtotal: (state) => state.items.reduce((sum, item) => {
      const price = item.selectedSize?.price ?? item.product.price;
      return sum + price * item.quantity;
    }, 0),
    isEmpty: (state) => state.items.length === 0,
  },

  actions: {
    addToCart(product: Product, quantity = 1, selectedSize?: ProductSize) {
      const key = cartKey(product._id, selectedSize?.name);
      const existing = this.items.find(item =>
        cartKey(item.product._id, item.selectedSize?.name) === key
      );
      if (existing) {
        existing.quantity += quantity;
      } else {
        this.items.push({ product, quantity, selectedSize });
      }
      this.saveToStorage();
    },

    removeFromCart(productId: string, sizeName?: string) {
      const key = cartKey(productId, sizeName);
      this.items = this.items.filter(item =>
        cartKey(item.product._id, item.selectedSize?.name) !== key
      );
      this.saveToStorage();
    },

    updateQuantity(productId: string, quantity: number, sizeName?: string) {
      if (quantity <= 0) {
        this.removeFromCart(productId, sizeName);
        return;
      }
      const key = cartKey(productId, sizeName);
      const item = this.items.find(item =>
        cartKey(item.product._id, item.selectedSize?.name) === key
      );
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
