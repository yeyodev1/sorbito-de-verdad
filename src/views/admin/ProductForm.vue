<script setup lang="ts">
import { RouterLink } from 'vue-router';
import AdminLayout from '../../layout/AdminLayout.vue';
import ProductBasicInfoCard from '../../components/admin/products/ProductBasicInfoCard.vue';
import ProductPricingCard from '../../components/admin/products/ProductPricingCard.vue';
import ProductClassificationCard from '../../components/admin/products/ProductClassificationCard.vue';
import ProductImagesCard from '../../components/admin/products/ProductImagesCard.vue';
import { useProductForm } from '../../composables/admin/products/useProductForm';

const {
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
} = useProductForm();
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
        <div class="pf__left">
          <ProductBasicInfoCard
            v-model:form="form"
            v-model:sku-manually-edited="skuManuallyEdited"
            :is-editing="isEditing"
          />
          <ProductPricingCard v-model:form="form" />
          <ProductClassificationCard v-model:form="form" :categories="categories" />
        </div>

        <div class="pf__right">
          <ProductImagesCard v-model:form="form" />
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

<style lang="scss" scoped src="./ProductForm.scss"></style>
