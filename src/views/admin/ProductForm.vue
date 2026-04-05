<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import AdminLayout from '../../layout/AdminLayout.vue';
import { adminService } from '../../services/admin.service';

interface Category {
  _id: string;
  name: string;
}

interface ImageItem {
  url: string;
  publicId?: string;
}

const route = useRoute();
const router = useRouter();

const isEditing = computed(() => !!route.params.id);
const pageTitle = computed(() => isEditing.value ? 'Editar Producto' : 'Nuevo Producto');

const saving = ref(false);
const loadingProduct = ref(false);
const categories = ref<Category[]>([]);
const uploadingImages = ref(false);
const uploadProgress = ref(0);
const errorMsg = ref('');
const successMsg = ref('');
const isDragOver = ref(false);
const fileInputRef = ref<HTMLInputElement | null>(null);

const form = ref({
  name: '',
  shortDescription: '',
  description: '',
  sku: '',
  price: 0,
  compareAtPrice: 0,
  stock: 0,
  category: '',
  productCollection: '',
  tags: [] as string[],
  isFeatured: false,
  isActive: true,
  images: [] as ImageItem[],
  mainImage: '',
});

const tagInput = ref('');
const collections = ['boscan', 'moni', 'rustica', 'set'];

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
      if (product) {
        form.value = {
          name: product.name || '',
          shortDescription: product.shortDescription || '',
          description: product.description || '',
          sku: product.sku || '',
          price: product.price || 0,
          compareAtPrice: product.compareAtPrice || 0,
          stock: product.stock || 0,
          category: typeof product.category === 'object' ? product.category?._id : product.category || '',
          productCollection: product.productCollection || '',
          tags: product.tags || [],
          isFeatured: product.isFeatured || false,
          isActive: product.isActive !== false,
          images: (product.images || []).map((img: string | ImageItem) =>
            typeof img === 'string' ? { url: img } : img
          ),
          mainImage: product.mainImage || '',
        };
      }
    } catch (e) {
      console.error(e);
    } finally {
      loadingProduct.value = false;
    }
  }
});

function addTag() {
  const tag = tagInput.value.trim();
  if (tag && !form.value.tags.includes(tag)) {
    form.value.tags.push(tag);
  }
  tagInput.value = '';
}

function removeTag(index: number) {
  form.value.tags.splice(index, 1);
}

function handleTagKeydown(e: KeyboardEvent) {
  if (e.key === 'Enter') {
    e.preventDefault();
    addTag();
  }
}

function onDragOver(e: DragEvent) {
  e.preventDefault();
  isDragOver.value = true;
}

function onDragLeave() {
  isDragOver.value = false;
}

function onDrop(e: DragEvent) {
  e.preventDefault();
  isDragOver.value = false;
  const files = e.dataTransfer?.files;
  if (files) handleFiles(files);
}

function onFileSelect(e: Event) {
  const input = e.target as HTMLInputElement;
  if (input.files) handleFiles(input.files);
}

async function handleFiles(files: FileList) {
  const validFiles = Array.from(files).filter((f) =>
    f.type.startsWith('image/') && f.size <= 10 * 1024 * 1024
  );

  if (validFiles.length === 0) return;

  uploadingImages.value = true;
  uploadProgress.value = 0;

  for (let i = 0; i < validFiles.length; i++) {
    const file = validFiles[i];
    if (!file) continue;
    try {
      const result = await adminService.uploadImage(file);
      form.value.images.push({ url: result.url, publicId: result.publicId });
      if (form.value.images.length === 1) {
        form.value.mainImage = result.url;
      }
      uploadProgress.value = Math.round(((i + 1) / validFiles.length) * 100);
    } catch (e) {
      console.error('Upload error:', e);
    }
  }

  uploadingImages.value = false;
  uploadProgress.value = 0;
  if (fileInputRef.value) fileInputRef.value.value = '';
}

function removeImage(index: number) {
  const removed = form.value.images[index];
  form.value.images.splice(index, 1);
  if (removed && form.value.mainImage === removed.url) {
    form.value.mainImage = form.value.images[0]?.url || '';
  }
}

