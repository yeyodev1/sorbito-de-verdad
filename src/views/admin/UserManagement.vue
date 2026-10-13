<script setup lang="ts">
import { ref, onMounted } from 'vue';
import AdminLayout from '../../layout/AdminLayout.vue';
import UserRoleInfo from '../../components/admin/users/UserRoleInfo.vue';
import UserCreateForm from '../../components/admin/users/UserCreateForm.vue';
import UsersTable from '../../components/admin/users/UsersTable.vue';
import UserDeleteModal from '../../components/admin/users/UserDeleteModal.vue';
import type { AdminUser as User } from '../../components/admin/users/userUtils';
import { adminService } from '../../services/admin.service';
import { useAuthStore } from '../../stores/auth';

const authStore = useAuthStore();
const users = ref<User[]>([]);
const loading = ref(true);
const deleteConfirmId = ref<string | null>(null);

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
</script>

<template>
  <AdminLayout title="Gestión de Usuarios">
    <!-- Role info -->
    <UserRoleInfo />

    <!-- Create Admin Form -->
    <UserCreateForm @created="loadUsers" />

    <!-- Users Table -->
    <UsersTable
      :users="users"
      :loading="loading"
      @change-role="changeRole"
      @toggle-active="toggleActive"
      @request-delete="deleteConfirmId = $event"
    />

    <!-- Delete Confirm Modal -->
    <UserDeleteModal :user-id="deleteConfirmId" @cancel="deleteConfirmId = null" @confirm="deleteUser" />
  </AdminLayout>
</template>
