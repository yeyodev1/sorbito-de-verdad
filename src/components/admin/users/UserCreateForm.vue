<script setup lang="ts">
import { ref } from 'vue';
import { adminService } from '../../../services/admin.service';

const emit = defineEmits<{ (e: 'created'): void }>();

const creating = ref(false);
const errorMsg = ref('');
const successMsg = ref('');

const newUser = ref({
  name: '',
  email: '',
  password: '',
  role: 'admin',
});

async function handleCreateUser() {
  if (!newUser.value.name || !newUser.value.email || !newUser.value.password) {
    errorMsg.value = 'Por favor completa todos los campos.';
    return;
  }

  creating.value = true;
  errorMsg.value = '';
  successMsg.value = '';

  try {
    await adminService.createAdminUser(newUser.value);
    successMsg.value = 'Administrador creado exitosamente.';
    newUser.value = { name: '', email: '', password: '', role: 'admin' };
    emit('created');
  } catch (e: unknown) {
    const err = e as { response?: { data?: { message?: string } }; message?: string };
    errorMsg.value = err?.response?.data?.message || err?.message || 'Error al crear el usuario.';
  } finally {
    creating.value = false;
  }
}
</script>

<template>
  <!-- Create Admin Form -->
  <div class="admin-card um__create-card">
    <h3 class="um__create-title">
      <i class="fa-solid fa-user-plus"></i>
      Crear Nuevo Administrador
    </h3>

    <div v-if="errorMsg" class="um__alert um__alert--error">
      <i class="fa-solid fa-circle-exclamation"></i> {{ errorMsg }}
    </div>
    <div v-if="successMsg" class="um__alert um__alert--success">
      <i class="fa-solid fa-circle-check"></i> {{ successMsg }}
    </div>

    <form @submit.prevent="handleCreateUser" class="um__create-form">
      <div class="pf__field">
        <label class="pf__label">Nombre Completo</label>
        <input v-model="newUser.name" type="text" class="pf__input" placeholder="Ana García" required />
      </div>
      <div class="pf__field">
        <label class="pf__label">Email</label>
        <input v-model="newUser.email" type="email" class="pf__input" placeholder="ana@sorbito.com" required />
      </div>
      <div class="pf__field">
        <label class="pf__label">Contraseña</label>
        <input v-model="newUser.password" type="password" class="pf__input" placeholder="Mínimo 8 caracteres" required minlength="8" />
      </div>
      <div class="pf__field">
        <label class="pf__label">Rol</label>
        <select v-model="newUser.role" class="pf__input pf__select">
          <option value="admin">Admin</option>
        </select>
      </div>
      <button type="submit" class="btn-primary" :disabled="creating">
        <i v-if="creating" class="fa-solid fa-spinner fa-spin"></i>
        <i v-else class="fa-solid fa-user-plus"></i>
        {{ creating ? 'Creando...' : 'Crear Administrador' }}
      </button>
    </form>
  </div>
</template>

<style lang="scss" scoped src="./adminCard.scss"></style>

<style lang="scss" scoped>
@use "sass:color";

.um {
  &__create-card {
    margin-bottom: 1.5rem;
    padding: 1.5rem;
  }

  &__create-title {
    font-size: 1rem;
    font-weight: 600;
    color: $admin-text;
    margin: 0 0 1.25rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;

    i {
      color: $admin-accent;
    }
  }

  &__create-form {
    display: grid;
    grid-template-columns: repeat(4, 1fr) auto;
    gap: 0.875rem;
    align-items: flex-end;

    @media (max-width: 1100px) {
      grid-template-columns: repeat(2, 1fr);
    }

    @media (max-width: 600px) {
      grid-template-columns: 1fr;
    }
  }

  &__alert {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.875rem 1.25rem;
    border-radius: 8px;
    font-size: 0.9375rem;
    margin-bottom: 1rem;

    &--error {
      background-color: rgba($admin-error, 0.12);
      border: 1px solid rgba($admin-error, 0.3);
      color: $admin-error;
    }

    &--success {
      background-color: rgba($admin-success, 0.12);
      border: 1px solid rgba($admin-success, 0.3);
      color: $admin-success;
    }
  }
}

.pf {
  &__field {
    display: flex;
    flex-direction: column;
    gap: 0.375rem;
  }

  &__label {
    font-size: 0.8125rem;
    font-weight: 500;
    color: $admin-text-muted;
    text-transform: uppercase;
    letter-spacing: 0.06em;
  }

  &__input {
    padding: 0.625rem 0.875rem;
    background-color: $admin-sidebar-active;
    border: 1px solid $admin-border;
    border-radius: 8px;
    color: $admin-text;
    font-size: 0.9375rem;
    font-family: 'Inter', sans-serif;
    width: 100%;

    &::placeholder { color: #555; }

    &:focus {
      outline: none;
      border-color: $admin-accent;
      box-shadow: 0 0 0 3px rgba($admin-accent, 0.12);
    }
  }

  &__select {
    appearance: none;
    cursor: pointer;
    option { background-color: $admin-card; }
  }
}

.btn-primary {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 1.25rem;
  background-color: $admin-accent;
  color: #fff;
  border-radius: 8px;
  font-size: 0.9375rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s ease;
  font-family: 'Inter', sans-serif;
  border: none;
  white-space: nowrap;

  &:hover:not(:disabled) { background-color: color.adjust(#C8956C, $lightness: -8%); }
  &:disabled { opacity: 0.6; cursor: not-allowed; }
}
</style>
