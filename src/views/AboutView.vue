<script setup lang="ts">
import MainLayout from '../layout/MainLayout.vue';
import AboutHero from '../components/about/AboutHero.vue';
import AboutStory from '../components/about/AboutStory.vue';
import AboutCollections from '../components/about/AboutCollections.vue';
import AboutValues from '../components/about/AboutValues.vue';
import AboutCta from '../components/about/AboutCta.vue';
</script>

<template>
  <MainLayout>
    <div class="about">
      <AboutHero />
      <AboutStory />
      <AboutCollections />
      <AboutValues />
      <AboutCta />
    </div>
  </MainLayout>
</template>

<style lang="scss" scoped>
.about {
  background-color: var(--color-bg);
}
</style>
