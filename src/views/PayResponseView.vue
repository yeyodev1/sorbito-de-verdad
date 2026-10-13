<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRoute, useRouter, RouterLink } from 'vue-router';
import MainLayout from '../layout/MainLayout.vue';
import { orderService } from '../services/order.service';

const route = useRoute();
const router = useRouter();

const status = ref<'verifying' | 'success' | 'failed' | 'error'>('verifying');
const message = ref('Verificando tu pago...');

onMounted(async () => {
  // PayPhone redirects with: ?id=<number>&clientTransactionId=<string>
  const id = route.query.id as string | undefined;
  const clientTransactionId = route.query.clientTransactionId as string | undefined;

  if (!id || !clientTransactionId) {
    status.value = 'error';
    message.value = 'No se encontró información del pago.';
    setTimeout(() => router.replace('/'), 4000);
    return;
  }

  try {
    const response = await orderService.confirmPayment(Number(id), clientTransactionId);
    const { approved, orderId } = response.data;

    if (approved) {
      status.value = 'success';
      router.replace(`/pago/confirmado?orderId=${orderId}`);
    } else {
      status.value = 'failed';
      router.replace(`/pago/rechazado?orderId=${orderId}`);
    }
  } catch {
    status.value = 'error';
    message.value = 'Error al verificar el pago. Contáctanos si el monto fue cobrado.';
  }
});
</script>

<template>
  <MainLayout>
    <section class="pay-response">
      <div class="pay-response__card" role="status" aria-live="polite">
        <!-- Verifying -->
        <template v-if="status === 'verifying'">
          <div class="pay-response__loader" aria-hidden="true">
            <span class="pay-response__ring"></span>
            <i class="fa-solid fa-mug-hot"></i>
          </div>
          <span class="eyebrow">Paso final</span>
          <h1 class="pay-response__title">Verificando tu pago</h1>
          <p class="pay-response__desc">Estamos confirmando tu transacción con el banco. No cierres esta ventana.</p>
        </template>

        <!-- Error -->
        <template v-else-if="status === 'error'">
          <div class="pay-response__icon" aria-hidden="true">
            <i class="fa-solid fa-triangle-exclamation"></i>
          </div>
          <span class="eyebrow pay-response__eyebrow--error">Verificación</span>
          <h1 class="pay-response__title">Algo salió mal</h1>
          <p class="pay-response__desc">{{ message }}</p>
          <RouterLink to="/" class="btn-outline pay-response__btn">Volver al inicio</RouterLink>
        </template>
      </div>
    </section>
  </MainLayout>
</template>

<style lang="scss" scoped>
.pay-response {
  min-height: 70vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4rem 1rem;

  &__card {
    width: 100%;
    max-width: 440px;
    padding: 3rem 1.75rem;
    background: var(--color-bg-card);
    border: 1px solid var(--color-border);
    border-radius: $radius-xl;
    box-shadow: var(--shadow-lg);
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.875rem;

    @media (min-width: 480px) {
      padding: 3.5rem 2.75rem;
    }
  }

  &__loader {
    position: relative;
    width: 84px;
    height: 84px;
    display: grid;
    place-items: center;
    margin-bottom: 0.5rem;
    font-size: 1.625rem;
    color: var(--color-accent);
    background: var(--color-accent-light);
    border-radius: 50%;
  }

  &__ring {
    position: absolute;
    inset: -6px;
    border-radius: 50%;
    border: 2px solid color-mix(in srgb, var(--color-accent) 18%, transparent);
    border-top-color: var(--color-accent);
    animation: pay-spin 1s linear infinite;
  }

  &__icon {
    width: 84px;
    height: 84px;
    display: grid;
    place-items: center;
    margin-bottom: 0.5rem;
    border-radius: 50%;
    font-size: 1.75rem;
    color: var(--color-error);
    background: var(--color-error-light);
  }

  &__eyebrow--error {
    color: var(--color-error);
  }

  &__title {
    font-size: clamp(1.625rem, 4vw, 2rem);
  }

  &__desc {
    font-size: 0.9375rem;
    max-width: 32ch;
  }

  &__btn {
    margin-top: 0.75rem;
  }
}

@keyframes pay-spin {
  to { transform: rotate(360deg); }
}
</style>
