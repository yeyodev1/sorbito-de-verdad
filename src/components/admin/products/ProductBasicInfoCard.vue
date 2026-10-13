<script setup lang="ts">
import type { ProductFormState } from '../../../composables/admin/products/productFormUtils';

defineProps<{ isEditing: boolean }>();
const form = defineModel<ProductFormState>('form', { required: true });
const skuManuallyEdited = defineModel<boolean>('skuManuallyEdited', { required: true });
</script>

<template>
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
</template>

<style lang="scss" scoped src="./ProductFormBase.scss"></style>
<style lang="scss" scoped>
.pf {
  &__char-count {
    font-size: 0.75rem;
    color: $admin-text-muted;
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
}
</style>
