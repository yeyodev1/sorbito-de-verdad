import { ref, computed, onMounted } from 'vue';
import { adminService } from '../../../services/admin.service';
import { useUIStore } from '../../../stores/ui';

export interface AdminProductRow {
  _id: string;
  name: string;
  sku?: string;
  price: number;
  stock?: number;
  isActive?: boolean;
  productCollection?: string;
  category?: { name?: string } | string;
  images?: string[];
  mainImage?: string;
}

export const PRODUCT_COLLECTIONS = ['boscan', 'moni', 'rustica', 'set'];

export const COLLECTION_COLORS: Record<string, string> = {
  boscan: 'white',
  moni: 'pink',
  rustica: 'terracota',
  set: 'blue',
};

const PER_PAGE = 15;

/** Listado de productos del admin: carga, filtros, paginación y acciones. */
export function useProductList() {
  const ui = useUIStore();
  const products = ref<AdminProductRow[]>([]);
  const loading = ref(true);
  const searchQuery = ref('');
  const filterCollection = ref('');
  const page = ref(1);

  onMounted(async () => {
    await loadProducts();
  });

  async function loadProducts() {
    loading.value = true;
    try {
      const res = await adminService.getProducts();
      const data = res?.data || res;
      products.value = Array.isArray(data) ? data : (data?.products || []);
    } catch (e) {
      console.error(e);
    } finally {
      loading.value = false;
    }
  }

  const filtered = computed(() => {
    let list = products.value;
    if (searchQuery.value) {
      const q = searchQuery.value.toLowerCase();
      list = list.filter((p) => p.name.toLowerCase().includes(q) || p.sku?.toLowerCase().includes(q));
    }
    if (filterCollection.value) {
      list = list.filter((p) => p.productCollection === filterCollection.value);
    }
    return list;
  });

  const paginated = computed(() => {
    const start = (page.value - 1) * PER_PAGE;
    return filtered.value.slice(start, start + PER_PAGE);
  });

  const totalPages = computed(() => Math.ceil(filtered.value.length / PER_PAGE));

  async function toggleActive(product: AdminProductRow) {
    try {
      await adminService.updateProduct(product._id, { isActive: !product.isActive });
      product.isActive = !product.isActive;
      ui.success(product.isActive ? 'Producto activado' : 'Producto desactivado');
    } catch (e: unknown) {
      const err = e as { response?: { data?: { message?: string } }; message?: string };
      ui.error(err?.response?.data?.message || 'Error al cambiar estado del producto');
    }
  }

  async function deleteProduct(id: string): Promise<boolean> {
    try {
      await adminService.deleteProduct(id);
      products.value = products.value.filter((p) => p._id !== id);
      ui.success('Producto eliminado correctamente');
      return true;
    } catch (e: unknown) {
      const err = e as { response?: { data?: { message?: string } }; message?: string };
      ui.error(err?.response?.data?.message || 'Error al eliminar el producto');
      return false;
    }
  }

  return {
    loading,
    searchQuery,
    filterCollection,
    page,
    filtered,
    paginated,
    totalPages,
    toggleActive,
    deleteProduct,
  };
}
