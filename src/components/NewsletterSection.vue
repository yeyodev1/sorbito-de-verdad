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
  <section class="newsletter">
    <!-- Cinematic background -->
    <div class="newsletter__bg" aria-hidden="true">
      <img :src="SPLASH_BG" alt="" class="newsletter__bg-img" loading="lazy" />
      <div class="newsletter__bg-overlay"></div>
    </div>

    <div class="container newsletter__inner">
      <div class="newsletter__content">
        <span class="newsletter__eyebrow">
          <span class="newsletter__eyebrow-line"></span>
          Newsletter exclusivo
          <span class="newsletter__eyebrow-line"></span>
        </span>

        <h2 class="newsletter__title">
          Sé el primero<br>en <em>descubrirlo</em>
        </h2>

        <p class="newsletter__subtitle">
          Lanzamientos exclusivos, colecciones especiales y descuentos
          para suscriptores. Solo lo que realmente vale la pena.
        </p>

        <Transition name="fade" mode="out-in">
          <form v-if="!submitted" class="newsletter__form" @submit.prevent="handleSubmit">
            <div class="newsletter__input-wrap">
              <i class="fa-regular fa-envelope newsletter__input-icon"></i>
              <input
                v-model="email"
                type="email"
                placeholder="tu@email.com"
                class="newsletter__input"
                required
                aria-label="Tu correo electrónico"
              />
              <button type="submit" class="newsletter__btn" :disabled="loading">
                <span v-if="loading">
                  <i class="fa-solid fa-circle-notch fa-spin"></i>
                </span>
                <span v-else>Suscribirme</span>
              </button>
            </div>
            <p class="newsletter__disclaimer">
              <i class="fa-solid fa-lock"></i>
              Sin spam. Solo lo que importa. Cancela cuando quieras.
            </p>
          </form>

          <div v-else class="newsletter__success">
            <div class="newsletter__success-icon">
              <i class="fa-solid fa-circle-check"></i>
            </div>
            <div>
              <p class="newsletter__success-title">¡Ya estás dentro!</p>
              <p class="newsletter__success-text">Te escribiremos cuando tengamos algo especial para ti.</p>
            </div>
          </div>
        </Transition>
      </div>

      <!-- Right: feature pills -->
      <div class="newsletter__perks">
        <div class="newsletter__perk">
          <div class="newsletter__perk-icon">
            <i class="fa-solid fa-bolt"></i>
          </div>
          <div>
            <p class="newsletter__perk-title">Acceso anticipado</p>
            <p class="newsletter__perk-text">Conoce las nuevas colecciones antes que nadie</p>
          </div>
        </div>
        <div class="newsletter__perk">
          <div class="newsletter__perk-icon">
            <i class="fa-solid fa-tag"></i>
          </div>
          <div>
            <p class="newsletter__perk-title">Descuentos exclusivos</p>
            <p class="newsletter__perk-text">Ofertas especiales solo para suscriptores</p>
          </div>
        </div>
        <div class="newsletter__perk">
          <div class="newsletter__perk-icon">
            <i class="fa-solid fa-star"></i>
          </div>
          <div>
            <p class="newsletter__perk-title">Ediciones limitadas</p>
            <p class="newsletter__perk-text">Piezas únicas que no se repiten</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>

