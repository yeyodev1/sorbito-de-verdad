import { ref, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from '../../stores/auth';
import { useUIStore } from '../../stores/ui';
import { authService } from '../../services/auth.service';

export type AuthMode = 'login' | 'register' | 'forgot';
export interface LoginFormData { name: string; email: string; password: string }

/** Estado y acciones de la pantalla de acceso (login, registro y recuperar contraseña). */
export function useLoginForm() {
  const authStore = useAuthStore();
  const uiStore = useUIStore();
  const router = useRouter();
  const route = useRoute();

  // 'login' | 'register' | 'forgot'
  const mode = ref<AuthMode>('login');
  const loading = ref(false);
  const errorMessage = ref('');
  const forgotSent = ref(false);

  const form = ref<LoginFormData>({ name: '', email: '', password: '' });
  const forgotEmail = ref('');

  const redirectPath = computed(() => {
    const r = route.query.redirect;
    return typeof r === 'string' ? r : '/';
  });

  async function handleSubmit() {
    if (loading.value) return;
    loading.value = true;
    errorMessage.value = '';
    try {
      if (mode.value === 'login') {
        await authStore.login(form.value.email, form.value.password);
        const firstName = authStore.user?.name?.split(' ')[0] ?? '';
        uiStore.success(`¡Bienvenido/a${firstName ? `, ${firstName}` : ''}!`);
        router.push(redirectPath.value);
      } else {
        await authStore.register(form.value.name, form.value.email, form.value.password);
        const firstName = form.value.name.trim().split(' ')[0];
        uiStore.success(`¡Bienvenido/a a Sorbito, ${firstName}!`);
        router.push(redirectPath.value);
      }
    } catch (err: unknown) {
      type AxiosErr = { response?: { data?: { message?: string } }; message?: string };
      const e = err as AxiosErr;
      errorMessage.value = e.response?.data?.message || 'Error al procesar. Verifica tus datos.';
    } finally {
      loading.value = false;
    }
  }

  async function handleForgot() {
    if (loading.value || !forgotEmail.value) return;
    loading.value = true;
    errorMessage.value = '';
    try {
      await authService.forgotPassword(forgotEmail.value);
      forgotSent.value = true;
    } catch (err: unknown) {
      errorMessage.value = (err as { message?: string })?.message || 'Error al enviar. Intenta de nuevo.';
    } finally {
      loading.value = false;
    }
  }

  function setMode(m: AuthMode) {
    mode.value = m;
    errorMessage.value = '';
    forgotSent.value = false;
    form.value = { name: '', email: '', password: '' };
    forgotEmail.value = '';
  }

  const cardTitle = computed(() => {
    if (mode.value === 'forgot') return forgotSent.value ? '¡Revisa tu correo!' : 'Recuperar contraseña';
    return mode.value === 'login' ? 'Bienvenido/a de vuelta' : 'Crear cuenta';
  });

  const cardSubtitle = computed(() => {
    if (mode.value === 'forgot') {
      return forgotSent.value
        ? `Enviamos un enlace de recuperación a ${forgotEmail.value}. Válido por 1 hora.`
        : 'Ingresa tu correo y te enviaremos un enlace para restablecer tu contraseña.';
    }
    return mode.value === 'login'
      ? 'Inicia sesión para acceder a tus pedidos y favoritos.'
      : 'Únete y descubre el mundo artesanal de Sorbito.';
  });

  return {
    mode, loading, errorMessage, forgotSent, form, forgotEmail,
    handleSubmit, handleForgot, setMode, cardTitle, cardSubtitle,
  };
}
