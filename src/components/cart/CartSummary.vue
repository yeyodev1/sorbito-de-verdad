<script setup lang="ts">
defineProps<{ subtotal: number }>();
const emit = defineEmits<{ checkout: [] }>();

function formatPrice(val: number) {
  return `$${val.toFixed(2)}`;
}
</script>

<template>
  <aside class="cv-sum">
    <h2 class="cv-sum__title">Resumen</h2>
    <div class="cv-sum__row">
      <span>Subtotal</span>
      <strong>{{ formatPrice(subtotal) }}</strong>
    </div>
    <div class="cv-sum__row">
      <span>Envío</span>
      <span class="cv-sum__muted">Se calcula en el pago</span>
    </div>
    <button class="btn-primary btn-lg btn-block" @click="emit('checkout')">
      <i class="fa-solid fa-lock"></i> Pagar ahora
    </button>
    <p class="cv-sum__secure"><i class="fa-solid fa-shield-halved"></i> Pago seguro con tarjeta vía PayPhone</p>
  </aside>
</template>

<style lang="scss" scoped>
.cv-sum {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1.5rem;
  background-color: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: $radius-lg;

  @media (min-width: 960px) {
    position: sticky;
    top: 96px;
  }

  &__title {
    font-size: 1.25rem;
  }

  &__row {
    display: flex;
    justify-content: space-between;
    font-size: 0.9375rem;

    strong { font-size: 1.25rem; font-variant-numeric: tabular-nums; }
  }

  &__muted {
    font-size: 0.8125rem;
    color: var(--color-muted);
  }

  &__secure {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.375rem;
    font-size: 0.75rem;

    i { color: var(--color-success); }
  }
}
</style>
