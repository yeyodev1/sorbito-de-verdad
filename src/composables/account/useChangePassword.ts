import { ref } from 'vue';
import { authService } from '../../services/auth.service';

/** Estado y envío del formulario "Cambiar contraseña" del perfil. */
export function useChangePassword() {
  const changingPassword = ref(false);
  const pwdForm = ref({ current: '', new: '', confirm: '' });
  const pwdError = ref('');
  const pwdSuccess = ref('');
  const savingPwd = ref(false);

  async function handleChangePassword() {
    pwdError.value = '';
    pwdSuccess.value = '';
    if (!pwdForm.value.current || !pwdForm.value.new) {
      pwdError.value = 'Completa todos los campos.';
      return;
    }
    if (pwdForm.value.new.length < 6) {
      pwdError.value = 'La nueva contraseña debe tener al menos 6 caracteres.';
      return;
    }
    if (pwdForm.value.new !== pwdForm.value.confirm) {
      pwdError.value = 'Las contraseñas no coinciden.';
      return;
    }
    savingPwd.value = true;
    try {
      await authService.changePassword(pwdForm.value.current, pwdForm.value.new);
      pwdSuccess.value = 'Contraseña actualizada correctamente.';
      pwdForm.value = { current: '', new: '', confirm: '' };
      setTimeout(() => { pwdSuccess.value = ''; changingPassword.value = false; }, 2500);
    } catch (err: unknown) {
      pwdError.value = (err as { message?: string })?.message || 'Error al cambiar la contraseña.';
    } finally {
      savingPwd.value = false;
    }
  }

  return { changingPassword, pwdForm, pwdError, pwdSuccess, savingPwd, handleChangePassword };
}
