export interface Product {
  _id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  price: number;
  compareAtPrice?: number;
  mainImage: string;
  images: string[];
  category: Category | string;
  collection: 'boscan' | 'moni' | 'rustica' | 'set';
  stock: number;
  isActive: boolean;
  isFeatured: boolean;
  tags: string[];
  sku: string;
  createdAt: string;
}

export interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'admin' | 'customer' | 'owner';
}

export interface Order {
  _id: string;
  orderNumber: string;
  items: Array<{
    product: string;
    name: string;
    image: string;
    quantity: number;
    price: number;
  }>;
  subtotal: number;
  shipping: number;
  total: number;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  shippingAddress: {
    name: string;
    phone: string;
    street: string;
    city: string;
    country: string;
  };
  createdAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface ApiError {
  status: number;
  message: string;
  data?: unknown;
}