function setMainImage(url: string) {
  form.value.mainImage = url;
}

async function handleSubmit() {
  if (!form.value.name || !form.value.sku || form.value.price <= 0) {
    errorMsg.value = 'Por favor completa los campos requeridos: nombre, SKU y precio.';
    return;
  }

  saving.value = true;
  errorMsg.value = '';
  successMsg.value = '';

  const payload = {
    ...form.value,
    images: form.value.images.map((img) => img.url),
  };

  try {
    if (isEditing.value) {
      await adminService.updateProduct(route.params.id as string, payload);
      successMsg.value = 'Producto actualizado exitosamente.';
    } else {
      await adminService.createProduct(payload);
      successMsg.value = 'Producto creado exitosamente.';
    }
    setTimeout(() => router.push('/admin/productos'), 1200);
  } catch (e: unknown) {
    const err = e as { response?: { data?: { message?: string } }; message?: string };
    errorMsg.value = err?.response?.data?.message || err?.message || 'Error al guardar el producto.';
  } finally {
    saving.value = false;
  }
}
</script>

<template>
  <AdminLayout :title="pageTitle">
    <!-- Breadcrumb -->
    <div class="pf__breadcrumb">
      <RouterLink to="/admin" class="pf__breadcrumb-link">Admin</RouterLink>
      <i class="fa-solid fa-chevron-right pf__breadcrumb-sep"></i>
      <RouterLink to="/admin/productos" class="pf__breadcrumb-link">Productos</RouterLink>
      <i class="fa-solid fa-chevron-right pf__breadcrumb-sep"></i>
      <span class="pf__breadcrumb-current">{{ isEditing ? 'Editar' : 'Nuevo' }}</span>
    </div>

    <!-- Loading state -->
    <div v-if="loadingProduct" class="pf__loading">
      <i class="fa-solid fa-spinner fa-spin"></i>
      <span>Cargando producto...</span>
    </div>

    <!-- Form -->
    <form v-else @submit.prevent="handleSubmit" class="pf__form">
      <!-- Error/Success alerts -->
      <div v-if="errorMsg" class="pf__alert pf__alert--error">
        <i class="fa-solid fa-circle-exclamation"></i>
        {{ errorMsg }}
      </div>
      <div v-if="successMsg" class="pf__alert pf__alert--success">
        <i class="fa-solid fa-circle-check"></i>
        {{ successMsg }}
      </div>

      <div class="pf__layout">
        <!-- Left column -->
        <div class="pf__left">
          <!-- Basic Info -->
          <div class="pf__card">
            <h3 class="pf__card-title">Información Básica</h3>
            <div class="pf__fields">
              <div class="pf__field">
                <label class="pf__label">Nombre del Producto <span class="pf__required">*</span></label>
                <input v-model="form.name" type="text" class="pf__input" placeholder="Taza Artesanal Boscan..." required />
              </div>

              <div class="pf__field">
                <label class="pf__label">
                  Descripción Corta
                  <span class="pf__char-count">{{ form.shortDescription.length }}/160</span>
                </label>
                <textarea
                  v-model="form.shortDescription"
                  class="pf__input pf__textarea pf__textarea--sm"
                  placeholder="Descripción breve para tarjetas de producto..."
                  maxlength="160"
                  rows="3"
                ></textarea>
              </div>

              <div class="pf__field">
                <label class="pf__label">Descripción Completa</label>
                <textarea
                  v-model="form.description"
                  class="pf__input pf__textarea"
                  placeholder="Descripción detallada del producto..."
                  rows="6"
                ></textarea>
              </div>

              <div class="pf__field">
                <label class="pf__label">SKU <span class="pf__required">*</span></label>
                <input v-model="form.sku" type="text" class="pf__input" placeholder="SDV-001" required />
              </div>
            </div>
          </div>

          <!-- Pricing & Stock -->
          <div class="pf__card">
            <h3 class="pf__card-title">Precio & Stock</h3>
            <div class="pf__fields pf__fields--grid">
              <div class="pf__field">
                <label class="pf__label">Precio <span class="pf__required">*</span></label>
                <div class="pf__input-prefix">
                  <span class="pf__prefix">$</span>
                  <input v-model.number="form.price" type="number" min="0" step="0.01" class="pf__input pf__input--prefixed" required />
                </div>
              </div>
              <div class="pf__field">
                <label class="pf__label">Precio Comparar <span class="pf__hint">(tachado)</span></label>
                <div class="pf__input-prefix">
                  <span class="pf__prefix">$</span>
                  <input v-model.number="form.compareAtPrice" type="number" min="0" step="0.01" class="pf__input pf__input--prefixed" />
                </div>
              </div>
              <div class="pf__field">
                <label class="pf__label">Stock</label>
                <input v-model.number="form.stock" type="number" min="0" class="pf__input" />
              </div>
            </div>
          </div>

          <!-- Classification -->
          <div class="pf__card">
            <h3 class="pf__card-title">Clasificación</h3>
            <div class="pf__fields">
              <div class="pf__fields--grid">
                <div class="pf__field">
                  <label class="pf__label">Categoría</label>
                  <select v-model="form.category" class="pf__input pf__select">
                    <option value="">Sin categoría</option>
                    <option v-for="cat in categories" :key="cat._id" :value="cat._id">{{ cat.name }}</option>
                  </select>
                </div>
                <div class="pf__field">
                  <label class="pf__label">Colección</label>
                  <select v-model="form.productCollection" class="pf__input pf__select">
                    <option value="">Sin colección</option>
                    <option v-for="c in collections" :key="c" :value="c">{{ c }}</option>
                  </select>
                </div>
              </div>

              <!-- Tags -->
              <div class="pf__field">
                <label class="pf__label">Tags</label>
                <div class="pf__tags-wrap">
                  <div class="pf__tags-list">
                    <span v-for="(tag, idx) in form.tags" :key="tag" class="pf__tag">
                      {{ tag }}
                      <button type="button" class="pf__tag-remove" @click="removeTag(idx)">
                        <i class="fa-solid fa-xmark"></i>
                      </button>
                    </span>
                  </div>
                  <input
                    v-model="tagInput"
                    type="text"
                    class="pf__input pf__tag-input"
                    placeholder="Añadir tag... (Enter para confirmar)"
                    @keydown="handleTagKeydown"
                    @blur="addTag"
                  />
                </div>
              </div>

              <!-- Toggles -->
              <div class="pf__toggles">
                <div class="pf__toggle-row">
                  <div class="pf__toggle-info">
                    <span class="pf__toggle-label">Producto Destacado</span>
                    <span class="pf__toggle-sub">Aparece en la sección destacados del inicio</span>
                  </div>
                  <button
                    type="button"
                    :class="['pf__toggle', { 'pf__toggle--on': form.isFeatured }]"
                    @click="form.isFeatured = !form.isFeatured"
                    :aria-checked="form.isFeatured"
                    role="switch"
                  >
                    <span class="pf__toggle-thumb"></span>
                  </button>
                </div>
                <div class="pf__toggle-row">
                  <div class="pf__toggle-info">
                    <span class="pf__toggle-label">Producto Activo</span>
                    <span class="pf__toggle-sub">Visible en la tienda para los clientes</span>
                  </div>
                  <button
                    type="button"
                    :class="['pf__toggle', { 'pf__toggle--on': form.isActive }]"
                    @click="form.isActive = !form.isActive"
                    :aria-checked="form.isActive"
                    role="switch"
                  >
                    <span class="pf__toggle-thumb"></span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Right column — Images -->
        <div class="pf__right">
          <div class="pf__card pf__card--sticky">
            <h3 class="pf__card-title">Imágenes del Producto</h3>

            <!-- Drop Zone -->
            <div
              :class="['pf__dropzone', { 'pf__dropzone--over': isDragOver }]"
              @dragover="onDragOver"
              @dragleave="onDragLeave"
              @drop="onDrop"
              @click="fileInputRef?.click()"
            >
              <i class="fa-solid fa-cloud-arrow-up pf__dropzone-icon"></i>
              <p class="pf__dropzone-text">Arrastra tus imágenes aquí<br />o haz clic para seleccionar</p>
              <p class="pf__dropzone-sub">PNG, JPG, WEBP — máx. 10MB por imagen</p>
              <input
                ref="fileInputRef"
                type="file"
                accept="image/*"
                multiple
                hidden
                @change="onFileSelect"
              />
            </div>

            <!-- Upload Progress -->
            <div v-if="uploadingImages" class="pf__upload-progress">
              <div class="pf__upload-progress-bar">
                <div class="pf__upload-progress-fill" :style="{ width: `${uploadProgress}%` }"></div>
              </div>
              <span class="pf__upload-progress-text">Subiendo... {{ uploadProgress }}%</span>
            </div>

            <!-- Images Preview -->
            <div v-if="form.images.length > 0" class="pf__images-grid">
              <div
                v-for="(img, idx) in form.images"
                :key="img.url"
                :class="['pf__image-item', { 'pf__image-item--main': img.url === form.mainImage }]"
                @click="setMainImage(img.url)"
                title="Clic para usar como imagen principal"
              >
                <img :src="img.url" :alt="`Imagen ${idx + 1}`" class="pf__image-thumb" />
                <div class="pf__image-overlay">
                  <span v-if="img.url === form.mainImage" class="pf__image-main-badge">Principal</span>
                </div>
                <button
                  type="button"
                  class="pf__image-remove"
                  @click.stop="removeImage(idx)"
                  title="Eliminar imagen"
                >
                  <i class="fa-solid fa-xmark"></i>
                </button>
              </div>
            </div>

            <p v-if="form.images.length > 0" class="pf__images-hint">
              <i class="fa-solid fa-circle-info"></i>
              Haz clic en una imagen para usarla como imagen principal
            </p>
          </div>
        </div>
      </div>

      <!-- Form Actions -->
      <div class="pf__actions">
        <button type="button" class="btn-outline" @click="router.push('/admin/productos')">
          <i class="fa-solid fa-xmark"></i>
          Cancelar
        </button>
        <button type="submit" class="btn-primary" :disabled="saving">
          <i v-if="saving" class="fa-solid fa-spinner fa-spin"></i>
          <i v-else class="fa-solid fa-floppy-disk"></i>
          {{ saving ? 'Guardando...' : 'Guardar Producto' }}
        </button>
      </div>
    </form>
  </AdminLayout>
