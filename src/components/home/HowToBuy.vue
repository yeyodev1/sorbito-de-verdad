<script setup lang="ts">
import { RouterLink } from 'vue-router';

const STEPS = [
  { n: '01', icon: 'fa-solid fa-mug-hot', title: 'Elige tu taza', text: 'Modelo y tamaño. Toca “Comprar ya” y pasas directo al pago.' },
  { n: '02', icon: 'fa-solid fa-credit-card', title: 'Paga con tarjeta', text: 'Solo tus datos de envío y pagas seguro con PayPhone.' },
  { n: '03', icon: 'fa-solid fa-box-open', title: 'Recíbela en casa', text: 'Te avisamos por correo y puedes rastrear tu pedido.' },
];
</script>

<template>
  <section class="how" aria-labelledby="how-title">
    <div class="container">
      <div class="how__box">
        <div class="how__intro">
          <span class="how__eyebrow">Así de fácil</span>
          <h2 id="how-title" class="how__title">Tu taza en <em>3 pasos</em></h2>
          <RouterLink to="/tienda" class="btn-primary btn-lg">
            Empezar ahora <i class="fa-solid fa-arrow-right"></i>
          </RouterLink>
        </div>

        <ol class="how__steps">
          <li v-for="s in STEPS" :key="s.n" class="how__step">
            <span class="how__num">{{ s.n }}</span>
            <span class="how__icon"><i :class="s.icon" aria-hidden="true"></i></span>
            <h3 class="how__step-title">{{ s.title }}</h3>
            <p class="how__step-text">{{ s.text }}</p>
          </li>
        </ol>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.how {
  padding: 1rem 0 3rem;

  @media (min-width: 768px) {
    padding: 1rem 0 5rem;
  }

  &__box {
    display: grid;
    gap: 2rem;
    padding: 2rem 1.25rem;
    color: var(--color-on-inverse);
    background-color: var(--color-bg-inverse);
    border-radius: $radius-xl;

    @media (min-width: 960px) {
      grid-template-columns: 0.8fr 1.6fr;
      align-items: center;
      gap: 3rem;
      padding: 3.5rem;
    }
  }

  &__intro {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  &__eyebrow {
    font-size: 0.75rem;
    font-weight: 600;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--color-accent);
  }

  &__title {
    font-size: clamp(2rem, 4.5vw, 3.25rem);
    color: var(--color-on-inverse);

    em { color: var(--color-accent); }
  }

  &__steps {
    display: grid;
    gap: 0.75rem;

    @media (min-width: 700px) {
      grid-template-columns: repeat(3, minmax(0, 1fr));
    }
  }

  &__step {
    position: relative;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    padding: 1.25rem;
    background-color: color-mix(in srgb, var(--color-on-inverse) 7%, transparent);
    border: 1px solid color-mix(in srgb, var(--color-on-inverse) 12%, transparent);
    border-radius: $radius-lg;
  }

  &__num {
    position: absolute;
    top: 1rem;
    right: 1.125rem;
    font-family: var(--font-heading);
    font-size: 1.75rem;
    font-weight: 700;
    letter-spacing: -0.04em;
    opacity: 0.18;
  }

  &__icon {
    display: grid;
    place-items: center;
    width: 44px;
    height: 44px;
    margin-bottom: 0.25rem;
    color: var(--color-on-accent);
    background-color: var(--color-accent);
    border-radius: 14px;
  }

  &__step-title {
    font-size: 1.125rem;
    color: var(--color-on-inverse);
  }

  &__step-text {
    font-size: 0.875rem;
    color: color-mix(in srgb, var(--color-on-inverse) 70%, transparent);
  }
}
</style>
