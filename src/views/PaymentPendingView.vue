<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { useRoute, useRouter, RouterLink } from 'vue-router';
import MainLayout from '../layout/MainLayout.vue';
import { orderService } from '../services/order.service';

const route = useRoute();
const router = useRouter();
const orderId = ref((route.query.orderId as string) || '');
const checking = ref(false);
const errorMessage = ref('');
let pollInterval: ReturnType<typeof setInterval> | null = null;

async function checkStatus() {
  if (!orderId.value || checking.value) return;
  checking.value = true;
  errorMessage.value = '';
  try {
    const response = await orderService.getPaymentStatus(orderId.value);
    const { paymentStatus } = response.data;
    if (paymentStatus === 'paid') {
      stopPolling();
      router.push(`/pago/confirmado?orderId=${orderId.value}`);
    } else if (paymentStatus === 'failed') {
      stopPolling();
      router.push(`/pago/rechazado?orderId=${orderId.value}`);
    }
  } catch (err: unknown) {
    errorMessage.value = (err as { message?: string })?.message || 'Error al verificar el estado del pago.';
  } finally {
    checking.value = false;
  }
}

function startPolling() {
  pollInterval = setInterval(checkStatus, 5000);
}

function stopPolling() {
  if (pollInterval) {
    clearInterval(pollInterval);
    pollInterval = null;
  }
}

onMounted(() => {
  if (orderId.value) startPolling();
});

onUnmounted(() => {
  stopPolling();
});
</script>

<template>
  <MainLayout>
    <div class="payment-pending-view">
      <div class="payment-pending-view__card">
        <div class="payment-pending-view__icon-wrap">
          <i class="fa-solid fa-clock payment-pending-view__icon"></i>
        </div>

        <h1 class="payment-pending-view__title">Esperando confirmación de pago</h1>
        <p class="payment-pending-view__message">
          Hemos enviado una solicitud a tu app PayPhone. Ábrela y confirma el pago para continuar.
        </p>

        <div v-if="orderId" class="payment-pending-view__order">
          <span class="payment-pending-view__order-label">Pedido</span>
          <span class="payment-pending-view__order-id">#{{ orderId }}</span>
        </div>

        <div class="payment-pending-view__badge">
          <i class="fa-solid fa-circle-dot"></i>
          Pendiente
        </div>

        <div v-if="errorMessage" class="payment-pending-view__error">
          {{ errorMessage }}
        </div>

        <div class="payment-pending-view__actions">
          <button
            class="payment-pending-view__btn-primary"
            :disabled="checking"
            @click="checkStatus"
          >
            <i class="fa-solid fa-rotate-right" :class="{ 'fa-spin': checking }"></i>
            {{ checking ? 'Verificando...' : 'Verificar ahora' }}
          </button>
          <RouterLink to="/perfil" class="payment-pending-view__link">
            <i class="fa-solid fa-bag-shopping"></i>
            Ir a mis pedidos
          </RouterLink>
        </div>
      </div>
    </div>
  </MainLayout>
</template>

<style lang="scss" scoped>
@use "sass:color";

.payment-pending-view {
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
    width: 80px;
    height: 80px;
    border-radius: 50%;
    background-color: rgba(#ECC94B, 0.15);
    border: 2px solid #ECC94B;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &__icon {
    font-size: 2rem;
    color: #D69E2E;
    animation: pulse-clock 2s ease-in-out infinite;
  }

  &__title {
    font-family: var(--font-heading);
    font-size: 1.625rem;
    font-weight: 700;
    color: var(--color-primary);
    line-height: 1.3;
  }

  &__message {
    font-size: 0.9375rem;
    color: var(--color-muted);
    line-height: 1.7;
    max-width: 360px;
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

  &__badge {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    padding: 0.375rem 1rem;
    background-color: rgba(#ECC94B, 0.15);
    color: #B7791F;
    border-radius: $radius-full;
    font-size: 0.8125rem;
    font-weight: 600;

    i { font-size: 0.6875rem; }
  }

  &__error {
    width: 100%;
    padding: 0.75rem 1rem;
    background-color: rgba(#E53E3E, 0.08);
    border: 1px solid rgba(#E53E3E, 0.3);
    border-radius: $radius-sm;
    font-size: 0.875rem;
    color: var(--color-error);
  }

  &__actions {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.875rem;
    width: 100%;
    margin-top: 0.25rem;
  }

  &__btn-primary {
    width: 100%;
    padding: 0.875rem 1.5rem;
    background-color: $color-accent;
    color: white;
    border: none;
    border-radius: $radius-md;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    transition: background-color 0.2s ease, transform 0.2s ease;
    font-family: var(--font-body);

    &:hover:not(:disabled) {
      background-color: color.adjust($color-accent, $lightness: -8%);
      transform: translateY(-1px);
    }

    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
  }

  &__link {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    font-size: 0.9375rem;
    color: var(--color-muted);
    text-decoration: none;
    font-weight: 500;
    transition: color 0.2s ease;

    &:hover { color: $color-accent; }
  }
}

@keyframes pulse-clock {
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.1); opacity: 0.75; }
}
</style>
