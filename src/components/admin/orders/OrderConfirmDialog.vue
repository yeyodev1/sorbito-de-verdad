<script setup lang="ts">
import { useOrdersContext } from '../../../composables/admin/orders/context';

const { confirmDialog, handleConfirm, closeConfirm } = useOrdersContext();
</script>

<template>
  <Teleport to="body">
    <div v-if="confirmDialog.show" class="om__confirm-overlay" @click.self="closeConfirm">
      <div class="om__confirm-dialog">
        <h3 class="om__confirm-title">{{ confirmDialog.title }}</h3>
        <p class="om__confirm-msg">{{ confirmDialog.message }}</p>
        <div v-if="confirmDialog.previewUrl" class="om__confirm-preview">
          <img :src="confirmDialog.previewUrl" alt="Preview" />
        </div>
        <div class="om__confirm-actions">
          <button class="om__confirm-cancel" @click="closeConfirm" :disabled="confirmDialog.loading">
            Cancelar
          </button>
          <button class="om__confirm-ok" @click="handleConfirm" :disabled="confirmDialog.loading">
            <i v-if="confirmDialog.loading" class="fa-solid fa-circle-notch fa-spin"></i>
            Confirmar
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style lang="scss" scoped src="./OrderConfirmDialog.scss"></style>
