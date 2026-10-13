<script setup lang="ts">
import { sanitizeInt, type ProductFormState } from '../../../composables/admin/products/productFormUtils';

const form = defineModel<ProductFormState>('form', { required: true });

function onStockBlur() {
  form.value.stock = sanitizeInt(String(form.value.stock)) || 0;
}
</script>

<template>
  <div class="pf__stock-section">
    <div class="pf__field pf__field--stock">
      <label class="pf__label">Unidades en Stock</label>
      <div class="pf__stock-wrap">
        <button type="button" class="pf__stock-btn" @click="form.stock = Math.max(0, Number(form.stock) - 1)">
          <i class="fa-solid fa-minus"></i>
        </button>
        <input
          v-model="form.stock"
          type="text"
          inputmode="numeric"
          class="pf__input pf__stock-input"
          placeholder="0"
          @blur="onStockBlur"
        />
        <button type="button" class="pf__stock-btn" @click="form.stock = Number(form.stock) + 1">
          <i class="fa-solid fa-plus"></i>
        </button>
      </div>
      <span class="pf__field-hint">
        <i class="fa-solid fa-circle-info"></i>
        {{ Number(form.stock) === 0 ? 'Sin stock disponible' : `${form.stock} unidades disponibles` }}
      </span>
    </div>

    <!-- Sell without stock toggle -->
    <div class="pf__backorder-card" :class="{ 'pf__backorder-card--active': form.allowBackorder }">
      <div class="pf__backorder-info">
        <div class="pf__backorder-title">
          <i :class="['fa-solid', form.allowBackorder ? 'fa-bolt' : 'fa-bolt-slash']"></i>
          Vender sin stock (Pre-venta)
        </div>
        <p class="pf__backorder-desc">
          {{ form.allowBackorder
            ? 'Activo — Los clientes pueden comprar aunque no haya stock disponible.'
            : 'Inactivo — El producto no se puede comprar cuando llega a 0 unidades.' }}
        </p>
      </div>
      <button
        type="button"
        :class="['pf__toggle', { 'pf__toggle--on': form.allowBackorder }]"
        @click="form.allowBackorder = !form.allowBackorder"
        :aria-checked="form.allowBackorder"
        role="switch"
      >
        <span class="pf__toggle-thumb"></span>
      </button>
    </div>
  </div>
</template>

<style lang="scss" scoped src="./ProductFormBase.scss"></style>
<style lang="scss" scoped src="./ProductFormToggle.scss"></style>
<style lang="scss" scoped src="./ProductStockSection.scss"></style>
