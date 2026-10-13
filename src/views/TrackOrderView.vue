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
  review:     'En revisión',
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
      <div class="container track__container">

        <!-- Hero -->
        <header class="track__hero">
          <span class="eyebrow">Seguimiento</span>
          <h1 class="track__title">Rastrear pedido</h1>
          <p class="track__subtitle">Ingresa tu número de pedido o tu correo para ver el estado de tu envío.</p>
        </header>

        <div class="track__panel">
          <!-- Mode toggle -->
          <div class="track__mode-tabs" role="tablist" aria-label="Buscar por">
            <button
              type="button"
              role="tab"
              :aria-selected="searchMode === 'number'"
              :class="['track__mode-tab', { 'track__mode-tab--active': searchMode === 'number' }]"
              @click="switchMode('number')"
            >
              <i class="fa-solid fa-hashtag" aria-hidden="true"></i>
              Nº de pedido
            </button>
            <button
              type="button"
              role="tab"
              :aria-selected="searchMode === 'email'"
              :class="['track__mode-tab', { 'track__mode-tab--active': searchMode === 'email' }]"
              @click="switchMode('email')"
            >
              <i class="fa-solid fa-envelope" aria-hidden="true"></i>
              Correo
            </button>
          </div>

          <!-- Search form -->
          <form class="track__form" @submit.prevent="search">
            <label class="track__input-wrap">
              <span class="sr-only">{{ searchMode === 'email' ? 'Correo electrónico' : 'Número de pedido' }}</span>
              <i :class="['track__input-icon', searchMode === 'email' ? 'fa-solid fa-envelope' : 'fa-solid fa-hashtag']" aria-hidden="true"></i>
              <input
                v-model="searchQuery"
                :type="searchMode === 'email' ? 'email' : 'text'"
                :inputmode="searchMode === 'email' ? 'email' : 'text'"
                class="track__input"
                :placeholder="searchMode === 'email' ? 'tu@correo.com' : 'Ej: SDV-1775430455700-123'"
                autocomplete="off"
                spellcheck="false"
              />
            </label>
            <button type="submit" class="btn-primary track__btn" :disabled="loading || !searchQuery.trim()">
              <i v-if="loading" class="fa-solid fa-circle-notch fa-spin" aria-hidden="true"></i>
              <i v-else class="fa-solid fa-magnifying-glass" aria-hidden="true"></i>
              {{ loading ? 'Buscando...' : 'Rastrear' }}
            </button>
          </form>

          <!-- Error -->
          <div v-if="error" class="track__error" role="alert">
            <i class="fa-solid fa-triangle-exclamation" aria-hidden="true"></i>
            {{ error }}
          </div>
        </div>

        <!-- Email results: list of orders to pick -->
        <div v-if="results.length > 1 && !selectedResult" class="track__order-list">
          <h2 class="track__order-list-title">Selecciona tu pedido</h2>
          <button
            v-for="o in results"
            :key="o.orderNumber"
            type="button"
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
          <button v-if="results.length > 1" type="button" class="track__back" @click="selectedResult = null">
            <i class="fa-solid fa-arrow-left" aria-hidden="true"></i> Ver todos mis pedidos
          </button>

          <!-- Order header -->
          <div class="track__result-header">
            <div class="track__result-id">
              <span class="track__result-label">Pedido</span>
              <h2 class="track__result-num">{{ activeResult()!.orderNumber }}</h2>
              <p class="track__result-date">{{ formatDate(activeResult()!.createdAt) }}</p>
            </div>
            <span :class="['track__status-badge', `track__status-badge--${activeResult()!.status}`]">
              {{ statusLabels[activeResult()!.status] || activeResult()!.status }}
            </span>
          </div>

          <!-- Progress tracker -->
          <ol class="track__progress">
            <li
              v-for="(step, i) in statusSteps"
              :key="step"
              :class="['tp-step', `tp-step--${getStepState(step, activeResult()!.status)}`]"
            >
              <div class="tp-step__circle">
                <i :class="stepIcons[i]" aria-hidden="true"></i>
              </div>
              <span class="tp-step__label">{{ stepLabels[i] }}</span>
              <div v-if="i < statusSteps.length - 1" class="tp-step__line" aria-hidden="true"></div>
            </li>
          </ol>

          <!-- Details grid -->
          <div class="track__details">
            <div class="track__card">
              <h3 class="track__card-title">
                <i class="fa-solid fa-mug-hot" aria-hidden="true"></i>
                Productos
              </h3>
              <ul class="track__items">
                <li v-for="(item, i) in activeResult()!.items" :key="i" class="track__item">
                  <span class="track__item-name">{{ item.name }}</span>
                  <span class="track__item-qty">× {{ item.quantity }}</span>
                </li>
              </ul>
            </div>

            <div class="track__card">
              <h3 class="track__card-title">
                <i class="fa-solid fa-location-dot" aria-hidden="true"></i>
                Destino
              </h3>
              <p class="track__destination">
                {{ activeResult()!.shippingAddress.city }}, {{ activeResult()!.shippingAddress.country }}
              </p>

              <div v-if="activeResult()!.notes" class="track__note">
                <i class="fa-solid fa-comment-dots" aria-hidden="true"></i>
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
  background-color: var(--color-bg);
  min-height: calc(100vh - 70px);
  padding: 2.5rem 0 5rem;

  @media (min-width: 768px) {
    padding: 4.5rem 0 7rem;
  }

  &__container {
    max-width: 760px;
  }

  // ── Hero ──────────────────────────────────
  &__hero {
    display: flex;
    flex-direction: column;
    gap: 0.625rem;
    margin-bottom: 2rem;
  }

  &__title {
    font-size: clamp(2.25rem, 6vw, 3.5rem);
    font-weight: 500;
  }

  &__subtitle {
    max-width: 48ch;
  }

  // ── Panel ─────────────────────────────────
  &__panel {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding: 1.25rem;
    border-radius: $radius-xl;
    background-color: var(--color-bg-card);
    border: 1px solid var(--color-border);
    box-shadow: var(--shadow-sm);

    @media (min-width: 640px) {
      padding: 1.75rem;
    }
  }

  &__mode-tabs {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0.25rem;
    padding: 0.25rem;
    border-radius: $radius-full;
    background-color: var(--color-bg-subtle);
  }

  &__mode-tab {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    min-height: 44px;
    border-radius: $radius-full;
    font-size: 0.875rem;
    font-weight: 600;
    color: var(--color-muted);
    transition: background-color 0.2s ease, color 0.2s ease, box-shadow 0.2s ease;

    i { font-size: 0.75rem; }

    &:hover { color: var(--color-primary); }

    &--active,
    &--active:hover {
      background-color: var(--color-bg-card);
      color: var(--color-primary);
      box-shadow: var(--shadow-sm);
    }
  }

  &__form {
    display: flex;
    flex-direction: column;
    gap: 0.625rem;

    @media (min-width: 560px) {
      flex-direction: row;
    }
  }

  &__input-wrap {
    position: relative;
    flex: 1;
    min-width: 0;
  }

  &__input-icon {
    position: absolute;
    left: 1rem;
    top: 50%;
    transform: translateY(-50%);
    font-size: 0.8125rem;
    color: var(--color-muted);
    pointer-events: none;
  }

  &__input {
    width: 100%;
    min-height: 52px;
    padding: 0 1rem 0 2.5rem;
    font-size: 1rem;
    color: var(--color-primary);
    background-color: var(--color-bg);
    border: 1.5px solid var(--color-border);
    border-radius: $radius-full;
    outline: none;
    transition: border-color 0.2s ease, box-shadow 0.2s ease;

    &::placeholder { color: var(--color-muted); opacity: 0.75; }

    &:focus {
      border-color: var(--color-accent);
      box-shadow: var(--focus-ring);
    }
  }

  &__btn {
    min-height: 52px;
  }

  &__error {
    display: flex;
    align-items: flex-start;
    gap: 0.625rem;
    padding: 0.875rem 1rem;
    border-radius: $radius-md;
    background-color: var(--color-error-light);
    color: var(--color-error);
    font-size: 0.875rem;
    font-weight: 500;

    i { margin-top: 0.2rem; }
  }

  // ── Email multi-result ────────────────────
  &__order-list {
    display: flex;
    flex-direction: column;
    gap: 0.625rem;
    margin-top: 2rem;
  }

  &__order-list-title {
    font-size: 1.25rem;
    font-weight: 500;
    margin-bottom: 0.25rem;
  }

  &__order-pick {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    min-height: 64px;
    padding: 0.875rem 1.125rem;
    border-radius: $radius-lg;
    background-color: var(--color-bg-card);
    border: 1px solid var(--color-border);
    text-align: left;
    transition: border-color 0.2s ease, box-shadow 0.2s ease;

    &:hover {
      border-color: var(--color-border-strong);
      box-shadow: var(--shadow-md);
    }
  }

  &__order-pick-left {
    display: flex;
    flex-direction: column;
    gap: 0.125rem;
    min-width: 0;
  }

  &__order-pick-num {
    font-weight: 600;
    font-size: 0.9375rem;
    color: var(--color-primary);
    overflow-wrap: anywhere;
  }

  &__order-pick-date {
    font-size: 0.8125rem;
    color: var(--color-muted);
  }

  // ── Status badge ──────────────────────────
  &__status-badge {
    flex-shrink: 0;
    display: inline-flex;
    align-items: center;
    padding: 0.375rem 0.75rem;
    border-radius: $radius-full;
    font-size: 0.75rem;
    font-weight: 600;
    white-space: nowrap;
    background-color: var(--color-bg-subtle);
    color: var(--color-muted);

    &--review     { background-color: var(--color-warning-light); color: var(--color-warning); }
    &--confirmed  { background-color: var(--color-accent-light);  color: var(--color-accent); }
    &--processing { background-color: var(--color-accent-light);  color: var(--color-accent); }
    &--shipped    { background-color: var(--color-bg-inverse);    color: var(--color-on-inverse); }
    &--delivered  { background-color: var(--color-success-light); color: var(--color-success); }
  }

  // ── Result ────────────────────────────────
  &__result {
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
    margin-top: 2rem;
  }

  &__back {
    align-self: flex-start;
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    min-height: 44px;
    font-size: 0.875rem;
    font-weight: 600;
    color: var(--color-muted);

    &:hover { color: var(--color-primary); }
  }

  &__result-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 1rem;
    padding: 1.5rem 1.25rem;
    border-radius: $radius-xl;
    background-color: var(--color-bg-card);
    border: 1px solid var(--color-border);

    @media (min-width: 640px) {
      padding: 1.75rem;
    }
  }

  &__result-id {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    min-width: 0;
  }

  &__result-label {
    font-size: 0.6875rem;
    font-weight: 600;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--color-muted);
  }

  &__result-num {
    font-size: clamp(1.125rem, 3.5vw, 1.5rem);
    font-weight: 500;
    overflow-wrap: anywhere;
  }

  &__result-date {
    font-size: 0.875rem;
  }

  &__progress {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    padding: 1.5rem 0.5rem;
    border-radius: $radius-xl;
    background-color: var(--color-bg-card);
    border: 1px solid var(--color-border);

    @media (min-width: 640px) {
      padding: 1.75rem 1rem;
    }
  }

  &__details {
    display: grid;
    gap: 1rem;

    @media (min-width: 640px) {
      grid-template-columns: 1fr 1fr;
    }
  }

  &__card {
    display: flex;
    flex-direction: column;
    gap: 0.875rem;
    padding: 1.375rem 1.25rem;
    border-radius: $radius-lg;
    background-color: var(--color-bg-card);
    border: 1px solid var(--color-border);
  }

  &__card-title {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-family: var(--font-body);
    font-size: 0.75rem;
    font-weight: 600;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--color-muted);

    i { color: var(--color-accent); }
  }

  &__items {
    display: flex;
    flex-direction: column;
  }

  &__item {
    display: flex;
    justify-content: space-between;
    gap: 1rem;
    padding: 0.625rem 0;
    border-bottom: 1px solid var(--color-border);
    font-size: 0.9375rem;

    &:last-child { border-bottom: none; padding-bottom: 0; }
    &:first-child { padding-top: 0; }
  }

  &__item-name {
    color: var(--color-primary);
    font-weight: 500;
  }

  &__item-qty {
    flex-shrink: 0;
    color: var(--color-muted);
  }

  &__destination {
    font-family: var(--font-heading);
    font-size: 1.25rem;
    color: var(--color-primary);
  }

  &__note {
    display: flex;
    gap: 0.625rem;
    padding: 0.875rem 1rem;
    border-radius: $radius-md;
    background-color: var(--color-accent-light);

    i { color: var(--color-accent); margin-top: 0.25rem; }

    p {
      font-size: 0.875rem;
      color: var(--color-primary);
    }
  }
}

