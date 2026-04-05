<script setup lang="ts">
import { onMounted } from 'vue';
import MainLayout from '../layout/MainLayout.vue';
import HeroSection from '../components/HeroSection.vue';
import FeaturedProducts from '../components/FeaturedProducts.vue';
import CinematicBreak from '../components/CinematicBreak.vue';
import CollectionBanner from '../components/CollectionBanner.vue';
import CollaboratorsSection from '../components/CollaboratorsSection.vue';
import NewsletterSection from '../components/NewsletterSection.vue';
import { useProductsStore } from '../stores/products';

const productsStore = useProductsStore();

onMounted(async () => {
  await productsStore.fetchFeatured();
});
</script>

<template>
  <MainLayout>
    <HeroSection />
    <FeaturedProducts />
    <CinematicBreak />
    <CollectionBanner />
    <CollaboratorsSection />
    <NewsletterSection />
  </MainLayout>
</template>
