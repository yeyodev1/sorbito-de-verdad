<script setup lang="ts">
import { computed } from 'vue';
import { RouterLink, useRouter } from 'vue-router';
import MainLayout from '../layout/MainLayout.vue';
import { useCartStore } from '../stores/cart';
import { useUIStore } from '../stores/ui';

const cartStore = useCartStore();
const uiStore = useUIStore();
const router = useRouter();

const items = computed(() => cartStore.items);
const subtotal = computed(() => cartStore.subtotal);
const totalItems = computed(() => cartStore.totalItems);
const isEmpty = computed(() => cartStore.isEmpty);

function goToCheckout() {
  router.push('/checkout');
}

function confirmClear() {
  uiStore.openConfirm({
    title: 'Vaciar carrito',
    message: '¿Seguro que quieres quitar todos los productos del carrito?',
    type: 'danger',
    confirmLabel: 'Vaciar',
    cancelLabel: 'Cancelar',
    onConfirm: () => cartStore.clearCart(),
  });
}

function unitPrice(item: (typeof cartStore.items)[number]) {
  return item.selectedSize?.price ?? item.product.price;
}

function formatPrice(val: number) {
  return `$${val.toFixed(2)}`;
}
</script>

<template>
  <MainLayout>
    <div class="cv">
      <div class="container">
        <header class="cv__header">
          <h1 class="cv__title">Tu carrito</h1>
          <span v-if="!isEmpty" class="cv__count">{{ totalItems }} {{ totalItems === 1 ? 'producto' : 'productos' }}</span>
        </header>

        <div v-if="isEmpty" class="cv__empty">
          <div class="cv__empty-icon"><i class="fa-solid fa-mug-hot"></i></div>
          <h2>Tu carrito está vacío</h2>
          <p>Descubre nuestras tazas artesanales y encuentra la que más te inspire.</p>
          <RouterLink to="/tienda" class="btn-primary btn-lg">Explorar tienda</RouterLink>
        </div>

        <div v-else class="cv__layout">
          <div>
            <ul class="cv__list">
              <li v-for="item in items" :key="`${item.product._id}-${item.selectedSize?.name}`" class="cv-row">
                <RouterLink :to="`/tienda/${item.product.slug}`" class="cv-row__media">
                  <img :src="item.product.mainImage || '/placeholder-cup.jpg'" :alt="item.product.name" />
                </RouterLink>
                <div class="cv-row__info">
                  <RouterLink :to="`/tienda/${item.product.slug}`" class="cv-row__name">{{ item.product.name }}</RouterLink>
                  <span class="cv-row__meta">
                    <template v-if="item.selectedSize">{{ item.selectedSize.name }} · </template>{{ formatPrice(unitPrice(item)) }} c/u
                  </span>
                  <div class="cv-row__controls">
                    <div class="cv-qty">
                      <button @click="cartStore.updateQuantity(item.product._id, item.quantity - 1, item.selectedSize?.name)" aria-label="Reducir cantidad">−</button>
                      <span>{{ item.quantity }}</span>
                      <button @click="cartStore.updateQuantity(item.product._id, item.quantity + 1, item.selectedSize?.name)" aria-label="Aumentar cantidad">+</button>
                    </div>
                    <button class="cv-row__remove" @click="cartStore.removeFromCart(item.product._id, item.selectedSize?.name)">
                      Quitar
                    </button>
                  </div>
                </div>
                <span class="cv-row__total">{{ formatPrice(unitPrice(item) * item.quantity) }}</span>
              </li>
            </ul>

            <div class="cv__actions">
              <RouterLink to="/tienda" class="cv__link"><i class="fa-solid fa-arrow-left"></i> Seguir comprando</RouterLink>
              <button class="cv__link cv__link--muted" @click="confirmClear">Vaciar carrito</button>
            </div>
          </div>

          <aside class="cv-sum">
            <h2 class="cv-sum__title">Resumen</h2>
            <div class="cv-sum__row">
              <span>Subtotal</span>
              <strong>{{ formatPrice(subtotal) }}</strong>
            </div>
            <div class="cv-sum__row">
              <span>Envío</span>
              <span class="cv-sum__muted">Se calcula en el pago</span>
            </div>
            <button class="btn-primary btn-lg btn-block" @click="goToCheckout">
              <i class="fa-solid fa-lock"></i> Pagar ahora
            </button>
            <p class="cv-sum__secure"><i class="fa-solid fa-shield-halved"></i> Pago seguro con tarjeta vía PayPhone</p>
          </aside>
        </div>
      </div>
    </div>
  </MainLayout>
