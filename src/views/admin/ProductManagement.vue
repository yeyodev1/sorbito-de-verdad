<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import AdminLayout from '../../layout/AdminLayout.vue';
import ProductTable from '../../components/admin/products/ProductTable.vue';
import ProductDeleteModal from '../../components/admin/products/ProductDeleteModal.vue';
import { useProductList, PRODUCT_COLLECTIONS } from '../../composables/admin/products/useProductList';

const router = useRouter();
const deleteConfirmId = ref<string | null>(null);

const {
  loading,
  searchQuery,
  filterCollection,
  page,
  filtered,
  paginated,
  totalPages,
  toggleActive,
  deleteProduct,
} = useProductList();

async function confirmDelete() {
  if (!deleteConfirmId.value) return;
  if (await deleteProduct(deleteConfirmId.value)) deleteConfirmId.value = null;
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
          <option v-for="c in PRODUCT_COLLECTIONS" :key="c" :value="c">{{ c }}</option>
        </select>
      </div>
      <button class="btn-primary" @click="router.push('/admin/productos/nuevo')">
        <i class="fa-solid fa-plus"></i>
        Nuevo Producto
      </button>
    </div>

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

      <!-- Table + pagination -->
      <ProductTable
        v-else
        v-model:page="page"
        :products="paginated"
        :total-pages="totalPages"
        @toggle="toggleActive"
        @delete="(id) => (deleteConfirmId = id)"
      />
    </div>

    <ProductDeleteModal
      :open="!!deleteConfirmId"
      @cancel="deleteConfirmId = null"
      @confirm="confirmDelete"
    />
  </AdminLayout>
</template>

<style lang="scss" scoped src="./ProductManagement.scss"></style>
