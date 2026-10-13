<script setup lang="ts">
import { useChangePassword } from '../../../composables/account/useChangePassword';

const { changingPassword, pwdForm, pwdError, pwdSuccess, savingPwd, handleChangePassword } = useChangePassword();
</script>

<template>
  <div class="ap__section ap__section--card">
    <div class="ap__collapse-header" @click="changingPassword = !changingPassword">
      <div class="ap__collapse-left">
        <div class="ap__collapse-icon"><i class="fa-solid fa-lock"></i></div>
        <div>
          <h3 class="ap__collapse-title">Cambiar Contraseña</h3>
          <p class="ap__collapse-sub">Actualiza tu contraseña de acceso</p>
        </div>
      </div>
      <i :class="['fa-solid ap__collapse-chevron', changingPassword ? 'fa-chevron-up' : 'fa-chevron-down']"></i>
    </div>

    <Transition name="slide-fade">
      <div v-if="changingPassword" class="ap__pwd-body">
        <div v-if="pwdError" class="ap__pwd-alert ap__pwd-alert--error">
          <i class="fa-solid fa-circle-xmark"></i> {{ pwdError }}
        </div>
        <div v-if="pwdSuccess" class="ap__pwd-alert ap__pwd-alert--success">
          <i class="fa-solid fa-circle-check"></i> {{ pwdSuccess }}
        </div>
        <form class="ap__pwd-form" @submit.prevent="handleChangePassword" novalidate>
          <div class="ap__pwd-field">
            <label class="ap__pwd-label">Contraseña actual</label>
            <input v-model="pwdForm.current" type="password" class="ap__pwd-input" placeholder="••••••••" autocomplete="current-password" required />
          </div>
          <div class="ap__pwd-field">
            <label class="ap__pwd-label">Nueva contraseña</label>
            <input v-model="pwdForm.new" type="password" class="ap__pwd-input" placeholder="Mínimo 6 caracteres" autocomplete="new-password" required minlength="6" />
          </div>
          <div class="ap__pwd-field">
            <label class="ap__pwd-label">Confirmar nueva contraseña</label>
            <input v-model="pwdForm.confirm" type="password" class="ap__pwd-input" placeholder="Repite la nueva contraseña" autocomplete="new-password" required />
            <span v-if="pwdForm.confirm && pwdForm.new !== pwdForm.confirm" class="ap__pwd-mismatch">
              <i class="fa-solid fa-triangle-exclamation"></i> Las contraseñas no coinciden
            </span>
          </div>
          <div class="ap__pwd-actions">
            <button type="button" class="ap__pwd-cancel" @click="changingPassword = false">Cancelar</button>
            <button type="submit" class="ap__pwd-save" :disabled="savingPwd">
              <i v-if="savingPwd" class="fa-solid fa-circle-notch fa-spin"></i>
              <i v-else class="fa-solid fa-floppy-disk"></i>
              {{ savingPwd ? 'Guardando...' : 'Actualizar contraseña' }}
            </button>
          </div>
        </form>
      </div>
    </Transition>
  </div>
</template>

<style lang="scss" scoped src="./AdminPasswordCard.scss"></style>