.newsletter {
  position: relative;
  padding: 7rem 0;
  overflow: hidden;

  @media (max-width: 768px) {
    padding: 4.5rem 0;
  }

  // ── Background ──────────────────────────────────────────

  &__bg {
    position: absolute;
    inset: 0;
    z-index: 0;
  }

  &__bg-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
    display: block;
    opacity: 0.45;
  }

  &__bg-overlay {
    position: absolute;
    inset: 0;
    background:
      linear-gradient(135deg, rgba(#070707, 0.97) 0%, rgba(#0d0905, 0.88) 100%);
  }

  // ── Layout ──────────────────────────────────────────────

  &__inner {
    position: relative;
    z-index: 1;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 5rem;
    align-items: center;

    @media (max-width: 900px) {
      grid-template-columns: 1fr;
      gap: 3rem;
    }
  }

  &__content {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  // ── Eyebrow ─────────────────────────────────────────────

  &__eyebrow {
    display: inline-flex;
    align-items: center;
    gap: 0.75rem;
    font-size: 0.6875rem;
    font-weight: 700;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: $color-accent;
    width: fit-content;
  }

  &__eyebrow-line {
    display: inline-block;
    width: 28px;
    height: 1px;
    background: $color-accent;
  }

  // ── Title ───────────────────────────────────────────────

  &__title {
    font-family: var(--font-heading);
    font-size: clamp(2rem, 4vw, 3rem);
    font-weight: 700;
    color: #FFFFFF;
    line-height: 1.1;

    em {
      font-style: italic;
      color: $color-accent;
    }
  }

  &__subtitle {
    font-size: 1rem;
    color: rgba(255, 255, 255, 0.58);
    line-height: 1.75;
    max-width: 400px;
  }

  // ── Form ────────────────────────────────────────────────

  &__form {
    display: flex;
    flex-direction: column;
    gap: 0.875rem;
    max-width: 480px;
  }

  &__input-wrap {
    position: relative;
    display: flex;
    align-items: center;
    background: rgba(255, 255, 255, 0.06);
    border: 1px solid rgba(255, 255, 255, 0.14);
    border-radius: $radius-md;
    overflow: hidden;
    backdrop-filter: blur(8px);
    transition: border-color 0.2s ease;

    &:focus-within {
      border-color: $color-accent;
    }
  }

  &__input-icon {
    flex-shrink: 0;
    padding: 0 1rem;
    color: rgba(255, 255, 255, 0.35);
    font-size: 0.9375rem;
  }

  &__input {
    flex: 1;
    padding: 1rem 0;
    background: transparent;
    border: none;
    font-size: 0.9375rem;
    color: #FFFFFF;
    font-family: var(--font-body);
    min-width: 0;

    &::placeholder { color: rgba(255, 255, 255, 0.3); }
    &:focus { outline: none; }
  }

  &__btn {
    flex-shrink: 0;
    padding: 1rem 1.5rem;
    background-color: $color-accent;
    color: #FFFFFF;
    border: none;
    font-size: 0.875rem;
    font-weight: 700;
    letter-spacing: 0.02em;
    cursor: pointer;
    transition: all 0.2s ease;
    font-family: var(--font-body);
    white-space: nowrap;

    &:hover:not(:disabled) {
      background-color: lighten(#C8956C, 8%);
    }

    &:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }
  }

  &__disclaimer {
    display: flex;
    align-items: center;
    gap: 0.375rem;
    font-size: 0.8125rem;
    color: rgba(255, 255, 255, 0.35);

    i { font-size: 0.7rem; }
  }

  // ── Success ─────────────────────────────────────────────

  &__success {
    display: flex;
    align-items: center;
    gap: 1.25rem;
    background: rgba($color-accent, 0.1);
    border: 1px solid rgba($color-accent, 0.3);
    border-radius: $radius-md;
    padding: 1.5rem;
    max-width: 480px;
  }

  &__success-icon {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    background: rgba($color-accent, 0.2);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    font-size: 1.25rem;
    color: $color-accent;
  }

  &__success-title {
    font-size: 1rem;
    font-weight: 700;
    color: #FFFFFF;
    margin-bottom: 0.25rem;
  }

  &__success-text {
    font-size: 0.875rem;
    color: rgba(255, 255, 255, 0.6);
  }

  // ── Perks (right column) ────────────────────────────────

  &__perks {
    display: flex;
    flex-direction: column;
    gap: 1.75rem;

    @media (max-width: 900px) {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 1rem;
    }

    @media (max-width: 640px) {
      grid-template-columns: 1fr;
    }
  }

  &__perk {
    display: flex;
    align-items: flex-start;
    gap: 1rem;
  }

  &__perk-icon {
    width: 44px;
    height: 44px;
    border-radius: $radius-md;
    background: rgba($color-accent, 0.12);
    border: 1px solid rgba($color-accent, 0.2);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1rem;
    color: $color-accent;
    flex-shrink: 0;
  }

  &__perk-title {
    font-size: 0.9375rem;
    font-weight: 600;
    color: #FFFFFF;
    margin-bottom: 0.25rem;
  }

  &__perk-text {
    font-size: 0.8125rem;
    color: rgba(255, 255, 255, 0.45);
    line-height: 1.5;
  }
}

.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
