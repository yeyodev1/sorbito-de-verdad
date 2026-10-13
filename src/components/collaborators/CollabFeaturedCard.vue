<script setup lang="ts">
import { BAKANO_LOGO, BAKANO_TEAM_IMG } from '../../data/collaborators';
</script>

<template>
  <!-- Bakano — featured wide card -->
  <a
    href="https://bakano.ec/"
    target="_blank"
    rel="noopener noreferrer"
    class="collab__card collab__card--featured"
  >
    <div class="collab__card-bg" :style="{ backgroundImage: `url(${BAKANO_TEAM_IMG})` }"></div>
    <div class="collab__card-overlay collab__card-overlay--featured"></div>
    <div class="collab__card-content collab__card-content--featured">
      <span class="collab__card-role">Aliado digital oficial</span>
      <img :src="BAKANO_LOGO" alt="Bakano" class="collab__card-featured-logo" loading="lazy" />
      <p class="collab__card-tagline">“Nosotros hacemos procesos de marketing y ventas. Conectamos a tus clientes potenciales con tu canal de transacción para que tu negocio crezca.”</p>
      <p class="collab__card-desc">Agencia de consultoría #1 en Ecuador. Detrás de la estrategia digital y el desarrollo web de Sorbito de Verdad.</p>
      <span class="collab__card-cta">
        bakano.ec
        <i class="fa-solid fa-arrow-up-right-from-square"></i>
      </span>
    </div>
  </a>
</template>

<!-- Estilos de tarjeta compartidos con CollabCard -->
<style lang="scss" scoped src="./collab-card.scss"></style>
