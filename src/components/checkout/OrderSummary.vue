<script setup lang="ts">
import { useUIStore } from '../../stores/ui';
import { useCheckoutContext } from '../../composables/checkout/useCheckout';
import { formatPrice } from '../../composables/checkout/constants';

const uiStore = useUIStore();
const { items, subtotal, selectedZone, shipping, total, summaryOpen } = useCheckoutContext();
</script>

<template>
  <aside :class="['co__summary', { 'co__summary--open': summaryOpen }]">
    <div class="co__summary-head">
      <h2 class="co__summary-title">Tu pedido</h2>
      <button type="button" class="co__edit" @click="uiStore.openCart()">Editar</button>
    </div>

    <ul class="co__items">
      <li v-for="item in items" :key="`${item.product._id}-${item.selectedSize?.name}`" class="co__item">
        <div class="co__item-media">
          <img :src="item.product.mainImage" :alt="item.product.name" />
          <span class="co__item-qty">{{ item.quantity }}</span>
        </div>
        <div class="co__item-info">
          <span class="co__item-name">{{ item.product.name }}</span>
          <span v-if="item.selectedSize" class="co__item-size">{{ item.selectedSize.name }}</span>
        </div>
        <span class="co__item-price">{{ formatPrice((item.selectedSize?.price ?? item.product.price) * item.quantity) }}</span>
      </li>
    </ul>

    <dl class="co__rows">
      <div class="co__row">
        <dt>Subtotal</dt>
        <dd>{{ formatPrice(subtotal) }}</dd>
      </div>
      <div class="co__row">
        <dt>Envío<span v-if="selectedZone" class="co__row-sub">{{ selectedZone.estimatedDays }}</span></dt>
        <dd :class="{ 'co__free': selectedZone && shipping === 0 }">
          {{ !selectedZone ? '—' : shipping === 0 ? 'Gratis' : formatPrice(shipping) }}
        </dd>
      </div>
      <div class="co__row co__row--total">
        <dt>Total</dt>
        <dd>{{ formatPrice(total) }}</dd>
      </div>
    </dl>

    <ul class="co__trust">
      <li><i class="fa-solid fa-shield-halved"></i> Pago 100% seguro</li>
      <li><i class="fa-solid fa-hand-holding-heart"></i> Hecho a mano en Ecuador</li>
      <li><i class="fa-solid fa-truck-fast"></i> Seguimiento de tu pedido</li>
    </ul>
  </aside>
</template>

<style lang="scss" scoped>
.co {
  &__summary {
    order: 1;
    display: none;
    flex-direction: column;
    gap: 1.25rem;
    margin-bottom: 1.25rem;
    padding: 1.25rem;
    background-color: var(--color-bg-card);
    border: 1px solid var(--color-border);
    border-radius: $radius-lg;

    &--open { display: flex; }

    @media (min-width: 960px) {
      order: 2;
      display: flex;
      position: sticky;
      top: 96px;
      margin-bottom: 0;
      padding: 1.5rem;
    }
  }

  &__summary-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  &__summary-title {
    font-size: 1.25rem;
  }

  &__edit {
    min-height: 36px;
    padding: 0 0.75rem;
    font-size: 0.8125rem;
    font-weight: 600;
    color: var(--color-accent);
    border-radius: $radius-full;

    &:hover { background-color: var(--color-accent-light); }
  }

  &__items {
    display: flex;
    flex-direction: column;
    gap: 0.875rem;
  }

  &__item {
    display: flex;
    align-items: center;
    gap: 0.875rem;
  }

  &__item-media {
    position: relative;
    flex-shrink: 0;
    width: 60px;
    height: 60px;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      background-color: var(--color-bg-subtle);
      border-radius: $radius-md;
    }
  }

  &__item-qty {
    position: absolute;
    top: -6px;
    right: -6px;
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 22px;
    height: 22px;
    padding: 0 0.3rem;
    font-size: 0.6875rem;
    font-weight: 700;
    color: var(--color-on-inverse);
    background-color: var(--color-bg-inverse);
    border-radius: $radius-full;
  }

  &__item-info {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
  }

  &__item-name {
    font-size: 0.875rem;
    font-weight: 600;
    line-height: 1.35;
  }

  &__item-size {
    font-size: 0.75rem;
    color: var(--color-muted);
  }

  &__item-price {
    font-size: 0.875rem;
    font-weight: 600;
    font-variant-numeric: tabular-nums;
  }

  &__rows {
    display: flex;
    flex-direction: column;
    gap: 0.625rem;
    padding-top: 1rem;
    border-top: 1px solid var(--color-border);
  }

  &__row {
    display: flex;
    justify-content: space-between;
    gap: 1rem;
    font-size: 0.875rem;

    dt { display: flex; flex-direction: column; color: var(--color-muted); }
    dd { font-weight: 600; font-variant-numeric: tabular-nums; }

    &--total {
      align-items: baseline;
      padding-top: 0.75rem;
      border-top: 1px solid var(--color-border);

      dt { font-size: 1rem; font-weight: 600; color: var(--color-primary); }
      dd { font-size: 1.5rem; font-weight: 700; }
    }
  }

  &__row-sub {
    font-size: 0.75rem;
    opacity: 0.85;
  }

  &__free {
    color: var(--color-success);
  }

  &__trust {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    padding-top: 1rem;
    border-top: 1px solid var(--color-border);
    font-size: 0.8125rem;
    color: var(--color-muted);

    i {
      width: 18px;
      margin-right: 0.375rem;
      color: var(--color-accent);
    }
  }
}
</style>
