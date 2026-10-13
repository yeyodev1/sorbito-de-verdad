<script setup lang="ts">
import { useProductImages } from '../../../composables/admin/products/useProductImages';
import type { ProductFormState } from '../../../composables/admin/products/productFormUtils';

const form = defineModel<ProductFormState>('form', { required: true });

const {
  uploadingImages,
  uploadProgress,
  isDragOver,
  fileInputRef,
  onDragOver,
  onDragLeave,
  onDrop,
  onFileSelect,
  removeImage,
  setMainImage,
} = useProductImages(form);
</script>

<template>
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
  </div>
</template>

<style lang="scss" scoped src="./ProductFormBase.scss"></style>
<style lang="scss" scoped src="./ProductImagesCard.scss"></style>
