<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRoute, RouterLink } from 'vue-router';
import MainLayout from '../layout/MainLayout.vue';
import { useAuthStore } from '../stores/auth';
import { useUIStore } from '../stores/ui';
import { useCartStore } from '../stores/cart';
import { orderService } from '../services/order.service';

const route = useRoute();
const authStore = useAuthStore();
const uiStore = useUIStore();
const orderId = computed(() => (route.query.orderId as string) || '');
const isGuest = computed(() => !authStore.isAuthenticated);
const resending = ref(false);

// El pago se confirmó: ya no hace falta la copia del carrito
useCartStore().clearPending();

async function resendCredentials() {
  if (!orderId.value || resending.value) return;
  resending.value = true;
  try {
    await orderService.resendCredentials(orderId.value);
    uiStore.success('Credenciales de acceso reenviadas a tu correo');
  } catch {
    uiStore.error('No se pudo reenviar. Intenta más tarde.');
  } finally {
    resending.value = false;
  }
}
</script>

<template>
  <MainLayout>
    <section class="payment-success-view">
      <div class="payment-success-view__card">
        <div class="payment-success-view__icon-wrap" aria-hidden="true">
          <i class="fa-solid fa-check payment-success-view__icon"></i>
        </div>

        <span class="eyebrow payment-success-view__eyebrow">Pago confirmado</span>
        <h1 class="payment-success-view__title">¡Gracias por tu compra!</h1>
        <p class="payment-success-view__subtitle">Tu pedido ha sido procesado exitosamente. Ya estamos preparando tus tazas.</p>

        <div v-if="orderId" class="payment-success-view__order">
          <span class="payment-success-view__order-label">Pedido</span>
          <span class="payment-success-view__order-id">#{{ orderId }}</span>
        </div>

        <!-- Guest account notice -->
        <div v-if="isGuest" class="payment-success-view__email-notice">
          <span class="payment-success-view__notice-icon" aria-hidden="true">
            <i class="fa-solid fa-envelope-open-text"></i>
          </span>
          <div>
            <strong>Revisa tu correo electrónico</strong>
            <p>Te enviamos los datos de acceso a tu cuenta para que puedas rastrear tu pedido.</p>
            <p class="payment-success-view__spam-tip">
              ¿No lo ves? Revisa tu carpeta de <strong>Spam</strong> o <strong>Correo no deseado</strong> y márcalo como "No es spam".
            </p>
          </div>
        </div>

        <div class="payment-success-view__actions">
          <RouterLink to="/perfil" class="btn-primary btn-lg btn-block">
            <i class="fa-solid fa-bag-shopping"></i>
            Ver mis pedidos
          </RouterLink>
          <RouterLink to="/tienda" class="btn-outline btn-lg btn-block">
            Seguir comprando
          </RouterLink>
          <button
            v-if="isGuest && orderId"
            class="btn-ghost btn-sm btn-block payment-success-view__btn-resend"
            :disabled="resending"
            @click="resendCredentials"
          >
            <i v-if="resending" class="fa-solid fa-circle-notch fa-spin"></i>
            <i v-else class="fa-solid fa-key"></i>
            {{ resending ? 'Enviando...' : 'Reenviar datos de acceso a mi cuenta' }}
          </button>
        </div>
      </div>
    </section>
  </MainLayout>
</template>

<style lang="scss" scoped>
.payment-success-view {
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
      background-color: var(--color-success);
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
    background-color: var(--color-success-light);
    box-shadow: 0 0 0 8px color-mix(in srgb, var(--color-success-light) 50%, transparent);
  }

  &__icon {
    font-size: 2.125rem;
    color: var(--color-success);
  }

  &__eyebrow {
    color: var(--color-success);
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

  &__email-notice {
    display: flex;
    align-items: flex-start;
    gap: 0.875rem;
    width: 100%;
    padding: 1rem 1.125rem;
    text-align: left;
    background-color: var(--color-accent-light);
    border: 1px solid color-mix(in srgb, var(--color-accent) 25%, transparent);
    border-radius: $radius-lg;

    strong {
      color: var(--color-primary);
    }

    > div > strong {
      display: block;
      margin-bottom: 0.125rem;
      font-size: 0.9375rem;
    }

    p {
      font-size: 0.875rem;
      line-height: 1.55;
    }
  }

  &__notice-icon {
    flex-shrink: 0;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    color: var(--color-on-accent);
    background-color: var(--color-accent);
  }

  &__spam-tip {
    margin-top: 0.5rem;
    font-size: 0.8125rem !important;
  }

  &__btn-resend {
    white-space: normal;
    text-align: center;
    line-height: 1.3;
  }
}
</style>
