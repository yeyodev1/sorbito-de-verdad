<script setup lang="ts">
import type { Order } from '../../../composables/admin/orders/types';
import { useOrdersContext } from '../../../composables/admin/orders/context';

defineProps<{ order: Order }>();

const { draftNotes, savingNotes, resendingEmail, saveNotes, resendEmail } = useOrdersContext();
</script>

<template>
  <div class="om__details-section om__details-section--full">
    <h4 class="om__details-title">
      <i class="fa-solid fa-note-sticky"></i>
      Nota interna
      <span class="om__note-hint">(se envía al cliente con el próximo cambio de estado)</span>
    </h4>
    <textarea
      v-model="draftNotes[order._id]"
      class="om__note-textarea"
      placeholder="Ej: Tu pedido saldrá mañana por DHL, número de guía: XXXXXXX"
      rows="3"
    ></textarea>
    <div class="om__note-actions">
      <button
        class="om__note-save"
        :disabled="savingNotes === order._id"
        @click="saveNotes(order)"
      >
        <i v-if="savingNotes === order._id" class="fa-solid fa-circle-notch fa-spin"></i>
        <i v-else class="fa-solid fa-floppy-disk"></i>
        {{ savingNotes === order._id ? 'Guardando...' : 'Guardar nota' }}
      </button>
      <button
        class="om__resend-btn"
        :disabled="resendingEmail === order._id"
        @click="resendEmail(order)"
        title="Reenvía el correo de confirmación al cliente"
      >
        <i v-if="resendingEmail === order._id" class="fa-solid fa-circle-notch fa-spin"></i>
        <i v-else class="fa-solid fa-paper-plane"></i>
        {{ resendingEmail === order._id ? 'Enviando...' : 'Reenviar correo' }}
      </button>
    </div>
  </div>
</template>

<style lang="scss" scoped src="./OrderNotesSection.scss"></style>
