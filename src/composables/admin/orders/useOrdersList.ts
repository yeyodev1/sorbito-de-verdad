import { ref, watch, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { adminService } from '../../../services/admin.service';
import type { Order } from './types';
import { DEFAULT_FILTER, exportFilterLabels } from './constants';
import { exportOrdersToExcel } from './exportOrdersExcel';

export function useOrdersList() {
  const route = useRoute();

  const orders = ref<Order[]>([]);
  const loading = ref(true);
  const filterStatus = ref(DEFAULT_FILTER);
  const filterSource = ref(''); // '' | 'whatsapp_bot' | 'web'
  const dateFrom = ref('');  // UTC ISO string from DateRangePicker
  const dateTo   = ref('');  // UTC ISO string from DateRangePicker
  const searchQuery = ref('');
  const statusCounts = ref<Record<string, number>>({});
  const totalCount = ref(0);
  const totalFiltered = ref(0);
  const currentPage = ref(1);
  const pageSize = ref(200);
  const expandedId = ref<string | null>(null);
  const draftNotes = ref<Record<string, string>>({});

  onMounted(async () => {
    if (route.query.filter === 'pending') {
      filterStatus.value = 'pending';
    }
    await loadOrders();
  });

  // Cada vez que cambia el filtro o las fechas → nueva llamada al backend
  watch([filterStatus, filterSource, dateFrom, dateTo], async () => {
    currentPage.value = 1;
    await loadOrders();
  });

  // Búsqueda con debounce de 350ms
  let _searchTimer: ReturnType<typeof setTimeout> | null = null;
  watch(searchQuery, () => {
    if (_searchTimer) clearTimeout(_searchTimer);
    _searchTimer = setTimeout(() => loadOrders(), 350);
  });

  async function loadOrders() {
    loading.value = true;
    expandedId.value = null;
    try {
      const params: Record<string, unknown> = { sort: '-createdAt', limit: pageSize.value, page: currentPage.value };
      if (filterStatus.value)  params.status   = filterStatus.value;
      if (filterSource.value)  params.source   = filterSource.value;
      if (dateFrom.value)      params.dateFrom  = dateFrom.value;
      if (dateTo.value)        params.dateTo    = dateTo.value;
      if (searchQuery.value)   params.search    = searchQuery.value;

      const res = await adminService.getOrders(params);

      // El backend devuelve { data: orders[], counts: {}, total: number, totalFiltered: number, page: number, pageSize: number }
      const raw = res?.data ?? res;
      orders.value = Array.isArray(raw) ? raw : (raw?.data ?? raw?.orders ?? []);

      // Conteos reales desde el backend (siempre presentes, sin importar el filtro)
      if (res?.counts) {
        statusCounts.value = res.counts;
        totalCount.value   = res.total ?? Object.values(res.counts as Record<string, number>).reduce((a, b) => a + b, 0);
      }
      totalFiltered.value = res?.totalFiltered ?? orders.value.length;
      currentPage.value = res?.page ?? 1;
      pageSize.value = res?.pageSize ?? 200;

      for (const o of orders.value) {
        if (o.notes && !(o._id in draftNotes.value)) {
          draftNotes.value[o._id] = o.notes;
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      loading.value = false;
    }
  }

  function goToPage(page: number) {
    currentPage.value = page;
    loadOrders();
  }

  function isDefaultFilterActive() {
    return filterStatus.value === DEFAULT_FILTER;
  }

  function setFilter(status: string) {
    filterStatus.value = status;
    currentPage.value = 1;
  }

  function getExportLabel() {
    if (!filterStatus.value) return 'Exportar todo';
    if (filterStatus.value === DEFAULT_FILTER) return 'Exportar activas';
    return `Exportar ${exportFilterLabels[filterStatus.value] || filterStatus.value}`;
  }

  function onDateChange(range: { from: string; to: string }) {
    dateFrom.value = range.from;
    dateTo.value   = range.to;
  }

  function openExpand(id: string) {
    if (expandedId.value === id) {
      expandedId.value = null;
    } else {
      expandedId.value = id;
      const order = orders.value.find(o => o._id === id);
      if (order && !(id in draftNotes.value)) {
        draftNotes.value[id] = order.notes || '';
      }
    }
  }

  function updateCountsAfterChange(order: Order) {
    if (statusCounts.value[order.status || ''] != null) {
      statusCounts.value = { ...statusCounts.value, [order.status || '']: Math.max(0, (statusCounts.value[order.status || ''] || 1) - 1) };
    }
  }

  function exportConfirmedOrders() {
    return exportOrdersToExcel(orders.value, filterStatus.value);
  }

  return {
    orders, loading, filterStatus, filterSource, searchQuery, statusCounts, totalCount,
    totalFiltered, currentPage, pageSize, expandedId, draftNotes,
    loadOrders, goToPage, isDefaultFilterActive, setFilter, getExportLabel, onDateChange,
    openExpand, updateCountsAfterChange, exportConfirmedOrders,
  };
}
