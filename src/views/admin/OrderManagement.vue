<script setup lang="ts">
import AdminLayout from '../../layout/AdminLayout.vue';
import OrdersToolbar from '../../components/admin/orders/OrdersToolbar.vue';
import OrdersTable from '../../components/admin/orders/OrdersTable.vue';
import PayConfirmModal from '../../components/admin/orders/PayConfirmModal.vue';
import PaymentStatusModal from '../../components/admin/orders/PaymentStatusModal.vue';
import DeliveryReceiptModal from '../../components/admin/orders/DeliveryReceiptModal.vue';
import OrderConfirmDialog from '../../components/admin/orders/OrderConfirmDialog.vue';
import { createOrdersContext } from '../../composables/admin/orders/context';

// Estado y acciones compartidos con todos los componentes hijos (provide/inject)
createOrdersContext();
</script>

<template>
  <AdminLayout title="Órdenes">
    <!-- Filters + Export -->
    <OrdersToolbar />

    <!-- Table -->
    <OrdersTable />
  </AdminLayout>

  <!-- Pay Confirmation Modal (on "confirmed" with pending payment) -->
  <PayConfirmModal />

  <!-- Payment Confirmation Modal (for direct payment change) -->
  <PaymentStatusModal />

  <!-- Receipt modal (on "delivered") -->
  <DeliveryReceiptModal />

  <!-- Confirmation dialog -->
  <OrderConfirmDialog />
</template>
