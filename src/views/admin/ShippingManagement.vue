<script setup lang="ts">
import { ref, onMounted } from 'vue';
import AdminLayout from '../../layout/AdminLayout.vue';
import { shippingZoneService, type ShippingZone } from '../../services/shippingZone.service';
import { useUIStore } from '../../stores/ui';

const ui = useUIStore();

const zones = ref<ShippingZone[]>([]);
const loading = ref(true);
const showModal = ref(false);
const editingZone = ref<ShippingZone | null>(null);
const saving = ref(false);
const deleteConfirmId = ref<string | null>(null);

// Country tag input
const countryInput = ref('');

const form = ref({
  name: '',
  description: '',
  price: 0,
  estimatedDays: '',
  countries: [] as string[],
  mapsUrl: '',
  isActive: true,
});

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
  form.value = { name: '', description: '', price: 0, estimatedDays: '', countries: [], mapsUrl: '', isActive: true };
  countryInput.value = '';
  showModal.value = true;
}

function openEdit(zone: ShippingZone) {
  editingZone.value = zone;
  form.value = {
    name: zone.name,
    description: zone.description || '',
    price: zone.price,
    estimatedDays: zone.estimatedDays,
    countries: [...zone.countries],
    mapsUrl: zone.mapsUrl || '',
    isActive: zone.isActive,
  };
  countryInput.value = '';
  showModal.value = true;
}

function closeModal() {
  showModal.value = false;
  editingZone.value = null;
}

function addCountry() {
  const val = countryInput.value.trim();
  if (val && !form.value.countries.includes(val)) {
    form.value.countries.push(val);
  }
  countryInput.value = '';
}

function removeCountry(index: number) {
  form.value.countries.splice(index, 1);
}

function onCountryKeydown(e: KeyboardEvent) {
  if (e.key === 'Enter') {
    e.preventDefault();
    addCountry();
  }
}

