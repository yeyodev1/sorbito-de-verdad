<script setup lang="ts">
import { computed, onMounted, onUnmounted } from 'vue';
import { useUIStore } from '../stores/ui';

const ui = useUIStore();

const opts = computed(() => ui.confirm.options);
const isOpen = computed(() => ui.confirm.open);

const typeIcon: Record<string, string> = {
  danger:  'fa-solid fa-triangle-exclamation',
  warning: 'fa-solid fa-circle-exclamation',
  info:    'fa-solid fa-circle-question',
};

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape' && isOpen.value) ui.resolveConfirm(false);
}

onMounted(() => document.addEventListener('keydown', onKeydown));
onUnmounted(() => document.removeEventListener('keydown', onKeydown));
</script>

<template>
  <Teleport to="body">
    <Transition name="modal-fade">
      <div
        v-if="isOpen && opts"
        class="cm-overlay"
        role="dialog"
        aria-modal="true"
        :aria-labelledby="'cm-title'"
        @click.self="ui.resolveConfirm(false)"
      >
        <Transition name="modal-scale">
          <div v-if="isOpen" class="cm-card">
            <!-- Icon -->
            <div :class="['cm-icon', `cm-icon--${opts.type ?? 'danger'}`]">
              <i :class="typeIcon[opts.type ?? 'danger']"></i>
            </div>

            <!-- Content -->
            <div class="cm-content">
              <h2 id="cm-title" class="cm-title">{{ opts.title }}</h2>
              <p class="cm-message">{{ opts.message }}</p>
            </div>

            <!-- Actions -->
            <div class="cm-actions">
              <button
                class="cm-btn cm-btn--cancel"
                @click="ui.resolveConfirm(false)"
                autofocus
              >
                <i class="fa-solid fa-xmark"></i>
                {{ opts.cancelLabel ?? 'Cancelar' }}
              </button>
              <button
                :class="['cm-btn', `cm-btn--${opts.type ?? 'danger'}`]"
                @click="ui.resolveConfirm(true)"
              >
                <i :class="opts.type === 'info' ? 'fa-solid fa-check' : 'fa-solid fa-trash-can'"></i>
                {{ opts.confirmLabel ?? 'Confirmar' }}
              </button>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<style lang="scss" scoped>
.cm-overlay {
  position: fixed;
  inset: 0;
  z-index: 99998;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  padding: 1rem;
  background-color: rgba(20, 12, 8, 0.55);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);

  @media (min-width: 560px) {
    align-items: center;
    padding: 1.5rem;
  }
}

.cm-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.25rem;
  width: 100%;
  max-width: 420px;
  padding: 1.75rem 1.25rem 1.25rem;
  text-align: center;
  background-color: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: $radius-xl;
  box-shadow: var(--shadow-lg);

  @media (min-width: 560px) {
    padding: 2rem;
  }
}

.cm-icon {
  --cm-tone: var(--color-error);
  display: grid;
  place-items: center;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  color: var(--cm-tone);
  background-color: color-mix(in srgb, var(--cm-tone) 12%, transparent);

  i { font-size: 1.4rem; }

  &--danger  { --cm-tone: var(--color-error); }
  &--warning { --cm-tone: var(--color-warning); }
  &--info    { --cm-tone: var(--color-accent); }
}

.cm-content {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.cm-title {
  margin: 0;
  font-size: 1.375rem;
  font-weight: 600;
  line-height: 1.25;
}

.cm-message {
  margin: 0;
  font-size: 0.9375rem;
  line-height: 1.6;
}

.cm-actions {
  display: flex;
  flex-direction: column-reverse;
  gap: 0.5rem;
  width: 100%;
  margin-top: 0.25rem;

  @media (min-width: 400px) {
    flex-direction: row;
  }
}

.cm-btn {
  --cm-tone: var(--color-error);
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  min-height: 48px;
  padding: 0 1.25rem;
  font-family: var(--font-body);
  font-size: 0.9375rem;
  font-weight: 600;
  color: var(--color-on-accent);
  background-color: var(--cm-tone);
  border-radius: $radius-full;
  transition: opacity 0.18s ease, background-color 0.18s ease, transform 0.15s ease;

  i { font-size: 0.85rem; }

  &:hover { opacity: 0.9; }
  &:active { transform: scale(0.97); }

  &--cancel {
    color: var(--color-primary);
    background-color: transparent;
    border: 1.5px solid var(--color-border-strong);

    &:hover {
      opacity: 1;
      background-color: var(--color-bg-subtle);
    }
  }

  &--danger  { --cm-tone: var(--color-error); }
  &--warning { --cm-tone: var(--color-warning); }
  &--info    { --cm-tone: var(--color-accent); }
}

// ── Animations ──────────────────────────────────────────────
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.22s ease;
}
.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

.modal-scale-enter-active {
  transition: transform 0.28s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.22s ease;
}
.modal-scale-leave-active {
  transition: transform 0.18s ease-in, opacity 0.18s ease-in;
}
.modal-scale-enter-from {
  transform: scale(0.88) translateY(16px);
  opacity: 0;
}
.modal-scale-leave-to {
  transform: scale(0.92) translateY(8px);
  opacity: 0;
}
</style>
