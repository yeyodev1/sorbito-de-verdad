import type { Order } from './types';
import { DEFAULT_FILTER, statusLabels } from './constants';
import { useUIStore } from '../../../stores/ui';

export async function exportOrdersToExcel(orders: Order[], filterStatus: string) {
  const ui = useUIStore();
  const confirmed = orders;
  if (confirmed.length === 0) {
    ui.error('No hay órdenes para exportar');
    return;
  }
  const filterLabel = filterStatus === DEFAULT_FILTER ? 'Activas' : (filterStatus ? statusLabels[filterStatus] : undefined) ?? 'Todas';

  const { default: ExcelJS } = await import('exceljs');

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
  const slug = filterStatus === DEFAULT_FILTER ? 'activas' : filterStatus || 'todas';
  a.download = `ordenes-${slug}-${new Date().toISOString().slice(0, 10)}.xlsx`;
  a.click();
  URL.revokeObjectURL(url);
  ui.success(`${confirmed.length} órdenes exportadas a Excel ✓`);
}
