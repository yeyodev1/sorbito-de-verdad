<script setup lang="ts">
import { useCheckoutContext } from '../../composables/checkout/useCheckout';
import { countryOptions } from '../../composables/checkout/constants';
import ZonePicker from './ZonePicker.vue';

const { form, err, isInternational, showMaps } = useCheckoutContext();
</script>

<template>
  <section class="co__section">
    <h2 class="co__section-title"><span class="co__step">2</span> Envío</h2>
    <div class="co__grid">
      <div class="field co__full">
        <label class="field__label" for="co-country">País</label>
        <select id="co-country" v-model="form.country" class="field__input co__select" autocomplete="country-name">
          <option v-for="c in countryOptions" :key="c.value" :value="c.value">{{ c.flag }} {{ c.label }}</option>
        </select>
      </div>
      <div class="field">
        <label class="field__label" for="co-name">Nombre y apellido</label>
        <input id="co-name" v-model="form.name" type="text" class="field__input" placeholder="Juan Pérez"
          autocomplete="name" :aria-invalid="!!err('name')" />
        <p v-if="err('name')" class="co__msg">{{ err('name') }}</p>
      </div>
      <div class="field">
        <label class="field__label" for="co-id">Cédula / Identificación</label>
        <input id="co-id" v-model="form.identificationNumber" type="text" class="field__input" placeholder="0912345678"
          inputmode="numeric" autocomplete="off" :aria-invalid="!!err('identificationNumber')" />
        <p v-if="err('identificationNumber')" class="co__msg">{{ err('identificationNumber') }}</p>
      </div>
      <div class="field co__full">
        <label class="field__label" for="co-street">Dirección</label>
        <input id="co-street" v-model="form.street" type="text" class="field__input" placeholder="Calle, número, urbanización, referencia"
          autocomplete="street-address" :aria-invalid="!!err('street')" />
        <p v-if="err('street')" class="co__msg">{{ err('street') }}</p>
      </div>
      <div class="field">
        <label class="field__label" for="co-city">Ciudad</label>
        <input id="co-city" v-model="form.city" type="text" class="field__input" placeholder="Guayaquil"
          autocomplete="address-level2" :aria-invalid="!!err('city')" />
        <p v-if="err('city')" class="co__msg">{{ err('city') }}</p>
      </div>
      <div class="field">
        <label class="field__label" for="co-state">
          {{ isInternational ? 'Estado / Provincia' : 'Provincia' }} <span class="co__opt">opcional</span>
        </label>
        <input id="co-state" v-model="form.state" type="text" class="field__input"
          :placeholder="isInternational ? 'California' : 'Guayas'" autocomplete="address-level1" />
      </div>
      <div v-if="isInternational" class="field">
        <label class="field__label" for="co-zip">Código postal</label>
        <input id="co-zip" v-model="form.zip" type="text" class="field__input" placeholder="90210"
          autocomplete="postal-code" :aria-invalid="!!err('zip')" />
        <p v-if="err('zip')" class="co__msg">{{ err('zip') }}</p>
      </div>
    </div>

    <button v-if="!showMaps" type="button" class="co__link-btn" @click="showMaps = true">
      <i class="fa-solid fa-location-dot"></i> Agregar ubicación de Google Maps (opcional)
    </button>
    <div v-else class="field co__maps">
      <label class="field__label" for="co-maps">Enlace de Google Maps <span class="co__opt">opcional</span></label>
      <input id="co-maps" v-model="form.mapsUrl" type="url" class="field__input" placeholder="https://maps.app.goo.gl/..." autocomplete="off" />
      <p class="co__hint">En Google Maps: Compartir → Copiar enlace. Nos ayuda a llegar sin problemas.</p>
    </div>

    <p class="co__notice">
      <i class="fa-solid fa-circle-info"></i>
      Revisa tu dirección: una vez confirmado el pedido no se puede modificar.
    </p>

    <ZonePicker />
  </section>
</template>

<style lang="scss" scoped>
@use './fields';
</style>
