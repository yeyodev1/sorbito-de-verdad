<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';
import ExcelJS from 'exceljs';
import AdminLayout from '../../layout/AdminLayout.vue';
import DateRangePicker from '../../components/DateRangePicker.vue';
import { adminService } from '../../services/admin.service';
import { useUIStore } from '../../stores/ui';

const ui = useUIStore();

interface OrderItem {
  name?: string;
  quantity?: number;
  price?: number;
}

interface ShippingAddress {
  name?: string;
  phone?: string;
  street?: string;
  city?: string;
  state?: string;
  country?: string;
  zip?: string;
  mapsUrl?: string;
}

interface Order {
  _id: string;
  orderNumber?: string;
  user?: { name?: string; email?: string };
  items?: OrderItem[];
  total?: number;
  status?: string;
  paymentStatus?: string;
  shippingAddress?: ShippingAddress;
  identificationNumber?: string;
  notes?: string;
  createdAt?: string;
}

// ⚠️ Cambiar al número real de WhatsApp de facturación (formato: código país + número, sin +)
const BILLING_WHATSAPP = '593XXXXXXXXX';

const orders = ref<Order[]>([]);
const loading = ref(true);
const filterStatus = ref('');
const dateFrom = ref('');  // UTC ISO string from DateRangePicker
const dateTo   = ref('');  // UTC ISO string from DateRangePicker
const statusCounts = ref<Record<string, number>>({});
const totalCount = ref(0);
const expandedId = ref<string | null>(null);
const updatingId = ref<string | null>(null);
const draftNotes = ref<Record<string, string>>({});
const savingNotes = ref<string | null>(null);
const resendingEmail = ref<string | null>(null);

const allStatuses = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];

const statusColors: Record<string, string> = {
  pending: 'warning',
  confirmed: 'info',
  processing: 'info',
  shipped: 'purple',
  delivered: 'success',
  cancelled: 'error',
};

const statusLabels: Record<string, string> = {
  pending: 'Pendiente',
  confirmed: 'Confirmado',
  processing: 'En proceso',
  shipped: 'Enviado',
  delivered: 'Entregado',
  cancelled: 'Cancelado',
};

onMounted(async () => {
  await loadOrders();
});

// Cada vez que cambia el filtro o las fechas → nueva llamada al backend
watch([filterStatus, dateFrom, dateTo], async () => {
  await loadOrders();
});

