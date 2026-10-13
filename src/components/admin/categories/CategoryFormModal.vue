<script setup lang="ts">
import type { CategoryFormState } from '../../../composables/admin/categories/useCategoryManager';

defineProps<{
  open: boolean;
  isEditing: boolean;
  saving: boolean;
}>();
const form = defineModel<CategoryFormState>('form', { required: true });
const emit = defineEmits<{ close: []; save: []; nameInput: [] }>();
</script>

<template>
  <Transition name="fade">
    <div v-if="open" class="modal-overlay" @click.self="emit('close')">
      <div class="modal-box">
        <div class="modal-box__header">
          <h3 class="modal-box__title">{{ isEditing ? 'Editar Categoría' : 'Nueva Categoría' }}</h3>
          <button class="modal-box__close" @click="emit('close')">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>

        <form @submit.prevent="emit('save')" class="modal-box__form">
          <div class="pf__field">
            <label class="pf__label">Nombre <span style="color: #EF4444;">*</span></label>
            <input
              v-model="form.name"
              type="text"
              class="pf__input"
              placeholder="Tazas de Cerámica..."
              required
              @input="emit('nameInput')"
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
            <button type="button" class="btn-outline" @click="emit('close')">Cancelar</button>
            <button type="submit" class="btn-primary" :disabled="saving">
              <i v-if="saving" class="fa-solid fa-spinner fa-spin"></i>
              <i v-else class="fa-solid fa-floppy-disk"></i>
              {{ saving ? 'Guardando...' : (isEditing ? 'Guardar Cambios' : 'Crear Categoría') }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </Transition>
</template>

<style lang="scss" scoped src="./CategoryModal.scss"></style>
<style lang="scss" scoped>
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

</style>
