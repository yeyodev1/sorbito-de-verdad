export interface DashboardStats {
  totalProducts?: number;
  activeProducts?: number;
  totalOrders?: number;
  pendingOrders?: number;
  totalUsers?: number;
  totalRevenue?: number;
}

export interface DashboardOrder {
  _id: string;
  orderNumber?: string;
  user?: { name?: string; email?: string };
  total?: number;
  status?: string;
  createdAt?: string;
}

export function formatCurrency(amount?: number) {
  if (!amount) return '$0.00';
  return new Intl.NumberFormat('es-VE', { style: 'currency', currency: 'USD' }).format(amount);
}

export function formatDate(dateStr?: string) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('es-VE', { day: '2-digit', month: 'short', year: 'numeric' });
}

const statusColors: Record<string, string> = {
  pending: 'warning',
  review: 'review',
  confirmed: 'info',
  processing: 'info',
  shipped: 'purple',
  delivered: 'success',
  cancelled: 'error',
};

export function getStatusColor(status?: string) {
  return statusColors[status || ''] || 'muted';
}