async function loadOrders() {
  loading.value = true;
  expandedId.value = null;
  try {
    const params: Record<string, unknown> = { sort: '-createdAt', limit: 200 };
    if (filterStatus.value) params.status = filterStatus.value;
    if (dateFrom.value)     params.dateFrom = dateFrom.value;
    if (dateTo.value)       params.dateTo = dateTo.value;

    const res = await adminService.getOrders(params);

    // El backend ahora devuelve { data: orders[], counts: {}, total: number }
    const raw = res?.data ?? res;
    orders.value = Array.isArray(raw) ? raw : (raw?.data ?? raw?.orders ?? []);

    // Conteos reales desde el backend (siempre presentes, sin importar el filtro)
    if (res?.counts) {
      statusCounts.value = res.counts;
      totalCount.value   = res.total ?? Object.values(res.counts as Record<string, number>).reduce((a, b) => a + b, 0);
    }

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




async function updateStatus(order: Order, newStatus: string) {
  updatingId.value = order._id;
  try {
    await adminService.updateOrderStatus(order._id, newStatus);
    order.status = newStatus;
    ui.success(`Estado → ${statusLabels[newStatus] || newStatus} · Email enviado al cliente`);
  } catch (e: unknown) {
    const err = e as { response?: { data?: { message?: string } }; message?: string };
    ui.error(err?.response?.data?.message || 'Error al actualizar la orden');
  } finally {
    updatingId.value = null;
  }
}

async function resendEmail(order: Order) {
  resendingEmail.value = order._id;
  try {
    await adminService.resendOrderEmail(order._id);
    ui.success(`Correo reenviado a ${order.user?.email || 'el cliente'}`);
  } catch {
    ui.error('Error al reenviar el correo');
  } finally {
    resendingEmail.value = null;
  }
}

async function saveNotes(order: Order) {
  savingNotes.value = order._id;
  try {
    const notes = draftNotes.value[order._id] ?? '';
    await adminService.updateOrderStatus(order._id, order.status || 'pending', undefined, notes);
    order.notes = notes;
    ui.success('Nota guardada');
  } catch {
    ui.error('Error al guardar la nota');
  } finally {
    savingNotes.value = null;
  }
}

function formatDate(dateStr?: string) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('es-VE', {
    day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
  });
}

function formatCurrency(amount?: number) {
  if (!amount) return '$0.00';
  return `$${amount.toFixed(2)}`;
}

function getItemCount(order: Order) {
  return (order.items || []).reduce((sum, item) => sum + (item.quantity || 1), 0);
}

function buildOrderMessage(order: Order): string {
  const lines: string[] = [];

  lines.push(`🧾 *ORDEN #${order.orderNumber || order._id?.slice(-6).toUpperCase()}*`);
  lines.push(`📅 ${formatDate(order.createdAt)}`);
  lines.push(`💳 Pago: ${order.paymentStatus === 'paid' ? '✅ Pagado' : '⏳ Pendiente'}`);
  lines.push('');

  lines.push('👤 *CLIENTE*');
  if (order.user?.name) lines.push(`Nombre: ${order.user.name}`);
  if (order.user?.email) lines.push(`Email: ${order.user.email}`);
  if (order.identificationNumber) lines.push(`Cédula: ${order.identificationNumber}`);
  if (order.shippingAddress?.phone) lines.push(`Teléfono: ${order.shippingAddress.phone}`);
  lines.push('');

  lines.push('🛍️ *PRODUCTOS*');
  for (const item of (order.items || [])) {
    const subtotal = (item.price || 0) * (item.quantity || 1);
    lines.push(`• ${item.name || '—'} x${item.quantity || 1} — ${formatCurrency(subtotal)}`);
  }
  lines.push(`💰 *TOTAL: ${formatCurrency(order.total)}*`);

  if (order.shippingAddress) {
    lines.push('');
    lines.push('📦 *DIRECCIÓN DE ENVÍO*');
    if (order.shippingAddress.street) lines.push(order.shippingAddress.street);
    const cityState = [order.shippingAddress.city, order.shippingAddress.state].filter(Boolean).join(', ');
    if (cityState) lines.push(cityState);
    const countryZip = [order.shippingAddress.country, order.shippingAddress.zip].filter(Boolean).join(' ');
    if (countryZip) lines.push(countryZip);
  }

  return lines.join('\n');
}

function shareOnWhatsApp(order: Order) {
  const message = buildOrderMessage(order);
  window.open(`https://wa.me/${BILLING_WHATSAPP}?text=${encodeURIComponent(message)}`, '_blank');
}

async function exportConfirmedOrders() {
  const confirmed = orders.value;
  if (confirmed.length === 0) {
    ui.error('No hay órdenes para exportar');
    return;
  }
  const filterLabel = filterStatus.value ? statusLabels[filterStatus.value] : 'Todas';

  const TERRACOTTA  = 'A0704A';
  const TERRACOTTA2 = 'C8956C';
  const CREMA       = 'F5EDE4';
  const WHITE       = 'FFFFFF';
  const DARK        = '1A1A1A';
  const MUTED       = '7A6A60';
  const NCOLS       = 11;

  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'Sorbito de Verdad';
  workbook.created = new Date();

  const sheet = workbook.addWorksheet('Confirmadas', {
    pageSetup: { orientation: 'landscape', fitToPage: true, fitToWidth: 1 },
    views: [{ state: 'frozen', ySplit: 4 }],
  });

  // ── Fila 1: Título ──────────────────────────────────────────────────────────
  sheet.mergeCells(1, 1, 1, NCOLS);
  const titleCell = sheet.getCell('A1');
  titleCell.value = `☕  SORBITO DE VERDAD — ÓRDENES: ${filterLabel.toUpperCase()}`;
  titleCell.font = { name: 'Calibri', size: 16, bold: true, color: { argb: 'FF' + WHITE } };
  titleCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF' + TERRACOTTA } };
  titleCell.alignment = { horizontal: 'center', vertical: 'middle' };
  sheet.getRow(1).height = 40;

  // ── Fila 2: Subtítulo ───────────────────────────────────────────────────────
  sheet.mergeCells(2, 1, 2, NCOLS);
  const subCell = sheet.getCell('A2');
  subCell.value = `Exportado: ${new Date().toLocaleDateString('es-VE', { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}  ·  Total: ${confirmed.length} órdenes`;
  subCell.font = { name: 'Calibri', size: 10, italic: true, color: { argb: 'FF' + MUTED } };
  subCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFF8F5' } };
  subCell.alignment = { horizontal: 'center', vertical: 'middle' };
  sheet.getRow(2).height = 22;

  // ── Fila 3: Espaciador ──────────────────────────────────────────────────────
  sheet.getRow(3).height = 8;

  // ── Fila 4: Encabezados ─────────────────────────────────────────────────────
  const headers = ['#', 'Orden', 'Fecha', 'Cliente', 'Email', 'Cédula / ID', 'Teléfono', 'Productos', 'Total', 'Dirección de Envío', 'Ciudad / País'];
  const headerRow = sheet.getRow(4);
  headers.forEach((h, i) => {
    const cell = headerRow.getCell(i + 1);
    cell.value = h;
    cell.font = { name: 'Calibri', size: 10, bold: true, color: { argb: 'FF' + WHITE } };
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF' + TERRACOTTA2 } };
    cell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
    cell.border = { bottom: { style: 'medium', color: { argb: 'FF' + TERRACOTTA } } };
  });
  headerRow.height = 28;

  // ── Filas de datos ──────────────────────────────────────────────────────────
  confirmed.forEach((order, idx) => {
    const bgColor = idx % 2 === 0 ? 'FFFFFFFF' : 'FF' + CREMA;

    const products = (order.items || [])
      .map(item => `• ${item.name || '—'} x${item.quantity || 1}  ($${((item.price || 0) * (item.quantity || 1)).toFixed(2)})`)
      .join('\n');

    const cityState = [order.shippingAddress?.city, order.shippingAddress?.state].filter(Boolean).join(', ');
    const location  = [cityState, [order.shippingAddress?.country, order.shippingAddress?.zip].filter(Boolean).join(' ')].filter(Boolean).join('\n');

    const values = [
      idx + 1,
      order.orderNumber || order._id?.slice(-6).toUpperCase() || '—',
      order.createdAt ? new Date(order.createdAt) : '—',
      order.user?.name || '—',
      order.user?.email || '—',
      order.identificationNumber || '—',
      order.shippingAddress?.phone || '—',
      products,
      order.total || 0,
      order.shippingAddress?.street || '—',
      location,
    ];

    const row = sheet.getRow(5 + idx);
    values.forEach((val, i) => {
      const cell = row.getCell(i + 1);
      cell.value = val;
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: bgColor } };
      cell.font = { name: 'Calibri', size: 10, color: { argb: 'FF' + DARK } };
      cell.alignment = { vertical: 'middle', wrapText: true, horizontal: i === 0 ? 'center' : i === 8 ? 'right' : 'left' };
      cell.border = { bottom: { style: 'hair', color: { argb: 'FFE8D5C4' } } };

      if (i === 2 && val instanceof Date) cell.numFmt = 'dd/mmm/yyyy hh:mm';
      if (i === 8) {
        cell.numFmt = '"$"#,##0.00';
        cell.font = { name: 'Calibri', size: 10, bold: true, color: { argb: 'FF' + TERRACOTTA } };
      }
    });
    row.height = (products.match(/\n/g) || []).length > 0 ? 42 : 22;
  });

  // ── Fila de totales ─────────────────────────────────────────────────────────
  const totalRowIdx = 5 + confirmed.length;
  const grandTotal = confirmed.reduce((sum, o) => sum + (o.total || 0), 0);

  sheet.mergeCells(totalRowIdx, 1, totalRowIdx, 8);
  const lblCell = sheet.getCell(totalRowIdx, 1);
  lblCell.value = `TOTAL GENERAL  (${confirmed.length} órdenes — ${filterLabel})`;
  lblCell.font = { name: 'Calibri', size: 11, bold: true, color: { argb: 'FF' + WHITE } };
  lblCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF' + TERRACOTTA } };
  lblCell.alignment = { horizontal: 'right', vertical: 'middle' };

  const grandCell = sheet.getCell(totalRowIdx, 9);
  grandCell.value = grandTotal;
  grandCell.numFmt = '"$"#,##0.00';
  grandCell.font = { name: 'Calibri', size: 12, bold: true, color: { argb: 'FF' + WHITE } };
  grandCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF' + TERRACOTTA } };
  grandCell.alignment = { horizontal: 'right', vertical: 'middle' };
  sheet.getRow(totalRowIdx).height = 32;

  // ── Anchos de columna ───────────────────────────────────────────────────────
  [4, 24, 18, 24, 30, 14, 16, 38, 13, 38, 22].forEach((w, i) => {
    sheet.getColumn(i + 1).width = w;
  });

  // ── Descargar ───────────────────────────────────────────────────────────────
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  const slug = filterStatus.value || 'todas';
  a.download = `ordenes-${slug}-${new Date().toISOString().slice(0, 10)}.xlsx`;
  a.click();
  URL.revokeObjectURL(url);
  ui.success(`${confirmed.length} órdenes exportadas a Excel ✓`);
}
</script>

