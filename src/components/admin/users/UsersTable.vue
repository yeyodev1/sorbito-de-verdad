<script setup lang="ts">
import { useAuthStore } from '../../../stores/auth';
import { formatDate, getUserInitials, roleBadgeClass, type AdminUser } from './userUtils';

defineProps<{ users: AdminUser[]; loading: boolean }>();
const emit = defineEmits<{
  (e: 'change-role', user: AdminUser, role: string): void;
  (e: 'toggle-active', user: AdminUser): void;
  (e: 'request-delete', id: string): void;
}>();

const authStore = useAuthStore();

function isCurrentUser(userId: string) {
  return userId === authStore.user?._id;
}
</script>

<template>
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
                  @change="emit('change-role', user, ($event.target as HTMLSelectElement).value)"
                >
                  <option value="admin">Admin</option>
                  <option value="customer">Customer</option>
                </select>

                <!-- Toggle active -->
                <button
                  v-if="!isCurrentUser(user._id) && user.role !== 'owner'"
                  :class="['um__action-btn', user.isActive !== false ? 'um__action-btn--deactivate' : 'um__action-btn--activate']"
                  :title="user.isActive !== false ? 'Desactivar' : 'Activar'"
                  @click="emit('toggle-active', user)"
                >
                  <i :class="['fa-solid', user.isActive !== false ? 'fa-eye-slash' : 'fa-eye']"></i>
                </button>

                <!-- Delete -->
                <button
                  v-if="!isCurrentUser(user._id) && user.role !== 'owner'"
                  class="um__action-btn um__action-btn--delete"
                  title="Eliminar usuario"
                  @click="emit('request-delete', user._id)"
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
</template>

<style lang="scss" scoped src="./adminCard.scss"></style>

<style lang="scss" scoped src="./UsersTable.scss"></style>
