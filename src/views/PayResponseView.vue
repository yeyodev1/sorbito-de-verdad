<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import MainLayout from '../layout/MainLayout.vue';
import { orderService } from '../services/order.service';

const route = useRoute();
const router = useRouter();

const status = ref<'verifying' | 'success' | 'failed' | 'error'>('verifying');
const message = ref('Verificando tu pago...');

onMounted(async () => {
  // PayPhone adds: ?id=<payphoneTransactionId>&clientTransactionID=<clientTransactionID>&orderId=<orderId>
  const orderId = route.query.orderId as string | undefined;
  const payphoneId = route.query.id as string | undefined;

  if (!orderId || !payphoneId) {
    status.value = 'error';
    message.value = 'No se encontró información del pago.';
    setTimeout(() => router.replace('/'), 4000);
    return;
  }

  try {
    const response = await orderService.verifyPayment(orderId, payphoneId);
    const { paymentStatus } = response.data;

    if (paymentStatus === 'paid') {
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
    <div class="pay-response">
      <div class="pay-response__card">
        <!-- Verifying -->
        <template v-if="status === 'verifying'">
          <div class="pay-response__spinner">
            <i class="fa-solid fa-circle-notch fa-spin"></i>
          </div>
          <h2 class="pay-response__title">Verificando tu pago</h2>
          <p class="pay-response__desc">Estamos confirmando tu transacción. Un momento...</p>
        </template>

        <!-- Error -->
        <template v-else-if="status === 'error'">
          <div class="pay-response__icon pay-response__icon--error">
            <i class="fa-solid fa-triangle-exclamation"></i>
          </div>
          <h2 class="pay-response__title">Algo salió mal</h2>
          <p class="pay-response__desc">{{ message }}</p>
        </template>
      </div>
    </div>
  </MainLayout>
</template>

<style lang="scss" scoped>
.pay-response {
  min-height: 60vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4rem 1rem;

  &__card {
    background: var(--color-bg-card);
    border: 1px solid var(--color-border);
    border-radius: $radius-xl;
    padding: 3rem 2.5rem;
    text-align: center;
    max-width: 420px;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
  }

  &__spinner {
    font-size: 2.5rem;
    color: $color-accent;
    margin-bottom: 0.5rem;
  }

  &__icon {
    width: 64px;
    height: 64px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.75rem;
    margin-bottom: 0.5rem;

    &--error {
      background: rgba(239, 68, 68, 0.1);
      color: #ef4444;
    }
  }

  &__title {
    font-family: var(--font-heading);
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--color-primary);
    margin: 0;
  }

  &__desc {
    font-size: 0.9375rem;
    color: var(--color-muted);
    line-height: 1.6;
    margin: 0;
  }
}
</style>
