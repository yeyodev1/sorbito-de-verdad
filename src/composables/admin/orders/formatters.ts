import type { Order } from './types';
import { BILLING_WHATSAPP } from './constants';

export function formatDate(dateStr?: string) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('es-VE', {
    day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
  });
}

export function formatCurrency(amount?: number) {
  if (!amount) return '$0.00';
  return `$${amount.toFixed(2)}`;
}

export function getItemCount(order: Order) {
  return (order.items || []).reduce((sum, item) => sum + (item.quantity || 1), 0);
}

export function extractCloudinaryPublicId(url: string): string {
  // https://res.cloudinary.com/{cloud}/image/upload/v{version}/{publicId}.{ext}
  const match = url.match(/\/upload\/(?:v\d+\/)?(.+)\.[^.]+$/);
  return match?.[1] ?? '';
}

export function buildOrderMessage(order: Order): string {
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

export function shareOnWhatsApp(order: Order) {
  const message = buildOrderMessage(order);
  window.open(`https://wa.me/${BILLING_WHATSAPP}?text=${encodeURIComponent(message)}`, '_blank');
}
