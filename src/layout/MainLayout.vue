<script setup lang="ts">
import Navbar from './Navbar.vue';
import Footer from './Footer.vue';
</script>

<template>
  <div class="main-layout">
    <Navbar />
    <main class="main-layout__content">
      <slot />
    </main>
    <Footer />
  </div>
</template>

<style lang="scss" scoped>
.main-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;

  &__content {
    flex: 1;
  }
}
</style>
