import { defineStore } from 'pinia';
import { productService } from '../services/product.service';
import type { Product, Category } from '../types';

interface ProductFilters {
  collection?: string;
  category?: string;
  search?: string;
  sort?: string;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

interface ProductsState {
  products: Product[];
  featured: Product[];
  currentProduct: Product | null;
  categories: Category[];
  loading: boolean;
  error: string | null;
  filters: ProductFilters;
  pagination: Pagination;
}

export const useProductsStore = defineStore('products', {
  state: (): ProductsState => ({
    products: [],
    featured: [],
    currentProduct: null,
    categories: [],
    loading: false,
    error: null,
    filters: {},
    pagination: { page: 1, limit: 12, total: 0, pages: 0 },
  }),

  actions: {
    async fetchProducts(page = 1) {
      this.loading = true;
      this.error = null;
      try {
        const response = await productService.getAll({
          page,
          limit: this.pagination.limit,
          ...this.filters,
        });
        this.products = response.data;
        if (response.pagination) {
          this.pagination = response.pagination;
        }
      } catch (err: unknown) {
        this.error = (err as { message: string })?.message || 'Error al cargar productos';
      } finally {
        this.loading = false;
      }
    },

    async fetchFeatured() {
      this.loading = true;
      try {
        const response = await productService.getAll({ isFeatured: true, limit: 8 });
        this.featured = response.data;
      } catch (err: unknown) {
        this.error = (err as { message: string })?.message || 'Error al cargar destacados';
      } finally {
        this.loading = false;
      }
    },

    async fetchProductBySlug(slug: string) {
      this.loading = true;
      this.error = null;
      this.currentProduct = null;
      try {
        const response = await productService.getBySlug(slug);
        this.currentProduct = response.data;
      } catch (err: unknown) {
        this.error = (err as { message: string })?.message || 'Producto no encontrado';
      } finally {
        this.loading = false;
      }
    },

    async fetchCategories() {
      try {
        const response = await productService.getCategories();
        this.categories = response.data;
      } catch {
        // silent fail
      }
    },

    setFilters(filters: ProductFilters) {
      this.filters = { ...this.filters, ...filters };
      this.pagination.page = 1;
    },

    clearFilters() {
      this.filters = {};
      this.pagination.page = 1;
    },
  },
});
