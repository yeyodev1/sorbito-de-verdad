<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter, RouterLink } from 'vue-router';
import MainLayout from '../layout/MainLayout.vue';
import OrderHeader from '../components/account/order/OrderHeader.vue';
import OrderTracker from '../components/account/order/OrderTracker.vue';
import OrderItemsCard from '../components/account/order/OrderItemsCard.vue';
import OrderShippingCard from '../components/account/order/OrderShippingCard.vue';
import OrderHelpCard from '../components/account/order/OrderHelpCard.vue';
import { orderService } from '../services/order.service';
import type { Order } from '../types';

const route = useRoute();
const router = useRouter();

const order = ref<Order | null>(null);
const loading = ref(true);
const error = ref('');

onMounted(async () => {
  try {
    const res = await orderService.getOrderById(route.params.id as string);
    order.value = res.data;
  } catch {
    error.value = 'No pudimos cargar los detalles de tu pedido.';
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <MainLayout>
    <section class="order-detail">
      <div class="container order-detail__container">

        <!-- Back -->
        <RouterLink to="/perfil" class="order-detail__back">
          <i class="fa-solid fa-arrow-left"></i>
          Mis pedidos
        </RouterLink>

        <!-- Loading skeleton -->
        <template v-if="loading">
          <div class="order-detail__skeleton" aria-busy="true">
            <div class="skeleton od-skel od-skel--title"></div>
            <div class="skeleton od-skel od-skel--bar"></div>
            <div class="od-skel-grid">
              <div class="skeleton od-skel od-skel--card"></div>
              <div class="skeleton od-skel od-skel--card"></div>
            </div>
          </div>
        </template>

        <!-- Error -->
        <template v-else-if="error">
          <div class="order-detail__error">
            <span class="order-detail__error-icon" aria-hidden="true">
              <i class="fa-solid fa-triangle-exclamation"></i>
            </span>
            <p>{{ error }}</p>
            <button class="btn-outline" @click="router.back()">Regresar</button>
          </div>
        </template>

        <!-- Content -->
        <template v-else-if="order">
          <OrderHeader :order="order" />

          <!-- Progress tracker (only for non-cancelled, non-pending) -->
          <OrderTracker v-if="!['pending', 'cancelled'].includes(order.status)" :status="order.status" />

          <!-- Two-column layout -->
          <div class="order-detail__grid">
            <OrderItemsCard :order="order" />

            <!-- Right column -->
            <aside class="od-sidebar">
              <OrderShippingCard :address="order.shippingAddress" />
              <OrderHelpCard :order-number="order.orderNumber" />
            </aside>
          </div>

        </template>
      </div>
    </section>
  </MainLayout>
</template>

<style lang="scss" scoped>
.order-detail {
  padding: 2rem 0 5rem;
  min-height: 60vh;

  @media (min-width: 768px) {
    padding-top: 3rem;
  }

  &__container {
    max-width: 1080px;
  }

  &__back {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    min-height: 44px;
    margin-bottom: 1rem;
    font-size: 0.875rem;
    font-weight: 500;
    color: var(--color-muted);
    transition: color 0.2s ease;

    &:hover { color: var(--color-primary); }
  }

  &__grid {
    display: flex;
    flex-direction: column;
    gap: 1.25rem;

    > * { min-width: 0; }

    @media (min-width: 900px) {
      flex-direction: row;
      align-items: flex-start;
      gap: 1.5rem;

      > :first-child { flex: 1 1 auto; }
      > :last-child { flex: 0 0 340px; }
    }
  }

  &__error {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    padding: 4rem 1rem;
    text-align: center;
  }

  &__error-icon {
    width: 64px;
    height: 64px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.5rem;
    color: var(--color-error);
    background-color: var(--color-error-light);
    border-radius: 50%;
  }

  &__skeleton {
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
  }
}

.od-skel {
  border-radius: $radius-lg;

  &--title { width: 50%; height: 44px; }
  &--bar { height: 96px; }
  &--card { height: 260px; }
}

.od-skel-grid {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;

  @media (min-width: 900px) {
    flex-direction: row;

    > :first-child { flex: 1 1 auto; }
    > :last-child { flex: 0 0 340px; }
  }
}

.od-sidebar {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}
</style>
