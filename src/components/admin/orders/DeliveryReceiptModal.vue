<script setup lang="ts">
import { ref } from 'vue';
import { formatCurrency } from '../../../composables/admin/orders/formatters';
import { useOrdersContext } from '../../../composables/admin/orders/context';

const rmFileInput = ref<HTMLInputElement | null>(null);

const {
  receiptModal, cancelReceiptModal, removeReceiptModalPreview,
  handleReceiptDrop, handleReceiptFileInput, confirmReceiptModal,
} = useOrdersContext();
</script>

<template>
  <Teleport to="body">
    <Transition name="rm-overlay">
      <div v-if="receiptModal.show" class="rm-overlay" @click.self="cancelReceiptModal">
        <div class="rm-box">
          <!-- Header -->
          <div class="rm-header">
            <div class="rm-header-icon">
              <i class="fa-solid fa-box-open"></i>
            </div>
            <div class="rm-header-text">
              <h3 class="rm-title">Marcar como Entregada</h3>
              <p class="rm-subtitle">
                Orden <strong>{{ receiptModal.order?.orderNumber || '#' + receiptModal.order?._id?.slice(-6).toUpperCase() }}</strong>
                &nbsp;·&nbsp;{{ formatCurrency(receiptModal.order?.total) }}
                &nbsp;·&nbsp;{{ receiptModal.order?.user?.name || '—' }}
              </p>
            </div>
            <button class="rm-close" @click="cancelReceiptModal" :disabled="receiptModal.saving">
              <i class="fa-solid fa-xmark"></i>
            </button>
          </div>

          <!-- Drop zone -->
          <div
            class="rm-dropzone"
            :class="{
              'rm-dropzone--drag': receiptModal.dragging,
              'rm-dropzone--has-file': receiptModal.filePreview,
            }"
            @dragover.prevent="receiptModal.dragging = true"
            @dragleave.prevent="receiptModal.dragging = false"
            @drop.prevent="handleReceiptDrop"
            @click="!receiptModal.filePreview ? rmFileInput?.click() : undefined"
          >
            <input
              ref="rmFileInput"
              type="file"
              accept="image/*"
              style="display:none"
              @change="handleReceiptFileInput"
            />

            <!-- Preview state -->
            <template v-if="receiptModal.filePreview">
              <img :src="receiptModal.filePreview" class="rm-preview-img" alt="Comprobante" />
              <div v-if="receiptModal.uploading" class="rm-uploading-overlay">
                <i class="fa-solid fa-circle-notch fa-spin"></i>
                <span>Subiendo...</span>
              </div>
              <div v-else-if="receiptModal.uploadedUrl" class="rm-uploaded-badge">
                <i class="fa-solid fa-circle-check"></i> Listo
              </div>
              <button
                class="rm-remove-preview"
                @click.stop="removeReceiptModalPreview"
                title="Quitar y borrar del servidor"
              >
                <i class="fa-solid fa-xmark"></i>
              </button>
            </template>

            <!-- Empty state -->
            <template v-else>
              <i class="fa-solid fa-cloud-arrow-up rm-drop-icon"></i>
              <p class="rm-drop-label">Arrastra el comprobante aquí</p>
              <p class="rm-drop-hint">o haz clic para seleccionar · PNG, JPG, WEBP</p>
            </template>
          </div>

          <p class="rm-optional">
            <i class="fa-solid fa-circle-info"></i>
            El comprobante es opcional — puedes confirmar la entrega sin adjuntarlo.
          </p>

          <!-- Actions -->
          <div class="rm-actions">
            <button class="rm-btn-cancel" @click="cancelReceiptModal" :disabled="receiptModal.saving">
              Cancelar
            </button>
            <button
              class="rm-btn-confirm"
              @click="confirmReceiptModal"
              :disabled="receiptModal.saving || receiptModal.uploading"
            >
              <i v-if="receiptModal.saving" class="fa-solid fa-circle-notch fa-spin"></i>
              <i v-else class="fa-solid fa-circle-check"></i>
              {{ receiptModal.saving ? 'Guardando...' : 'Confirmar entrega' }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style lang="scss" scoped src="./DeliveryReceiptModal.scss"></style>
