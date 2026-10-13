export interface AdminUser {
  _id: string;
  name: string;
  email: string;
  role: string;
  isActive?: boolean;
  createdAt?: string;
}

export function formatDate(dateStr?: string) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('es-VE', { day: '2-digit', month: 'short', year: 'numeric' });
}

export function getUserInitials(name: string) {
  return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
}

export const roleBadgeClass: Record<string, string> = {
  owner: 'role-badge--owner',
  admin: 'role-badge--admin',
  customer: 'role-badge--customer',
};
