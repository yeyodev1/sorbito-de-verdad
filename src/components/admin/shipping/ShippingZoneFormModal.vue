<script setup lang="ts">
import { toRef } from 'vue';
import type { ShippingZone } from '../../../services/shippingZone.service';
import { useShippingZoneForm, type ShippingZonePayload } from '../../../composables/admin/useShippingZoneForm';

const props = defineProps<{ show: boolean; zone: ShippingZone | null; saving: boolean }>();
const emit = defineEmits<{ (e: 'close'): void; (e: 'save', payload: ShippingZonePayload): void }>();

const { form, countryInput, addCountry, removeCountry, onCountryKeydown, buildPayload } =
  useShippingZoneForm(toRef(props, 'show'), toRef(props, 'zone'));

function handleSave() {
  const payload = buildPayload();
  if (payload) emit('save', payload);
}
</script>

<template>
  <!-- Create/Edit Modal -->
  <Transition name="fade">
    <div v-if="show" class="modal-overlay" @click.self="emit('close')">
      <div class="modal-box modal-box--lg">
        <div class="modal-box__header">
          <h3 class="modal-box__title">{{ zone ? 'Editar Zona de Envío' : 'Nueva Zona de Envío' }}</h3>
          <button class="modal-box__close" @click="emit('close')">
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
            <button type="button" class="btn-outline" @click="emit('close')">Cancelar</button>
            <button type="submit" class="btn-primary" :disabled="saving">
              <i v-if="saving" class="fa-solid fa-spinner fa-spin"></i>
              <i v-else class="fa-solid fa-floppy-disk"></i>
              {{ saving ? 'Guardando...' : (zone ? 'Guardar Cambios' : 'Crear Zona') }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </Transition>
</template>

<style lang="scss" scoped src="./shippingButtons.scss"></style>

<style lang="scss" scoped src="./shippingModal.scss"></style>

<style lang="scss" scoped src="./shippingForm.scss"></style>
