<script setup lang="ts">
import OrderRow from './OrderRow.vue';
import OrdersPagination from './OrdersPagination.vue';
import { DEFAULT_FILTER, statusLabels } from '../../../composables/admin/orders/constants';
import { useOrdersContext } from '../../../composables/admin/orders/context';

const { orders, loading, filterStatus } = useOrdersContext();
</script>

<template>
  <div class="admin-card">
    <div v-if="loading" class="om__skeleton">
      <!-- Header skeleton -->
      <div class="om__skeleton-header">
        <div v-for="n in 9" :key="n" class="om__skeleton-th"></div>
      </div>
      <!-- Row skeletons -->
      <div v-for="n in 6" :key="n" class="om__skeleton-row">
        <div class="om__skeleton-cell om__skeleton-cell--sm"></div>
        <div class="om__skeleton-cell om__skeleton-cell--lg"></div>
        <div class="om__skeleton-cell om__skeleton-cell--sm"></div>
        <div class="om__skeleton-cell om__skeleton-cell--sm"></div>
        <div class="om__skeleton-cell om__skeleton-cell--md"></div>
        <div class="om__skeleton-cell om__skeleton-cell--md"></div>
        <div class="om__skeleton-cell om__skeleton-cell--sm"></div>
        <div class="om__skeleton-cell om__skeleton-cell--md"></div>
        <div class="om__skeleton-cell om__skeleton-cell--sm"></div>
      </div>
    </div>

    <div v-else-if="orders.length === 0" class="om__empty">
      <i class="fa-solid fa-inbox"></i>
      <p v-if="filterStatus === DEFAULT_FILTER">No hay órdenes activas. Todas están pendientes.</p>
      <p v-else-if="filterStatus">No hay órdenes con estado "{{ statusLabels[filterStatus] || filterStatus }}"</p>
      <p v-else>No hay órdenes para mostrar</p>
    </div>

    <div v-else class="om__table-wrap">
      <!-- Pagination top -->
      <OrdersPagination />
      <table class="admin-table">
        <thead>
          <tr>
            <th style="padding-left: 1.5rem;">Orden</th>
            <th>Cliente</th>
            <th>Canal</th>
            <th>Productos</th>
            <th>Total</th>
            <th>Estado</th>
            <th>Pago</th>
            <th>Fecha</th>
            <th style="text-align: right; padding-right: 1.5rem;">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <OrderRow v-for="order in orders" :key="order._id" :order="order" />
        </tbody>
      </table>
      <!-- Pagination bottom -->
      <OrdersPagination bottom />
    </div>
  </div>
</template>

<style lang="scss" scoped src="./OrdersTable.scss"></style>
