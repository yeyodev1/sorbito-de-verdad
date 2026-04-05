<script setup lang="ts">
import { computed } from 'vue';
import { useRoute, RouterLink } from 'vue-router';
import MainLayout from '../layout/MainLayout.vue';

const route = useRoute();
const orderId = computed(() => (route.query.orderId as string) || '');
</script>

<template>
  <MainLayout>
    <div class="payment-rejected-view">
      <div class="payment-rejected-view__card">
        <div class="payment-rejected-view__icon-wrap">
          <i class="fa-solid fa-circle-xmark payment-rejected-view__icon"></i>
        </div>

        <h1 class="payment-rejected-view__title">Pago no completado</h1>
        <p class="payment-rejected-view__subtitle">Tu pago fue rechazado o cancelado. Puedes intentarlo de nuevo.</p>

        <div v-if="orderId" class="payment-rejected-view__order">
          <span class="payment-rejected-view__order-label">Pedido</span>
          <span class="payment-rejected-view__order-id">#{{ orderId }}</span>
        </div>

        <div class="payment-rejected-view__actions">
          <RouterLink to="/checkout" class="payment-rejected-view__btn-primary">
            <i class="fa-solid fa-rotate-left"></i>
            Intentar de nuevo
          </RouterLink>
          <RouterLink to="/perfil" class="payment-rejected-view__btn-secondary">
            <i class="fa-solid fa-bag-shopping"></i>
            Ver mis pedidos
          </RouterLink>
        </div>
      </div>
    </div>
  </MainLayout>
</template>

<style lang="scss" scoped>
@use "sass:color";

.payment-rejected-view {
  min-height: 70vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4rem 1rem;

  &__card {
    background-color: var(--color-bg-card);
    border: 1px solid var(--color-border);
    border-radius: $radius-xl;
    box-shadow: 0 8px 40px rgba(0, 0, 0, 0.18);
    max-width: 480px;
    width: 100%;
    padding: 3rem 2.5rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1.25rem;
    text-align: center;
  }

  &__icon-wrap {
    width: 88px;
    height: 88px;
    border-radius: 50%;
    background-color: rgba(#ef4444, 0.1);
    border: 2px solid #ef4444;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &__icon {
    font-size: 2.5rem;
    color: #ef4444;
  }

  &__title {
    font-family: var(--font-heading);
    font-size: 2rem;
    font-weight: 700;
    color: var(--color-primary);
    line-height: 1.2;
  }

  &__subtitle {
    font-size: 1rem;
    color: var(--color-muted);
    line-height: 1.6;
  }

  &__order {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.625rem 1.25rem;
    background-color: var(--color-bg-subtle);
    border-radius: $radius-md;
    border: 1px solid var(--color-border);
  }

  &__order-label {
    font-size: 0.875rem;
    color: var(--color-muted);
    font-weight: 500;
  }

  &__order-id {
    font-size: 0.9375rem;
    font-weight: 700;
    color: var(--color-primary);
    font-family: var(--font-heading);
  }

  &__actions {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    width: 100%;
    margin-top: 0.25rem;
  }

  &__btn-primary {
    width: 100%;
    padding: 0.875rem 1.5rem;
    background-color: $color-accent;
    color: white;
    border-radius: $radius-md;
    text-decoration: none;
    font-size: 1rem;
    font-weight: 600;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    transition: background-color 0.2s ease, transform 0.2s ease;

    &:hover {
      background-color: color.adjust($color-accent, $lightness: -8%);
      transform: translateY(-1px);
    }
  }

  &__btn-secondary {
    width: 100%;
    padding: 0.875rem 1.5rem;
    border: 2px solid var(--color-border);
    color: var(--color-primary);
    border-radius: $radius-md;
    text-decoration: none;
    font-size: 1rem;
    font-weight: 500;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    transition: border-color 0.2s ease;

    &:hover { border-color: var(--color-primary); }
  }
}
</style>
