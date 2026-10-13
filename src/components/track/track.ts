export interface TrackResult {
  orderNumber: string;
  status: string;
  createdAt: string;
  shippingAddress: { city: string; country: string };
  items: Array<{ name: string; quantity: number }>;
  notes?: string;
}

export type SearchMode = 'number' | 'email';

export const statusLabels: Record<string, string> = {
  review:     'En revisión',
  confirmed:  'Confirmado',
  processing: 'En proceso',
  shipped:    'Enviado',
  delivered:  'Entregado',
};

export const statusSteps = ['confirmed', 'processing', 'shipped', 'delivered'];
export const stepLabels  = ['Confirmado', 'En proceso', 'Enviado', 'Entregado'];
export const stepIcons   = [
  'fa-solid fa-circle-check',
  'fa-solid fa-gear',
  'fa-solid fa-truck',
  'fa-solid fa-house',
];

export function getStepState(step: string, currentStatus: string) {
  const idx    = statusSteps.indexOf(step);
  const curIdx = statusSteps.indexOf(currentStatus);
  if (curIdx === -1)  return 'pending';
  if (idx < curIdx)   return 'done';
  if (idx === curIdx) return 'active';
  return 'pending';
}

export function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('es-ES', {
    year: 'numeric', month: 'long', day: 'numeric',
  });
}
