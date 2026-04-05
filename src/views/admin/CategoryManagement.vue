<script setup lang="ts">
import { ref, onMounted } from 'vue';
import AdminLayout from '../../layout/AdminLayout.vue';
import { adminService } from '../../services/admin.service';
import { useUIStore } from '../../stores/ui';

const ui = useUIStore();

interface Category {
  _id: string;
  name: string;
  slug?: string;
  description?: string;
  isActive?: boolean;
}

const categories = ref<Category[]>([]);
const loading = ref(true);
const showModal = ref(false);
const editingCategory = ref<Category | null>(null);
const saving = ref(false);
const deleteConfirmId = ref<string | null>(null);

const form = ref({
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

function openEdit(cat: Category) {
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

function generateSlug(name: string) {
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
        categories.value[idx] = { ...categories.value[idx], ...payload } as Category;
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
    const err = e as { response?: { data?: { message?: string } }; message?: string };
    ui.error(err?.response?.data?.message || err?.message || 'Error al guardar la categoría');
  } finally {
    saving.value = false;
  }
}

async function toggleActive(cat: Category) {
  try {
    await adminService.updateCategory(cat._id, { isActive: !cat.isActive });
    cat.isActive = !cat.isActive;
    ui.success(cat.isActive ? 'Categoría activada' : 'Categoría desactivada');
  } catch (e: unknown) {
    const err = e as { response?: { data?: { message?: string } }; message?: string };
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
    const err = e as { response?: { data?: { message?: string } }; message?: string };
    ui.error(err?.response?.data?.message || 'Error al eliminar la categoría');
  }
}
</script>

<template>
  <AdminLayout title="Categorías">
    <!-- Toolbar -->
    <div class="cm__toolbar">
      <h2 class="cm__count">{{ categories.length }} categoría(s)</h2>
      <button class="btn-primary" @click="openCreate">
        <i class="fa-solid fa-plus"></i>
        Nueva Categoría
      </button>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="admin-card">
      <div v-for="n in 5" :key="n" class="cm__skeleton-row"></div>
    </div>

    <!-- Empty state -->
    <div v-else-if="categories.length === 0" class="cm__empty">
      <i class="fa-solid fa-tag"></i>
      <p>No hay categorías creadas</p>
      <button class="btn-primary" @click="openCreate">
        <i class="fa-solid fa-plus"></i> Crear primera categoría
      </button>
    </div>

    <!-- Table -->
    <div v-else class="admin-card">
      <div class="cm__table-wrap">
        <table class="admin-table">
          <thead>
            <tr>
              <th style="padding-left: 1.5rem;">Nombre</th>
              <th>Slug</th>
              <th>Descripción</th>
              <th>Estado</th>
              <th style="text-align: right; padding-right: 1.5rem;">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="cat in categories" :key="cat._id">
              <td style="padding-left: 1.5rem;">
                <span class="cm__cat-name">{{ cat.name }}</span>
              </td>
              <td>
                <code class="cm__slug">{{ cat.slug || '—' }}</code>
              </td>
              <td>
                <span class="cm__description">{{ cat.description || '—' }}</span>
              </td>
              <td>
                <span :class="['status-badge', cat.isActive !== false ? 'status-badge--success' : 'status-badge--error']">
                  {{ cat.isActive !== false ? 'Activa' : 'Inactiva' }}
                </span>
              </td>
              <td style="text-align: right; padding-right: 1.5rem;">
                <div class="cm__actions">
                  <button class="cm__action-btn cm__action-btn--edit" title="Editar" @click="openEdit(cat)">
                    <i class="fa-solid fa-pencil"></i>
                  </button>
                  <button
                    :class="['cm__action-btn', cat.isActive !== false ? 'cm__action-btn--deactivate' : 'cm__action-btn--activate']"
                    :title="cat.isActive !== false ? 'Desactivar' : 'Activar'"
                    @click="toggleActive(cat)"
                  >
                    <i :class="['fa-solid', cat.isActive !== false ? 'fa-eye-slash' : 'fa-eye']"></i>
                  </button>
                  <button class="cm__action-btn cm__action-btn--delete" title="Eliminar" @click="deleteConfirmId = cat._id">
                    <i class="fa-solid fa-trash"></i>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Create/Edit Modal -->
    <Transition name="fade">
      <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
        <div class="modal-box">
          <div class="modal-box__header">
            <h3 class="modal-box__title">{{ editingCategory ? 'Editar Categoría' : 'Nueva Categoría' }}</h3>
            <button class="modal-box__close" @click="closeModal">
              <i class="fa-solid fa-xmark"></i>
            </button>
          </div>

          <form @submit.prevent="handleSave" class="modal-box__form">
            <div class="pf__field">
              <label class="pf__label">Nombre <span style="color: #EF4444;">*</span></label>
              <input
                v-model="form.name"
                type="text"
                class="pf__input"
                placeholder="Tazas de Cerámica..."
                required
                @input="onNameInput"
              />
            </div>

            <div class="pf__field">
              <label class="pf__label">Slug</label>
              <input
                v-model="form.slug"
                type="text"
                class="pf__input"
                placeholder="tazas-ceramica"
              />
              <span class="pf__hint-text">Se genera automáticamente desde el nombre</span>
            </div>

            <div class="pf__field">
              <label class="pf__label">Descripción</label>
              <textarea
                v-model="form.description"
                class="pf__input pf__textarea"
                placeholder="Descripción de la categoría..."
                rows="3"
              ></textarea>
            </div>

            <div class="pf__toggle-row">
              <div class="pf__toggle-info">
                <span class="pf__toggle-label">Categoría Activa</span>
              </div>
              <button
                type="button"
                :class="['pf__toggle', { 'pf__toggle--on': form.isActive }]"
                @click="form.isActive = !form.isActive"
              >
                <span class="pf__toggle-thumb"></span>
              </button>
            </div>

            <div class="modal-box__actions">
              <button type="button" class="btn-outline" @click="closeModal">Cancelar</button>
              <button type="submit" class="btn-primary" :disabled="saving">
                <i v-if="saving" class="fa-solid fa-spinner fa-spin"></i>
                <i v-else class="fa-solid fa-floppy-disk"></i>
                {{ saving ? 'Guardando...' : (editingCategory ? 'Guardar Cambios' : 'Crear Categoría') }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Transition>

    <!-- Delete Confirm Modal -->
    <Transition name="fade">
      <div v-if="deleteConfirmId" class="modal-overlay" @click.self="deleteConfirmId = null">
        <div class="modal-box modal-box--sm">
          <div class="modal-box__icon">
            <i class="fa-solid fa-triangle-exclamation"></i>
          </div>
          <h3 class="modal-box__title" style="text-align: center;">¿Eliminar categoría?</h3>
          <p class="modal-box__text">Esta acción no se puede deshacer.</p>
          <div class="modal-box__actions">
            <button class="btn-outline" @click="deleteConfirmId = null">Cancelar</button>
            <button class="btn-danger" @click="deleteCategory(deleteConfirmId!)">Sí, eliminar</button>
          </div>
        </div>
      </div>
    </Transition>
  </AdminLayout>
</template>

<style lang="scss" scoped>

.cm {
  &__toolbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    margin-bottom: 1.25rem;
  }

  &__count {
    font-size: 0.9375rem;
    color: $admin-text-muted;
    font-weight: 500;
    margin: 0;
  }

  &__skeleton-row {
    height: 56px;
    border-bottom: 1px solid $admin-border;
    background: linear-gradient(90deg, $admin-border 25%, lighten(#2A2A2A, 5%) 50%, $admin-border 75%);
    background-size: 200% 100%;
    animation: shimmer 1.5s infinite;

    &:last-child { border-bottom: none; }
  }

  &__empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    padding: 4rem 2rem;
    color: $admin-text-muted;
    background-color: $admin-card;
    border: 1px solid $admin-border;
    border-radius: 12px;

    i {
      font-size: 3rem;
      opacity: 0.4;
    }

    p {
      font-size: 1rem;
      margin: 0;
    }
  }

  &__table-wrap {
    overflow-x: auto;
  }

  &__cat-name {
    font-size: 0.9375rem;
    font-weight: 600;
    color: $admin-text;
  }

  &__slug {
    font-family: monospace;
    font-size: 0.8125rem;
    color: $admin-text-muted;
    background-color: $admin-sidebar-active;
    padding: 0.125rem 0.375rem;
    border-radius: 4px;
  }

  &__description {
    font-size: 0.875rem;
    color: $admin-text-muted;
    max-width: 300px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    display: block;
  }

  &__actions {
    display: flex;
    align-items: center;
    gap: 0.375rem;
    justify-content: flex-end;
  }

  &__action-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.15s ease;
    font-size: 0.875rem;
    border: 1px solid $admin-border;
    background-color: $admin-sidebar-hover;
    color: $admin-text-muted;

    &--edit:hover { border-color: $admin-accent; color: $admin-accent; }
    &--activate:hover, &--deactivate:hover { border-color: $admin-info; color: $admin-info; }
    &--delete:hover { border-color: $admin-error; color: $admin-error; background-color: rgba($admin-error, 0.1); }
  }
}

.admin-card {
  background-color: $admin-card;
  border: 1px solid $admin-border;
  border-radius: 12px;
  overflow: hidden;
}

.admin-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.875rem;

  thead tr th {
    background-color: $admin-sidebar-active;
    color: $admin-text-muted;
    text-transform: uppercase;
    font-size: 0.75rem;
    letter-spacing: 0.06em;
    font-weight: 600;
    padding: 0.75rem 1rem;
    text-align: left;
  }

  tbody tr {
    border-bottom: 1px solid $admin-border;
    transition: background-color 0.15s ease;

    &:last-child { border-bottom: none; }
    &:hover { background-color: $admin-sidebar-hover; }

    td {
      padding: 0.875rem 1rem;
      color: $admin-text;
    }
  }
}

.status-badge {
  display: inline-flex;
  padding: 0.2rem 0.6rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 600;

  &--success { background-color: rgba($admin-success, 0.15); color: $admin-success; }
  &--error { background-color: rgba($admin-error, 0.15); color: $admin-error; }
}

// Buttons
.btn-primary {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 1.25rem;
  background-color: $admin-accent;
  color: #fff;
  border-radius: 8px;
  font-size: 0.9375rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s ease;
  font-family: 'Inter', sans-serif;
  border: none;

  &:hover:not(:disabled) { background-color: darken(#C8956C, 8%); }
  &:disabled { opacity: 0.6; cursor: not-allowed; }
}

.btn-outline {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 1.25rem;
  background-color: transparent;
  color: $admin-text-muted;
  border: 1px solid $admin-border;
  border-radius: 8px;
  font-size: 0.9375rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s ease;
  font-family: 'Inter', sans-serif;

  &:hover { border-color: $admin-text; color: $admin-text; }
}

.btn-danger {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 1.25rem;
  background-color: $admin-error;
  color: #fff;
  border-radius: 8px;
  font-size: 0.9375rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s ease;
  font-family: 'Inter', sans-serif;
  border: none;

  &:hover { background-color: darken(#EF4444, 8%); }
}

// Modal
.modal-overlay {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 200;
  padding: 1rem;
}

.modal-box {
  background-color: $admin-card;
  border: 1px solid $admin-border;
  border-radius: 16px;
  padding: 1.5rem;
  max-width: 480px;
  width: 100%;

  &--sm {
    max-width: 380px;
    text-align: center;
  }

  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 1.25rem;
  }

  &__title {
    font-size: 1.125rem;
    font-weight: 700;
    color: $admin-text;
    margin: 0 0 0.375rem;
  }

  &__close {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    border-radius: 6px;
    border: 1px solid $admin-border;
    background-color: $admin-sidebar-hover;
    color: $admin-text-muted;
    cursor: pointer;
    transition: all 0.15s ease;

    &:hover { color: $admin-text; }
  }

  &__icon {
    width: 56px;
    height: 56px;
    border-radius: 50%;
    background-color: rgba($admin-error, 0.15);
    color: $admin-error;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.5rem;
    margin: 0 auto 1.25rem;
  }

  &__text {
    color: $admin-text-muted;
    font-size: 0.9375rem;
    margin: 0 0 1.5rem;
  }

  &__form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  &__actions {
    display: flex;
    gap: 0.75rem;
    justify-content: flex-end;
    margin-top: 0.5rem;
  }
}

// Form elements
.pf {
  &__field {
    display: flex;
    flex-direction: column;
    gap: 0.375rem;
  }

  &__label {
    font-size: 0.8125rem;
    font-weight: 500;
    color: $admin-text-muted;
    text-transform: uppercase;
    letter-spacing: 0.06em;
  }

  &__input {
    padding: 0.625rem 0.875rem;
    background-color: $admin-sidebar-active;
    border: 1px solid $admin-border;
    border-radius: 8px;
    color: $admin-text;
    font-size: 0.9375rem;
    font-family: 'Inter', sans-serif;
    width: 100%;

    &::placeholder { color: #555; }

    &:focus {
      outline: none;
      border-color: $admin-accent;
      box-shadow: 0 0 0 3px rgba($admin-accent, 0.12);
    }
  }

  &__textarea {
    resize: vertical;
    min-height: 70px;
  }

  &__hint-text {
    font-size: 0.75rem;
    color: $admin-text-muted;
  }

  &__toggle-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    padding: 0.75rem 0;
    border-top: 1px solid $admin-border;
  }

  &__toggle-info {
    display: flex;
    flex-direction: column;
  }

  &__toggle-label {
    font-size: 0.9375rem;
    font-weight: 500;
    color: $admin-text;
  }

  &__toggle {
    width: 44px;
    height: 24px;
    border-radius: 12px;
    background-color: $admin-border;
    border: none;
    cursor: pointer;
    position: relative;
    flex-shrink: 0;
    transition: background-color 0.2s ease;

    &--on { background-color: $admin-accent; }
  }

  &__toggle-thumb {
    position: absolute;
    top: 3px;
    left: 3px;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background-color: #fff;
    transition: transform 0.2s ease;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);

    .pf__toggle--on & { transform: translateX(20px); }
  }
}

.fade-enter-active, .fade-leave-active { transition: opacity 0.2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}
</style>
