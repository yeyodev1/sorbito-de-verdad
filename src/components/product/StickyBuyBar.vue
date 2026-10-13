<script setup lang="ts">
defineProps<{
  name: string;
  total: number;
}>();

const emit = defineEmits<{ add: []; buy: [] }>();

function formatPrice(val: number) {
  return `$${val.toFixed(2)}`;
}
</script>

<template>
  <div class="pd-sticky">
    <div class="pd-sticky__info">
      <span class="pd-sticky__name">{{ name }}</span>
      <strong>{{ formatPrice(total) }}</strong>
    </div>
    <button type="button" class="pd-sticky__add" @click="emit('add')" aria-label="Agregar al carrito">
      <i class="fa-solid fa-plus"></i>
    </button>
    <button type="button" class="btn-primary pd-sticky__buy" @click="emit('buy')">Comprar ahora</button>
  </div>
</template>

<style lang="scss" scoped>
.pd-sticky {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 900;
  display: flex;
  align-items: center;
  gap: 0.625rem;
  padding: 0.625rem 1rem calc(0.625rem + env(safe-area-inset-bottom));
  background-color: color-mix(in srgb, var(--color-bg-card) 94%, transparent);
  backdrop-filter: blur(12px);
  border-top: 1px solid var(--color-border);
  box-shadow: 0 -8px 24px -12px rgba(0, 0, 0, 0.18);

  @media (min-width: 960px) {
    display: none;
  }

  &__info {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    line-height: 1.25;

    strong { font-size: 1.0625rem; font-variant-numeric: tabular-nums; }
  }

  &__name {
    font-size: 0.75rem;
    color: var(--color-muted);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  &__add {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 46px;
    height: 46px;
    border: 1.5px solid var(--color-border-strong);
    border-radius: 50%;
  }

  &__buy {
    flex-shrink: 0;
  }
}
</style>
