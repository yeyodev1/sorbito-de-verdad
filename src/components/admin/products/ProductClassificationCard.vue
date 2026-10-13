<script setup lang="ts">
import { ref } from 'vue';
import { RouterLink } from 'vue-router';
import type { AdminCategory, ProductFormState } from '../../../composables/admin/products/productFormUtils';

defineProps<{ categories: AdminCategory[] }>();
const form = defineModel<ProductFormState>('form', { required: true });

const tagInput = ref('');

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
</script>

<template>
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
</template>

<style lang="scss" scoped src="./ProductFormBase.scss"></style>
<style lang="scss" scoped src="./ProductFormToggle.scss"></style>
<style lang="scss" scoped src="./ProductClassificationCard.scss"></style>
