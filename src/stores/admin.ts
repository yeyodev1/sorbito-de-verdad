import { defineStore } from 'pinia';
import { ref } from 'vue';
import { adminService } from '../services/admin.service';

export const useAdminStore = defineStore('admin', () => {
  const stats = ref<Record<string, unknown> | null>(null);
  const loading = ref(false);

  async function fetchStats() {
    loading.value = true;
    try {
      const res = await adminService.getStats();
      stats.value = res.data;
    } finally {
      loading.value = false;
    }
  }

  return { stats, loading, fetchStats };
});
