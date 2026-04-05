<script setup lang="ts">
import { onMounted } from 'vue';
import MainLayout from '../layout/MainLayout.vue';
import HeroSection from '../components/HeroSection.vue';
import CinematicBreak from '../components/CinematicBreak.vue';
import FeaturedProducts from '../components/FeaturedProducts.vue';
import CollaboratorsSection from '../components/CollaboratorsSection.vue';
import NewsletterSection from '../components/NewsletterSection.vue';
import { useProductsStore } from '../stores/products';

const productsStore = useProductsStore();
onMounted(() => productsStore.fetchFeatured());
</script>

<template>
  <MainLayout>
    <HeroSection />
    <FeaturedProducts />
    <CinematicBreak />
    <CollaboratorsSection />
    <NewsletterSection />
  </MainLayout>
</template>
