<script setup lang="ts">
const messages = [
  { icon: 'fa-solid fa-hand-sparkles', text: 'Hechas a mano en Ecuador' },
  { icon: 'fa-solid fa-truck-fast', text: 'IVA y envío incluidos' },
  { icon: 'fa-solid fa-lock', text: 'Pago seguro con tarjeta' },
  { icon: 'fa-solid fa-mug-hot', text: 'Estándar 250 ml o XXL' },
];
</script>

<template>
  <div class="announce" role="region" aria-label="Novedades">
    <div class="announce__track">
      <!-- Se duplica la lista para que el desplazamiento sea continuo -->
      <ul v-for="n in 2" :key="n" class="announce__list" :aria-hidden="n === 2">
        <li v-for="m in messages" :key="m.text" class="announce__item">
          <i :class="m.icon" aria-hidden="true"></i>
          {{ m.text }}
        </li>
      </ul>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@keyframes announce-scroll {
  from { transform: translateX(0); }
  to   { transform: translateX(-50%); }
}

.announce {
  overflow: hidden;
  background-color: var(--color-bg-inverse);
  color: var(--color-on-inverse);

  &__track {
    display: flex;
    width: max-content;
    animation: announce-scroll 32s linear infinite;

    @media (prefers-reduced-motion: reduce) {
      animation: none;
    }
  }

  &__list {
    display: flex;
    flex-shrink: 0;
  }

  &__item {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.55rem 2rem;
    font-size: 0.75rem;
    font-weight: 500;
    letter-spacing: 0.02em;
    white-space: nowrap;

    i {
      font-size: 0.7rem;
      color: var(--color-accent);
    }
  }
}
</style>
