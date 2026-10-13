<script setup lang="ts">
import { onMounted } from 'vue';
import MainLayout from '../layout/MainLayout.vue';
import HeroSection from '../components/HeroSection.vue';
import CollectionTiles from '../components/home/CollectionTiles.vue';
import FeaturedProducts from '../components/FeaturedProducts.vue';
import HowToBuy from '../components/home/HowToBuy.vue';
import CraftBento from '../components/home/CraftBento.vue';
import CollaboratorsSection from '../components/CollaboratorsSection.vue';
import NewsletterSection from '../components/NewsletterSection.vue';
import { useProductsStore } from '../stores/products';

const productsStore = useProductsStore();
onMounted(() => productsStore.fetchFeatured());
</script>

<template>
  <MainLayout>
    <HeroSection />
    <CollectionTiles />
    <FeaturedProducts />
    <HowToBuy />
    <CraftBento />
    <CollaboratorsSection />
    <NewsletterSection />
  </MainLayout>
</template>
