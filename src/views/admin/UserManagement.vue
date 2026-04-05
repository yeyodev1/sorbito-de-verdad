<script setup lang="ts">
import { ref, onMounted } from 'vue';
import AdminLayout from '../../layout/AdminLayout.vue';
import { adminService } from '../../services/admin.service';
import { useAuthStore } from '../../stores/auth';

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  isActive?: boolean;
  createdAt?: string;
}

const authStore = useAuthStore();
const users = ref<User[]>([]);
const loading = ref(true);
const creating = ref(false);
const deleteConfirmId = ref<string | null>(null);
const errorMsg = ref('');
const successMsg = ref('');

const newUser = ref({
  name: '',
  email: '',
  password: '',
  role: 'admin',
});

onMounted(async () => {
  await loadUsers();
});

async function loadUsers() {
  loading.value = true;
  try {
    const res = await adminService.getUsers();
    const data = res?.data || res;
    users.value = Array.isArray(data) ? data : (data?.users || []);
  } catch (e) {
    console.error(e);
  } finally {
    loading.value = false;
  }
}

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
    await loadUsers();
  } catch (e: unknown) {
    const err = e as { response?: { data?: { message?: string } }; message?: string };
    errorMsg.value = err?.response?.data?.message || err?.message || 'Error al crear el usuario.';
  } finally {
    creating.value = false;
  }
}

async function toggleActive(user: User) {
  if (user._id === authStore.user?._id) return;
  try {
    await adminService.updateUser(user._id, { isActive: !user.isActive });
    user.isActive = !user.isActive;
  } catch (e) {
    console.error(e);
  }
}

async function changeRole(user: User, role: string) {
  if (user._id === authStore.user?._id) return;
  try {
    await adminService.updateUser(user._id, { role });
    user.role = role;
  } catch (e) {
    console.error(e);
  }
}

async function deleteUser(id: string) {
  try {
    await adminService.deleteUser(id);
    users.value = users.value.filter((u) => u._id !== id);
    deleteConfirmId.value = null;
  } catch (e) {
    console.error(e);
  }
}

function isCurrentUser(userId: string) {
  return userId === authStore.user?._id;
}

function formatDate(dateStr?: string) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('es-VE', { day: '2-digit', month: 'short', year: 'numeric' });
}

function getUserInitials(name: string) {
  return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
}

const roleBadgeClass: Record<string, string> = {
  owner: 'role-badge--owner',
  admin: 'role-badge--admin',
  customer: 'role-badge--customer',
};
</script>

