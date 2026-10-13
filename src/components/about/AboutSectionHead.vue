<script setup lang="ts">
defineProps<{
  eyebrow: string;
  title: string;
  subtitle?: string;
}>();
</script>

<template>
  <div class="about-section-head">
    <span class="eyebrow">{{ eyebrow }}</span>
    <h2 class="about-section-head__title">{{ title }}</h2>
    <p v-if="subtitle" class="about-section-head__subtitle">{{ subtitle }}</p>
  </div>
</template>

<style lang="scss" scoped>
// ── Shared section head ─────────────────────────
.about-section-head {
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
  margin-bottom: 2.5rem;

  @media (min-width: 768px) {
    margin-bottom: 3.5rem;
  }

  &__title {
    font-weight: 500;
  }

  &__subtitle {
    max-width: 48ch;
  }
}
</style>
