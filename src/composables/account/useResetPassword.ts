import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '../../stores/auth';
import { useUIStore } from '../../stores/ui';
import { authService } from '../../services/auth.service';

/** Lee el token del enlace y establece la nueva contraseña. */
export function useResetPassword() {
  const route = useRoute();
  const router = useRouter();
  const authStore = useAuthStore();
  const uiStore = useUIStore();

  const token = ref('');
  const password = ref('');
  const confirmPassword = ref('');
  const loading = ref(false);
  const errorMessage = ref('');
  const success = ref(false);

  onMounted(() => {
    const t = route.query.token;
    if (typeof t === 'string' && t) {
      token.value = t;
    } else {
      errorMessage.value = 'Enlace inválido. Solicita uno nuevo desde la pantalla de login.';
    }
  });

  async function handleReset() {
    if (loading.value) return;
    errorMessage.value = '';

    if (password.value.length < 6) {
      errorMessage.value = 'La contraseña debe tener al menos 6 caracteres.';
      return;
    }
    if (password.value !== confirmPassword.value) {
      errorMessage.value = 'Las contraseñas no coinciden.';
      return;
    }

    loading.value = true;
    try {
      const res = await authService.resetPassword(token.value, password.value);
      if (res.data?.token) {
        authStore.setFromToken(res.data.token, res.data.user);
      }
      success.value = true;
      uiStore.showNotification('¡Contraseña actualizada!', 'success');
      setTimeout(() => router.push('/perfil'), 2200);
    } catch (err: unknown) {
      errorMessage.value =
        (err as { message?: string })?.message ||
        'Enlace inválido o expirado. Solicita uno nuevo.';
    } finally {
      loading.value = false;
    }
  }

  return { token, password, confirmPassword, loading, errorMessage, success, handleReset };
}
