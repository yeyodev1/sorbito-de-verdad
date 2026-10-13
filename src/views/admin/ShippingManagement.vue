<script setup lang="ts">
import { ref, onMounted } from 'vue';
import AdminLayout from '../../layout/AdminLayout.vue';
import ShippingZonesList from '../../components/admin/shipping/ShippingZonesList.vue';
import ShippingZoneFormModal from '../../components/admin/shipping/ShippingZoneFormModal.vue';
import ShippingDeleteModal from '../../components/admin/shipping/ShippingDeleteModal.vue';
import type { ShippingZonePayload } from '../../composables/admin/useShippingZoneForm';
import { shippingZoneService, type ShippingZone } from '../../services/shippingZone.service';
import { useUIStore } from '../../stores/ui';

const ui = useUIStore();

const zones = ref<ShippingZone[]>([]);
const loading = ref(true);
const showModal = ref(false);
const editingZone = ref<ShippingZone | null>(null);
const saving = ref(false);
const deleteConfirmId = ref<string | null>(null);

onMounted(async () => {
  await loadZones();
});

async function loadZones() {
  loading.value = true;
  try {
    zones.value = await shippingZoneService.getZones();
  } catch (e) {
    console.error(e);
    ui.error('Error al cargar las zonas de envío');
  } finally {
    loading.value = false;
  }
}

function openCreate() {
  editingZone.value = null;
  showModal.value = true;
}

function openEdit(zone: ShippingZone) {
  editingZone.value = zone;
  showModal.value = true;
}

function closeModal() {
  showModal.value = false;
  editingZone.value = null;
}

async function handleSave(payload: ShippingZonePayload) {
  saving.value = true;
  try {
    if (editingZone.value) {
      const updated = await shippingZoneService.updateZone(editingZone.value._id, payload);
      const idx = zones.value.findIndex((z) => z._id === editingZone.value!._id);
      if (idx !== -1) zones.value[idx] = updated;
      ui.success('Zona de envío actualizada');
    } else {
      const created = await shippingZoneService.createZone(payload);
      zones.value.push(created);
      ui.success('Zona de envío creada');
    }
    closeModal();
    await loadZones();
  } catch (e: unknown) {
    const err = e as { response?: { data?: { message?: string } }; message?: string };
    ui.error(err?.response?.data?.message || err?.message || 'Error al guardar la zona de envío');
  } finally {
    saving.value = false;
  }
}

async function toggleActive(zone: ShippingZone) {
  try {
    await shippingZoneService.updateZone(zone._id, { isActive: !zone.isActive });
    zone.isActive = !zone.isActive;
    ui.success(zone.isActive ? 'Zona activada' : 'Zona desactivada');
  } catch (e: unknown) {
    const err = e as { response?: { data?: { message?: string } }; message?: string };
    ui.error(err?.response?.data?.message || 'Error al cambiar estado');
  }
}

async function deleteZone(id: string) {
  try {
    await shippingZoneService.deleteZone(id);
    zones.value = zones.value.filter((z) => z._id !== id);
    deleteConfirmId.value = null;
    ui.success('Zona de envío eliminada');
  } catch (e: unknown) {
    const err = e as { response?: { data?: { message?: string } }; message?: string };
    ui.error(err?.response?.data?.message || 'Error al eliminar la zona de envío');
  }
}
</script>

<template>
  <AdminLayout title="Zonas de Envío">
    <!-- Toolbar -->
    <div class="sm__toolbar">
      <h2 class="sm__count">{{ zones.length }} zona(s) de envío</h2>
      <button class="btn-primary" @click="openCreate">
        <i class="fa-solid fa-plus"></i>
        Nueva Zona
      </button>
    </div>

    <ShippingZonesList
      :zones="zones"
      :loading="loading"
      @create="openCreate"
      @edit="openEdit"
      @toggle-active="toggleActive"
      @request-delete="deleteConfirmId = $event"
    />

    <!-- Hint cards for seed zones -->
    <div class="sm__hints">
      <p class="sm__hints-title"><i class="fa-solid fa-lightbulb"></i> Zonas sugeridas:</p>
      <div class="sm__hints-list">
        <span class="sm__hint-chip">Todo Ecuador — $5.00 — 3-5 días</span>
        <span class="sm__hint-chip">Estados Unidos — $25.00 — 7-14 días</span>
        <span class="sm__hint-chip">Europa — $30.00 — 10-20 días</span>
      </div>
    </div>

    <!-- Create/Edit Modal -->
    <ShippingZoneFormModal :show="showModal" :zone="editingZone" :saving="saving" @close="closeModal" @save="handleSave" />

    <!-- Delete Confirm Modal -->
    <ShippingDeleteModal :zone-id="deleteConfirmId" @cancel="deleteConfirmId = null" @confirm="deleteZone" />
  </AdminLayout>
</template>

<style lang="scss" scoped src="../../components/admin/shipping/shippingButtons.scss"></style>

<style lang="scss" scoped>
.sm {
  &__toolbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    margin-bottom: 1.25rem;
  }

  &__count {
    font-size: 0.9375rem;
    color: $admin-text-muted;
    font-weight: 500;
    margin: 0;
  }


  &__hints {
    margin-top: 1rem;
    padding: 0.875rem 1.125rem;
    background-color: rgba($admin-accent, 0.06);
    border: 1px solid rgba($admin-accent, 0.18);
    border-radius: 10px;
  }

  &__hints-title {
    font-size: 0.8125rem;
    color: $admin-text-muted;
    margin: 0 0 0.625rem;
    display: flex;
    align-items: center;
    gap: 0.375rem;

    i { color: $admin-accent; font-size: 0.75rem; }
  }

  &__hints-list {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  &__hint-chip {
    display: inline-flex;
    padding: 0.25rem 0.75rem;
    background-color: $admin-sidebar-active;
    border: 1px solid $admin-border;
    border-radius: 20px;
    font-size: 0.8125rem;
    color: $admin-text-muted;
  }
}
</style>