<template>
  <AdminLayout title="Órdenes">
    <!-- Filters + Export -->
    <div class="om__toolbar">
      <div class="om__toolbar-top">
        <div class="om__filters">
          <button
            :class="['om__filter-btn', { 'om__filter-btn--active': filterStatus === '' }]"
            @click="filterStatus = ''"
          >
            Todas
            <span class="om__filter-count">{{ totalCount || orders.length }}</span>
          </button>
          <button
            v-for="s in allStatuses"
            :key="s"
            :class="['om__filter-btn', { 'om__filter-btn--active': filterStatus === s }]"
            @click="filterStatus = s"
          >
            {{ statusLabels[s] }}
            <span class="om__filter-count">{{ statusCounts[s] ?? 0 }}</span>
          </button>
        </div>
        <button class="om__export-btn" @click="exportConfirmedOrders" :title="`Exportar ${filterStatus ? statusLabels[filterStatus] : 'todas las'} órdenes`">
          <i class="fa-solid fa-file-excel"></i>
          {{ filterStatus ? `Exportar ${statusLabels[filterStatus]}` : 'Exportar todo' }}
          <span class="om__filter-count">{{ orders.length }}</span>
        </button>
      </div>

      <!-- Date range filter -->
      <DateRangePicker @change="onDateChange" />
    </div>

    <!-- Table -->
    <div class="admin-card">
      <div v-if="loading" class="om__skeleton">
        <!-- Header skeleton -->
        <div class="om__skeleton-header">
          <div v-for="n in 8" :key="n" class="om__skeleton-th"></div>
        </div>
        <!-- Row skeletons -->
        <div v-for="n in 6" :key="n" class="om__skeleton-row">
          <div class="om__skeleton-cell om__skeleton-cell--sm"></div>
          <div class="om__skeleton-cell om__skeleton-cell--lg"></div>
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
        <p>No hay órdenes {{ filterStatus ? `con estado "${statusLabels[filterStatus]}"` : 'para mostrar' }}</p>
      </div>

      <div v-else class="om__table-wrap">
        <table class="admin-table">
          <thead>
            <tr>
              <th style="padding-left: 1.5rem;">Orden</th>
              <th>Cliente</th>
              <th>Productos</th>
              <th>Total</th>
              <th>Estado</th>
              <th>Pago</th>
              <th>Fecha</th>
              <th style="text-align: right; padding-right: 1.5rem;">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <template v-for="order in orders" :key="order._id">
              <!-- Main row -->
              <tr :class="['om__row', { 'om__row--expanded': expandedId === order._id }]">
                <td style="padding-left: 1.5rem;">
                  <span class="om__order-num">#{{ order.orderNumber || order._id?.slice(-6).toUpperCase() }}</span>
                </td>
                <td>
                  <div class="om__user">
                    <span class="om__user-name">{{ order.user?.name || '—' }}</span>
                    <span class="om__user-email">{{ order.user?.email || '' }}</span>
                  </div>
                </td>
                <td>
                  <span class="om__items-count">{{ getItemCount(order) }} ítem(s)</span>
                </td>
                <td class="om__total">{{ formatCurrency(order.total) }}</td>
                <td>
                  <span :class="['status-badge', `status-badge--${statusColors[order.status || ''] || 'muted'}`]">
                    {{ statusLabels[order.status || ''] || order.status || '—' }}
                  </span>
                </td>
                <td>
                  <span :class="['status-badge', order.paymentStatus === 'paid' ? 'status-badge--success' : 'status-badge--warning']">
                    {{ order.paymentStatus || '—' }}
                  </span>
                </td>
                <td class="om__date">{{ formatDate(order.createdAt) }}</td>
                <td style="text-align: right; padding-right: 1.5rem;">
                  <div class="om__actions">
                    <!-- WhatsApp button -->
                    <button class="om__wa-btn" @click="shareOnWhatsApp(order)" title="Enviar a WhatsApp de facturación">
                      <i class="fa-brands fa-whatsapp"></i>
                    </button>
                    <!-- Status dropdown -->
                    <select
                      class="om__status-select"
                      :value="order.status"
                      :disabled="updatingId === order._id"
                      @change="updateStatus(order, ($event.target as HTMLSelectElement).value)"
                    >
                      <option v-for="s in allStatuses" :key="s" :value="s">{{ statusLabels[s] }}</option>
                    </select>
                    <!-- Expand button -->
                    <button class="om__expand-btn" @click="openExpand(order._id)" :title="expandedId === order._id ? 'Cerrar' : 'Ver detalles'">
                      <i :class="['fa-solid', expandedId === order._id ? 'fa-chevron-up' : 'fa-chevron-down']"></i>
                    </button>
                  </div>
                </td>
              </tr>

              <!-- Expanded details row -->
              <Transition name="expand">
                <tr v-if="expandedId === order._id" class="om__details-row">
                  <td colspan="8">
                    <div class="om__details">
                      <div class="om__details-section">
                        <h4 class="om__details-title">Productos</h4>
                        <table class="om__items-table">
                          <thead>
                            <tr>
                              <th>Producto</th>
                              <th>Cant.</th>
                              <th>Precio</th>
                              <th>Subtotal</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr v-for="(item, idx) in (order.items || [])" :key="idx">
                              <td>{{ item.name || '—' }}</td>
                              <td>{{ item.quantity || 1 }}</td>
                              <td>{{ formatCurrency(item.price) }}</td>
                              <td>{{ formatCurrency((item.price || 0) * (item.quantity || 1)) }}</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                      <div v-if="order.shippingAddress" class="om__details-section">
                        <h4 class="om__details-title">Dirección de Envío</h4>
                        <div class="om__address">
                          <p v-if="order.shippingAddress.name"><span class="om__address-key">Nombre:</span> {{ order.shippingAddress.name }}</p>
                          <p v-if="order.identificationNumber"><span class="om__address-key">Cédula / ID:</span> {{ order.identificationNumber }}</p>
                          <p v-if="order.shippingAddress.phone"><span class="om__address-key">Teléfono:</span> {{ order.shippingAddress.phone }}</p>
                          <p v-if="order.shippingAddress.street"><span class="om__address-key">Dirección:</span> {{ order.shippingAddress.street }}</p>
                          <p v-if="order.shippingAddress.city"><span class="om__address-key">Ciudad:</span> {{ order.shippingAddress.city }}<span v-if="order.shippingAddress.state">, {{ order.shippingAddress.state }}</span></p>
                          <p v-if="order.shippingAddress.country"><span class="om__address-key">País:</span> {{ order.shippingAddress.country }}<span v-if="order.shippingAddress.zip"> {{ order.shippingAddress.zip }}</span></p>
                        </div>
                        <a
                          :href="order.shippingAddress.mapsUrl || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent([order.shippingAddress.street, order.shippingAddress.city, order.shippingAddress.country].filter(Boolean).join(', '))}`"
                          target="_blank"
                          rel="noopener"
                          class="om__maps-btn"
                        >
                          <i class="fa-brands fa-google"></i>
                          Ver en Google Maps
                        </a>
                      </div>

                      <!-- Notes section -->
                      <div class="om__details-section om__details-section--full">
                        <h4 class="om__details-title">
                          <i class="fa-solid fa-note-sticky"></i>
                          Nota interna
                          <span class="om__note-hint">(se envía al cliente con el próximo cambio de estado)</span>
                        </h4>
                        <textarea
                          v-model="draftNotes[order._id]"
                          class="om__note-textarea"
                          placeholder="Ej: Tu pedido saldrá mañana por DHL, número de guía: XXXXXXX"
                          rows="3"
                        ></textarea>
                        <div class="om__note-actions">
                          <button
                            class="om__note-save"
                            :disabled="savingNotes === order._id"
                            @click="saveNotes(order)"
                          >
                            <i v-if="savingNotes === order._id" class="fa-solid fa-circle-notch fa-spin"></i>
                            <i v-else class="fa-solid fa-floppy-disk"></i>
                            {{ savingNotes === order._id ? 'Guardando...' : 'Guardar nota' }}
                          </button>
                          <button
                            class="om__resend-btn"
                            :disabled="resendingEmail === order._id"
                            @click="resendEmail(order)"
                            title="Reenvía el correo de confirmación al cliente"
                          >
                            <i v-if="resendingEmail === order._id" class="fa-solid fa-circle-notch fa-spin"></i>
                            <i v-else class="fa-solid fa-paper-plane"></i>
                            {{ resendingEmail === order._id ? 'Enviando...' : 'Reenviar correo' }}
                          </button>
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
              </Transition>
            </template>
          </tbody>
        </table>
      </div>
    </div>
  </AdminLayout>