<template>
  <AdminLayout title="Gestión de Usuarios">
    <!-- Role info -->
    <div class="um__role-info">
      <div class="um__role-card">
        <div class="um__role-icon um__role-icon--owner">
          <i class="fa-solid fa-crown"></i>
        </div>
        <div>
          <h4 class="um__role-title">Owner</h4>
          <p class="um__role-desc">Acceso total. Puede crear/eliminar admins, gestionar todo el sistema.</p>
        </div>
      </div>
      <div class="um__role-card">
        <div class="um__role-icon um__role-icon--admin">
          <i class="fa-solid fa-shield-halved"></i>
        </div>
        <div>
          <h4 class="um__role-title">Admin</h4>
          <p class="um__role-desc">Gestionar productos, categorías y órdenes. No puede gestionar usuarios.</p>
        </div>
      </div>
    </div>

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

    <!-- Users Table -->
    <div class="admin-card">
      <div class="admin-card__header">
        <h3 class="admin-card__title">Todos los Usuarios</h3>
        <span class="um__total">{{ users.length }} total</span>
      </div>

      <!-- Loading -->
      <div v-if="loading">
        <div v-for="n in 5" :key="n" class="um__skeleton-row"></div>
      </div>

      <!-- Table -->
      <div v-else class="um__table-wrap">
        <table class="admin-table">
          <thead>
            <tr>
              <th style="padding-left: 1.5rem;">Usuario</th>
              <th>Email</th>
              <th>Rol</th>
              <th>Estado</th>
              <th>Registro</th>
              <th style="text-align: right; padding-right: 1.5rem;">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in users" :key="user._id" :class="{ 'um__row--current': isCurrentUser(user._id) }">
              <td style="padding-left: 1.5rem;">
                <div class="um__user-cell">
                  <div class="um__avatar" :class="`um__avatar--${user.role}`">
                    {{ getUserInitials(user.name) }}
                  </div>
                  <div class="um__user-info">
                    <span class="um__user-name">
                      {{ user.name }}
                      <span v-if="isCurrentUser(user._id)" class="um__you-badge">Tú</span>
                    </span>
                  </div>
                </div>
              </td>
              <td class="um__email">{{ user.email }}</td>
              <td>
                <span :class="['role-badge', roleBadgeClass[user.role] || 'role-badge--customer']">
                  {{ user.role?.toUpperCase() }}
                </span>
              </td>
              <td>
                <span :class="['status-badge', user.isActive !== false ? 'status-badge--success' : 'status-badge--error']">
                  {{ user.isActive !== false ? 'Activo' : 'Inactivo' }}
                </span>
              </td>
              <td class="um__date">{{ formatDate(user.createdAt) }}</td>
              <td style="text-align: right; padding-right: 1.5rem;">
                <div class="um__actions" :class="{ 'um__actions--disabled': isCurrentUser(user._id) || user.role === 'owner' }">
                  <!-- Change role (only for non-owners/non-self) -->
                  <select
                    v-if="!isCurrentUser(user._id) && user.role !== 'owner'"
                    class="um__role-select"
                    :value="user.role"
                    @change="changeRole(user, ($event.target as HTMLSelectElement).value)"
                  >
                    <option value="admin">Admin</option>
                    <option value="customer">Customer</option>
                  </select>

                  <!-- Toggle active -->
                  <button
                    v-if="!isCurrentUser(user._id) && user.role !== 'owner'"
                    :class="['um__action-btn', user.isActive !== false ? 'um__action-btn--deactivate' : 'um__action-btn--activate']"
                    :title="user.isActive !== false ? 'Desactivar' : 'Activar'"
                    @click="toggleActive(user)"
                  >
                    <i :class="['fa-solid', user.isActive !== false ? 'fa-eye-slash' : 'fa-eye']"></i>
                  </button>

                  <!-- Delete -->
                  <button
                    v-if="!isCurrentUser(user._id) && user.role !== 'owner'"
                    class="um__action-btn um__action-btn--delete"
                    title="Eliminar usuario"
                    @click="deleteConfirmId = user._id"
                  >
                    <i class="fa-solid fa-trash"></i>
                  </button>

                  <span v-if="isCurrentUser(user._id) || user.role === 'owner'" class="um__protected">
                    <i class="fa-solid fa-lock"></i>
                  </span>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Delete Confirm Modal -->
    <Transition name="fade">
      <div v-if="deleteConfirmId" class="modal-overlay" @click.self="deleteConfirmId = null">
        <div class="modal-box">
          <div class="modal-box__icon">
            <i class="fa-solid fa-triangle-exclamation"></i>
          </div>
          <h3 class="modal-box__title">¿Eliminar usuario?</h3>
          <p class="modal-box__text">Esta acción no se puede deshacer.</p>
          <div class="modal-box__actions">
            <button class="btn-outline" @click="deleteConfirmId = null">Cancelar</button>
            <button class="btn-danger" @click="deleteUser(deleteConfirmId!)">Sí, eliminar</button>
          </div>
        </div>
      </div>
    </Transition>
  </AdminLayout>
</template>

<style lang="scss" scoped>
@use '../../styles/colorVariables.module.scss' as *;

