<script setup lang="ts">
defineProps<{ zoneId: string | null }>();
const emit = defineEmits<{ (e: 'cancel'): void; (e: 'confirm', id: string): void }>();
</script>

<template>
  <!-- Delete Confirm Modal -->
  <Transition name="fade">
    <div v-if="zoneId" class="modal-overlay" @click.self="emit('cancel')">
      <div class="modal-box modal-box--sm">
        <div class="modal-box__icon">
          <i class="fa-solid fa-triangle-exclamation"></i>
        </div>
        <h3 class="modal-box__title" style="text-align: center;">¿Eliminar zona de envío?</h3>
        <p class="modal-box__text">Esta acción no se puede deshacer.</p>
        <div class="modal-box__actions">
          <button class="btn-outline" @click="emit('cancel')">Cancelar</button>
          <button class="btn-danger" @click="emit('confirm', zoneId!)">Sí, eliminar</button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style lang="scss" scoped src="./shippingButtons.scss"></style>

<style lang="scss" scoped src="./shippingModal.scss"></style>
