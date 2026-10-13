<script setup lang="ts">
import { computed } from 'vue';
import { useRoute, RouterLink } from 'vue-router';
import MainLayout from '../layout/MainLayout.vue';

const route = useRoute();
const orderId = computed(() => (route.query.orderId as string) || '');
</script>

<template>
  <MainLayout>
    <section class="payment-rejected-view">
      <div class="payment-rejected-view__card">
        <div class="payment-rejected-view__icon-wrap" aria-hidden="true">
          <i class="fa-solid fa-xmark payment-rejected-view__icon"></i>
        </div>

        <span class="eyebrow payment-rejected-view__eyebrow">Pago rechazado</span>
        <h1 class="payment-rejected-view__title">Pago no completado</h1>
        <p class="payment-rejected-view__subtitle">Tu pago fue rechazado o cancelado. No se realizó ningún cobro; puedes intentarlo de nuevo.</p>

        <div v-if="orderId" class="payment-rejected-view__order">
          <span class="payment-rejected-view__order-label">Pedido</span>
          <span class="payment-rejected-view__order-id">#{{ orderId }}</span>
        </div>

        <div class="payment-rejected-view__actions">
          <RouterLink to="/checkout" class="btn-primary btn-lg btn-block">
            <i class="fa-solid fa-rotate-left"></i>
            Intentar de nuevo
          </RouterLink>
          <RouterLink to="/perfil" class="btn-outline btn-lg btn-block">
            <i class="fa-solid fa-bag-shopping"></i>
            Ver mis pedidos
          </RouterLink>
        </div>
      </div>
    </section>
  </MainLayout>
</template>

<style lang="scss" scoped>
.payment-rejected-view {
  min-height: 72vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 3.5rem 1rem 5rem;

  &__card {
    position: relative;
    width: 100%;
    max-width: 500px;
    padding: 2.75rem 1.5rem 2rem;
    background-color: var(--color-bg-card);
    border: 1px solid var(--color-border);
    border-radius: $radius-xl;
    box-shadow: var(--shadow-lg);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    text-align: center;
    overflow: hidden;

    &::before {
      content: '';
      position: absolute;
      inset: 0 0 auto;
      height: 4px;
      background-color: var(--color-error);
    }

    @media (min-width: 480px) {
      padding: 3.25rem 2.75rem 2.5rem;
    }
  }

  &__icon-wrap {
    width: 84px;
    height: 84px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 0.25rem;
    border-radius: 50%;
    background-color: var(--color-error-light);
    box-shadow: 0 0 0 8px color-mix(in srgb, var(--color-error-light) 50%, transparent);
  }

  &__icon {
    font-size: 2.125rem;
    color: var(--color-error);
  }

  &__eyebrow {
    color: var(--color-error);
  }

  &__title {
    font-size: clamp(1.75rem, 5vw, 2.25rem);
  }

  &__subtitle {
    font-size: 1rem;
    max-width: 36ch;
  }

  &__order {
    display: inline-flex;
    align-items: center;
    gap: 0.625rem;
    max-width: 100%;
    padding: 0.5rem 0.5rem 0.5rem 1rem;
    background-color: var(--color-bg-subtle);
    border: 1px solid var(--color-border);
    border-radius: $radius-full;
  }

  &__order-label {
    font-size: 0.75rem;
    font-weight: 600;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--color-muted);
  }

  &__order-id {
    padding: 0.25rem 0.75rem;
    font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
    font-size: 0.8125rem;
    font-weight: 600;
    color: var(--color-primary);
    background-color: var(--color-bg-card);
    border-radius: $radius-full;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &__actions {
    display: flex;
    flex-direction: column;
    gap: 0.625rem;
    width: 100%;
    margin-top: 0.75rem;
  }
}
</style>
