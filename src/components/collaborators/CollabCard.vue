<script setup lang="ts">
import type { collaborators } from '../../data/collaborators';

defineProps<{ collaborator: (typeof collaborators)[number] }>();
</script>

<template>
  <a
    :href="collaborator.url"
    target="_blank"
    rel="noopener noreferrer"
    class="collab__card"
  >
    <div
      class="collab__card-bg"
      :style="collaborator.bgImage
        ? { backgroundImage: `url(${collaborator.bgImage})` }
        : { backgroundColor: collaborator.bgColor ?? '#0D1117' }"
    ></div>
    <div class="collab__card-overlay"></div>

    <div v-if="collaborator.logo" class="collab__card-logo-wrap">
      <img :src="collaborator.logo" :alt="collaborator.name + ' logo'" class="collab__card-logo" :style="{ filter: collaborator.logoFilter || 'none' }" loading="lazy" />
    </div>

    <div class="collab__card-content">
      <span class="collab__card-role">{{ collaborator.eyebrow }}</span>
      <h3 class="collab__card-name">{{ collaborator.name }}</h3>
      <p class="collab__card-tagline">“{{ collaborator.tagline }}”</p>
      <p class="collab__card-desc">{{ collaborator.description }}</p>
      <span class="collab__card-cta">
        {{ collaborator.cta }}
        <i class="fa-solid fa-arrow-up-right-from-square"></i>
      </span>
    </div>
  </a>
</template>

<!-- Estilos de tarjeta compartidos con CollabFeaturedCard -->
<style lang="scss" scoped src="./collab-card.scss"></style>
