<script setup lang="ts">
import { formatCurrency, type DashboardStats } from './dashboardUtils';

defineProps<{ loading: boolean; stats: DashboardStats }>();
</script>

<template>
  <!-- Stats Grid -->
  <div class="dashboard__stats">
    <!-- Skeleton loading -->
    <template v-if="loading">
      <div v-for="n in 4" :key="n" class="stat-card stat-card--skeleton">
        <div class="skeleton-line"></div>
        <div class="skeleton-line skeleton-line--short"></div>
      </div>
    </template>

    <template v-else>
      <div class="stat-card">
        <div class="stat-card__body">
          <div class="stat-card__info">
            <div class="stat-card__number">{{ stats.activeProducts ?? stats.totalProducts ?? 0 }}</div>
            <div class="stat-card__label">Productos Activos</div>
          </div>
          <div class="stat-card__icon-wrap">
            <i class="fa-solid fa-box stat-card__icon"></i>
          </div>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-card__body">
          <div class="stat-card__info">
            <div class="stat-card__number">{{ stats.totalOrders ?? 0 }}</div>
            <div class="stat-card__label">Órdenes Totales</div>
          </div>
          <div class="stat-card__icon-wrap">
            <i class="fa-solid fa-shopping-bag stat-card__icon"></i>
          </div>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-card__body">
          <div class="stat-card__info">
            <div class="stat-card__number">{{ stats.totalUsers ?? 0 }}</div>
            <div class="stat-card__label">Usuarios</div>
          </div>
          <div class="stat-card__icon-wrap">
            <i class="fa-solid fa-users stat-card__icon"></i>
          </div>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-card__body">
          <div class="stat-card__info">
            <div class="stat-card__number">{{ formatCurrency(stats.totalRevenue) }}</div>
            <div class="stat-card__label">Ingresos Totales</div>
          </div>
          <div class="stat-card__icon-wrap">
            <i class="fa-solid fa-dollar-sign stat-card__icon"></i>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<style lang="scss" scoped>
@use "sass:color";

.dashboard {

  &__stats {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    margin-bottom: 1.5rem;

    > * {
      flex: 1 1 calc((100% - 3rem) / 4);
      min-width: 0;
    }

    @media (max-width: 1200px) {
      > * { flex-basis: calc(50% - 0.5rem); }
    }

    @media (max-width: 600px) {
      > * { flex-basis: 100%; }
    }
  }
}

.stat-card {
  background-color: $admin-card;
  border: 1px solid $admin-border;
  border-radius: 12px;
  padding: 1.5rem;
  transition: border-color 0.2s ease;

  &:hover {
    border-color: rgba($admin-accent, 0.3);
  }

  &--skeleton {
    min-height: 100px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 0.75rem;
  }

  &__body {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
  }

  &__number {
    font-size: 2rem;
    font-weight: 700;
    color: $admin-text;
    line-height: 1;
    margin-bottom: 0.375rem;
    font-family: 'Inter', sans-serif;
  }

  &__label {
    font-size: 0.8125rem;
    color: $admin-text-muted;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    font-weight: 500;
  }

  &__icon-wrap {
    width: 46px;
    height: 46px;
    border-radius: 10px;
    background-color: $admin-accent-dim;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  &__icon {
    font-size: 1.25rem;
    color: $admin-accent;
  }
}

.skeleton-line {
  height: 18px;
  background: linear-gradient(90deg, $admin-border 25%, color.adjust(#2A2A2A, $lightness: 5%) 50%, $admin-border 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 4px;
  width: 70%;

  &--short {
    width: 40%;
    height: 14px;
  }
}

@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}
</style>