.um {
  &__role-info {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
    margin-bottom: 1.5rem;

    @media (max-width: 600px) {
      grid-template-columns: 1fr;
    }
  }

  &__role-card {
    display: flex;
    align-items: flex-start;
    gap: 1rem;
    padding: 1.25rem;
    background-color: $admin-card;
    border: 1px solid $admin-border;
    border-radius: 12px;
  }

  &__role-icon {
    width: 40px;
    height: 40px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1rem;
    flex-shrink: 0;

    &--owner {
      background-color: rgba($admin-accent, 0.15);
      color: $admin-accent;
    }

    &--admin {
      background-color: rgba($admin-info, 0.15);
      color: $admin-info;
    }
  }

  &__role-title {
    font-size: 0.9375rem;
    font-weight: 600;
    color: $admin-text;
    margin: 0 0 0.25rem;
  }

  &__role-desc {
    font-size: 0.8125rem;
    color: $admin-text-muted;
    margin: 0;
    line-height: 1.5;
  }

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

  &__total {
    font-size: 0.875rem;
    color: $admin-text-muted;
    font-weight: 500;
  }

  &__skeleton-row {
    height: 60px;
    border-bottom: 1px solid $admin-border;
    background: linear-gradient(90deg, $admin-border 25%, lighten(#2A2A2A, 5%) 50%, $admin-border 75%);
    background-size: 200% 100%;
    animation: shimmer 1.5s infinite;

    &:last-child { border-bottom: none; }
  }

  &__table-wrap {
    overflow-x: auto;
  }

  &__user-cell {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  &__avatar {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.8125rem;
    font-weight: 700;
    flex-shrink: 0;
    color: #fff;

    &--owner { background-color: $admin-accent; }
    &--admin { background-color: $admin-info; }
    &--customer { background-color: $admin-text-muted; }
  }

  &__user-info {
    display: flex;
    flex-direction: column;
  }

  &__user-name {
    font-size: 0.9375rem;
    font-weight: 500;
    color: $admin-text;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  &__you-badge {
    background-color: rgba($admin-accent, 0.15);
    color: $admin-accent;
    font-size: 0.625rem;
    font-weight: 700;
    padding: 0.125rem 0.375rem;
    border-radius: 4px;
    text-transform: uppercase;
    letter-spacing: 0.04em;
  }

  &__email {
    color: $admin-text-muted;
    font-size: 0.875rem;
  }

  &__date {
    color: $admin-text-muted;
    font-size: 0.8125rem;
    white-space: nowrap;
  }

  &__actions {
    display: flex;
    align-items: center;
    gap: 0.375rem;
    justify-content: flex-end;

    &--disabled {
      opacity: 0.6;
    }
  }

  &__role-select {
    padding: 0.375rem 0.625rem;
    background-color: $admin-sidebar-active;
    border: 1px solid $admin-border;
    border-radius: 6px;
    color: $admin-text;
    font-size: 0.8125rem;
    font-family: 'Inter', sans-serif;
    cursor: pointer;

    &:focus {
      outline: none;
      border-color: $admin-accent;
    }

    option { background-color: $admin-card; }
  }

  &__action-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.15s ease;
    font-size: 0.875rem;
    border: 1px solid $admin-border;
    background-color: $admin-sidebar-hover;
    color: $admin-text-muted;

    &--activate:hover, &--deactivate:hover { border-color: $admin-info; color: $admin-info; }
    &--delete:hover { border-color: $admin-error; color: $admin-error; background-color: rgba($admin-error, 0.1); }
  }

  &__protected {
    color: $admin-text-muted;
    font-size: 0.875rem;
    opacity: 0.5;
    padding: 0.25rem;
  }

  &__row--current {
    background-color: rgba($admin-accent, 0.04);
  }
}

.admin-card {
  background-color: $admin-card;
  border: 1px solid $admin-border;
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 1.5rem;

  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1.25rem 1.5rem;
    border-bottom: 1px solid $admin-border;
  }

  &__title {
    font-size: 1rem;
    font-weight: 600;
    color: $admin-text;
    margin: 0;
  }
}

.admin-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.875rem;

  thead tr th {
    background-color: $admin-sidebar-active;
    color: $admin-text-muted;
    text-transform: uppercase;
    font-size: 0.75rem;
    letter-spacing: 0.06em;
    font-weight: 600;
    padding: 0.75rem 1rem;
    text-align: left;
    white-space: nowrap;
  }

  tbody tr {
    border-bottom: 1px solid $admin-border;
    transition: background-color 0.15s ease;

    &:last-child { border-bottom: none; }
    &:hover { background-color: $admin-sidebar-hover; }

    td {
      padding: 0.875rem 1rem;
      color: $admin-text;
    }
  }
}

.role-badge {
  display: inline-flex;
  padding: 0.2rem 0.6rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.04em;

  &--owner { background-color: rgba($admin-accent, 0.15); color: $admin-accent; }
  &--admin { background-color: rgba($admin-info, 0.15); color: $admin-info; }
  &--customer { background-color: rgba($admin-text-muted, 0.15); color: $admin-text-muted; }
}

.status-badge {
  display: inline-flex;
  padding: 0.2rem 0.6rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 600;

  &--success { background-color: rgba($admin-success, 0.15); color: $admin-success; }
  &--error { background-color: rgba($admin-error, 0.15); color: $admin-error; }
}

// Buttons
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

  &:hover:not(:disabled) { background-color: darken(#C8956C, 8%); }
  &:disabled { opacity: 0.6; cursor: not-allowed; }
}

.btn-outline {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 1.25rem;
  background-color: transparent;
  color: $admin-text-muted;
  border: 1px solid $admin-border;
  border-radius: 8px;
  font-size: 0.9375rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s ease;
  font-family: 'Inter', sans-serif;

  &:hover { border-color: $admin-text; color: $admin-text; }
}

.btn-danger {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 1.25rem;
  background-color: $admin-error;
  color: #fff;
  border-radius: 8px;
  font-size: 0.9375rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s ease;
  font-family: 'Inter', sans-serif;
  border: none;

  &:hover { background-color: darken(#EF4444, 8%); }
}

// Modal
.modal-overlay {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 200;
  padding: 1rem;
}

.modal-box {
  background-color: $admin-card;
  border: 1px solid $admin-border;
  border-radius: 16px;
  padding: 2rem;
  max-width: 380px;
  width: 100%;
  text-align: center;

  &__icon {
    width: 56px;
    height: 56px;
    border-radius: 50%;
    background-color: rgba($admin-error, 0.15);
    color: $admin-error;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.5rem;
    margin: 0 auto 1.25rem;
  }

  &__title {
    font-size: 1.25rem;
    font-weight: 700;
    color: $admin-text;
    margin: 0 0 0.75rem;
  }

  &__text {
    color: $admin-text-muted;
    font-size: 0.9375rem;
    margin: 0 0 1.5rem;
  }

  &__actions {
    display: flex;
    gap: 0.75rem;
    justify-content: center;
  }
}

// Form
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

.fade-enter-active, .fade-leave-active { transition: opacity 0.2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}
</style>