// ── Progress step ───────────────────────────────
.tp-step {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  text-align: center;

  &__circle {
    position: relative;
    z-index: 1;
    display: grid;
    place-items: center;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    font-size: 0.875rem;
    background-color: var(--color-bg-subtle);
    color: var(--color-muted);
    border: 2px solid var(--color-border);
    transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease;

    @media (min-width: 640px) {
      width: 46px;
      height: 46px;
    }
  }

  &__label {
    font-size: 0.6875rem;
    font-weight: 600;
    line-height: 1.3;
    color: var(--color-muted);

    @media (min-width: 640px) {
      font-size: 0.8125rem;
    }
  }

  &__line {
    position: absolute;
    top: 20px;
    left: calc(50% + 22px);
    right: calc(-50% + 22px);
    height: 2px;
    background-color: var(--color-border);

    @media (min-width: 640px) {
      top: 23px;
      left: calc(50% + 25px);
      right: calc(-50% + 25px);
    }
  }

  &--done {
    .tp-step__circle {
      background-color: var(--color-accent);
      border-color: var(--color-accent);
      color: var(--color-on-accent);
    }
    .tp-step__label { color: var(--color-primary); }
    .tp-step__line { background-color: var(--color-accent); }
  }

  &--active {
    .tp-step__circle {
      background-color: var(--color-bg-card);
      border-color: var(--color-accent);
      color: var(--color-accent);
      box-shadow: var(--focus-ring);
    }
    .tp-step__label { color: var(--color-accent); }
  }
}
</style>
