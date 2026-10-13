<script setup lang="ts">
import { useCheckoutContext } from '../../composables/checkout/useCheckout';

const { form, err, isGuest } = useCheckoutContext();
</script>

<template>
  <section class="co__section">
    <h2 class="co__section-title"><span class="co__step">1</span> Contacto</h2>
    <div class="co__grid">
      <div class="field">
        <label class="field__label" for="co-email">Correo electrónico</label>
        <input id="co-email" v-model="form.email" type="email" class="field__input" placeholder="tu@email.com"
          autocomplete="email" inputmode="email" :aria-invalid="!!err('email')" />
        <p v-if="err('email')" class="co__msg">{{ err('email') }}</p>
        <p v-else-if="isGuest" class="co__hint">Te enviamos la confirmación y el seguimiento aquí.</p>
      </div>
      <div class="field">
        <label class="field__label" for="co-phone">Teléfono / WhatsApp</label>
        <input id="co-phone" v-model="form.phone" type="tel" class="field__input" placeholder="099 000 0000"
          autocomplete="tel" inputmode="tel" :aria-invalid="!!err('phone')" />
        <p v-if="err('phone')" class="co__msg">{{ err('phone') }}</p>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
@use './fields';
</style>
