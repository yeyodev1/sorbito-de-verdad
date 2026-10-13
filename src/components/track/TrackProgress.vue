<script setup lang="ts">
import { getStepState, statusSteps, stepIcons, stepLabels } from './track';

defineProps<{ status: string }>();
</script>

<template>
  <ol class="track__progress">
    <li
      v-for="(step, i) in statusSteps"
      :key="step"
      :class="['tp-step', `tp-step--${getStepState(step, status)}`]"
    >
      <div class="tp-step__circle">
        <i :class="stepIcons[i]" aria-hidden="true"></i>
      </div>
      <span class="tp-step__label">{{ stepLabels[i] }}</span>
      <div v-if="i < statusSteps.length - 1" class="tp-step__line" aria-hidden="true"></div>
    </li>
  </ol>
</template>

<style lang="scss" scoped>
.track {
  &__progress {
    display: flex;
    padding: 1.5rem 0.5rem;
    border-radius: $radius-xl;
    background-color: var(--color-bg-card);
    border: 1px solid var(--color-border);

    @media (min-width: 640px) {
      padding: 1.75rem 1rem;
    }
  }
}

// ── Progress step ───────────────────────────────
.tp-step {
  position: relative;
  flex: 1 1 0;
  min-width: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  text-align: center;

  &__circle {
    position: relative;
    z-index: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    font-size: 0.875rem;
    background-color: var(--color-bg-subtle);
    color: var(--color-muted);
    border: 2px solid var(--color-border);
    transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease;

    @media (min-width: 640px) {
      width: 46px;
      height: 46px;
    }
  }

  &__label {
    font-size: 0.6875rem;
    font-weight: 600;
    line-height: 1.3;
    color: var(--color-muted);

    @media (min-width: 640px) {
      font-size: 0.8125rem;
    }
  }

  &__line {
    position: absolute;
    top: 20px;
    left: calc(50% + 22px);
    right: calc(-50% + 22px);
    height: 2px;
    background-color: var(--color-border);

    @media (min-width: 640px) {
      top: 23px;
      left: calc(50% + 25px);
      right: calc(-50% + 25px);
    }
  }

  &--done {
    .tp-step__circle {
      background-color: var(--color-accent);
      border-color: var(--color-accent);
      color: var(--color-on-accent);
    }
    .tp-step__label { color: var(--color-primary); }
    .tp-step__line { background-color: var(--color-accent); }
  }

  &--active {
    .tp-step__circle {
      background-color: var(--color-bg-card);
      border-color: var(--color-accent);
      color: var(--color-accent);
      box-shadow: var(--focus-ring);
    }
    .tp-step__label { color: var(--color-accent); }
  }
}
</style>
