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
.update-overlay {
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  background: rgba(20, 12, 8, 0.55);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
}

.update-modal {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.25rem;
  width: 100%;
  max-width: 420px;
  padding: 2.25rem 1.5rem 1.5rem;
  text-align: center;
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: $radius-xl;
  box-shadow: var(--shadow-lg);

  &__icon-wrap {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 64px;
    height: 64px;
    border-radius: 50%;
    background: var(--color-accent-light);
  }

  &__icon {
    font-size: 1.6rem;
    color: var(--color-accent);
  }

  &__body {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  &__title {
    margin: 0;
    font-size: 1.5rem;
    font-weight: 600;
  }

  &__text {
    margin: 0;
    font-size: 0.9375rem;
    line-height: 1.65;
  }

  &__btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    width: 100%;
    min-height: 50px;
    margin-top: 0.25rem;
    font-family: var(--font-body);
    font-size: 1rem;
    font-weight: 600;
    color: var(--color-on-accent);
    background: var(--color-accent);
    border-radius: $radius-full;
    transition: background-color 0.2s ease, transform 0.15s ease;

    &:hover { background: var(--color-accent-hover); }
    &:active { transform: scale(0.97); }
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
