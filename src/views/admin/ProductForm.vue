<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import AdminLayout from '../../layout/AdminLayout.vue';
import { adminService } from '../../services/admin.service';
import { useUIStore } from '../../stores/ui';

const ui = useUIStore();

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
  price: '' as string | number,
  compareAtPrice: '' as string | number,
  stock: '' as string | number,
  category: '',
  productCollection: '',
  tags: [] as string[],
  isFeatured: false,
  allowBackorder: false,
  isActive: true,
  images: [] as ImageItem[],
  mainImage: '',
});

// Format helpers — strip non-numeric chars except decimal point
function sanitizePrice(val: string): number {
  const clean = String(val).replace(/[^0-9.]/g, '');
  const parsed = parseFloat(clean);
  return isNaN(parsed) ? 0 : parsed;
}
function sanitizeInt(val: string): number {
  const clean = String(val).replace(/[^0-9]/g, '');
  const parsed = parseInt(clean, 10);
  return isNaN(parsed) ? 0 : parsed;
}

function onPriceBlur(field: 'price' | 'compareAtPrice') {
  const raw = String(form.value[field]);
  const num = sanitizePrice(raw);
  form.value[field] = num > 0 ? num.toFixed(2) : '';
}

function onStockBlur() {
  const raw = String(form.value.stock);
  form.value.stock = sanitizeInt(raw) || 0;
}

const tagInput = ref('');
const skuManuallyEdited = ref(false);

