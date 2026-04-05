<script setup lang="ts">
import { onMounted } from 'vue';
import { RouterView } from 'vue-router';
import CartDrawer from './components/CartDrawer.vue';
import ToastStack from './components/ToastStack.vue';
import ConfirmModal from './components/ConfirmModal.vue';
import { useAuthStore } from './stores/auth';
import { useCartStore } from './stores/cart';
import { useUIStore } from './stores/ui';

const authStore = useAuthStore();
const cartStore = useCartStore();
const uiStore = useUIStore();

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
    <ToastStack />
    <ConfirmModal />
  </div>
</template>

<style lang="scss">
@use './styles/global.scss';

.app-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
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
