<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useUIStore } from '../stores/ui';

const ui = useUIStore();
const router = useRouter();

const icons: Record<string, string> = {
  success: 'fa-solid fa-circle-check',
  error: 'fa-solid fa-circle-xmark',
  warning: 'fa-solid fa-triangle-exclamation',
  info: 'fa-solid fa-circle-info',
};

function handleAction(toastId: number, to: string) {
  ui.dismiss(toastId);
  router.push(to);
}
</script>

<template>
  <Teleport to="body">
    <div class="toast-stack" aria-live="polite" aria-atomic="false">
      <TransitionGroup name="toast" tag="div" class="toast-stack__inner">
        <div
          v-for="toast in ui.toasts"
          :key="toast.id"
          :class="['toast-item', `toast-item--${toast.type}`, { 'toast-item--rich': toast.image }]"
          role="alert"
        >
          <!-- Progress bar -->
          <div
            class="toast-item__progress"
            :style="{ animationDuration: `${toast.duration}ms` }"
          ></div>

          <!-- Rich layout: product image -->
          <img
            v-if="toast.image"
            :src="toast.image"
            alt=""
            class="toast-item__img"
          />

          <!-- Content -->
          <div class="toast-item__body">
            <!-- Header row: icon + message + close -->
            <div class="toast-item__row">
              <i :class="['toast-item__icon', icons[toast.type]]"></i>
              <span class="toast-item__msg">{{ toast.message }}</span>
              <button class="toast-item__close" @click="ui.dismiss(toast.id)" aria-label="Cerrar">
                <i class="fa-solid fa-xmark"></i>
              </button>
            </div>

            <!-- Action button -->
            <div v-if="toast.action" class="toast-item__actions">
              <button
                class="toast-item__action-btn"
                @click="handleAction(toast.id, toast.action.to)"
              >
                {{ toast.action.label }}
                <i class="fa-solid fa-arrow-right"></i>
              </button>
            </div>
          </div>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<style lang="scss" scoped>
.toast-stack {
  position: fixed;
  top: 1.25rem;
  right: 1.25rem;
  z-index: 99999;
  pointer-events: none;
  width: 380px;
  max-width: calc(100vw - 2.5rem);

  @media (max-width: 480px) {
    top: auto;
    bottom: 1rem;
    left: 1rem;
    right: 1rem;
    width: 100%;
  }
}

.toast-stack__inner {
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
}

// ── Toast item ───────────────────────────────────────────────
.toast-item {
  --toast-tone: var(--color-primary);
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.875rem;
  padding: 0.75rem 0.75rem 0.75rem 0.875rem;
  overflow: hidden;
  pointer-events: auto;
  color: var(--color-primary);
  background-color: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: $radius-lg;
  box-shadow: var(--shadow-lg);

  &__img {
    width: 56px;
    height: 56px;
    flex-shrink: 0;
    object-fit: cover;
    border-radius: $radius-md;
    background-color: var(--color-bg-subtle);
  }

  &__body {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  &__row {
    display: flex;
    align-items: flex-start;
    gap: 0.625rem;
  }

  &__icon {
    flex-shrink: 0;
    margin-top: 0.15rem;
    font-size: 1rem;
    color: var(--toast-tone);
  }

  &__msg {
    flex: 1;
    min-width: 0;
    font-size: 0.875rem;
    font-weight: 500;
    line-height: 1.45;
    word-break: break-word;
  }

  &__close {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    flex-shrink: 0;
    margin: -0.375rem -0.25rem 0 0;
    font-size: 0.85rem;
    color: var(--color-muted);
    border-radius: 50%;
    transition: color 0.15s ease, background-color 0.15s ease;

    &:hover {
      color: var(--color-primary);
      background-color: var(--color-bg-subtle);
    }
  }

  &__actions {
    display: flex;
  }

  &__action-btn {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    min-height: 36px;
    padding: 0 0.95rem;
    font-size: 0.8125rem;
    font-weight: 600;
    color: var(--color-on-accent);
    background-color: var(--color-accent);
    border-radius: $radius-full;
    transition: background-color 0.15s ease;

    i { font-size: 0.7rem; }

    &:hover { background-color: var(--color-accent-hover); }
  }

  &__progress {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    height: 3px;
    background-color: var(--toast-tone);
    opacity: 0.6;
    transform-origin: left;
    animation: toast-progress linear forwards;
  }

  &--success { --toast-tone: var(--color-success); }
  &--error   { --toast-tone: var(--color-error); }
  &--warning { --toast-tone: var(--color-warning); }
  &--info    { --toast-tone: var(--color-accent); }
}

// ── Progress animation ──────────────────────────────────────
@keyframes toast-progress {
  from { transform: scaleX(1); }
  to   { transform: scaleX(0); }
}

// ── TransitionGroup animations ───────────────────────────────
.toast-enter-active {
  transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.25s ease;
}
.toast-leave-active {
  transition: transform 0.22s ease-in, opacity 0.22s ease-in;
  position: absolute;
  right: 0;
  width: 100%;
}
.toast-move {
  transition: transform 0.3s ease;
}

.toast-enter-from {
  opacity: 0;
  transform: translateX(110%);
}
.toast-leave-to {
  opacity: 0;
  transform: translateX(110%);
}
</style>
