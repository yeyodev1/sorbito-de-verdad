<script setup lang="ts">
import MainLayout from '../layout/MainLayout.vue';
import AliadosHero from '../components/aliados/AliadosHero.vue';
import BakanoFeature from '../components/aliados/BakanoFeature.vue';
import AliadosPartners from '../components/aliados/AliadosPartners.vue';
import AliadosCta from '../components/aliados/AliadosCta.vue';
</script>

<template>
  <MainLayout>
    <div class="aliados-page">
      <AliadosHero />
      <BakanoFeature />
      <AliadosPartners />
      <AliadosCta />
    </div>
  </MainLayout>
</template>

<style lang="scss" scoped>
.aliados-page {
  background-color: var(--color-bg);
}
</style>