// Auto-generate SKU from product name (only when creating, only if not manually edited)
watch(() => form.value.name, (newName) => {
  if (isEditing.value || skuManuallyEdited.value) return;
  const words = newName.trim().split(/\s+/).filter(Boolean);
  const initials = words.map((w: string) => w[0]?.toUpperCase() || '').join('').slice(0, 5);
  const num = String(Math.floor(Math.random() * 900) + 100);
  form.value.sku = initials ? `SDV-${initials}-${num}` : '';
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
      if (product) {
        const price = product.price || 0;
        const compareAtPrice = product.compareAtPrice || 0;
        form.value = {
          name: product.name || '',
          shortDescription: product.shortDescription || '',
          description: product.description || '',
          sku: product.sku || '',
          price: price > 0 ? price.toFixed(2) : '',
          compareAtPrice: compareAtPrice > 0 ? compareAtPrice.toFixed(2) : '',
          stock: product.stock ?? 0,
          category: typeof product.category === 'object' ? product.category?._id : product.category || '',
          productCollection: product.productCollection || '',
          tags: product.tags || [],
          isFeatured: product.isFeatured || false,
          allowBackorder: product.allowBackorder || false,
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

async function removeImage(index: number) {
  const removed = form.value.images[index];
  form.value.images.splice(index, 1);
  if (removed && form.value.mainImage === removed.url) {
    form.value.mainImage = form.value.images[0]?.url || '';
  }
  // Delete from Cloudinary if we have the publicId
  if (removed?.publicId) {
    adminService.deleteImage(removed.publicId).catch((e) =>
      console.warn('Cloudinary delete failed:', e)
    );
  }
}

function setMainImage(url: string) {
  form.value.mainImage = url;
}

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

  const payload = {
    ...form.value,
    price: priceNum,
    compareAtPrice: sanitizePrice(String(form.value.compareAtPrice)),
    stock: sanitizeInt(String(form.value.stock)),
    images: form.value.images.map((img) => img.url),
  };

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
                <label class="pf__label">
                  SKU <span class="pf__required">*</span>
                  <span v-if="!isEditing && !skuManuallyEdited" class="pf__hint-badge">Se genera automáticamente</span>
                  <span v-else-if="!isEditing && skuManuallyEdited" class="pf__sku-manual-badge">
                    <i class="fa-solid fa-pen-to-square"></i> Editado manualmente
                  </span>
                </label>
                <input
                  v-model="form.sku"
                  type="text"
                  class="pf__input"
                  placeholder="SDV-TAZA-001"
                  required
                  @input="skuManuallyEdited = (form.sku.trim() !== '')"
                />
                <span v-if="!isEditing && skuManuallyEdited" class="pf__field-hint">
                  <i class="fa-solid fa-circle-info"></i>
                  Borra el SKU para volver a generarlo automáticamente
                </span>
              </div>
            </div>
          </div>

          <!-- Pricing & Stock -->
          <div class="pf__card">
            <h3 class="pf__card-title">Precio & Stock</h3>

            <!-- Prices -->
            <div class="pf__price-grid">
              <!-- Main price -->
              <div class="pf__field">
                <label class="pf__label">
                  Precio de Venta <span class="pf__required">*</span>
                  <span class="pf__currency-badge">USD</span>
                </label>
                <div class="pf__money-wrap">
                  <span class="pf__money-symbol">$</span>
                  <input
                    v-model="form.price"
                    type="text"
                    inputmode="decimal"
                    class="pf__input pf__money-input"
                    placeholder="0.00"
                    @blur="onPriceBlur('price')"
                  />
                </div>
                <span class="pf__field-hint">Precio final que paga el cliente</span>
              </div>

              <!-- Compare price -->
              <div class="pf__field">
                <label class="pf__label">
                  Precio Original
                  <span class="pf__hint-badge">Opcional — se muestra tachado</span>
                </label>
                <div class="pf__money-wrap">
                  <span class="pf__money-symbol pf__money-symbol--compare">$</span>
                  <input
                    v-model="form.compareAtPrice"
                    type="text"
                    inputmode="decimal"
                    class="pf__input pf__money-input pf__money-input--compare"
                    placeholder="0.00"
                    @blur="onPriceBlur('compareAtPrice')"
                  />
                </div>
                <span class="pf__field-hint">Para mostrar descuento (ej: 25.00 → tachado)</span>
              </div>
            </div>

            <!-- Price preview -->
            <div v-if="form.price" class="pf__price-preview">
              <span class="pf__price-preview-label">Vista previa:</span>
              <span v-if="form.compareAtPrice && Number(form.compareAtPrice) > 0" class="pf__price-preview-compare">
                ${{ Number(form.compareAtPrice).toFixed(2) }}
              </span>
              <span class="pf__price-preview-main">${{ Number(form.price).toFixed(2) }}</span>
              <span v-if="form.compareAtPrice && Number(form.compareAtPrice) > Number(form.price)" class="pf__price-preview-discount">
                {{ Math.round((1 - Number(form.price) / Number(form.compareAtPrice)) * 100) }}% OFF
              </span>
            </div>

            <div class="pf__divider"></div>

            <!-- Stock -->
            <div class="pf__stock-section">
              <div class="pf__field pf__field--stock">
                <label class="pf__label">Unidades en Stock</label>
                <div class="pf__stock-wrap">
                  <button type="button" class="pf__stock-btn" @click="form.stock = Math.max(0, Number(form.stock) - 1)">
                    <i class="fa-solid fa-minus"></i>
                  </button>
                  <input
                    v-model="form.stock"
                    type="text"
                    inputmode="numeric"
                    class="pf__input pf__stock-input"
                    placeholder="0"
                    @blur="onStockBlur"
                  />
                  <button type="button" class="pf__stock-btn" @click="form.stock = Number(form.stock) + 1">
                    <i class="fa-solid fa-plus"></i>
                  </button>
                </div>
                <span class="pf__field-hint">
                  <i class="fa-solid fa-circle-info"></i>
                  {{ Number(form.stock) === 0 ? 'Sin stock disponible' : `${form.stock} unidades disponibles` }}
                </span>
              </div>

              <!-- Sell without stock toggle -->
              <div class="pf__backorder-card" :class="{ 'pf__backorder-card--active': form.allowBackorder }">
                <div class="pf__backorder-info">
                  <div class="pf__backorder-title">
                    <i :class="['fa-solid', form.allowBackorder ? 'fa-bolt' : 'fa-bolt-slash']"></i>
                    Vender sin stock (Pre-venta)
                  </div>
                  <p class="pf__backorder-desc">
                    {{ form.allowBackorder
                      ? 'Activo — Los clientes pueden comprar aunque no haya stock disponible.'
                      : 'Inactivo — El producto no se puede comprar cuando llega a 0 unidades.' }}
                  </p>
                </div>
                <button
                  type="button"
                  :class="['pf__toggle', { 'pf__toggle--on': form.allowBackorder }]"
                  @click="form.allowBackorder = !form.allowBackorder"
                  :aria-checked="form.allowBackorder"
                  role="switch"
                >
                  <span class="pf__toggle-thumb"></span>
                </button>
              </div>
            </div>
          </div>

          <!-- Classification -->
          <div class="pf__card">
            <h3 class="pf__card-title">Clasificación</h3>
            <div class="pf__fields">

              <!-- No categories warning -->
              <div v-if="categories.length === 0" class="pf__no-categories">
                <i class="fa-solid fa-triangle-exclamation"></i>
                <div>
                  <strong>No hay categorías creadas.</strong>
                  El producto se guardará sin categoría.
                  <RouterLink to="/admin/categorias" class="pf__no-categories-link" target="_blank">
                    Crear categorías →
                  </RouterLink>
                </div>
              </div>

              <div class="pf__fields--grid">
                <div class="pf__field">
                  <label class="pf__label">
                    Categoría
                    <RouterLink v-if="categories.length > 0" to="/admin/categorias" target="_blank" class="pf__label-action">
                      <i class="fa-solid fa-plus"></i> Gestionar
                    </RouterLink>
                  </label>
                  <select v-model="form.category" class="pf__input pf__select">
                    <option value="">— Sin categoría —</option>
                    <option v-for="cat in categories" :key="cat._id" :value="cat._id">{{ cat.name }}</option>
                  </select>
                </div>
                <div class="pf__field">
                  <label class="pf__label">Colección <span class="pf__required">*</span></label>
                  <select v-model="form.productCollection" class="pf__input pf__select" required>
                    <option value="">— Seleccionar —</option>
                    <option value="boscan">Boscan</option>
                    <option value="moni">La Moni</option>
                    <option value="rustica">Artesanal Rústica</option>
                    <option value="set">Set / Colección</option>
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

          <!-- Images upload card -->
          <div class="pf__card">
            <h3 class="pf__card-title">
              Imágenes del Producto
              <span v-if="form.images.length > 0" class="pf__images-counter">
                {{ form.images.length }} {{ form.images.length === 1 ? 'imagen' : 'imágenes' }}
              </span>
            </h3>

            <!-- Drop Zone -->
            <div
              :class="['pf__dropzone', { 'pf__dropzone--over': isDragOver, 'pf__dropzone--has-images': form.images.length > 0 }]"
              @dragover="onDragOver"
              @dragleave="onDragLeave"
              @drop="onDrop"
              @click="fileInputRef?.click()"
            >
              <i class="fa-solid fa-cloud-arrow-up pf__dropzone-icon"></i>
              <p class="pf__dropzone-text">
                {{ form.images.length > 0 ? 'Agregar más imágenes' : 'Arrastra tus imágenes aquí' }}<br />
                <span class="pf__dropzone-cta">o haz clic para seleccionar</span>
              </p>
              <p class="pf__dropzone-sub">
                <i class="fa-solid fa-images"></i>
                Puedes seleccionar <strong>varias imágenes a la vez</strong> — PNG, JPG, WEBP · máx. 10MB c/u
              </p>
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
          </div><!-- /images card -->
        </div><!-- /pf__right -->
      </div><!-- /pf__layout -->

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
    align-items: start; // critical: prevents columns from stretching

    @media (max-width: 1100px) {
      grid-template-columns: 1fr;
    }
  }

  &__left {
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
  }

  &__right {
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
    position: sticky;
    top: 1.5rem;
    align-self: start;

    @media (max-width: 1100px) {
      position: static;
    }
  }

  &__card {
    background-color: $admin-card;
    border: 1px solid $admin-border;
    border-radius: 12px;
    padding: 1.5rem;
    flex-shrink: 0; // don't shrink inside the sticky right column
  }

  &__card-title {
    font-size: 0.8125rem;
    font-weight: 600;
    color: $admin-text-muted;
    margin: 0 0 1.25rem;
    padding-bottom: 0.875rem;
    border-bottom: 1px solid $admin-border;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    display: flex;
    align-items: center;
    gap: 0.5rem;
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

  &__no-categories {
    display: flex;
    align-items: flex-start;
    gap: 0.75rem;
    padding: 0.875rem 1rem;
    background-color: rgba(#F59E0B, 0.08);
    border: 1px solid rgba(#F59E0B, 0.3);
    border-radius: 8px;
    font-size: 0.875rem;
    color: #F59E0B;

    i { flex-shrink: 0; margin-top: 2px; }

    strong { display: block; margin-bottom: 0.25rem; }
  }

  &__no-categories-link {
    color: $admin-accent;
    text-decoration: none;
    font-weight: 600;
    margin-left: 0.25rem;

    &:hover { text-decoration: underline; }
  }

  &__label-action {
    font-size: 0.6875rem;
    font-weight: 600;
    color: $admin-accent;
    text-decoration: none;
    text-transform: none;
    letter-spacing: 0;
    display: flex;
    align-items: center;
    gap: 0.25rem;
    opacity: 0.8;
    transition: opacity 0.15s ease;

    &:hover { opacity: 1; }

    i { font-size: 0.625rem; }
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

  // ── Price section ────────────────────────────────────────
  &__price-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1.25rem;
    margin-bottom: 1rem;

    @media (max-width: 600px) {
      grid-template-columns: 1fr;
    }
  }

  &__currency-badge {
    display: inline-flex;
    align-items: center;
    padding: 0.125rem 0.5rem;
    background-color: rgba($admin-success, 0.12);
    border: 1px solid rgba($admin-success, 0.25);
    border-radius: 4px;
    color: $admin-success;
    font-size: 0.625rem;
    font-weight: 800;
    letter-spacing: 0.08em;
    text-transform: none;
    margin-left: auto;
  }

  &__hint-badge {
    font-size: 0.6875rem;
    font-weight: 400;
    color: $admin-text-muted;
    text-transform: none;
    letter-spacing: 0;
    margin-left: auto;
    font-style: italic;
  }

  &__field-hint {
    font-size: 0.75rem;
    color: $admin-text-muted;
    margin-top: 0.125rem;
    display: flex;
    align-items: center;
    gap: 0.3rem;

    i { font-size: 0.6875rem; color: $admin-info; }
  }

  &__money-wrap {
    display: flex;
    align-items: stretch;
    border: 1px solid $admin-border;
    border-radius: 8px;
    overflow: hidden;
    background-color: $admin-sidebar-active;
    transition: border-color 0.15s ease, box-shadow 0.15s ease;

    &:focus-within {
      border-color: $admin-accent;
      box-shadow: 0 0 0 3px rgba($admin-accent, 0.12);
    }
  }

  &__money-symbol {
    display: flex;
    align-items: center;
    padding: 0 0.875rem;
    background-color: rgba($admin-success, 0.1);
    border-right: 1px solid $admin-border;
    color: $admin-success;
    font-size: 1.125rem;
    font-weight: 700;
    flex-shrink: 0;
    user-select: none;

    &--compare {
      background-color: $admin-sidebar-hover;
      color: $admin-text-muted;
      font-size: 1rem;
    }
  }

  &__money-input {
    border: none !important;
    border-radius: 0 !important;
    background: transparent !important;
    box-shadow: none !important;
    padding: 0.75rem 1rem;
    font-size: 1.0625rem;
    font-weight: 600;
    color: $admin-text;
    width: 100%;
    font-family: 'Inter', sans-serif;

    /* Remove native number spinners */
    -moz-appearance: textfield;
    &::-webkit-outer-spin-button,
    &::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }

    &:focus { outline: none; }
    &::placeholder { color: #666; font-weight: 400; font-size: 0.9375rem; }

    &--compare {
      color: $admin-text-muted;
      font-weight: 500;
    }
  }

  &__price-preview {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.75rem 1rem;
    background-color: $admin-sidebar-hover;
    border: 1px solid $admin-border;
    border-radius: 8px;
    margin-bottom: 1.25rem;
    flex-wrap: wrap;
  }

  &__price-preview-label {
    font-size: 0.75rem;
    color: $admin-text-muted;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    font-weight: 600;
  }

  &__price-preview-compare {
    font-size: 0.9375rem;
    color: $admin-text-muted;
    text-decoration: line-through;
  }

  &__price-preview-main {
    font-size: 1.125rem;
    font-weight: 700;
    color: $admin-accent;
  }

  &__price-preview-discount {
    font-size: 0.75rem;
    font-weight: 700;
    padding: 0.2rem 0.5rem;
    background-color: rgba($admin-success, 0.15);
    color: $admin-success;
    border-radius: 4px;
  }

  &__divider {
    height: 1px;
    background-color: $admin-border;
    margin: 1.25rem 0;
  }

  // ── Stock section ────────────────────────────────────────
  &__stock-section {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  &__field--stock {
    max-width: 220px;
  }

  &__stock-wrap {
    display: flex;
    align-items: stretch;
    border: 1px solid $admin-border;
    border-radius: 8px;
    overflow: hidden;
    background-color: $admin-sidebar-active;
    transition: border-color 0.15s ease;

    &:focus-within {
      border-color: $admin-accent;
      box-shadow: 0 0 0 3px rgba($admin-accent, 0.12);
    }
  }

  &__stock-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    flex-shrink: 0;
    background-color: $admin-sidebar-hover;
    border: none;
    color: $admin-text-muted;
    font-size: 0.75rem;
    cursor: pointer;
    transition: all 0.15s ease;

    &:hover {
      background-color: rgba($admin-accent, 0.15);
      color: $admin-accent;
    }

    &:first-child { border-right: 1px solid $admin-border; }
    &:last-child  { border-left: 1px solid $admin-border; }
  }

  &__stock-input {
    border: none !important;
    border-radius: 0 !important;
    background: transparent !important;
    box-shadow: none !important;
    text-align: center;
    font-size: 1.0625rem;
    font-weight: 700;
    color: $admin-text;
    padding: 0.625rem 0.5rem;
    width: 80px;
    flex-shrink: 0;
    font-family: 'Inter', sans-serif;

    -moz-appearance: textfield;
    &::-webkit-outer-spin-button,
    &::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }

    &:focus { outline: none; }
    &::placeholder { color: #666; font-weight: 400; }
  }

  // ── Backorder card ───────────────────────────────────────
  &__backorder-card {
    display: flex;
    align-items: center;
    gap: 1.25rem;
    padding: 1.125rem 1.25rem;
    border: 1.5px dashed $admin-border;
    border-radius: 10px;
    background-color: $admin-sidebar-active;
    transition: all 0.2s ease;

    &--active {
      border-style: solid;
      border-color: rgba($admin-accent, 0.5);
      background-color: rgba($admin-accent, 0.05);
    }
  }

  &__backorder-info {
    flex: 1;
    min-width: 0;
  }

  &__backorder-title {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.9375rem;
    font-weight: 600;
    color: $admin-text;
    margin-bottom: 0.25rem;

    i { font-size: 0.875rem; color: $admin-accent; }
  }

  &__backorder-desc {
    font-size: 0.8125rem;
    color: $admin-text-muted;
    margin: 0;
    line-height: 1.5;
  }

  // ── Images counter + SKU manual badge ───────────────────
  &__images-counter {
    margin-left: auto;
    font-size: 0.6875rem;
    font-weight: 700;
    padding: 0.2rem 0.625rem;
    background-color: rgba($admin-accent, 0.12);
    color: $admin-accent;
    border-radius: 4px;
    text-transform: none;
    letter-spacing: 0;
  }

  &__sku-manual-badge {
    font-size: 0.6875rem;
    font-weight: 500;
    color: $admin-info;
    text-transform: none;
    letter-spacing: 0;
    display: flex;
    align-items: center;
    gap: 0.25rem;

    i { font-size: 0.5625rem; }
  }

  &__dropzone-cta {
    font-weight: 400;
    opacity: 0.7;
    font-size: 0.875rem;
  }

  &__dropzone--has-images {
    padding: 1.25rem 1.5rem;
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
