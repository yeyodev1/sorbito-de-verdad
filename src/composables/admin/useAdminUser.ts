import { computed } from 'vue';
import { useAuthStore } from '../../stores/auth';

/** Datos del usuario admin que se muestran en la barra lateral y la superior. */
export function useAdminUser() {
  const authStore = useAuthStore();

  const userInitials = computed(() => {
    const name = authStore.user?.name || '';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  });

  const userRole = computed(() => authStore.user?.role?.toUpperCase() || '');

  return { authStore, userInitials, userRole };
}
