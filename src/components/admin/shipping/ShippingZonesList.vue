<script setup lang="ts">
import type { ShippingZone } from '../../../services/shippingZone.service';

defineProps<{ zones: ShippingZone[]; loading: boolean }>();
const emit = defineEmits<{
  (e: 'create'): void;
  (e: 'edit', zone: ShippingZone): void;
  (e: 'toggle-active', zone: ShippingZone): void;
  (e: 'request-delete', id: string): void;
}>();
</script>

<template>
  <!-- Loading -->
  <div v-if="loading" class="admin-card">
    <div v-for="n in 4" :key="n" class="sm__skeleton-row"></div>
  </div>

  <!-- Empty state -->
  <div v-else-if="zones.length === 0" class="sm__empty">
    <i class="fa-solid fa-truck"></i>
    <p>No hay zonas de envío configuradas</p>
    <button class="btn-primary" @click="emit('create')">
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
                <button class="sm__action-btn sm__action-btn--edit" title="Editar" @click="emit('edit', zone)">
                  <i class="fa-solid fa-pencil"></i>
                </button>
                <button
                  :class="['sm__action-btn', zone.isActive ? 'sm__action-btn--deactivate' : 'sm__action-btn--activate']"
                  :title="zone.isActive ? 'Desactivar' : 'Activar'"
                  @click="emit('toggle-active', zone)"
                >
                  <i :class="['fa-solid', zone.isActive ? 'fa-eye-slash' : 'fa-eye']"></i>
                </button>
                <button class="sm__action-btn sm__action-btn--delete" title="Eliminar" @click="emit('request-delete', zone._id)">
                  <i class="fa-solid fa-trash"></i>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style lang="scss" scoped src="./shippingButtons.scss"></style>

<style lang="scss" scoped src="./ShippingZonesList.scss"></style>
