<script setup lang="ts">
import DateRangePicker from '../../DateRangePicker.vue';
import { DEFAULT_FILTER, statusLabels } from '../../../composables/admin/orders/constants';
import { useOrdersContext } from '../../../composables/admin/orders/context';

const {
  orders, filterStatus, filterSource, searchQuery, statusCounts, totalCount, totalFiltered,
  setFilter, isDefaultFilterActive, getExportLabel, onDateChange, exportConfirmedOrders,
} = useOrdersContext();
</script>

<template>
  <div class="om__toolbar">
    <div class="om__toolbar-top">
      <div class="om__filters">
        <button
          :class="['om__filter-btn', 'om__filter-btn--pending', { 'om__filter-btn--active': filterStatus === 'pending' }]"
          @click="setFilter('pending')"
          title="Ver solo órdenes pendientes de pago"
        >
          <i class="fa-solid fa-clock"></i>
          Pendientes
          <span class="om__filter-count om__filter-count--alert">{{ statusCounts.pending ?? 0 }}</span>
        </button>

        <button
          :class="['om__filter-btn', 'om__filter-btn--review', { 'om__filter-btn--active': filterStatus === 'review' }]"
          @click="setFilter('review')"
          title="Órdenes que requieren revisión"
        >
          <i class="fa-solid fa-eye"></i>
          En revisión
          <span class="om__filter-count om__filter-count--review">{{ statusCounts.review ?? 0 }}</span>
        </button>

        <span class="om__filter-divider"></span>

        <button
          :class="['om__filter-btn', { 'om__filter-btn--active': isDefaultFilterActive() }]"
          @click="setFilter(DEFAULT_FILTER)"
          title="Mostrar todas excepto pendientes"
        >
          <i class="fa-solid fa-check-circle"></i>
          Activas
          <span class="om__filter-count">{{ totalFiltered || orders.length }}</span>
        </button>

        <span class="om__filter-divider"></span>

        <button
          v-for="s in ['confirmed', 'processing', 'shipped', 'delivered', 'cancelled']"
          :key="s"
          :class="['om__filter-btn', { 'om__filter-btn--active': filterStatus === s }]"
          @click="setFilter(s)"
        >
          {{ statusLabels[s] }}
          <span class="om__filter-count">{{ statusCounts[s] ?? 0 }}</span>
        </button>

        <span class="om__filter-divider"></span>

        <button
          :class="['om__filter-btn', { 'om__filter-btn--active': filterStatus === '' }]"
          @click="setFilter('')"
          title="Mostrar todas las órdenes sin filtro"
        >
          <i class="fa-solid fa-list"></i>
          Todas
          <span class="om__filter-count">{{ totalCount || orders.length }}</span>
        </button>
      </div>
      <button class="om__export-btn" @click="exportConfirmedOrders" :title="`Exportar ${getExportLabel()} órdenes`">
        <i class="fa-solid fa-file-excel"></i>
        {{ getExportLabel() }}
        <span class="om__filter-count">{{ orders.length }}</span>
      </button>
    </div>

    <!-- Date range + Search + Source filter -->
    <div class="om__toolbar-bottom">
      <DateRangePicker @change="onDateChange" />
      <div class="om__search-wrap">
        <i class="fa-solid fa-magnifying-glass om__search-icon"></i>
        <input
          v-model="searchQuery"
          type="text"
          class="om__search-input"
          placeholder="Buscar por nombre, cédula o teléfono..."
        />
        <button v-if="searchQuery" class="om__search-clear" @click="searchQuery = ''" title="Limpiar búsqueda">
          <i class="fa-solid fa-xmark"></i>
        </button>
      </div>
      <div class="om__source-wrap">
        <i class="fa-solid fa-sliders-filter om__source-icon"></i>
        <select v-model="filterSource" class="om__source-select" title="Filtrar por canal">
          <option value="">Todos los canales</option>
          <option value="whatsapp_bot">WhatsApp Bot</option>
          <option value="web">Web</option>
        </select>
        <i class="fa-solid fa-chevron-down om__source-arrow"></i>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped src="./OrdersToolbar.scss"></style>
