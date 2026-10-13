<script setup lang="ts">
defineProps<{ userId: string | null }>();
const emit = defineEmits<{ (e: 'cancel'): void; (e: 'confirm', id: string): void }>();
</script>

<template>
  <!-- Delete Confirm Modal -->
  <Transition name="fade">
    <div v-if="userId" class="modal-overlay" @click.self="emit('cancel')">
      <div class="modal-box">
        <div class="modal-box__icon">
          <i class="fa-solid fa-triangle-exclamation"></i>
        </div>
        <h3 class="modal-box__title">¿Eliminar usuario?</h3>
        <p class="modal-box__text">Esta acción no se puede deshacer.</p>
        <div class="modal-box__actions">
          <button class="btn-outline" @click="emit('cancel')">Cancelar</button>
          <button class="btn-danger" @click="emit('confirm', userId!)">Sí, eliminar</button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style lang="scss" scoped>
@use "sass:color";

.btn-outline {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 1.25rem;
  background-color: transparent;
  color: $admin-text-muted;
  border: 1px solid $admin-border;
  border-radius: 8px;
  font-size: 0.9375rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s ease;
  font-family: 'Inter', sans-serif;

  &:hover { border-color: $admin-text; color: $admin-text; }
}

.btn-danger {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 1.25rem;
  background-color: $admin-error;
  color: #fff;
  border-radius: 8px;
  font-size: 0.9375rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s ease;
  font-family: 'Inter', sans-serif;
  border: none;

  &:hover { background-color: color.adjust(#EF4444, $lightness: -8%); }
}

.modal-overlay {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 200;
  padding: 1rem;
}

.modal-box {
  background-color: $admin-card;
  border: 1px solid $admin-border;
  border-radius: 16px;
  padding: 2rem;
  max-width: 380px;
  width: 100%;
  text-align: center;

  &__icon {
    width: 56px;
    height: 56px;
    border-radius: 50%;
    background-color: rgba($admin-error, 0.15);
    color: $admin-error;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.5rem;
    margin: 0 auto 1.25rem;
  }

  &__title {
    font-size: 1.25rem;
    font-weight: 700;
    color: $admin-text;
    margin: 0 0 0.75rem;
  }

  &__text {
    color: $admin-text-muted;
    font-size: 0.9375rem;
    margin: 0 0 1.5rem;
  }

  &__actions {
    display: flex;
    gap: 0.75rem;
    justify-content: center;
  }
}

.fade-enter-active, .fade-leave-active { transition: opacity 0.2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