</template>

<style lang="scss" scoped>
@use '../../styles/colorVariables.module.scss' as *;

.pf {
  &__breadcrumb {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 1.5rem;
    font-size: 0.875rem;
  }

  &__breadcrumb-link {
    color: $admin-text-muted;
    text-decoration: none;

    &:hover {
      color: $admin-text;
    }
  }

  &__breadcrumb-sep {
    color: $admin-text-muted;
    font-size: 0.625rem;
  }

  &__breadcrumb-current {
    color: $admin-accent;
    font-weight: 500;
  }

  &__loading {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 3rem;
    color: $admin-text-muted;
    justify-content: center;
    font-size: 1rem;

    i {
      font-size: 1.5rem;
      color: $admin-accent;
    }
  }

  &__form {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  &__alert {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 1rem 1.25rem;
    border-radius: 10px;
    font-size: 0.9375rem;

    &--error {
      background-color: rgba($admin-error, 0.12);
      border: 1px solid rgba($admin-error, 0.3);
      color: $admin-error;
    }

    &--success {
      background-color: rgba($admin-success, 0.12);
      border: 1px solid rgba($admin-success, 0.3);
      color: $admin-success;
    }
  }

  &__layout {
    display: grid;
    grid-template-columns: 1fr 380px;
    gap: 1.5rem;

    @media (max-width: 1100px) {
      grid-template-columns: 1fr;
    }
  }

  &__left,
  &__right {
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
  }

  &__card {
    background-color: $admin-card;
    border: 1px solid $admin-border;
    border-radius: 12px;
    padding: 1.5rem;

    &--sticky {
      position: sticky;
      top: 1.5rem;
    }
  }

  &__card-title {
    font-size: 0.9375rem;
    font-weight: 600;
    color: $admin-text;
    margin: 0 0 1.25rem;
    padding-bottom: 0.875rem;
    border-bottom: 1px solid $admin-border;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    font-size: 0.8125rem;
    color: $admin-text-muted;
  }

  &__fields {
    display: flex;
    flex-direction: column;
    gap: 1rem;

    &--grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 1rem;

      @media (max-width: 600px) {
        grid-template-columns: 1fr;
      }
    }
  }

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
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  &__required {
    color: $admin-error;
    margin-left: 0.25rem;
  }

  &__hint {
    color: $admin-text-muted;
    font-size: 0.75rem;
    font-weight: 400;
    text-transform: none;
    letter-spacing: 0;
    margin-left: 0.25rem;
  }

  &__char-count {
    font-size: 0.75rem;
    color: $admin-text-muted;
    text-transform: none;
    letter-spacing: 0;
  }

  &__input {
    padding: 0.625rem 0.875rem;
    background-color: $admin-sidebar-active;
    border: 1px solid $admin-border;
    border-radius: 8px;
    color: $admin-text;
    font-size: 0.9375rem;
    font-family: 'Inter', sans-serif;
    transition: border-color 0.15s ease, box-shadow 0.15s ease;
    width: 100%;

    &::placeholder {
      color: #555;
    }

    &:focus {
      outline: none;
      border-color: $admin-accent;
      box-shadow: 0 0 0 3px rgba($admin-accent, 0.12);
    }

    &-prefix {
      display: flex;
      align-items: center;
      position: relative;
    }

    &--prefixed {
      padding-left: 1.875rem;
    }
  }

  &__prefix {
    position: absolute;
    left: 0.875rem;
    color: $admin-text-muted;
    font-size: 0.9375rem;
    pointer-events: none;
  }

  &__textarea {
    resize: vertical;
    min-height: 80px;

    &--sm {
      min-height: 70px;
    }
  }

  &__select {
    appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath d='M2 4l4 4 4-4' stroke='%23888' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 0.875rem center;
    padding-right: 2.5rem;
    cursor: pointer;

    option {
      background-color: $admin-card;
    }
  }

  &__tags-wrap {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  &__tags-list {
    display: flex;
    flex-wrap: wrap;
    gap: 0.375rem;
    min-height: 24px;
  }

  &__tag {
    display: inline-flex;
    align-items: center;
    gap: 0.375rem;
    padding: 0.25rem 0.625rem;
    background-color: $admin-accent-dim;
    border: 1px solid rgba($admin-accent, 0.25);
    border-radius: 4px;
    color: $admin-accent;
    font-size: 0.8125rem;
    font-weight: 500;
  }

  &__tag-remove {
    display: flex;
    align-items: center;
    cursor: pointer;
    color: rgba($admin-accent, 0.7);
    font-size: 0.75rem;
    padding: 0;
    background: none;
    border: none;
    line-height: 1;

    &:hover {
      color: $admin-accent;
    }
  }

  &__tag-input {
    min-height: auto;
  }

  &__toggles {
    display: flex;
    flex-direction: column;
    gap: 0;
    border: 1px solid $admin-border;
    border-radius: 8px;
    overflow: hidden;
  }

  &__toggle-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    padding: 0.875rem 1rem;
    border-bottom: 1px solid $admin-border;

    &:last-child {
      border-bottom: none;
    }
  }

  &__toggle-info {
    display: flex;
    flex-direction: column;
    gap: 0.125rem;
  }

  &__toggle-label {
    font-size: 0.9375rem;
    font-weight: 500;
    color: $admin-text;
  }

  &__toggle-sub {
    font-size: 0.8125rem;
    color: $admin-text-muted;
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

    &--on {
      background-color: $admin-accent;
    }
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

    .pf__toggle--on & {
      transform: translateX(20px);
    }
  }

  &__dropzone {
    border: 2px dashed $admin-border;
    border-radius: 12px;
    padding: 2rem 1.5rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    cursor: pointer;
    transition: all 0.2s ease;
    margin-bottom: 1rem;

    &:hover,
    &--over {
      border-color: $admin-accent;
      background-color: $admin-accent-dim;
    }
  }

  &__dropzone-icon {
    font-size: 2.5rem;
    color: $admin-text-muted;
    margin-bottom: 0.75rem;

    .pf__dropzone--over & {
      color: $admin-accent;
    }
  }

  &__dropzone-text {
    font-size: 0.9375rem;
    color: $admin-text;
    margin: 0 0 0.375rem;
    line-height: 1.5;
  }

  &__dropzone-sub {
    font-size: 0.8125rem;
    color: $admin-text-muted;
    margin: 0;
  }

  &__upload-progress {
    margin-bottom: 1rem;
    display: flex;
    flex-direction: column;
    gap: 0.375rem;
  }

  &__upload-progress-bar {
    height: 6px;
    background-color: $admin-border;
    border-radius: 3px;
    overflow: hidden;
  }

  &__upload-progress-fill {
    height: 100%;
    background-color: $admin-accent;
    border-radius: 3px;
    transition: width 0.2s ease;
  }

  &__upload-progress-text {
    font-size: 0.8125rem;
    color: $admin-text-muted;
    text-align: center;
  }

  &__images-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 0.5rem;
    margin-bottom: 0.75rem;
  }

  &__image-item {
    position: relative;
    border-radius: 8px;
    overflow: hidden;
    border: 2px solid $admin-border;
    aspect-ratio: 1;
    cursor: pointer;
    transition: border-color 0.15s ease;

    &:hover {
      border-color: $admin-accent;
    }

    &--main {
      border-color: $admin-accent;
    }
  }

  &__image-thumb {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }

  &__image-overlay {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: flex-end;
    padding: 0.375rem;
  }

  &__image-main-badge {
    background-color: $admin-accent;
    color: #fff;
    font-size: 0.625rem;
    font-weight: 700;
    padding: 0.125rem 0.375rem;
    border-radius: 3px;
    text-transform: uppercase;
    letter-spacing: 0.04em;
  }

  &__image-remove {
    position: absolute;
    top: 0.25rem;
    right: 0.25rem;
    width: 22px;
    height: 22px;
    border-radius: 50%;
    background-color: rgba(0, 0, 0, 0.7);
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.625rem;
    cursor: pointer;
    border: none;
    transition: background-color 0.15s ease;

    &:hover {
      background-color: $admin-error;
    }
  }

  &__images-hint {
    font-size: 0.8125rem;
    color: $admin-text-muted;
    display: flex;
    align-items: center;
    gap: 0.375rem;
    margin: 0;

    i {
      color: $admin-info;
    }
  }

  &__actions {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    justify-content: flex-end;
    padding-top: 0.5rem;
    border-top: 1px solid $admin-border;

    @media (max-width: 600px) {
      flex-direction: column;

      .btn-outline, .btn-primary {
        width: 100%;
        justify-content: center;
      }
    }
  }
}

// Shared buttons
.btn-primary {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 1.5rem;
  background-color: $admin-accent;
  color: #fff;
  border-radius: 8px;
  font-size: 0.9375rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s ease;
  font-family: 'Inter', sans-serif;
  border: none;

  &:hover:not(:disabled) {
    background-color: darken(#C8956C, 8%);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
}

.btn-outline {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 1.5rem;
  background-color: transparent;
  color: $admin-text-muted;
  border: 1px solid $admin-border;
  border-radius: 8px;
  font-size: 0.9375rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s ease;
  font-family: 'Inter', sans-serif;

  &:hover {
    border-color: $admin-text;
    color: $admin-text;
  }
}
</style>
