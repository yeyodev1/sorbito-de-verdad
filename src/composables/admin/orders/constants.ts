// ⚠️ Cambiar al número real de WhatsApp de facturación (formato: código país + número, sin +)
export const BILLING_WHATSAPP = '593XXXXXXXXX';

export const DEFAULT_FILTER = 'confirmed,processing,shipped,delivered,cancelled,review';

export const allStatuses = ['pending', 'review', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];

export const statusColors: Record<string, string> = {
  pending: 'warning',
  review: 'review',
  confirmed: 'info',
  processing: 'info',
  shipped: 'purple',
  delivered: 'success',
  cancelled: 'error',
};

export const statusLabels: Record<string, string> = {
  pending: 'Pendiente',
  review: 'En revisión',
  confirmed: 'Confirmado',
  processing: 'En proceso',
  shipped: 'Enviado',
  delivered: 'Entregado',
  cancelled: 'Cancelado',
};

export const paymentStatusLabels: Record<string, string> = {
  pending: 'Pendiente',
  paid: 'Pagado',
  failed: 'Fallido',
  refunded: 'Reembolsado',
};

export const paymentStatusColors: Record<string, string> = {
  pending: 'warning',
  paid: 'success',
  failed: 'error',
  refunded: 'info',
};

export const exportFilterLabels: Record<string, string> = {
  pending: 'Pendientes',
  review: 'En revisión',
  confirmed: 'Confirmadas',
  processing: 'En proceso',
  shipped: 'Enviadas',
  delivered: 'Entregadas',
  cancelled: 'Canceladas',
};