</template>

<style lang="scss" scoped>
.cv {
  padding: 1.5rem 0 5rem;

  @media (min-width: 960px) {
    padding: 2.5rem 0 6rem;
  }

  &__header {
    display: flex;
    align-items: baseline;
    gap: 0.75rem;
    margin-bottom: 1.5rem;
  }

  &__title {
    font-size: clamp(1.875rem, 4vw, 2.75rem);
  }

  &__count {
    font-size: 0.9375rem;
    color: var(--color-muted);
  }

  &__empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.875rem;
    padding: 4rem 1rem;
    text-align: center;

    p { max-width: 360px; }
  }

  &__empty-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 80px;
    height: 80px;
    font-size: 2rem;
    color: var(--color-accent);
    background-color: var(--color-accent-light);
    border-radius: 50%;
  }

  &__layout {
    display: grid;
    grid-template-columns: minmax(0, 1fr);
    gap: 2rem;

    @media (min-width: 960px) {
      grid-template-columns: minmax(0, 1fr) 360px;
      gap: 3rem;
      align-items: start;
    }
  }

  &__list {
    border-top: 1px solid var(--color-border);
  }

  &__actions {
    display: flex;
    justify-content: space-between;
    gap: 1rem;
    margin-top: 1.25rem;
  }

  &__link {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    min-height: 44px;
    font-size: 0.875rem;
    font-weight: 600;
    color: var(--color-accent);

    &--muted {
      color: var(--color-muted);
      &:hover { color: var(--color-error); }
    }
  }
}

.cv-row {
  display: flex;
  gap: 1rem;
  padding: 1.25rem 0;
  border-bottom: 1px solid var(--color-border);

  &__media {
    flex-shrink: 0;
    width: 96px;
    height: 112px;
    overflow: hidden;
    background-color: var(--color-bg-subtle);
    border-radius: $radius-md;

    @media (min-width: 640px) {
      width: 120px;
      height: 140px;
    }

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  &__info {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  &__name {
    font-family: var(--font-heading);
    font-size: 1.125rem;
    font-weight: 600;
    line-height: 1.25;

    &:hover { color: var(--color-accent); }
  }

  &__meta {
    font-size: 0.8125rem;
    color: var(--color-muted);
  }

  &__controls {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-top: auto;
    padding-top: 0.5rem;
  }

  &__remove {
    min-height: 36px;
    font-size: 0.8125rem;
    color: var(--color-muted);
    text-decoration: underline;
    text-underline-offset: 3px;

    &:hover { color: var(--color-error); }
  }

  &__total {
    font-weight: 700;
    font-variant-numeric: tabular-nums;
  }
}

.cv-qty {
  display: inline-flex;
  align-items: center;
  border: 1.5px solid var(--color-border);
  border-radius: $radius-full;

  button {
    width: 38px;
    height: 38px;
    font-size: 1.125rem;
    border-radius: 50%;

    &:hover { background-color: var(--color-bg-subtle); }
  }

  span {
    min-width: 24px;
    text-align: center;
    font-size: 0.9375rem;
    font-weight: 600;
    font-variant-numeric: tabular-nums;
  }
}

.cv-sum {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1.5rem;
  background-color: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: $radius-lg;

  @media (min-width: 960px) {
    position: sticky;
    top: 96px;
  }

  &__title {
    font-size: 1.25rem;
  }

  &__row {
    display: flex;
    justify-content: space-between;
    font-size: 0.9375rem;

    strong { font-size: 1.25rem; font-variant-numeric: tabular-nums; }
  }

  &__muted {
    font-size: 0.8125rem;
    color: var(--color-muted);
  }

  &__secure {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.375rem;
    font-size: 0.75rem;

    i { color: var(--color-success); }
  }
}
</style>
