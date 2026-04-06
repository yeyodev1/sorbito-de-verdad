import httpBase from './httpBase';
import type { Order, CartItem, ApiResponse } from '../types';

interface CreateOrderPayload {
  items: Array<{
    product: string;
    quantity: number;
    price: number;
  }>;
  shippingAddress: {
    name: string;
    phone: string;
    street: string;
    city: string;
    country: string;
  };
  email: string;
}

interface PayphoneOrderPayload {
  items: Array<{
    product: string;
    quantity: number;
    price: number;
    sizeName?: string;
  }>;
  shippingAddress: {
    name: string;
    phone: string;
    street: string;
    city: string;
    country: string;
    state?: string;
    zip?: string;
  };
  email: string;
  notes?: string;
  shippingZoneId?: string;
}

interface PayphoneInitResponse {
  orderId: string;
  clientTransactionId: string;
  payWithPayPhone: string;
}

interface PaymentStatusResponse {
  paymentStatus: 'pending' | 'paid' | 'failed';
  status: string;
}

export const orderService = {
  async createOrder(cartItems: CartItem[], shippingAddress: CreateOrderPayload['shippingAddress'], email: string): Promise<ApiResponse<Order>> {
    const payload: CreateOrderPayload = {
      items: cartItems.map(item => ({
        product: item.product._id,
        quantity: item.quantity,
        price: item.selectedSize?.price ?? item.product.price,
        ...(item.selectedSize && { sizeName: item.selectedSize.name }),
      })),
      shippingAddress,
      email,
    };
    const { data } = await httpBase.post('/orders', payload);
    return data;
  },

  async initiatePayphonePayment(
    cartItems: CartItem[],
    shippingAddress: PayphoneOrderPayload['shippingAddress'],
    email: string,
    notes?: string,
    shippingZoneId?: string,
  ): Promise<ApiResponse<PayphoneInitResponse>> {
    const payload: PayphoneOrderPayload = {
      items: cartItems.map(item => ({
        product: item.product._id,
        quantity: item.quantity,
        price: item.selectedSize?.price ?? item.product.price,
        ...(item.selectedSize && { sizeName: item.selectedSize.name }),
      })),
      shippingAddress,
      email,
      notes,
      ...(shippingZoneId && { shippingZoneId }),
    };
    const { data } = await httpBase.post('/orders/payphone', payload);
    return data;
  },

  async getPaymentStatus(orderId: string): Promise<ApiResponse<PaymentStatusResponse>> {
    const { data } = await httpBase.get(`/orders/${orderId}/payment-status`);
    return data;
  },

  async confirmPayment(id: number, clientTransactionId: string): Promise<ApiResponse<{ orderId: string; paymentStatus: string; approved: boolean }>> {
    const { data } = await httpBase.post('/orders/confirm-payment', { id, clientTransactionId });
    return data;
  },

  async getMyOrders(): Promise<ApiResponse<Order[]>> {
    const { data } = await httpBase.get('/orders/my-orders');
    return data;
  },

  async getOrderById(id: string): Promise<ApiResponse<Order>> {
    const { data } = await httpBase.get(`/orders/${id}`);
    return data;
  },

  async resendConfirmation(orderId: string): Promise<ApiResponse<{ message: string }>> {
    const { data } = await httpBase.post(`/orders/${orderId}/resend-email`);
    return data;
  },
};
