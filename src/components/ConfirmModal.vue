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
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
}

.cm-card {
  background-color: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: 16px;
  padding: 2rem;
  width: 100%;
  max-width: 420px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.25rem;
  box-shadow: 0 24px 64px rgba(0, 0, 0, 0.4);
  text-align: center;
}

.cm-icon {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;

  i { font-size: 1.5rem; }

  &--danger {
    background-color: rgba(#ef4444, 0.12);
    color: #ef4444;
    border: 2px solid rgba(#ef4444, 0.25);
  }

  &--warning {
    background-color: rgba(#f59e0b, 0.12);
    color: #f59e0b;
    border: 2px solid rgba(#f59e0b, 0.25);
  }

  &--info {
    background-color: rgba(#3b82f6, 0.12);
    color: #3b82f6;
    border: 2px solid rgba(#3b82f6, 0.25);
  }
}

.cm-content {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.cm-title {
  font-family: var(--font-heading);
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--color-primary);
  margin: 0;
  line-height: 1.3;
}

.cm-message {
  font-size: 0.9375rem;
  color: var(--color-muted);
  margin: 0;
  line-height: 1.6;
}

.cm-actions {
  display: flex;
  gap: 0.75rem;
  width: 100%;
  margin-top: 0.25rem;
}

.cm-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  border-radius: 8px;
  font-size: 0.9375rem;
  font-weight: 600;
  cursor: pointer;
  border: none;
  transition: all 0.18s ease;
  font-family: var(--font-body);

  i { font-size: 0.875rem; }

  &--cancel {
    background-color: var(--color-bg-subtle);
    color: var(--color-muted);
    border: 1px solid var(--color-border);

    &:hover {
      background-color: var(--color-border);
      color: var(--color-primary);
    }
  }

  &--danger {
    background-color: #ef4444;
    color: white;

    &:hover {
      background-color: darken(#ef4444, 8%);
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(#ef4444, 0.4);
    }
  }

  &--warning {
    background-color: #f59e0b;
    color: white;

    &:hover {
      background-color: darken(#f59e0b, 8%);
      transform: translateY(-1px);
    }
  }

  &--info {
    background-color: $color-accent;
    color: white;

    &:hover {
      background-color: darken($color-accent, 8%);
      transform: translateY(-1px);
    }
  }
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
