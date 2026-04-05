import httpBase from './httpBase';
import type { Product, Category, ApiResponse } from '../types';

export const productService = {
  async getAll(params?: {
    page?: number;
    limit?: number;
    collection?: string;
    category?: string;
    search?: string;
    isFeatured?: boolean;
    sort?: string;
  }): Promise<ApiResponse<Product[]>> {
    const { data } = await httpBase.get('/products', { params });
    return data;
  },

  async getBySlug(slug: string): Promise<ApiResponse<Product>> {
    const { data } = await httpBase.get(`/products/${slug}`);
    return data;
  },

  async getCategories(): Promise<ApiResponse<Category[]>> {
    const { data } = await httpBase.get('/categories');
    return data;
  },
};
