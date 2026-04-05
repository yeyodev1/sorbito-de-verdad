<script setup lang="ts">
import { ref } from 'vue';
import MainLayout from '../layout/MainLayout.vue';
import httpBase from '../services/httpBase';

interface TrackResult {
  orderNumber: string;
  status: string;
  createdAt: string;
  shippingAddress: { city: string; country: string };
  items: Array<{ name: string; quantity: number }>;
  notes?: string;
}

const searchQuery = ref('');
const loading = ref(false);
const result = ref<TrackResult | null>(null);
const results = ref<TrackResult[]>([]);  // for email search (multiple orders)
const selectedResult = ref<TrackResult | null>(null);
const error = ref('');
const searchMode = ref<'number' | 'email'>('number');

const statusLabels: Record<string, string> = {
  confirmed:  'Confirmado',
  processing: 'En proceso',
  shipped:    'Enviado',
  delivered:  'Entregado',
};

const statusSteps = ['confirmed', 'processing', 'shipped', 'delivered'];
const stepLabels  = ['Confirmado', 'En proceso', 'Enviado', 'Entregado'];
const stepIcons   = [
  'fa-solid fa-circle-check',
  'fa-solid fa-gear',
  'fa-solid fa-truck',
  'fa-solid fa-house',
];

function getStepState(step: string, currentStatus: string) {
  const idx    = statusSteps.indexOf(step);
  const curIdx = statusSteps.indexOf(currentStatus);
  if (curIdx === -1)  return 'pending';
  if (idx < curIdx)   return 'done';
  if (idx === curIdx) return 'active';
  return 'pending';
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('es-ES', {
    year: 'numeric', month: 'long', day: 'numeric',
  });
}

function activeResult() {
  return selectedResult.value ?? result.value;
}

function switchMode(mode: 'number' | 'email') {
  searchMode.value = mode;
  searchQuery.value = '';
  result.value = null;
  results.value = [];
  selectedResult.value = null;
  error.value = '';
}

