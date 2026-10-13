<script setup lang="ts">
import { formatPriceInput, type SizeItem } from '../../../composables/admin/products/productFormUtils';

const sizes = defineModel<SizeItem[]>('sizes', { required: true });

function addSize() {
  sizes.value.push({ name: '', price: '' });
}

function removeSize(index: number) {
  sizes.value.splice(index, 1);
}

function onSizePriceBlur(index: number) {
  const size = sizes.value[index];
  if (size) size.price = formatPriceInput(size.price || '');
}
</script>

<template>
  <div class="pf__field">
    <label class="pf__label">
      Tamaños / Variantes de precio
      <span class="pf__hint-badge">Opcional — si hay tamaños, el cliente elige en la tienda</span>
    </label>
    <div class="pf__sizes-list">
      <div v-for="(size, i) in sizes" :key="i" class="pf__size-row">
        <input
          v-model="size.name"
          type="text"
          class="pf__input pf__input--sm"
          placeholder="Ej: Estándar o XXL"
        />
        <div class="pf__money-wrap pf__money-wrap--sm">
          <span class="pf__money-symbol">$</span>
          <input
            v-model="size.price"
            type="text"
            inputmode="decimal"
            class="pf__input pf__money-input pf__input--sm"
            placeholder="0.00"
            @blur="onSizePriceBlur(i)"
          />
        </div>
        <button type="button" class="pf__size-remove" @click="removeSize(i)" aria-label="Eliminar tamaño">
          <i class="fa-solid fa-xmark"></i>
        </button>
      </div>
    </div>
    <button type="button" class="pf__size-add" @click="addSize">
      <i class="fa-solid fa-plus"></i>
      Agregar tamaño
    </button>
    <span class="pf__field-hint">Ejemplo: Estándar $25 · XXL $49. Deja vacío si no hay variantes.</span>
  </div>
</template>

<style lang="scss" scoped src="./ProductFormBase.scss"></style>
<style lang="scss" scoped src="./ProductMoney.scss"></style>
<style lang="scss" scoped>
.pf {
  &__sizes-list {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    margin-bottom: 0.625rem;
  }

  &__size-row {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  &__input--sm {
    max-width: 180px !important;
    font-size: 0.875rem !important;
    padding: 0.4rem 0.75rem !important;
  }

  &__money-wrap--sm {
    max-width: 120px;
  }

  &__size-remove {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    border: 1px solid $admin-border;
    border-radius: 6px;
    background: none;
    color: $admin-text-muted;
    cursor: pointer;
    font-size: 0.75rem;
    flex-shrink: 0;
    transition: all 0.2s ease;

    &:hover { border-color: #e53e3e; color: #e53e3e; }
  }

  &__size-add {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    padding: 0.4rem 0.875rem;
    border: 1.5px dashed $admin-border;
    border-radius: 8px;
    font-size: 0.8125rem;
    font-weight: 600;
    color: $admin-text-muted;
    background: none;
    cursor: pointer;
    font-family: inherit;
    transition: all 0.2s ease;

    i { font-size: 0.7rem; }

    &:hover { border-color: $admin-accent; color: $admin-accent; }
  }
}
</style>
