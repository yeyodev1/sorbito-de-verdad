import { defineStore } from 'pinia';
import type { CartItem, Product, ProductSize } from '../types';

const STORAGE_KEY = 'sorbito-cart';
// Copia del carrito mientras el cliente paga en PayPhone, por si el pago se rechaza
const PENDING_KEY = 'sorbito-cart-pending';
const PENDING_TTL_MS = 2 * 60 * 60 * 1000;

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

    /** Vacía el carrito guardando una copia para recuperarlo si el pago falla. */
    stashForPayment() {
      try {
        localStorage.setItem(PENDING_KEY, JSON.stringify({ items: this.items, at: Date.now() }));
      } catch {}
      this.clearCart();
    },

    /** Recupera el carrito guardado antes de ir a pagar. Devuelve true si se restauró. */
    restorePending(): boolean {
      try {
        const raw = localStorage.getItem(PENDING_KEY);
        if (!raw) return false;
        localStorage.removeItem(PENDING_KEY);
        const { items, at } = JSON.parse(raw) as { items: CartItem[]; at: number };
        if (!Array.isArray(items) || !items.length || Date.now() - at > PENDING_TTL_MS) return false;
        this.items = items;
        this.saveToStorage();
        return true;
      } catch {
        return false;
      }
    },

    clearPending() {
      try { localStorage.removeItem(PENDING_KEY); } catch {}
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
