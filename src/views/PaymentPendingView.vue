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
    <section class="payment-pending-view">
      <div class="payment-pending-view__card">
        <div class="payment-pending-view__icon-wrap" aria-hidden="true">
          <i class="fa-regular fa-clock payment-pending-view__icon"></i>
        </div>

        <span class="eyebrow payment-pending-view__eyebrow">
          <span class="payment-pending-view__dot" aria-hidden="true"></span>
          Pendiente
        </span>
        <h1 class="payment-pending-view__title">Esperando confirmación de pago</h1>
        <p class="payment-pending-view__subtitle">
          Hemos enviado una solicitud a tu app PayPhone. Ábrela y confirma el pago para continuar.
        </p>

        <div v-if="orderId" class="payment-pending-view__order">
          <span class="payment-pending-view__order-label">Pedido</span>
          <span class="payment-pending-view__order-id">#{{ orderId }}</span>
        </div>

        <p class="payment-pending-view__auto" aria-live="polite">
          <i class="fa-solid fa-rotate" :class="{ 'fa-spin': checking }"></i>
          Revisamos el estado automáticamente cada pocos segundos.
        </p>

        <div v-if="errorMessage" class="payment-pending-view__error" role="alert">
          <i class="fa-solid fa-circle-exclamation"></i>
          {{ errorMessage }}
        </div>

        <div class="payment-pending-view__actions">
          <button
            class="btn-primary btn-lg btn-block"
            :disabled="checking"
            @click="checkStatus"
          >
            <i class="fa-solid fa-rotate-right" :class="{ 'fa-spin': checking }"></i>
            {{ checking ? 'Verificando...' : 'Verificar ahora' }}
          </button>
          <RouterLink to="/perfil" class="btn-ghost btn-block">
            <i class="fa-solid fa-bag-shopping"></i>
            Ir a mis pedidos
          </RouterLink>
        </div>
      </div>
    </section>
  </MainLayout>
</template>

<style lang="scss" scoped>
.payment-pending-view {
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
      background-color: var(--color-warning);
    }

    @media (min-width: 480px) {
      padding: 3.25rem 2.75rem 2.5rem;
    }
  }

  &__icon-wrap {
    width: 84px;
    height: 84px;
    display: grid;
    place-items: center;
    margin-bottom: 0.25rem;
    border-radius: 50%;
    background-color: var(--color-warning-light);
    box-shadow: 0 0 0 8px color-mix(in srgb, var(--color-warning-light) 50%, transparent);
  }

  &__icon {
    font-size: 2.125rem;
    color: var(--color-warning);
  }

  &__eyebrow {
    color: var(--color-warning);
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

  &__dot {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background-color: currentColor;
    animation: pending-pulse 1.6s ease-in-out infinite;
  }

  &__auto {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.8125rem;
  }

  &__error {
    display: flex;
    align-items: flex-start;
    gap: 0.5rem;
    width: 100%;
    padding: 0.75rem 1rem;
    font-size: 0.875rem;
    text-align: left;
    color: var(--color-error);
    background-color: var(--color-error-light);
    border-radius: $radius-md;

    i { margin-top: 3px; }
  }
}

@keyframes pending-pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.3; }
}
</style>