</template>

<style lang="scss" scoped>
@use "sass:color";

.om {
  &__toolbar {
    margin-bottom: 1.25rem;
    overflow-x: auto;
  }

  &__toolbar-top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.75rem;
    flex-wrap: wrap;
  }


  &__filters {
    display: flex;
    gap: 0.375rem;
    flex-wrap: nowrap;
    min-width: min-content;
  }

  &__export-btn {
    display: inline-flex;
    align-items: center;
    gap: 0.375rem;
    padding: 0.5rem 0.875rem;
    border-radius: 8px;
    border: 1px solid #25D366;
    background-color: rgba(37, 211, 102, 0.1);
    color: #25D366;
    font-size: 0.8125rem;
    font-weight: 600;
    cursor: pointer;
    white-space: nowrap;
    font-family: 'Inter', sans-serif;
    transition: all 0.15s ease;
    flex-shrink: 0;

    .om__filter-count {
      background-color: rgba(37, 211, 102, 0.2);
    }

    &:hover {
      background-color: rgba(37, 211, 102, 0.2);
    }
  }

  &__wa-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 30px;
    height: 30px;
    border-radius: 6px;
    border: 1px solid rgba(37, 211, 102, 0.4);
    background-color: rgba(37, 211, 102, 0.08);
    color: #25D366;
    cursor: pointer;
    transition: all 0.15s ease;
    font-size: 1rem;
    flex-shrink: 0;

    &:hover {
      background-color: rgba(37, 211, 102, 0.2);
      border-color: #25D366;
    }
  }

  &__filter-btn {
    display: inline-flex;
    align-items: center;
    gap: 0.375rem;
    padding: 0.5rem 0.875rem;
    border-radius: 8px;
    border: 1px solid $admin-border;
    background-color: $admin-card;
    color: $admin-text-muted;
    font-size: 0.8125rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.15s ease;
    white-space: nowrap;
    font-family: 'Inter', sans-serif;

    &:hover {
      border-color: $admin-accent;
      color: $admin-text;
    }

    &--active {
      background-color: $admin-accent;
      border-color: $admin-accent;
      color: #fff;
    }
  }

  &__filter-count {
    background-color: rgba(255, 255, 255, 0.15);
    border-radius: 10px;
    padding: 0.1rem 0.375rem;
    font-size: 0.6875rem;
    font-weight: 700;
  }

  &__skeleton {
    display: flex;
    flex-direction: column;
  }

  &__skeleton-header {
    display: flex;
    gap: 0.75rem;
    padding: 0.75rem 1.5rem;
    background-color: $admin-sidebar-active;
    border-bottom: 1px solid $admin-border;
  }

  &__skeleton-th {
    height: 12px;
    flex: 1;
    border-radius: 4px;
    background: linear-gradient(90deg, $admin-border 25%, color.adjust(#2A2A2A, $lightness: 8%) 50%, $admin-border 75%);
    background-size: 200% 100%;
    animation: shimmer 1.5s infinite;

    &:first-child { max-width: 100px; }
    &:last-child  { max-width: 80px; }
  }

  &__skeleton-row {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.875rem 1.5rem;
    border-bottom: 1px solid $admin-border;

    &:last-child { border-bottom: none; }
  }

  &__skeleton-cell {
    height: 14px;
    border-radius: 6px;
    background: linear-gradient(90deg, $admin-border 25%, color.adjust(#2A2A2A, $lightness: 5%) 50%, $admin-border 75%);
    background-size: 200% 100%;
    animation: shimmer 1.5s infinite;

    &--sm  { flex: 0 0 80px; }
    &--md  { flex: 0 0 140px; }
    &--lg  { flex: 0 0 200px; }

    // Stagger animation delays para efecto cascada
    &:nth-child(1) { animation-delay: 0s; }
    &:nth-child(2) { animation-delay: 0.08s; }
    &:nth-child(3) { animation-delay: 0.16s; }
    &:nth-child(4) { animation-delay: 0.24s; }
    &:nth-child(5) { animation-delay: 0.32s; }
    &:nth-child(6) { animation-delay: 0.4s; }
    &:nth-child(7) { animation-delay: 0.48s; }
    &:nth-child(8) { animation-delay: 0.56s; }
  }

  &__empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    padding: 4rem 2rem;
    color: $admin-text-muted;

    i {
      font-size: 3rem;
      opacity: 0.4;
    }

    p {
      font-size: 1rem;
      margin: 0;
    }
  }

  &__table-wrap {
    overflow-x: auto;
  }

  &__order-num {
    font-family: monospace;
    font-weight: 600;
    color: $admin-accent;
    font-size: 0.9375rem;
  }

  &__user {
    display: flex;
    flex-direction: column;
    gap: 0.125rem;
  }

  &__user-name {
    color: $admin-text;
    font-size: 0.875rem;
    font-weight: 500;
  }

  &__user-email {
    color: $admin-text-muted;
    font-size: 0.75rem;
  }

  &__items-count {
    color: $admin-text-muted;
    font-size: 0.875rem;
  }

  &__total {
    color: $admin-text;
    font-weight: 600;
    font-size: 0.9375rem;
  }

  &__date {
    color: $admin-text-muted;
    font-size: 0.8125rem;
    white-space: nowrap;
  }

  &__actions {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    justify-content: flex-end;
  }

  &__status-select {
    padding: 0.375rem 0.625rem;
    background-color: $admin-sidebar-active;
    border: 1px solid $admin-border;
    border-radius: 6px;
    color: $admin-text;
    font-size: 0.8125rem;
    font-family: 'Inter', sans-serif;
    cursor: pointer;

    &:focus {
      outline: none;
      border-color: $admin-accent;
    }

    option {
      background-color: $admin-card;
    }

    &:disabled {
      opacity: 0.5;
    }
  }

  &__expand-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 30px;
    height: 30px;
    border-radius: 6px;
    border: 1px solid $admin-border;
    background-color: $admin-sidebar-hover;
    color: $admin-text-muted;
    cursor: pointer;
    transition: all 0.15s ease;
    font-size: 0.75rem;

    &:hover {
      border-color: $admin-accent;
      color: $admin-accent;
    }
  }

  &__row--expanded td {
    border-bottom: none;
  }

  &__details-row td {
    padding: 0;
  }

  &__details {
    display: grid;
    grid-template-columns: 1fr 280px;
    gap: 1.5rem;
    padding: 1.25rem 1.5rem 1.5rem;
    background-color: $admin-sidebar-hover;
    border-bottom: 1px solid $admin-border;

    @media (max-width: 900px) {
      grid-template-columns: 1fr;
    }
  }

  &__details-section {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;

    &--full {
      grid-column: 1 / -1;
    }
  }

  &__details-title {
    font-size: 0.8125rem;
    font-weight: 600;
    color: $admin-text-muted;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    margin: 0;
    display: flex;
    align-items: center;
    gap: 0.375rem;

    i { color: $admin-accent; }
  }

  &__note-hint {
    font-size: 0.6875rem;
    color: $admin-text-muted;
    text-transform: none;
    letter-spacing: 0;
    font-weight: 400;
    opacity: 0.7;
  }

  &__note-textarea {
    width: 100%;
    background: $admin-sidebar-active;
    border: 1px solid $admin-border;
    border-radius: 8px;
    color: $admin-text;
    font-family: 'Inter', sans-serif;
    font-size: 0.875rem;
    padding: 0.75rem 1rem;
    resize: vertical;
    transition: border-color 0.15s;
    box-sizing: border-box;

    &::placeholder { color: $admin-text-muted; opacity: 0.6; }

    &:focus {
      outline: none;
      border-color: $admin-accent;
    }
  }

  &__note-actions {
    display: flex;
    justify-content: flex-end;
    gap: 0.625rem;
    flex-wrap: wrap;
  }

  &__note-save {
    display: inline-flex;
    align-items: center;
    gap: 0.375rem;
    background: $admin-accent;
    color: #fff;
    border: none;
    border-radius: 7px;
    padding: 0.5rem 1.125rem;
    font-size: 0.875rem;
    font-weight: 600;
    cursor: pointer;
    font-family: 'Inter', sans-serif;
    transition: opacity 0.15s;

    &:hover { opacity: 0.85; }
    &:disabled { opacity: 0.5; cursor: not-allowed; }
  }

  &__resend-btn {
    display: inline-flex;
    align-items: center;
    gap: 0.375rem;
    background: transparent;
    color: $admin-accent;
    border: 1px solid $admin-accent;
    border-radius: 7px;
    padding: 0.5rem 1.125rem;
    font-size: 0.875rem;
    font-weight: 600;
    cursor: pointer;
    font-family: 'Inter', sans-serif;
    transition: all 0.15s;

    &:hover { background: rgba($admin-accent, 0.1); }
    &:disabled { opacity: 0.5; cursor: not-allowed; }
  }

  &__items-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 0.875rem;

    th {
      text-align: left;
      padding: 0.5rem 0.75rem;
      color: $admin-text-muted;
      font-size: 0.75rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      background-color: $admin-sidebar-active;
      border-radius: 4px;
    }

    td {
      padding: 0.625rem 0.75rem;
      color: $admin-text;
      border-bottom: 1px solid $admin-border;

      &:last-child { border-bottom: none; }
    }
  }

  &__address {
    display: flex;
    flex-direction: column;
    gap: 0.375rem;

    p {
      font-size: 0.875rem;
      color: $admin-text;
      margin: 0;
    }
  }

  &__address-key {
    color: $admin-text-muted;
    text-transform: capitalize;
  }

  &__maps-btn {
    display: inline-flex;
    align-items: center;
    gap: 0.375rem;
    background: #4285F4;
    color: #fff;
    text-decoration: none;
    padding: 0.4rem 0.875rem;
    border-radius: 6px;
    font-size: 0.8125rem;
    font-weight: 600;
    margin-top: 0.625rem;
    transition: opacity 0.15s;

    &:hover { opacity: 0.85; }
  }
}

