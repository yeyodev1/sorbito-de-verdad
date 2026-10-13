<script setup lang="ts">
import type { AdminCategoryRow } from '../../../composables/admin/categories/useCategoryManager';

defineProps<{ categories: AdminCategoryRow[] }>();
const emit = defineEmits<{
  edit: [category: AdminCategoryRow];
  toggle: [category: AdminCategoryRow];
  delete: [id: string];
}>();
</script>

<template>
  <div class="cm__table-wrap">
    <table class="admin-table">
      <thead>
        <tr>
          <th style="padding-left: 1.5rem;">Nombre</th>
          <th>Slug</th>
          <th>Descripción</th>
          <th>Estado</th>
          <th style="text-align: right; padding-right: 1.5rem;">Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="cat in categories" :key="cat._id">
          <td style="padding-left: 1.5rem;">
            <span class="cm__cat-name">{{ cat.name }}</span>
          </td>
          <td>
            <code class="cm__slug">{{ cat.slug || '—' }}</code>
          </td>
          <td>
            <span class="cm__description">{{ cat.description || '—' }}</span>
          </td>
          <td>
            <span :class="['status-badge', cat.isActive !== false ? 'status-badge--success' : 'status-badge--error']">
              {{ cat.isActive !== false ? 'Activa' : 'Inactiva' }}
            </span>
          </td>
          <td style="text-align: right; padding-right: 1.5rem;">
            <div class="cm__actions">
              <button class="cm__action-btn cm__action-btn--edit" title="Editar" @click="emit('edit', cat)">
                <i class="fa-solid fa-pencil"></i>
              </button>
              <button
                :class="['cm__action-btn', cat.isActive !== false ? 'cm__action-btn--deactivate' : 'cm__action-btn--activate']"
                :title="cat.isActive !== false ? 'Desactivar' : 'Activar'"
                @click="emit('toggle', cat)"
              >
                <i :class="['fa-solid', cat.isActive !== false ? 'fa-eye-slash' : 'fa-eye']"></i>
              </button>
              <button class="cm__action-btn cm__action-btn--delete" title="Eliminar" @click="emit('delete', cat._id)">
                <i class="fa-solid fa-trash"></i>
              </button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style lang="scss" scoped src="./CategoryTable.scss"></style>