async function handleSave() {
  if (!form.value.name.trim() || !form.value.estimatedDays.trim()) return;

  saving.value = true;
  try {
    const payload = {
      name: form.value.name.trim(),
      description: form.value.description.trim() || undefined,
      price: Number(form.value.price),
      estimatedDays: form.value.estimatedDays.trim(),
      countries: form.value.countries,
      mapsUrl: form.value.mapsUrl.trim() || undefined,
      isActive: form.value.isActive,
    };

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

    <!-- Loading -->
    <div v-if="loading" class="admin-card">
      <div v-for="n in 4" :key="n" class="sm__skeleton-row"></div>
    </div>

    <!-- Empty state -->
    <div v-else-if="zones.length === 0" class="sm__empty">
      <i class="fa-solid fa-truck"></i>
      <p>No hay zonas de envío configuradas</p>
      <button class="btn-primary" @click="openCreate">
        <i class="fa-solid fa-plus"></i> Crear primera zona
      </button>
    </div>

    <!-- Table -->
    <div v-else class="admin-card">
      <div class="sm__table-wrap">
        <table class="admin-table">
          <thead>
            <tr>
              <th style="padding-left: 1.5rem;">Nombre</th>
              <th>Países</th>
              <th>Precio</th>
              <th>Tiempo est.</th>
              <th>Mapa</th>
              <th>Estado</th>
              <th style="text-align: right; padding-right: 1.5rem;">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="zone in zones" :key="zone._id">
              <td style="padding-left: 1.5rem;">
                <div class="sm__zone-name">{{ zone.name }}</div>
                <div v-if="zone.description" class="sm__zone-desc">{{ zone.description }}</div>
              </td>
              <td>
                <div class="sm__tags">
                  <span v-for="country in zone.countries" :key="country" class="sm__tag">
                    {{ country }}
                  </span>
                  <span v-if="zone.countries.length === 0" class="sm__no-countries">—</span>
                </div>
              </td>
              <td>
                <span class="sm__price">{{ zone.price === 0 ? 'Gratis' : '$' + zone.price.toFixed(2) }}</span>
              </td>
              <td>
                <span class="sm__days">
                  <i class="fa-solid fa-clock"></i>
                  {{ zone.estimatedDays }}
                </span>
              </td>
              <td>
                <a
                  v-if="zone.mapsUrl"
                  :href="zone.mapsUrl"
                  target="_blank"
                  rel="noopener"
                  class="sm__maps-link"
                  title="Ver en Google Maps"
                >
                  <i class="fa-solid fa-map-location-dot"></i>
                </a>
                <span v-else class="sm__no-maps">—</span>
              </td>
              <td>
                <span :class="['status-badge', zone.isActive ? 'status-badge--success' : 'status-badge--error']">
                  {{ zone.isActive ? 'Activa' : 'Inactiva' }}
                </span>
              </td>
              <td style="text-align: right; padding-right: 1.5rem;">
                <div class="sm__actions">
                  <button class="sm__action-btn sm__action-btn--edit" title="Editar" @click="openEdit(zone)">
                    <i class="fa-solid fa-pencil"></i>
                  </button>
                  <button
                    :class="['sm__action-btn', zone.isActive ? 'sm__action-btn--deactivate' : 'sm__action-btn--activate']"
                    :title="zone.isActive ? 'Desactivar' : 'Activar'"
                    @click="toggleActive(zone)"
                  >
                    <i :class="['fa-solid', zone.isActive ? 'fa-eye-slash' : 'fa-eye']"></i>
                  </button>
                  <button class="sm__action-btn sm__action-btn--delete" title="Eliminar" @click="deleteConfirmId = zone._id">
                    <i class="fa-solid fa-trash"></i>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

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
    <Transition name="fade">
      <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
        <div class="modal-box modal-box--lg">
          <div class="modal-box__header">
            <h3 class="modal-box__title">{{ editingZone ? 'Editar Zona de Envío' : 'Nueva Zona de Envío' }}</h3>
            <button class="modal-box__close" @click="closeModal">
              <i class="fa-solid fa-xmark"></i>
            </button>
          </div>

          <form @submit.prevent="handleSave" class="modal-box__form">
            <!-- Nombre -->
            <div class="pf__field">
              <label class="pf__label">Nombre <span class="pf__required">*</span></label>
              <input
                v-model="form.name"
                type="text"
                class="pf__input"
                placeholder="Todo Ecuador"
                required
              />
            </div>

            <!-- Descripción -->
            <div class="pf__field">
              <label class="pf__label">Descripción</label>
              <textarea
                v-model="form.description"
                class="pf__input pf__textarea"
                placeholder="Envíos a todo el territorio ecuatoriano"
                rows="2"
              ></textarea>
            </div>

            <!-- Precio y días -->
            <div class="pf__row">
              <div class="pf__field">
                <label class="pf__label">Precio (USD) <span class="pf__required">*</span></label>
                <input
                  v-model.number="form.price"
                  type="number"
                  class="pf__input"
                  placeholder="5.00"
                  step="0.01"
                  min="0"
                  required
                />
                <span class="pf__hint-text">Ingresa 0 para envío gratis</span>
              </div>
              <div class="pf__field">
                <label class="pf__label">Días estimados <span class="pf__required">*</span></label>
                <input
                  v-model="form.estimatedDays"
                  type="text"
                  class="pf__input"
                  placeholder="3-5 días hábiles"
                  required
                />
              </div>
            </div>

            <!-- Países (tag input) -->
            <div class="pf__field">
              <label class="pf__label">Países cubiertos</label>
              <div class="pf__tag-input-wrap">
                <div class="pf__tags-display">
                  <span v-for="(country, i) in form.countries" :key="i" class="pf__tag">
                    {{ country }}
                    <button type="button" class="pf__tag-remove" @click="removeCountry(i)">
                      <i class="fa-solid fa-xmark"></i>
                    </button>
                  </span>
                  <input
                    v-model="countryInput"
                    type="text"
                    class="pf__tag-input"
                    placeholder="Escribe un país y presiona Enter"
                    @keydown="onCountryKeydown"
                    @blur="addCountry"
                  />
                </div>
              </div>
              <span class="pf__hint-text">Presiona Enter para agregar cada país</span>
            </div>

            <!-- Link Google Maps -->
            <div class="pf__field">
              <label class="pf__label">Link Google Maps <span class="pf__optional">(opcional)</span></label>
              <input
                v-model="form.mapsUrl"
                type="url"
                class="pf__input"
                placeholder="https://maps.google.com/..."
              />
            </div>

            <!-- Toggle activo -->
            <div class="pf__toggle-row">
              <div class="pf__toggle-info">
                <span class="pf__toggle-label">Zona Activa</span>
              </div>
              <button
                type="button"
                :class="['pf__toggle', { 'pf__toggle--on': form.isActive }]"
                @click="form.isActive = !form.isActive"
              >
                <span class="pf__toggle-thumb"></span>
              </button>
            </div>

            <div class="modal-box__actions">
              <button type="button" class="btn-outline" @click="closeModal">Cancelar</button>
              <button type="submit" class="btn-primary" :disabled="saving">
                <i v-if="saving" class="fa-solid fa-spinner fa-spin"></i>
                <i v-else class="fa-solid fa-floppy-disk"></i>
                {{ saving ? 'Guardando...' : (editingZone ? 'Guardar Cambios' : 'Crear Zona') }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Transition>

    <!-- Delete Confirm Modal -->
    <Transition name="fade">
      <div v-if="deleteConfirmId" class="modal-overlay" @click.self="deleteConfirmId = null">
        <div class="modal-box modal-box--sm">
          <div class="modal-box__icon">
            <i class="fa-solid fa-triangle-exclamation"></i>
          </div>
          <h3 class="modal-box__title" style="text-align: center;">¿Eliminar zona de envío?</h3>
          <p class="modal-box__text">Esta acción no se puede deshacer.</p>
          <div class="modal-box__actions">
            <button class="btn-outline" @click="deleteConfirmId = null">Cancelar</button>
            <button class="btn-danger" @click="deleteZone(deleteConfirmId!)">Sí, eliminar</button>
          </div>
        </div>
      </div>
    </Transition>
  </AdminLayout>
</template>

<style lang="scss" scoped>
@use "sass:color";
@use '../../styles/colorVariables.module.scss' as *;

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

  &__skeleton-row {
    height: 64px;
    border-bottom: 1px solid $admin-border;
    background: linear-gradient(90deg, $admin-border 25%, color.adjust(#2A2A2A, $lightness: 5%) 50%, $admin-border 75%);
    background-size: 200% 100%;
    animation: shimmer 1.5s infinite;

    &:last-child { border-bottom: none; }
  }

  &__empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    padding: 4rem 2rem;
    color: $admin-text-muted;
    background-color: $admin-card;
    border: 1px solid $admin-border;
    border-radius: 12px;

    i { font-size: 3rem; opacity: 0.4; }
    p { font-size: 1rem; margin: 0; }
  }

  &__table-wrap {
    overflow-x: auto;
  }

  &__zone-name {
    font-size: 0.9375rem;
    font-weight: 600;
    color: $admin-text;
  }

  &__zone-desc {
    font-size: 0.8125rem;
    color: $admin-text-muted;
    max-width: 220px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    margin-top: 2px;
  }

  &__tags {
    display: flex;
    flex-wrap: wrap;
    gap: 0.25rem;
    max-width: 180px;
  }

  &__tag {
    display: inline-flex;
    padding: 0.125rem 0.5rem;
    background-color: $admin-sidebar-active;
    border: 1px solid $admin-border;
    border-radius: 4px;
    font-size: 0.75rem;
    color: $admin-text-muted;
    white-space: nowrap;
  }

  &__no-countries,
  &__no-maps {
    color: $admin-text-muted;
    opacity: 0.5;
  }

  &__price {
    font-size: 0.9375rem;
    font-weight: 700;
    color: $admin-text;
  }

  &__days {
    font-size: 0.8125rem;
    color: $admin-text-muted;
    display: flex;
    align-items: center;
    gap: 0.375rem;

    i { font-size: 0.75rem; color: $admin-accent; }
  }

  &__maps-link {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    border-radius: 6px;
    background-color: $admin-sidebar-active;
    border: 1px solid $admin-border;
    color: $admin-text-muted;
    text-decoration: none;
    transition: all 0.15s ease;

    &:hover {
      border-color: $admin-accent;
      color: $admin-accent;
    }

    i { font-size: 0.8125rem; }
  }

  &__actions {
    display: flex;
    align-items: center;
    gap: 0.375rem;
    justify-content: flex-end;
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

    &--edit:hover { border-color: $admin-accent; color: $admin-accent; }
    &--activate:hover, &--deactivate:hover { border-color: $admin-info; color: $admin-info; }
    &--delete:hover { border-color: $admin-error; color: $admin-error; background-color: rgba($admin-error, 0.1); }
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

.admin-card {
  background-color: $admin-card;
  border: 1px solid $admin-border;
  border-radius: 12px;
  overflow: hidden;
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

  &:hover:not(:disabled) { background-color: color.adjust(#C8956C, $lightness: -8%); }
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

  &:hover { background-color: color.adjust(#EF4444, $lightness: -8%); }
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
  padding: 1.5rem;
  max-width: 480px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;

  &--lg { max-width: 560px; }

  &--sm {
    max-width: 380px;
    text-align: center;
  }

  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 1.25rem;
  }

  &__title {
    font-size: 1.125rem;
    font-weight: 700;
    color: $admin-text;
    margin: 0 0 0.375rem;
  }

  &__close {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    border-radius: 6px;
    border: 1px solid $admin-border;
    background-color: $admin-sidebar-hover;
    color: $admin-text-muted;
    cursor: pointer;
    transition: all 0.15s ease;

    &:hover { color: $admin-text; }
  }

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

  &__text {
    color: $admin-text-muted;
    font-size: 0.9375rem;
    margin: 0 0 1.5rem;
  }

  &__form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  &__actions {
    display: flex;
    gap: 0.75rem;
    justify-content: flex-end;
    margin-top: 0.5rem;
  }
}

// Form elements
.pf {
  &__row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;

    @media (max-width: 480px) { grid-template-columns: 1fr; }
  }

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

  &__required {
    color: $admin-error;
  }

  &__optional {
    color: $admin-text-muted;
    font-weight: 400;
    text-transform: none;
    letter-spacing: 0;
    font-size: 0.75rem;
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
    box-sizing: border-box;

    &::placeholder { color: #555; }

    &:focus {
      outline: none;
      border-color: $admin-accent;
      box-shadow: 0 0 0 3px rgba($admin-accent, 0.12);
    }
  }

  &__textarea {
    resize: vertical;
    min-height: 60px;
  }

  &__hint-text {
    font-size: 0.75rem;
    color: $admin-text-muted;
  }

  &__tag-input-wrap {
    border: 1px solid $admin-border;
    border-radius: 8px;
    background-color: $admin-sidebar-active;
    padding: 0.375rem 0.5rem;
    cursor: text;
    transition: border-color 0.15s ease, box-shadow 0.15s ease;

    &:focus-within {
      border-color: $admin-accent;
      box-shadow: 0 0 0 3px rgba($admin-accent, 0.12);
    }
  }

  &__tags-display {
    display: flex;
    flex-wrap: wrap;
    gap: 0.375rem;
    align-items: center;
  }

  &__tag {
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
    padding: 0.2rem 0.5rem 0.2rem 0.625rem;
    background-color: rgba($admin-accent, 0.15);
    border: 1px solid rgba($admin-accent, 0.3);
    border-radius: 20px;
    font-size: 0.8125rem;
    color: $admin-text;
    white-space: nowrap;
  }

  &__tag-remove {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 14px;
    height: 14px;
    border-radius: 50%;
    background: none;
    border: none;
    cursor: pointer;
    color: $admin-text-muted;
    padding: 0;
    transition: color 0.15s ease;

    &:hover { color: $admin-error; }

    i { font-size: 0.5625rem; }
  }

  &__tag-input {
    flex: 1;
    min-width: 140px;
    border: none;
    background: transparent;
    color: $admin-text;
    font-size: 0.875rem;
    font-family: 'Inter', sans-serif;
    padding: 0.25rem 0.25rem;
    outline: none;

    &::placeholder { color: #555; }
  }

  &__toggle-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    padding: 0.75rem 0;
    border-top: 1px solid $admin-border;
  }

  &__toggle-info {
    display: flex;
    flex-direction: column;
  }

  &__toggle-label {
    font-size: 0.9375rem;
    font-weight: 500;
    color: $admin-text;
  }

  &__toggle {
    width: 44px;
    height: 24px;
    border-radius: 12px;
    background-color: $admin-border;
    border: none;
    cursor: pointer;
    position: relative;
    flex-shrink: 0;
    transition: background-color 0.2s ease;

    &--on { background-color: $admin-accent; }
  }

  &__toggle-thumb {
    position: absolute;
    top: 3px;
    left: 3px;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background-color: #fff;
    transition: transform 0.2s ease;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);

    .pf__toggle--on & { transform: translateX(20px); }
  }
}

.fade-enter-active, .fade-leave-active { transition: opacity 0.2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}
</style>
