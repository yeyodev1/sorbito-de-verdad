<script setup lang="ts">
import { formatPriceInput, type ProductFormState } from '../../../composables/admin/products/productFormUtils';
import ProductSizesField from './ProductSizesField.vue';
import ProductStockSection from './ProductStockSection.vue';

const form = defineModel<ProductFormState>('form', { required: true });

function onPriceBlur(field: 'price' | 'compareAtPrice') {
  form.value[field] = formatPriceInput(form.value[field]);
}
</script>

<template>
  <div class="pf__card">
    <h3 class="pf__card-title">Precio & Stock</h3>

    <!-- Prices -->
    <div class="pf__price-grid">
      <!-- Main price -->
      <div class="pf__field">
        <label class="pf__label">
          Precio de Venta <span class="pf__required">*</span>
          <span class="pf__currency-badge">USD</span>
        </label>
        <div class="pf__money-wrap">
          <span class="pf__money-symbol">$</span>
          <input
            v-model="form.price"
            type="text"
            inputmode="decimal"
            class="pf__input pf__money-input"
            placeholder="0.00"
            @blur="onPriceBlur('price')"
          />
        </div>
        <span class="pf__field-hint">Precio final que paga el cliente</span>
      </div>

      <!-- Compare price -->
      <div class="pf__field">
        <label class="pf__label">
          Precio Original
          <span class="pf__hint-badge">Opcional — se muestra tachado</span>
        </label>
        <div class="pf__money-wrap">
          <span class="pf__money-symbol pf__money-symbol--compare">$</span>
          <input
            v-model="form.compareAtPrice"
            type="text"
            inputmode="decimal"
            class="pf__input pf__money-input pf__money-input--compare"
            placeholder="0.00"
            @blur="onPriceBlur('compareAtPrice')"
          />
        </div>
        <span class="pf__field-hint">Para mostrar descuento (ej: 25.00 → tachado)</span>
      </div>
    </div>

    <!-- Price preview -->
    <div v-if="form.price" class="pf__price-preview">
      <span class="pf__price-preview-label">Vista previa:</span>
      <span v-if="form.compareAtPrice && Number(form.compareAtPrice) > 0" class="pf__price-preview-compare">
        ${{ Number(form.compareAtPrice).toFixed(2) }}
      </span>
      <span class="pf__price-preview-main">${{ Number(form.price).toFixed(2) }}</span>
      <span v-if="form.compareAtPrice && Number(form.compareAtPrice) > Number(form.price)" class="pf__price-preview-discount">
        {{ Math.round((1 - Number(form.price) / Number(form.compareAtPrice)) * 100) }}% OFF
      </span>
    </div>

    <div class="pf__divider"></div>

    <ProductSizesField v-model:sizes="form.sizes" />

    <div class="pf__divider"></div>

    <ProductStockSection v-model:form="form" />
  </div>
</template>

<style lang="scss" scoped src="./ProductFormBase.scss"></style>
<style lang="scss" scoped src="./ProductMoney.scss"></style>
<style lang="scss" scoped src="./ProductPricing.scss"></style>
