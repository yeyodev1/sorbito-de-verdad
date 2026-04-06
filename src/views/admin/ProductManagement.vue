<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import AdminLayout from '../../layout/AdminLayout.vue';
import { adminService } from '../../services/admin.service';
import { useUIStore } from '../../stores/ui';

const ui = useUIStore();

interface Product {
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

const router = useRouter();
const products = ref<Product[]>([]);
const loading = ref(true);
const searchQuery = ref('');
const filterCollection = ref('');
const page = ref(1);
const perPage = 15;
const deleteConfirmId = ref<string | null>(null);

const collections = ['boscan', 'moni', 'rustica', 'set'];

const collectionColors: Record<string, string> = {
  boscan: 'white',
  moni: 'pink',
  rustica: 'terracota',
  set: 'blue',
};

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
  const start = (page.value - 1) * perPage;
  return filtered.value.slice(start, start + perPage);
});

const totalPages = computed(() => Math.ceil(filtered.value.length / perPage));

function getProductImage(product: Product) {
  return product.mainImage || product.images?.[0] || null;
}

async function toggleActive(product: Product) {
  try {
    await adminService.updateProduct(product._id, { isActive: !product.isActive });
    product.isActive = !product.isActive;
    ui.success(product.isActive ? 'Producto activado' : 'Producto desactivado');
  } catch (e: unknown) {
    const err = e as { response?: { data?: { message?: string } }; message?: string };
    ui.error(err?.response?.data?.message || 'Error al cambiar estado del producto');
  }
}

async function deleteProduct(id: string) {
  try {
    await adminService.deleteProduct(id);
    products.value = products.value.filter((p) => p._id !== id);
    deleteConfirmId.value = null;
    ui.success('Producto eliminado correctamente');
  } catch (e: unknown) {
    const err = e as { response?: { data?: { message?: string } }; message?: string };
    ui.error(err?.response?.data?.message || 'Error al eliminar el producto');
  }
}
</script>

<template>
  <AdminLayout title="Gestión de Productos">
    <!-- Toolbar -->
    <div class="pm__toolbar">
      <div class="pm__toolbar-left">
        <div class="pm__search">
          <i class="fa-solid fa-search pm__search-icon"></i>
          <input v-model="searchQuery" type="text" placeholder="Buscar por nombre o SKU..." class="pm__search-input" />
        </div>
        <select v-model="filterCollection" class="pm__select">
          <option value="">Todas las colecciones</option>
          <option v-for="c in collections" :key="c" :value="c">{{ c }}</option>
        </select>
      </div>
      <button class="btn-primary" @click="router.push('/admin/productos/nuevo')">
        <i class="fa-solid fa-plus"></i>
        Nuevo Producto
      </button>
    </div>

    <!-- Table -->
    <div class="admin-card">
      <!-- Loading skeleton -->
      <div v-if="loading" class="pm__skeleton">
        <div v-for="n in 8" :key="n" class="pm__skeleton-row"></div>
      </div>

      <!-- Empty state -->
      <div v-else-if="filtered.length === 0" class="pm__empty">
        <i class="fa-solid fa-box-open"></i>
        <p>No se encontraron productos</p>
        <button class="btn-primary" @click="router.push('/admin/productos/nuevo')">
          <i class="fa-solid fa-plus"></i> Crear primer producto
        </button>
      </div>

      <!-- Table -->
      <div v-else class="pm__table-wrap">
        <table class="admin-table">
          <thead>
            <tr>
              <th style="padding-left: 1.5rem;">Producto</th>
              <th>Colección</th>
              <th>Precio</th>
              <th>Stock</th>
              <th>Estado</th>
              <th style="text-align: right; padding-right: 1.5rem;">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="product in paginated" :key="product._id">
              <td style="padding-left: 1.5rem;">
                <div class="pm__product-cell">
                  <div class="pm__product-thumb">
                    <img v-if="getProductImage(product)" :src="getProductImage(product)!" :alt="product.name" />
                    <i v-else class="fa-solid fa-image pm__product-thumb-placeholder"></i>
                  </div>
                  <div class="pm__product-info">
                    <span class="pm__product-name">{{ product.name }}</span>
                    <span v-if="product.sku" class="pm__product-sku">SKU: {{ product.sku }}</span>
                  </div>
                </div>
              </td>
              <td>
                <span v-if="product.productCollection" :class="['collection-badge', `collection-badge--${collectionColors[product.productCollection] || 'default'}`]">
                  {{ product.productCollection }}
                </span>
                <span v-else class="text-muted">—</span>
              </td>
              <td class="pm__price">${{ product.price?.toFixed(2) }}</td>
              <td>
                <span :class="['stock-badge', (product.stock ?? 0) > 0 ? 'stock-badge--ok' : 'stock-badge--empty']">
                  {{ product.stock ?? 0 }}
                </span>
              </td>
              <td>
                <span :class="['status-badge', product.isActive ? 'status-badge--success' : 'status-badge--error']">
                  {{ product.isActive ? 'Activo' : 'Inactivo' }}
                </span>
              </td>
              <td style="text-align: right; padding-right: 1.5rem;">
                <div class="pm__actions">
                  <button class="pm__action-btn pm__action-btn--edit" title="Editar" @click="router.push(`/admin/productos/${product._id}`)">
                    <i class="fa-solid fa-pencil"></i>
                  </button>
                  <button :class="['pm__action-btn', product.isActive ? 'pm__action-btn--deactivate' : 'pm__action-btn--activate']"
                    :title="product.isActive ? 'Desactivar' : 'Activar'"
                    @click="toggleActive(product)">
                    <i :class="['fa-solid', product.isActive ? 'fa-eye-slash' : 'fa-eye']"></i>
                  </button>
                  <button class="pm__action-btn pm__action-btn--delete" title="Eliminar" @click="deleteConfirmId = product._id">
                    <i class="fa-solid fa-trash"></i>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div v-if="totalPages > 1" class="pm__pagination">
        <button class="pm__page-btn" :disabled="page <= 1" @click="page--">
          <i class="fa-solid fa-chevron-left"></i>
        </button>
        <span class="pm__page-info">{{ page }} / {{ totalPages }}</span>
        <button class="pm__page-btn" :disabled="page >= totalPages" @click="page++">
          <i class="fa-solid fa-chevron-right"></i>
        </button>
      </div>
    </div>

    <!-- Delete Confirm Modal -->
    <Transition name="fade">
      <div v-if="deleteConfirmId" class="modal-overlay" @click.self="deleteConfirmId = null">
        <div class="modal-box">
          <div class="modal-box__icon">
            <i class="fa-solid fa-triangle-exclamation"></i>
          </div>
          <h3 class="modal-box__title">¿Eliminar producto?</h3>
          <p class="modal-box__text">Esta acción no se puede deshacer. El producto será eliminado permanentemente.</p>
          <div class="modal-box__actions">
            <button class="btn-outline" @click="deleteConfirmId = null">Cancelar</button>
            <button class="btn-danger" @click="deleteProduct(deleteConfirmId!)">Sí, eliminar</button>
          </div>
        </div>
      </div>
    </Transition>
  </AdminLayout>
