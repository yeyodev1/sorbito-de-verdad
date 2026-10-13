import { ref, computed, watch, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { adminService } from '../../../services/admin.service';
import { useUIStore } from '../../../stores/ui';
import {
  emptyProductForm,
  generateSku,
  productToForm,
  buildProductPayload,
  sanitizePrice,
  type AdminCategory,
} from './productFormUtils';

export function useProductForm() {
  const ui = useUIStore();
  const route = useRoute();
  const router = useRouter();

  const isEditing = computed(() => !!route.params.id);
  const pageTitle = computed(() => isEditing.value ? 'Editar Producto' : 'Nuevo Producto');

  const saving = ref(false);
  const loadingProduct = ref(false);
  const categories = ref<AdminCategory[]>([]);
  const errorMsg = ref('');
  const successMsg = ref('');
  const skuManuallyEdited = ref(false);
  const form = ref(emptyProductForm());

  // Auto-generate SKU from product name (only when creating, only if not manually edited)
  watch(() => form.value.name, (newName) => {
    if (isEditing.value || skuManuallyEdited.value) return;
    form.value.sku = generateSku(newName);
  });

  onMounted(async () => {
    // Load categories
    try {
      const res = await adminService.getCategories();
      const data = res?.data || res;
      categories.value = Array.isArray(data) ? data : (data?.categories || []);
    } catch (e) {
      console.error('Error loading categories:', e);
    }

    // If editing, load product
    if (isEditing.value) {
      loadingProduct.value = true;
      try {
        const res = await adminService.getProducts({ id: route.params.id as string });
        const products = res?.data || res;
        const arr = Array.isArray(products) ? products : (products?.products || []);
        const product = arr.find((p: { _id: string }) => p._id === route.params.id) || arr[0];
        if (product) form.value = productToForm(product);
      } catch (e) {
        console.error(e);
      } finally {
        loadingProduct.value = false;
      }
    }
  });

  async function handleSubmit() {
    const priceNum = sanitizePrice(String(form.value.price));
    if (!form.value.name || !form.value.sku || priceNum <= 0) {
      ui.error('Por favor completa los campos requeridos: nombre, SKU y precio.');
      return;
    }
    if (!form.value.productCollection) {
      ui.error('Por favor selecciona una colección para el producto.');
      return;
    }

    saving.value = true;
    errorMsg.value = '';
    successMsg.value = '';

    const payload = buildProductPayload(form.value, priceNum);

    try {
      if (isEditing.value) {
        await adminService.updateProduct(route.params.id as string, payload);
        ui.success('Producto actualizado exitosamente');
      } else {
        await adminService.createProduct(payload);
        ui.success('Producto creado exitosamente');
      }
      setTimeout(() => router.push('/admin/productos'), 1200);
    } catch (e: unknown) {
      const err = e as { response?: { data?: { message?: string } }; message?: string };
      ui.error(err?.response?.data?.message || err?.message || 'Error al guardar el producto.');
    } finally {
      saving.value = false;
    }
  }

  return {
    router,
    isEditing,
    pageTitle,
    saving,
    loadingProduct,
    categories,
    errorMsg,
    successMsg,
    skuManuallyEdited,
    form,
    handleSubmit,
  };
}
