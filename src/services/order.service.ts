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

export const orderService = {
  async createOrder(cartItems: CartItem[], shippingAddress: CreateOrderPayload['shippingAddress'], email: string): Promise<ApiResponse<Order>> {
    const payload: CreateOrderPayload = {
      items: cartItems.map(item => ({
        product: item.product._id,
        quantity: item.quantity,
        price: item.product.price,
      })),
      shippingAddress,
      email,
    };
    const { data } = await httpBase.post('/orders', payload);
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
};
