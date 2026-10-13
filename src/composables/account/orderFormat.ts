import type { Order } from '../../types';

export const statusLabels: Record<string, string> = {
  pending:    'Pendiente',
  review:     'En revisión',
  confirmed:  'Confirmado',
  processing: 'En proceso',
  shipped:    'Enviado',
  delivered:  'Entregado',
  cancelled:  'Cancelado',
};

export const statusColors: Record<string, string> = {
  pending:    'warning',
  review:     'info',
  confirmed:  'info',
  processing: 'info',
  shipped:    'accent',
  delivered:  'success',
  cancelled:  'error',
};

export const paymentStatusLabels: Record<string, string> = {
  pending:  'Pendiente',
  paid:     'Pagado',
  failed:   'Fallido',
  refunded: 'Reembolsado',
};

export function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('es-ES', {
    year: 'numeric', month: 'long', day: 'numeric',
  });
}

export function formatPrice(val: number) {
  return `$${val.toFixed(2)}`;
}

export function googleMapsUrl(addr: Order['shippingAddress']) {
  if (addr.mapsUrl) return addr.mapsUrl;
  const query = encodeURIComponent(`${addr.street}, ${addr.city}, ${addr.country}`);
  return `https://www.google.com/maps/search/?api=1&query=${query}`;
}

export function whatsappUrl(orderNumber: string) {
  const text = `Hola, tengo una consulta sobre mi pedido #${orderNumber}`;
  return `https://api.whatsapp.com/send/?phone=593962861148&text=${encodeURIComponent(text)}&type=phone_number&app_absent=0`;
}
