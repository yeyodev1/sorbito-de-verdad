<script setup lang="ts">
import { ref } from 'vue';
import { formatCurrency } from '../../../composables/admin/orders/formatters';
import { useOrdersContext } from '../../../composables/admin/orders/context';

const pmFileInput = ref<HTMLInputElement | null>(null);

const {
  payModal, closePayModal, removePayModalPreview, payModalAnswerNo, payModalAnswerYes,
  handlePayModalDrop, handlePayModalFileInput, confirmPayModal,
} = useOrdersContext();
</script>

<template>
  <Teleport to="body">
    <Transition name="pm-overlay">
      <div v-if="payModal.show" class="pm-overlay" @click.self="closePayModal">
        <div class="pm-box">

          <!-- Header (always visible) -->
          <div class="pm-header">
            <div class="pm-header-icon">
              <i class="fa-solid fa-hand-holding-dollar"></i>
            </div>
            <div class="pm-header-text">
              <h3 class="pm-title">Confirmar orden</h3>
              <p class="pm-subtitle">
                <strong>{{ payModal.order?.orderNumber || '#' + payModal.order?._id?.slice(-6).toUpperCase() }}</strong>
                &nbsp;·&nbsp;{{ formatCurrency(payModal.order?.total) }}
                &nbsp;·&nbsp;{{ payModal.order?.user?.name || '—' }}
              </p>
            </div>
            <button class="pm-close" @click="closePayModal" :disabled="payModal.saving || payModal.uploading">
              <i class="fa-solid fa-xmark"></i>
            </button>
          </div>

          <!-- Step content with slide transition -->
          <Transition name="pm-step" mode="out-in">

            <!-- STEP: ask -->
            <div v-if="payModal.step === 'ask'" key="ask" class="pm-step">
              <div class="pm-ask-icon">
                <i class="fa-solid fa-circle-question"></i>
              </div>
              <p class="pm-ask-label">¿Este cliente realizó el pago <strong>por fuera de la plataforma</strong>?</p>
              <p class="pm-ask-hint">WhatsApp, transferencia bancaria, efectivo, etc.</p>
              <div class="pm-ask-actions">
                <button
                  class="pm-btn-no"
                  @click="payModalAnswerNo"
                  :disabled="payModal.saving"
                >
                  <i v-if="payModal.saving" class="fa-solid fa-circle-notch fa-spin"></i>
                  <i v-else class="fa-solid fa-xmark-circle"></i>
                  No, solo confirmar
                </button>
                <button class="pm-btn-yes" @click="payModalAnswerYes">
                  <i class="fa-solid fa-check-circle"></i>
                  Sí, pagó por fuera
                  <i class="fa-solid fa-arrow-right pm-arrow"></i>
                </button>
              </div>
            </div>

            <!-- STEP: upload comprobante -->
            <div v-else key="upload" class="pm-step">
              <p class="pm-upload-title">
                <i class="fa-solid fa-receipt"></i>
                Sube el comprobante o foto de la transacción
              </p>

              <!-- Drop zone -->
              <div
                class="pm-dropzone"
                :class="{
                  'pm-dropzone--drag': payModal.dragging,
                  'pm-dropzone--has-file': payModal.filePreview,
                }"
                @dragover.prevent="payModal.dragging = true"
                @dragleave.prevent="payModal.dragging = false"
                @drop.prevent="handlePayModalDrop"
                @click="!payModal.filePreview ? pmFileInput?.click() : undefined"
              >
                <input
                  ref="pmFileInput"
                  type="file"
                  accept="image/*"
                  style="display:none"
                  @change="handlePayModalFileInput"
                />

                <!-- Preview -->
                <template v-if="payModal.filePreview">
                  <img :src="payModal.filePreview" class="pm-preview-img" alt="Comprobante" />
                  <div v-if="payModal.uploading" class="pm-uploading-overlay">
                    <i class="fa-solid fa-circle-notch fa-spin"></i>
                    <span>Subiendo...</span>
                  </div>
                  <div v-else-if="payModal.uploadedUrl" class="pm-uploaded-badge">
                    <i class="fa-solid fa-circle-check"></i> Listo
                  </div>
                  <button
                    class="pm-remove-preview"
                    @click.stop="removePayModalPreview"
                    title="Quitar y borrar del servidor"
                  >
                    <i class="fa-solid fa-xmark"></i>
                  </button>
                </template>

                <template v-else>
                  <i class="fa-solid fa-cloud-arrow-up pm-drop-icon"></i>
                  <p class="pm-drop-label">Arrastra el comprobante aquí</p>
                  <p class="pm-drop-hint">o haz clic para seleccionar · PNG, JPG, WEBP</p>
                </template>
              </div>

              <p class="pm-upload-note">
                <i class="fa-solid fa-circle-info"></i>
                El comprobante es opcional, pero se registrará el pago externo de todas formas.
              </p>

              <div class="pm-upload-actions">
                <button class="pm-btn-back" @click="payModal.step = 'ask'" :disabled="payModal.saving">
                  <i class="fa-solid fa-arrow-left"></i>
                  Atrás
                </button>
                <button
                  class="pm-btn-confirm"
                  @click="confirmPayModal"
                  :disabled="payModal.saving || payModal.uploading"
                >
                  <i v-if="payModal.saving" class="fa-solid fa-circle-notch fa-spin"></i>
                  <i v-else class="fa-solid fa-circle-check"></i>
                  {{ payModal.saving ? 'Guardando...' : 'Confirmar y registrar pago' }}
                </button>
              </div>
            </div>

          </Transition>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style lang="scss" scoped src="./PayConfirmModal.scss"></style>
