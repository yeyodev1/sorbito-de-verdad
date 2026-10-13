<script setup lang="ts">
defineProps<{ status: string }>();

const statusSteps = ['confirmed', 'processing', 'shipped', 'delivered'];
const stepLabels = ['Confirmado', 'En proceso', 'Enviado', 'Entregado'];
const stepIcons = [
  'fa-solid fa-circle-check',
  'fa-solid fa-gear',
  'fa-solid fa-truck',
  'fa-solid fa-house',
];

function getStepState(step: string, currentStatus: string) {
  const idx = statusSteps.indexOf(step);
  const curIdx = statusSteps.indexOf(currentStatus);
  if (curIdx === -1) return 'pending';
  if (idx < curIdx) return 'done';
  if (idx === curIdx) return 'active';
  return 'pending';
}
</script>

<template>
  <ol class="order-detail__tracker" aria-label="Progreso del pedido">
    <li
      v-for="(step, i) in statusSteps"
      :key="step"
      :class="['od-step', `od-step--${getStepState(step, status)}`]"
    >
      <div class="od-step__circle">
        <i :class="getStepState(step, status) === 'done' ? 'fa-solid fa-check' : stepIcons[i]"></i>
      </div>
      <span class="od-step__label">{{ stepLabels[i] }}</span>
      <div v-if="i < statusSteps.length - 1" class="od-step__line" aria-hidden="true"></div>
    </li>
  </ol>
</template>

<style lang="scss" scoped>
.order-detail {
  &__tracker {
    display: flex;
    margin-bottom: 2rem;

    > * {
      flex: 1 1 0;
      min-width: 0;
    }

    padding: 1.5rem 0.75rem;
    background-color: var(--color-bg-card);
    border: 1px solid var(--color-border);
    border-radius: $radius-lg;

    @media (min-width: 640px) {
      padding: 1.75rem 1.5rem;
    }
  }
}

.od-step {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  text-align: center;

  &__circle {
    position: relative;
    z-index: 1;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.875rem;
    color: var(--color-muted);
    background-color: var(--color-bg-subtle);
    border: 1.5px solid var(--color-border);
    border-radius: 50%;
    transition: all 0.3s ease;

    @media (min-width: 640px) {
      width: 46px;
      height: 46px;
      font-size: 1rem;
    }
  }

  &__label {
    font-size: 0.6875rem;
    font-weight: 600;
    color: var(--color-muted);

    @media (min-width: 640px) {
      font-size: 0.8125rem;
    }
  }

  &__line {
    position: absolute;
    top: 20px;
    left: calc(50% + 24px);
    right: calc(-50% + 24px);
    height: 2px;
    background-color: var(--color-border);
    border-radius: 2px;

    @media (min-width: 640px) {
      top: 23px;
      left: calc(50% + 28px);
      right: calc(-50% + 28px);
    }
  }

  &--done {
    .od-step__circle {
      color: var(--color-on-accent);
      background-color: var(--color-accent);
      border-color: var(--color-accent);
    }
    .od-step__label { color: var(--color-primary); }
    .od-step__line { background-color: var(--color-accent); }
  }

  &--active {
    .od-step__circle {
      color: var(--color-accent);
      background-color: var(--color-accent-light);
      border-color: var(--color-accent);
      box-shadow: var(--focus-ring);
    }
    .od-step__label { color: var(--color-accent); }
  }
}
</style>
