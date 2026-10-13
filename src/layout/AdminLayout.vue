<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRoute } from 'vue-router';
import AdminSidebar from './admin/AdminSidebar.vue';
import AdminTopbar from './admin/AdminTopbar.vue';

const props = defineProps<{ title?: string }>();

const route = useRoute();

const sidebarOpen = ref(false);

const pageTitle = computed(() => props.title || (route.meta?.title as string) || 'Admin');

function closeSidebar() {
  sidebarOpen.value = false;
}
</script>

<template>
  <div class="admin-layout">
    <!-- Overlay (mobile) -->
    <Transition name="fade">
      <div v-if="sidebarOpen" class="admin-layout__overlay" @click="closeSidebar" />
    </Transition>

    <!-- Sidebar -->
    <AdminSidebar :open="sidebarOpen" @close="closeSidebar" />

    <!-- Main content -->
    <div class="admin-layout__main">
      <AdminTopbar :title="pageTitle" @toggle-menu="sidebarOpen = !sidebarOpen" />

      <!-- Page content -->
      <main class="admin-layout__content">
        <slot />
      </main>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.admin-layout {
  display: flex;
  min-height: 100vh;
  background-color: $admin-bg;
  font-family: 'Inter', sans-serif;

  &__overlay {
    position: fixed;
    inset: 0;
    background-color: rgba(0, 0, 0, 0.6);
    z-index: 98;

    @media (min-width: 1024px) {
      display: none;
    }
  }


  &__main {
    flex: 1;
    display: flex;
    flex-direction: column;
    min-width: 0;
    overflow: hidden;
  }

  &__content {
    flex: 1;
    padding: 2rem;
    overflow-y: auto;

    @media (max-width: 768px) {
      padding: 1rem;
    }
  }
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
