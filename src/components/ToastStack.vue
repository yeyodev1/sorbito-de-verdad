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
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.875rem;
  padding: 0.875rem 0.875rem 0.875rem 1rem;
  border-radius: 12px;
  box-shadow: 0 8px 28px rgba(0, 0, 0, 0.35), 0 2px 6px rgba(0, 0, 0, 0.2);
  overflow: hidden;
  pointer-events: all;
  background-color: #1c1c1e;
  border: 1px solid rgba(255, 255, 255, 0.08);
  color: #f0f0f0;

  // Rich variant (has image) padding tweak
  &--rich {
    padding: 0.75rem;
    align-items: flex-start;
  }

  &__img {
    width: 56px;
    height: 56px;
    border-radius: 8px;
    object-fit: cover;
    flex-shrink: 0;
    border: 1px solid rgba(255,255,255,0.1);
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
    font-size: 1rem;
    flex-shrink: 0;
    margin-top: 1px;
  }

  &__msg {
    flex: 1;
    line-height: 1.45;
    font-size: 0.875rem;
    font-weight: 500;
  }

  &__close {
    background: none;
    border: none;
    color: rgba(255, 255, 255, 0.4);
    cursor: pointer;
    padding: 0.2rem;
    font-size: 0.6875rem;
    line-height: 1;
    border-radius: 4px;
    flex-shrink: 0;
    transition: color 0.15s ease, background-color 0.15s ease;
    align-self: flex-start;

    &:hover {
      color: rgba(255, 255, 255, 0.9);
      background-color: rgba(255, 255, 255, 0.1);
    }
  }

  &__actions {
    padding-left: 1.625rem; // align under the message (icon width + gap)
  }

  &__action-btn {
    display: inline-flex;
    align-items: center;
    gap: 0.375rem;
    padding: 0.375rem 0.875rem;
    border-radius: 6px;
    font-size: 0.8125rem;
    font-weight: 600;
    cursor: pointer;
    border: none;
    transition: all 0.15s ease;
    background-color: rgba(255, 255, 255, 0.12);
    color: #ffffff;
    font-family: inherit;

    &:hover {
      background-color: rgba(255, 255, 255, 0.2);
      transform: translateX(2px);
    }

    i {
      font-size: 0.6875rem;
      transition: transform 0.15s ease;
    }

    &:hover i {
      transform: translateX(2px);
    }
  }

  // ── Progress bar ────────────────────────────────────────
  &__progress {
    position: absolute;
    bottom: 0;
    left: 0;
    height: 3px;
    width: 100%;
    transform-origin: left;
    animation: toast-progress linear forwards;
    border-radius: 0 0 12px 12px;
  }

  // ── Type variants ───────────────────────────────────────
  &--success {
    border-left: 3px solid #4ade80;
    .toast-item__icon { color: #4ade80; }
    .toast-item__progress { background-color: #4ade80; }
    .toast-item__action-btn { background-color: rgba(#4ade80, 0.15); color: #4ade80; }
    .toast-item__action-btn:hover { background-color: rgba(#4ade80, 0.25); }
  }

  &--error {
    border-left: 3px solid #f87171;
    .toast-item__icon { color: #f87171; }
    .toast-item__progress { background-color: #f87171; }
    .toast-item__action-btn { background-color: rgba(#f87171, 0.15); color: #f87171; }
    .toast-item__action-btn:hover { background-color: rgba(#f87171, 0.25); }
  }

  &--warning {
    border-left: 3px solid #fbbf24;
    .toast-item__icon { color: #fbbf24; }
    .toast-item__progress { background-color: #fbbf24; }
    .toast-item__action-btn { background-color: rgba(#fbbf24, 0.15); color: #fbbf24; }
    .toast-item__action-btn:hover { background-color: rgba(#fbbf24, 0.25); }
  }

  &--info {
    border-left: 3px solid #60a5fa;
    .toast-item__icon { color: #60a5fa; }
    .toast-item__progress { background-color: #60a5fa; }
    .toast-item__action-btn { background-color: rgba(#60a5fa, 0.15); color: #60a5fa; }
    .toast-item__action-btn:hover { background-color: rgba(#60a5fa, 0.25); }
  }
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
