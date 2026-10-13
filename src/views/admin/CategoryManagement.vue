<script setup lang="ts">
import AdminLayout from '../../layout/AdminLayout.vue';
import CategoryTable from '../../components/admin/categories/CategoryTable.vue';
import CategoryFormModal from '../../components/admin/categories/CategoryFormModal.vue';
import CategoryDeleteModal from '../../components/admin/categories/CategoryDeleteModal.vue';
import { useCategoryManager } from '../../composables/admin/categories/useCategoryManager';

const {
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
} = useCategoryManager();
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
      <CategoryTable
        :categories="categories"
        @edit="openEdit"
        @toggle="toggleActive"
        @delete="(id) => (deleteConfirmId = id)"
      />
    </div>

    <CategoryFormModal
      v-model:form="form"
      :open="showModal"
      :is-editing="!!editingCategory"
      :saving="saving"
      @close="closeModal"
      @save="handleSave"
      @name-input="onNameInput"
    />

    <CategoryDeleteModal
      :open="!!deleteConfirmId"
      @cancel="deleteConfirmId = null"
      @confirm="deleteCategory(deleteConfirmId!)"
    />
  </AdminLayout>
</template>

<style lang="scss" scoped src="./CategoryManagement.scss"></style>
