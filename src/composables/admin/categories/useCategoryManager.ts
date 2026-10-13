import { ref, onMounted } from 'vue';
import { adminService } from '../../../services/admin.service';
import { useUIStore } from '../../../stores/ui';

export interface AdminCategoryRow {
  _id: string;
  name: string;
  slug?: string;
  description?: string;
  isActive?: boolean;
}

export interface CategoryFormState {
  name: string;
  slug: string;
  description: string;
  isActive: boolean;
}

type ApiErr = { response?: { data?: { message?: string } }; message?: string };

export function generateSlug(name: string) {
  return name
    .toLowerCase()
    .replace(/[áàä]/g, 'a')
    .replace(/[éèë]/g, 'e')
    .replace(/[íìï]/g, 'i')
    .replace(/[óòö]/g, 'o')
    .replace(/[úùü]/g, 'u')
    .replace(/ñ/g, 'n')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

/** CRUD de categorías del admin con el estado de los modales. */
export function useCategoryManager() {
  const ui = useUIStore();

  const categories = ref<AdminCategoryRow[]>([]);
  const loading = ref(true);
  const showModal = ref(false);
  const editingCategory = ref<AdminCategoryRow | null>(null);
  const saving = ref(false);
  const deleteConfirmId = ref<string | null>(null);

  const form = ref<CategoryFormState>({
    name: '',
    slug: '',
    description: '',
    isActive: true,
  });

  onMounted(async () => {
    await loadCategories();
  });

  async function loadCategories() {
    loading.value = true;
    try {
      const res = await adminService.getCategories();
      const data = res?.data || res;
      categories.value = Array.isArray(data) ? data : (data?.categories || []);
    } catch (e) {
      console.error(e);
      ui.error('Error al cargar las categorías');
    } finally {
      loading.value = false;
    }
  }

  function openCreate() {
    editingCategory.value = null;
    form.value = { name: '', slug: '', description: '', isActive: true };
    showModal.value = true;
  }

  function openEdit(cat: AdminCategoryRow) {
    editingCategory.value = cat;
    form.value = {
      name: cat.name,
      slug: cat.slug || '',
      description: cat.description || '',
      isActive: cat.isActive !== false,
    };
    showModal.value = true;
  }

  function closeModal() {
    showModal.value = false;
    editingCategory.value = null;
  }

  function onNameInput() {
    if (!editingCategory.value) {
      form.value.slug = generateSlug(form.value.name);
    }
  }

  async function handleSave() {
    if (!form.value.name.trim()) return;

    saving.value = true;
    try {
      const payload = { ...form.value };

      if (editingCategory.value) {
        await adminService.updateCategory(editingCategory.value._id, payload);
        const idx = categories.value.findIndex((c) => c._id === editingCategory.value!._id);
        if (idx !== -1) {
          categories.value[idx] = { ...categories.value[idx], ...payload } as AdminCategoryRow;
        }
        ui.success('Categoría actualizada');
      } else {
        const res = await adminService.createCategory(payload);
        const newCat = res?.data || res;
        categories.value.push(newCat);
        ui.success('Categoría creada');
      }
      closeModal();
      await loadCategories();
    } catch (e: unknown) {
      const err = e as ApiErr;
      ui.error(err?.response?.data?.message || err?.message || 'Error al guardar la categoría');
    } finally {
      saving.value = false;
    }
  }

  async function toggleActive(cat: AdminCategoryRow) {
    try {
      await adminService.updateCategory(cat._id, { isActive: !cat.isActive });
      cat.isActive = !cat.isActive;
      ui.success(cat.isActive ? 'Categoría activada' : 'Categoría desactivada');
    } catch (e: unknown) {
      const err = e as ApiErr;
      ui.error(err?.response?.data?.message || 'Error al cambiar estado');
    }
  }

  async function deleteCategory(id: string) {
    try {
      await adminService.deleteCategory(id);
      categories.value = categories.value.filter((c) => c._id !== id);
      deleteConfirmId.value = null;
      ui.success('Categoría eliminada');
    } catch (e: unknown) {
      const err = e as ApiErr;
      ui.error(err?.response?.data?.message || 'Error al eliminar la categoría');
    }
  }

  return {
    categories,
    loading,
    showModal,
    editingCategory,
    saving,
    deleteConfirmId,
    form,
    openCreate,
    openEdit,
    closeModal,
    onNameInput,
    handleSave,
    toggleActive,
    deleteCategory,
  };
}