async function search() {
  const q = searchQuery.value.trim();
  if (!q) return;
  loading.value = true;
  error.value = '';
  result.value = null;
  results.value = [];
  selectedResult.value = null;

  try {
    if (searchMode.value === 'email') {
      const { data } = await httpBase.get(`/orders/track/by-email/${encodeURIComponent(q.toLowerCase())}`);
      results.value = data.data;
      if (results.value.length === 1) selectedResult.value = results.value[0]!;
    } else {
      const { data } = await httpBase.get(`/orders/track/${q.toUpperCase()}`);
      result.value = data.data;
    }
  } catch {
    error.value = searchMode.value === 'email'
      ? 'No se encontraron pedidos confirmados para ese correo.'
      : 'Pedido no encontrado. Verifica el número o aún no fue confirmado.';
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <MainLayout>
    <div class="track">
      <div class="container">

        <!-- Hero -->
        <div class="track__hero">
          <div class="track__hero-icon">
            <i class="fa-solid fa-truck"></i>
          </div>
          <h1 class="track__title">Rastrear pedido</h1>
          <p class="track__subtitle">Ingresa tu número de pedido para ver el estado de tu envío</p>
        </div>

        <!-- Mode toggle -->
        <div class="track__mode-tabs">
          <button
            :class="['track__mode-tab', { 'track__mode-tab--active': searchMode === 'number' }]"
            @click="switchMode('number')"
          >
            <i class="fa-solid fa-hashtag"></i>
            Número de pedido
          </button>
          <button
            :class="['track__mode-tab', { 'track__mode-tab--active': searchMode === 'email' }]"
            @click="switchMode('email')"
          >
            <i class="fa-solid fa-envelope"></i>
            Correo electrónico
          </button>
        </div>

        <!-- Search form -->
        <form class="track__form" @submit.prevent="search">
          <div class="track__input-wrap">
            <i :class="['track__input-icon', searchMode === 'email' ? 'fa-solid fa-envelope' : 'fa-solid fa-hashtag']"></i>
            <input
              v-model="searchQuery"
              :type="searchMode === 'email' ? 'email' : 'text'"
              class="track__input"
              :placeholder="searchMode === 'email' ? 'tu@correo.com' : 'Ej: SDV-1775430455700-123'"
              autocomplete="off"
              spellcheck="false"
            />
          </div>
          <button type="submit" class="track__btn" :disabled="loading || !searchQuery.trim()">
            <i v-if="loading" class="fa-solid fa-circle-notch fa-spin"></i>
            <i v-else class="fa-solid fa-magnifying-glass"></i>
            {{ loading ? 'Buscando...' : 'Rastrear' }}
          </button>
        </form>

        <!-- Error -->
        <div v-if="error" class="track__error">
          <i class="fa-solid fa-triangle-exclamation"></i>
          {{ error }}
        </div>

        <!-- Email results: list of orders to pick -->
        <div v-if="results.length > 1 && !selectedResult" class="track__order-list">
          <h3 class="track__order-list-title">Selecciona tu pedido:</h3>
          <button
            v-for="o in results"
            :key="o.orderNumber"
            class="track__order-pick"
            @click="selectedResult = o"
          >
            <div class="track__order-pick-left">
              <span class="track__order-pick-num">{{ o.orderNumber }}</span>
              <span class="track__order-pick-date">{{ formatDate(o.createdAt) }}</span>
            </div>
            <span :class="['track__status-badge', `track__status-badge--${o.status}`]">
              {{ statusLabels[o.status] || o.status }}
            </span>
          </button>
        </div>

        <!-- Single result -->
        <div v-if="activeResult()" class="track__result">

          <!-- Back button when email search showed multiple -->
          <button v-if="results.length > 1" class="track__back" @click="selectedResult = null">
            <i class="fa-solid fa-arrow-left"></i> Ver todos mis pedidos
          </button>

          <!-- Order header -->
          <div class="track__result-header">
            <div>
              <h2 class="track__result-num">{{ activeResult()!.orderNumber }}</h2>
              <p class="track__result-date">Pedido del {{ formatDate(activeResult()!.createdAt) }}</p>
            </div>
            <span :class="['track__status-badge', `track__status-badge--${activeResult()!.status}`]">
              {{ statusLabels[activeResult()!.status] || activeResult()!.status }}
            </span>
          </div>

          <!-- Progress tracker -->
          <div class="track__progress">
            <div
              v-for="(step, i) in statusSteps"
              :key="step"
              :class="['tp-step', `tp-step--${getStepState(step, activeResult()!.status)}`]"
            >
              <div class="tp-step__circle">
                <i :class="stepIcons[i]"></i>
              </div>
              <span class="tp-step__label">{{ stepLabels[i] }}</span>
              <div v-if="i < statusSteps.length - 1" class="tp-step__line"></div>
            </div>
          </div>

          <!-- Details grid -->
          <div class="track__details">
            <!-- Items -->
            <div class="track__card">
              <h3 class="track__card-title">
                <i class="fa-solid fa-mug-hot"></i>
                Productos
              </h3>
              <ul class="track__items">
                <li v-for="(item, i) in activeResult()!.items" :key="i" class="track__item">
                  <span class="track__item-name">{{ item.name }}</span>
                  <span class="track__item-qty">× {{ item.quantity }}</span>
                </li>
              </ul>
            </div>

            <!-- Destination -->
            <div class="track__card">
              <h3 class="track__card-title">
                <i class="fa-solid fa-location-dot"></i>
                Destino
              </h3>
              <p class="track__destination">
                {{ activeResult()!.shippingAddress.city }}, {{ activeResult()!.shippingAddress.country }}
              </p>

              <!-- Admin note to customer -->
              <div v-if="activeResult()!.notes" class="track__note">
                <i class="fa-solid fa-comment-dots"></i>
                <p>{{ activeResult()!.notes }}</p>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  </MainLayout>
</template>

<style lang="scss" scoped>
.track {
  padding: 4rem 0 6rem;
  min-height: 70vh;

  &__hero {
    text-align: center;
    margin-bottom: 2.5rem;
  }

  &__hero-icon {
    width: 72px;
    height: 72px;
    border-radius: 50%;
    background: rgba($color-accent, 0.1);
    color: $color-accent;
    font-size: 1.75rem;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 1.25rem;
  }

  &__title {
    font-family: var(--font-heading);
    font-size: 2rem;
    font-weight: 700;
    color: var(--color-primary);
    margin: 0 0 0.5rem;
  }

  &__subtitle {
    font-size: 1rem;
    color: var(--color-muted);
    margin: 0;
  }

  &__mode-tabs {
    display: flex;
    gap: 0.5rem;
    max-width: 560px;
    margin: 0 auto 1rem;
    background: var(--color-bg-card);
    border: 1px solid var(--color-border);
    border-radius: 10px;
    padding: 0.25rem;
  }

  &__mode-tab {
    flex: 1;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    padding: 0.625rem 1rem;
    border-radius: 7px;
    border: none;
    background: transparent;
    color: var(--color-muted);
    font-size: 0.875rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
    font-family: 'Inter', sans-serif;

    &--active {
      background: $color-accent;
      color: #fff;
      font-weight: 700;
    }

    &:not(&--active):hover { color: var(--color-primary); }
  }

  &__form {
    display: flex;
    gap: 0.75rem;
    max-width: 560px;
    margin: 0 auto 2rem;

    @media (max-width: 500px) {
      flex-direction: column;
    }
  }

  &__input-wrap {
    flex: 1;
    position: relative;
  }

  &__input-icon {
    position: absolute;
    left: 1rem;
    top: 50%;
    transform: translateY(-50%);
    color: var(--color-muted);
    font-size: 0.875rem;
    pointer-events: none;
  }

  &__input {
    width: 100%;
    padding: 0.75rem 1rem 0.75rem 2.5rem;
    border: 1.5px solid var(--color-border);
    border-radius: 10px;
    background: var(--color-bg-card);
    color: var(--color-primary);
    font-size: 0.9375rem;
    font-family: monospace;
    letter-spacing: 0.04em;
    box-sizing: border-box;
    transition: border-color 0.2s;

    &:focus {
      outline: none;
      border-color: $color-accent;
    }

    &::placeholder { color: var(--color-muted); font-family: 'Inter', sans-serif; letter-spacing: 0; }
  }

  &__btn {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    background: $color-accent;
    color: #fff;
    border: none;
    border-radius: 10px;
    padding: 0.75rem 1.5rem;
    font-size: 0.9375rem;
    font-weight: 600;
    cursor: pointer;
    white-space: nowrap;
    transition: opacity 0.2s;

    &:hover:not(:disabled) { opacity: 0.85; }
    &:disabled { opacity: 0.5; cursor: not-allowed; }
  }

  &__error {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    max-width: 560px;
    margin: 0 auto 1.5rem;
    background: rgba(239, 68, 68, 0.08);
    border: 1px solid rgba(239, 68, 68, 0.2);
    border-radius: 8px;
    padding: 0.75rem 1rem;
    font-size: 0.9rem;
    color: #DC2626;

    i { flex-shrink: 0; }
  }

  &__order-list {
    max-width: 560px;
    margin: 0 auto 2rem;
  }

  &__order-list-title {
    font-size: 0.875rem;
    font-weight: 600;
    color: var(--color-muted);
    text-transform: uppercase;
    letter-spacing: 0.06em;
    margin: 0 0 0.75rem;
  }

  &__order-pick {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    padding: 1rem 1.25rem;
    background: var(--color-bg-card);
    border: 1px solid var(--color-border);
    border-radius: 10px;
    margin-bottom: 0.5rem;
    cursor: pointer;
    transition: all 0.2s;
    font-family: 'Inter', sans-serif;
    text-align: left;

    &:hover {
      border-color: $color-accent;
      box-shadow: 0 2px 8px rgba($color-accent, 0.12);
    }
  }

  &__order-pick-left {
    display: flex;
    flex-direction: column;
    gap: 0.2rem;
  }

  &__order-pick-num {
    font-family: monospace;
    font-size: 0.9375rem;
    font-weight: 700;
    color: $color-accent;
  }

  &__order-pick-date {
    font-size: 0.8125rem;
    color: var(--color-muted);
  }

  &__back {
    display: inline-flex;
    align-items: center;
    gap: 0.375rem;
    font-size: 0.875rem;
    color: var(--color-muted);
    background: none;
    border: none;
    cursor: pointer;
    padding: 0;
    margin-bottom: 1.25rem;
    font-family: 'Inter', sans-serif;
    transition: color 0.2s;

    &:hover { color: $color-accent; }
  }

  &__result {
    max-width: 680px;
    margin: 0 auto;
  }

  &__result-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 1rem;
    margin-bottom: 1.5rem;
  }

  &__result-num {
    font-family: monospace;
    font-size: 1.25rem;
    font-weight: 700;
    color: $color-accent;
    margin: 0 0 0.25rem;
  }

  &__result-date {
    font-size: 0.875rem;
    color: var(--color-muted);
    margin: 0;
  }

  &__status-badge {
    display: inline-flex;
    align-items: center;
    padding: 0.375rem 0.875rem;
    border-radius: 999px;
    font-size: 0.8125rem;
    font-weight: 700;

    &--confirmed  { background: rgba($color-accent, 0.1); color: $color-accent; }
    &--processing { background: rgba(59, 130, 246, 0.1); color: #2563EB; }
    &--shipped    { background: rgba(139, 92, 246, 0.1); color: #7C3AED; }
    &--delivered  { background: rgba(16, 185, 129, 0.1); color: #059669; }
  }

  &__progress {
    display: flex;
    align-items: flex-start;
    background: var(--color-bg-card);
    border: 1px solid var(--color-border);
    border-radius: 14px;
    padding: 1.5rem;
    margin-bottom: 1.5rem;
    overflow-x: auto;
  }

  &__details {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;

    @media (max-width: 560px) {
      grid-template-columns: 1fr;
    }
  }

  &__card {
    background: var(--color-bg-card);
    border: 1px solid var(--color-border);
    border-radius: 14px;
    padding: 1.25rem;
  }

  &__card-title {
    font-size: 0.875rem;
    font-weight: 700;
    color: var(--color-primary);
    margin: 0 0 1rem;
    display: flex;
    align-items: center;
    gap: 0.375rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;

    i { color: $color-accent; }
  }

  &__items {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  &__item {
    display: flex;
    justify-content: space-between;
    font-size: 0.9rem;
    color: var(--color-primary);
  }

  &__item-name { font-weight: 500; }
  &__item-qty  { color: var(--color-muted); }

  &__destination {
    font-size: 1rem;
    font-weight: 600;
    color: var(--color-primary);
    margin: 0 0 1rem;
  }

  &__note {
    display: flex;
    gap: 0.5rem;
    background: rgba($color-accent, 0.06);
    border: 1px solid rgba($color-accent, 0.15);
    border-radius: 8px;
    padding: 0.75rem;

    i { color: $color-accent; flex-shrink: 0; margin-top: 2px; }

    p {
      margin: 0;
      font-size: 0.875rem;
      color: var(--color-primary);
      line-height: 1.5;
    }
  }
}

// Progress steps
.tp-step {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  gap: 0.5rem;
  position: relative;

  &__circle {
    width: 44px;
    height: 44px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1rem;
    position: relative;
    z-index: 1;
  }

  &__label {
    font-size: 0.6875rem;
    font-weight: 600;
    text-align: center;
    white-space: nowrap;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  &__line {
    position: absolute;
    top: 22px;
    left: 50%;
    width: 100%;
    height: 2px;
    z-index: 0;
  }

  &--done {
    .tp-step__circle { background: rgba($color-accent, 0.15); color: $color-accent; border: 2px solid $color-accent; }
    .tp-step__label  { color: $color-accent; }
    .tp-step__line   { background: $color-accent; }
  }

  &--active {
    .tp-step__circle { background: $color-accent; color: #fff; border: 2px solid $color-accent; box-shadow: 0 0 0 4px rgba($color-accent, 0.2); }
    .tp-step__label  { color: $color-accent; font-weight: 700; }
    .tp-step__line   { background: var(--color-border); }
  }

  &--pending {
    .tp-step__circle { background: var(--color-bg); color: var(--color-muted); border: 2px solid var(--color-border); }
    .tp-step__label  { color: var(--color-muted); }
    .tp-step__line   { background: var(--color-border); }
  }
}
</style>