</template>

<style lang="scss" scoped>
@use "sass:color";

.pm {
  &__toolbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    margin-bottom: 1.25rem;
    flex-wrap: wrap;
  }

  &__toolbar-left {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    flex-wrap: wrap;
    flex: 1;
    min-width: 0;
  }

  &__search {
    position: relative;
    flex: 1;
    min-width: 200px;
    max-width: 360px;
  }

  &__search-icon {
    position: absolute;
    left: 0.875rem;
    top: 50%;
    transform: translateY(-50%);
    color: $admin-text-muted;
    font-size: 0.875rem;
    pointer-events: none;
  }

  &__search-input {
    width: 100%;
    padding: 0.625rem 0.875rem 0.625rem 2.5rem;
    background-color: $admin-card;
    border: 1px solid $admin-border;
    border-radius: 8px;
    color: $admin-text;
    font-size: 0.9375rem;
    font-family: 'Inter', sans-serif;

    &::placeholder {
      color: #555;
    }

    &:focus {
      outline: none;
      border-color: $admin-accent;
      box-shadow: 0 0 0 3px rgba($admin-accent, 0.12);
    }
  }

  &__select {
    padding: 0.625rem 0.875rem;
    background-color: $admin-card;
    border: 1px solid $admin-border;
    border-radius: 8px;
    color: $admin-text;
    font-size: 0.9375rem;
    font-family: 'Inter', sans-serif;
    cursor: pointer;

    &:focus {
      outline: none;
      border-color: $admin-accent;
    }

    option {
      background-color: $admin-card;
    }
  }

  &__skeleton {
    padding: 0;
  }

  &__skeleton-row {
    height: 56px;
    border-bottom: 1px solid $admin-border;
    background: linear-gradient(90deg, $admin-border 25%, color.adjust(#2A2A2A, $lightness: 5%) 50%, $admin-border 75%);
    background-size: 200% 100%;
    animation: shimmer 1.5s infinite;

    &:last-child {
      border-bottom: none;
    }
  }

  &__empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    padding: 4rem 2rem;
    color: $admin-text-muted;

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

  &__product-cell {
    display: flex;
    align-items: center;
    gap: 0.875rem;
  }

  &__product-thumb {
    width: 44px;
    height: 44px;
    border-radius: 8px;
    overflow: hidden;
    border: 1px solid $admin-border;
    background-color: $admin-sidebar-active;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  &__product-thumb-placeholder {
    color: $admin-text-muted;
    font-size: 1.25rem;
    opacity: 0.4;
  }

  &__product-info {
    display: flex;
    flex-direction: column;
    gap: 0.2rem;
    min-width: 0;
  }

  &__product-name {
    color: $admin-text;
    font-weight: 500;
    font-size: 0.9375rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  &__product-sku {
    color: $admin-text-muted;
    font-size: 0.75rem;
    font-family: monospace;
  }

  &__price {
    color: $admin-text;
    font-weight: 600;
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

    &:hover {
      color: $admin-text;
    }

    &--edit:hover {
      border-color: $admin-accent;
      color: $admin-accent;
    }

    &--activate:hover,
    &--deactivate:hover {
      border-color: $admin-info;
      color: $admin-info;
    }

    &--delete:hover {
      border-color: $admin-error;
      color: $admin-error;
      background-color: rgba($admin-error, 0.1);
    }
  }

  &__pagination {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1rem 1.5rem;
    border-top: 1px solid $admin-border;
    justify-content: center;
  }

  &__page-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    border-radius: 6px;
    border: 1px solid $admin-border;
    background-color: $admin-sidebar-hover;
    color: $admin-text;
    cursor: pointer;
    transition: all 0.15s ease;

    &:hover:not(:disabled) {
      border-color: $admin-accent;
      color: $admin-accent;
    }

    &:disabled {
      opacity: 0.4;
      cursor: not-allowed;
    }
  }

  &__page-info {
    color: $admin-text-muted;
    font-size: 0.875rem;
  }
}

.admin-card {
  background-color: $admin-card;
  border: 1px solid $admin-border;
  border-radius: 12px;
  overflow: hidden;
}

.text-muted {
  color: $admin-text-muted;
}

// Collection badges
.collection-badge {
  display: inline-flex;
  padding: 0.2rem 0.625rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.04em;

  &--white {
    background-color: rgba(255, 255, 255, 0.1);
    color: #e5e7eb;
    border: 1px solid rgba(255, 255, 255, 0.2);
  }

  &--pink {
    background-color: rgba(244, 114, 182, 0.15);
    color: #f472b6;
  }

  &--terracota {
    background-color: rgba($admin-accent, 0.15);
    color: $admin-accent;
  }

  &--blue {
    background-color: rgba($admin-info, 0.15);
    color: $admin-info;
  }

  &--default {
    background-color: rgba($admin-text-muted, 0.15);
    color: $admin-text-muted;
  }
}

.stock-badge {
  display: inline-flex;
  align-items: center;
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
  font-size: 0.8125rem;
  font-weight: 600;

  &--ok {
    background-color: rgba($admin-success, 0.12);
    color: $admin-success;
  }

  &--empty {
    background-color: rgba($admin-error, 0.12);
    color: $admin-error;
  }
}

.status-badge {
  display: inline-flex;
  padding: 0.2rem 0.6rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 600;

  &--success {
    background-color: rgba($admin-success, 0.15);
    color: $admin-success;
  }

  &--error {
    background-color: rgba($admin-error, 0.15);
    color: $admin-error;
  }
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
  white-space: nowrap;

  &:hover {
    background-color: color.adjust(#C8956C, $lightness: -8%);
  }
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

  &:hover {
    border-color: $admin-text;
    color: $admin-text;
  }
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

  &:hover {
    background-color: color.adjust(#EF4444, $lightness: -8%);
  }
}

// Admin Table
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
    white-space: nowrap;
  }

  tbody tr {
    border-bottom: 1px solid $admin-border;
    transition: background-color 0.15s ease;

    &:last-child {
      border-bottom: none;
    }

    &:hover {
      background-color: $admin-sidebar-hover;
    }

    td {
      padding: 0.875rem 1rem;
      color: $admin-text;
    }
  }
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
  padding: 2rem;
  max-width: 420px;
  width: 100%;
  text-align: center;

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

  &__title {
    font-size: 1.25rem;
    font-weight: 700;
    color: $admin-text;
    margin: 0 0 0.75rem;
  }

  &__text {
    color: $admin-text-muted;
    font-size: 0.9375rem;
    margin: 0 0 1.5rem;
    line-height: 1.5;
  }

  &__actions {
    display: flex;
    gap: 0.75rem;
    justify-content: center;
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}
</style>
