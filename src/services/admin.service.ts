import httpBase from './httpBase';

export const adminService = {
  // Stats
  async getStats() {
    const { data } = await httpBase.get('/admin/stats');
    return data;
  },

  // Products (reutiliza /api/products)
  async getProducts(params?: Record<string, unknown>) {
    const { data } = await httpBase.get('/products', { params: { ...params, limit: 50 } });
    return data;
  },
  async createProduct(payload: FormData | Record<string, unknown>) {
    const { data } = await httpBase.post('/products', payload);
    return data;
  },
  async updateProduct(id: string, payload: Record<string, unknown>) {
    const { data } = await httpBase.put(`/products/${id}`, payload);
    return data;
  },
  async deleteProduct(id: string) {
    const { data } = await httpBase.delete(`/products/${id}`);
    return data;
  },

  // Categories
  async getCategories() {
    const { data } = await httpBase.get('/categories');
    return data;
  },
  async createCategory(payload: Record<string, unknown>) {
    const { data } = await httpBase.post('/categories', payload);
    return data;
  },
  async updateCategory(id: string, payload: Record<string, unknown>) {
    const { data } = await httpBase.put(`/categories/${id}`, payload);
    return data;
  },
  async deleteCategory(id: string) {
    const { data } = await httpBase.delete(`/categories/${id}`);
    return data;
  },

  // Orders
  async getOrders(params?: Record<string, unknown>) {
    const { data } = await httpBase.get('/orders/admin', { params });
    return data;
  },
  async updateOrderStatus(id: string, status: string, paymentStatus?: string, adminNotes?: string) {
    const { data } = await httpBase.patch(`/orders/${id}/status`, { status, paymentStatus, adminNotes });
    return data;
  },

  // Upload
  async uploadImage(file: File): Promise<{ url: string; publicId: string }> {
    const formData = new FormData();
    formData.append('image', file);
    const { data } = await httpBase.post('/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data.data;
  },

  async deleteImage(publicId: string): Promise<void> {
    await httpBase.delete(`/upload/${encodeURIComponent(publicId)}`);
  },

  // Users (owner only)
  async getUsers() {
    const { data } = await httpBase.get('/admin/users');
    return data;
  },
  async createAdminUser(payload: { name: string; email: string; password: string; role: string }) {
    const { data } = await httpBase.post('/admin/users', payload);
    return data;
  },
  async updateUser(id: string, payload: { role?: string; isActive?: boolean }) {
    const { data } = await httpBase.patch(`/admin/users/${id}`, payload);
    return data;
  },
  async deleteUser(id: string) {
    const { data } = await httpBase.delete(`/admin/users/${id}`);
    return data;
  },
};
