<script setup lang="ts">
import { ref } from 'vue';

// Coffee splash on pure black — dramatic
const SPLASH_BG = 'https://res.cloudinary.com/dpjzfua3n/image/upload/q_auto,f_auto,w_1600/v1775351858/sorbito-de-verdad/products/zrl0xmlbrhduqdwma6mh.jpg';

const email = ref('');
const submitted = ref(false);
const loading = ref(false);

async function handleSubmit() {
  if (!email.value || loading.value) return;
  loading.value = true;
  await new Promise(resolve => setTimeout(resolve, 800));
  submitted.value = true;
  loading.value = false;
}
</script>

<template>
  <section class="newsletter" aria-labelledby="newsletter-title">
    <div class="container">
      <div class="newsletter__card">
        <div class="newsletter__content">
          <span class="newsletter__eyebrow">Newsletter exclusivo</span>

          <h2 id="newsletter-title" class="newsletter__title">
            Sé el primero en <em>descubrirlo</em>
          </h2>

          <p class="newsletter__subtitle">
            Lanzamientos exclusivos, colecciones especiales y descuentos
            para suscriptores. Solo lo que realmente vale la pena.
          </p>

          <Transition name="fade" mode="out-in">
            <form v-if="!submitted" class="newsletter__form" @submit.prevent="handleSubmit">
              <div class="newsletter__input-wrap">
                <input
                  v-model="email"
                  type="email"
                  placeholder="tu@email.com"
                  class="newsletter__input"
                  required
                  autocomplete="email"
                  aria-label="Tu correo electrónico"
                />
                <button type="submit" class="newsletter__btn" :disabled="loading">
                  <i v-if="loading" class="fa-solid fa-circle-notch fa-spin"></i>
                  <span v-else>Suscribirme</span>
                </button>
              </div>
              <p class="newsletter__disclaimer">
                Sin spam. Solo lo que importa. Cancela cuando quieras.
              </p>
            </form>

            <div v-else class="newsletter__success" role="status">
              <i class="fa-solid fa-circle-check newsletter__success-icon"></i>
              <div>
                <p class="newsletter__success-title">¡Ya estás dentro!</p>
                <p class="newsletter__success-text">Te escribiremos cuando tengamos algo especial para ti.</p>
              </div>
            </div>
          </Transition>

          <ul class="newsletter__perks">
            <li><i class="fa-solid fa-bolt"></i> Acceso anticipado</li>
            <li><i class="fa-solid fa-tag"></i> Descuentos exclusivos</li>
            <li><i class="fa-solid fa-star"></i> Ediciones limitadas</li>
          </ul>
        </div>

        <div class="newsletter__visual" aria-hidden="true">
          <img :src="SPLASH_BG" alt="" class="newsletter__img" loading="lazy" />
        </div>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.newsletter {
  padding: 1rem 0 4rem;
  background-color: var(--color-bg);

  @media (min-width: 768px) {
    padding: 2rem 0 6rem;
  }

  &__card {
    display: grid;
    grid-template-columns: 1fr;
    overflow: hidden;
    border-radius: $radius-xl;
    background-color: var(--color-bg-inverse);
    color: var(--color-on-inverse);

    @media (min-width: 900px) {
      grid-template-columns: 1.2fr 1fr;
    }
  }

  &__content {
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
    padding: 2.25rem 1.25rem;

    @media (min-width: 768px) {
      padding: 4rem;
    }
  }

  &__eyebrow {
    font-size: 0.75rem;
    font-weight: 600;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--color-accent);
  }

  &__title {
    font-size: clamp(2rem, 4.5vw, 3rem);
    font-weight: 500;
    color: var(--color-on-inverse);

    em {
      font-style: italic;
      font-weight: 400;
      color: var(--color-accent);
    }
  }

  &__subtitle {
    max-width: 46ch;
    color: color-mix(in srgb, var(--color-on-inverse) 70%, transparent);
  }

  &__form {
    display: flex;
    flex-direction: column;
    gap: 0.625rem;
  }

  &__input-wrap {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;

    @media (min-width: 480px) {
      flex-direction: row;
      padding: 0.3rem;
      border-radius: $radius-full;
      background-color: color-mix(in srgb, var(--color-on-inverse) 8%, transparent);
      border: 1px solid color-mix(in srgb, var(--color-on-inverse) 18%, transparent);
    }
  }

  &__input {
    flex: 1;
    min-width: 0;
    min-height: 48px;
    padding: 0 1.1rem;
    font-size: 1rem;
    color: var(--color-on-inverse);
    background: color-mix(in srgb, var(--color-on-inverse) 8%, transparent);
    border: 1px solid color-mix(in srgb, var(--color-on-inverse) 18%, transparent);
    border-radius: $radius-full;
    outline: none;

    &::placeholder { color: color-mix(in srgb, var(--color-on-inverse) 45%, transparent); }

    &:focus-visible { border-color: var(--color-accent); }

    @media (min-width: 480px) {
      background: transparent;
      border: none;
    }
  }

  &__btn {
    min-height: 48px;
    padding: 0 1.5rem;
    font-size: 0.95rem;
    font-weight: 600;
    color: var(--color-on-accent);
    background-color: var(--color-accent);
    border-radius: $radius-full;
    transition: background-color 0.2s ease;

    &:hover:not(:disabled) { background-color: var(--color-accent-hover); }
    &:disabled { opacity: 0.7; }
  }

  &__disclaimer {
    font-size: 0.8rem;
    color: color-mix(in srgb, var(--color-on-inverse) 50%, transparent);
  }

  &__success {
    display: flex;
    align-items: flex-start;
    gap: 0.875rem;
    padding: 1rem 1.25rem;
    border-radius: $radius-lg;
    background-color: color-mix(in srgb, var(--color-on-inverse) 8%, transparent);
  }

  &__success-icon {
    font-size: 1.5rem;
    color: var(--color-accent);
  }

  &__success-title {
    font-weight: 600;
    color: var(--color-on-inverse);
  }

  &__success-text {
    font-size: 0.9rem;
    color: color-mix(in srgb, var(--color-on-inverse) 65%, transparent);
  }

  &__perks {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem 1.25rem;
    padding-top: 0.5rem;
    font-size: 0.85rem;
    color: color-mix(in srgb, var(--color-on-inverse) 75%, transparent);

    li {
      display: inline-flex;
      align-items: center;
      gap: 0.45rem;
    }

    i { color: var(--color-accent); }
  }

  &__visual {
    min-height: 220px;

    @media (min-width: 900px) {
      min-height: 100%;
    }
  }

  &__img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}
</style>
