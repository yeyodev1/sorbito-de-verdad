import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../../stores/auth';
import { useCartStore } from '../../stores/cart';
import { useUIStore } from '../../stores/ui';

/** Estado compartido por la barra de escritorio y el menú móvil. */
export function useNavbarSession() {
  const authStore = useAuthStore();
  const cartStore = useCartStore();
  const uiStore = useUIStore();
  const router = useRouter();

  const isDark = computed(() => uiStore.theme === 'dark');
  const totalItems = computed(() => cartStore.totalItems);
  const isMenuOpen = computed(() => uiStore.isMenuOpen);

  function handleLogout() {
    authStore.logout();
    uiStore.closeMenu();
    router.push('/');
  }

  function confirmLogout() {
    uiStore.openConfirm({
      title: 'Cerrar sesión',
      message: '¿Seguro que deseas cerrar tu sesión? Tendrás que volver a iniciar sesión para acceder a tu cuenta.',
      type: 'danger',
      confirmLabel: 'Cerrar sesión',
      cancelLabel: 'Cancelar',
      onConfirm: handleLogout,
    });
  }

  return { authStore, uiStore, isDark, totalItems, isMenuOpen, confirmLogout };
}
