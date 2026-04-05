<script setup lang="ts">
import { onMounted, computed } from 'vue';
import { RouterView } from 'vue-router';
import CartDrawer from './components/CartDrawer.vue';
import { useAuthStore } from './stores/auth';
import { useCartStore } from './stores/cart';
import { useUIStore } from './stores/ui';

const authStore = useAuthStore();
const cartStore = useCartStore();
const uiStore = useUIStore();

const notification = computed(() => uiStore.notification);

onMounted(async () => {
  uiStore.applyTheme();
  cartStore.loadFromStorage();
  await authStore.initAuth();
});
</script>

<template>
  <div class="app-container">
    <RouterView v-slot="{ Component, route }">
      <Transition name="page" mode="out-in">
        <component :is="Component" :key="route.path" />
      </Transition>
    </RouterView>
    <CartDrawer />

    <!-- Global Notification Toast -->
    <Transition name="toast-slide">
      <div
        v-if="notification.show"
        :class="['notification-toast', notification.type]"
        role="alert"
      >
        <i v-if="notification.type === 'success'" class="fa-solid fa-circle-check"></i>
        <i v-else-if="notification.type === 'error'" class="fa-solid fa-circle-xmark"></i>
        <i v-else-if="notification.type === 'warning'" class="fa-solid fa-triangle-exclamation"></i>
        <i v-else class="fa-solid fa-circle-info"></i>
        {{ notification.message }}
      </div>
    </Transition>
  </div>
</template>

<style lang="scss">
@use './styles/global.scss';

.app-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.notification-toast {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  z-index: 9999;
  padding: 0.875rem 1.375rem;
  border-radius: 10px;
  font-size: 0.9375rem;
  font-weight: 500;
  box-shadow: 0 8px 24px rgba(26, 26, 26, 0.16);
  display: flex;
  align-items: center;
  gap: 0.625rem;
  max-width: 380px;

  @media (max-width: 480px) {
    left: 1rem;
    right: 1rem;
    bottom: 1rem;
    max-width: 100%;
  }

  &.success { background: #4CAF50; color: white; }
  &.error { background: #E53E3E; color: white; }
  &.info { background: #1A1A1A; color: white; }
  &.warning { background: #ECC94B; color: #1A1A1A; }
}

.toast-slide-enter-active,
.toast-slide-leave-active {
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s ease;
}

.toast-slide-enter-from,
.toast-slide-leave-to {
  transform: translateY(16px);
  opacity: 0;
}

/* ─── Page transition ─────────────────────────────── */
.page-enter-active {
  transition: opacity 0.38s ease, transform 0.38s cubic-bezier(0.4, 0, 0.2, 1);
}
.page-leave-active {
  transition: opacity 0.22s ease, transform 0.22s cubic-bezier(0.4, 0, 0.2, 1);
}
.page-enter-from {
  opacity: 0;
  transform: translateY(18px);
}
.page-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
