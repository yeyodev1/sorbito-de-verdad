<script setup lang="ts">
import MainLayout from '../layout/MainLayout.vue';
import TrackSearch from '../components/track/TrackSearch.vue';
import TrackOrderList from '../components/track/TrackOrderList.vue';
import TrackResult from '../components/track/TrackResult.vue';
import { useTrackOrder } from '../composables/useTrackOrder';

const {
  searchQuery, loading, results, selectedResult, error, searchMode,
  activeResult, switchMode, search,
} = useTrackOrder();
</script>

<template>
  <MainLayout>
    <div class="track">
      <div class="container track__container">

        <!-- Hero -->
        <header class="track__hero">
          <span class="eyebrow">Seguimiento</span>
          <h1 class="track__title">Rastrear pedido</h1>
          <p class="track__subtitle">Ingresa tu número de pedido o tu correo para ver el estado de tu envío.</p>
        </header>

        <TrackSearch
          v-model:query="searchQuery"
          :mode="searchMode"
          :loading="loading"
          :error="error"
          @switch-mode="switchMode"
          @submit="search"
        />

        <!-- Email results: list of orders to pick -->
        <TrackOrderList
          v-if="results.length > 1 && !selectedResult"
          :orders="results"
          @select="selectedResult = $event"
        />

        <!-- Single result -->
        <TrackResult
          v-if="activeResult()"
          :order="activeResult()!"
          :show-back="results.length > 1"
          @back="selectedResult = null"
        />

      </div>
    </div>
  </MainLayout>
</template>

<style lang="scss" scoped>
.track {
  background-color: var(--color-bg);
  min-height: calc(100vh - 70px);
  padding: 2.5rem 0 5rem;

  @media (min-width: 768px) {
    padding: 4.5rem 0 7rem;
  }

  &__container {
    max-width: 760px;
  }

  // ── Hero ──────────────────────────────────
  &__hero {
    display: flex;
    flex-direction: column;
    gap: 0.625rem;
    margin-bottom: 2rem;
  }

  &__title {
    font-size: clamp(2.25rem, 6vw, 3.5rem);
    font-weight: 500;
  }

  &__subtitle {
    max-width: 48ch;
  }
}
</style>
