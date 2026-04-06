<script setup lang="ts">
defineProps<{ show: boolean }>();
const emit = defineEmits<{ (e: 'reload'): void }>();
</script>

<template>
  <Transition name="update-modal">
    <div v-if="show" class="update-overlay" role="dialog" aria-modal="true" aria-labelledby="update-title">
      <div class="update-modal">
        <div class="update-modal__icon-wrap">
          <i class="fa-solid fa-rotate update-modal__icon"></i>
        </div>

        <div class="update-modal__body">
          <h2 id="update-title" class="update-modal__title">
            Nueva versión disponible
          </h2>
          <p class="update-modal__text">
            Actualizamos la tienda con mejoras y novedades.<br>
            Recarga la página para ver la versión más reciente.
          </p>
        </div>

        <button class="update-modal__btn" @click="emit('reload')">
          <i class="fa-solid fa-rotate-right"></i>
          Actualizar ahora
        </button>
      </div>
    </div>
  </Transition>
</template>

<style lang="scss" scoped>
@use "sass:color";

.update-overlay {
  position: fixed;
  inset: 0;
  z-index: 9999;
  background: rgba(0, 0, 0, 0.55);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  backdrop-filter: blur(4px);
}

.update-modal {
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: 20px;
  box-shadow: 0 24px 64px rgba(0, 0, 0, 0.3);
  max-width: 420px;
  width: 100%;
  padding: 2.5rem 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.25rem;
  text-align: center;

  &__icon-wrap {
    width: 72px;
    height: 72px;
    border-radius: 50%;
    background: rgba($color-accent, 0.12);
    border: 2px solid rgba($color-accent, 0.35);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &__icon {
    font-size: 2rem;
    color: $color-accent;
  }

  &__body {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  &__title {
    font-family: var(--font-heading);
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--color-primary);
    margin: 0;
    line-height: 1.2;
  }

  &__text {
    font-size: 0.9375rem;
    color: var(--color-muted);
    line-height: 1.65;
    margin: 0;
  }

  &__btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    padding: 0.875rem 2.5rem;
    background: $color-accent;
    color: white;
    border: none;
    border-radius: $radius-md;
    font-size: 1rem;
    font-weight: 700;
    font-family: var(--font-body);
    cursor: pointer;
    transition: all 0.2s ease;
    width: 100%;
    margin-top: 0.25rem;

    &:hover {
      background: color.adjust($color-accent, $lightness: -8%);
      transform: translateY(-1px);
      box-shadow: 0 6px 20px rgba($color-accent, 0.35);
    }
  }
}

// Transition
.update-modal-enter-active,
.update-modal-leave-active {
  transition: opacity 0.3s ease;

  .update-modal {
    transition: opacity 0.3s ease, transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  }
}

.update-modal-enter-from,
.update-modal-leave-to {
  opacity: 0;

  .update-modal {
    opacity: 0;
    transform: scale(0.92) translateY(16px);
  }
}
</style>