.admin-card {
  background-color: $admin-card;
  border: 1px solid $admin-border;
  border-radius: 12px;
  overflow: hidden;
}

.admin-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.875rem;

  thead tr th {
    background-color: $admin-sidebar-active;
    color: $admin-text-muted;
    text-transform: uppercase;
    font-size: 0.75rem;
    letter-spacing: 0.06em;
    font-weight: 600;
    padding: 0.75rem 1rem;
    text-align: left;
    white-space: nowrap;
  }

  tbody tr {
    border-bottom: 1px solid $admin-border;
    transition: background-color 0.15s ease;

    &:hover {
      background-color: $admin-sidebar-hover;
    }

    td {
      padding: 0.875rem 1rem;
      color: $admin-text;
    }
  }
}

.status-badge {
  display: inline-flex;
  padding: 0.2rem 0.6rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 600;
  white-space: nowrap;

  &--warning { background-color: rgba($admin-warning, 0.15); color: $admin-warning; }
  &--info { background-color: rgba($admin-info, 0.15); color: $admin-info; }
  &--success { background-color: rgba($admin-success, 0.15); color: $admin-success; }
  &--error { background-color: rgba($admin-error, 0.15); color: $admin-error; }
  &--purple { background-color: rgba(167, 139, 250, 0.15); color: #a78bfa; }
  &--muted { background-color: rgba($admin-text-muted, 0.15); color: $admin-text-muted; }
}

.expand-enter-active,
.expand-leave-active {
  transition: opacity 0.2s ease;
}
.expand-enter-from,
.expand-leave-to {
  opacity: 0;
}

@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}
</style>
