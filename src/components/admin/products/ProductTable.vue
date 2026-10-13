<script setup lang="ts">
import { useRouter } from 'vue-router';
import { COLLECTION_COLORS, type AdminProductRow } from '../../../composables/admin/products/useProductList';

defineProps<{
  products: AdminProductRow[];
  totalPages: number;
}>();
const page = defineModel<number>('page', { required: true });
const emit = defineEmits<{
  toggle: [product: AdminProductRow];
  delete: [id: string];
}>();

const router = useRouter();

function getProductImage(product: AdminProductRow) {
  return product.mainImage || product.images?.[0] || null;
}
</script>

<template>
  <div class="pm__table-wrap">
    <table class="admin-table">
      <thead>
        <tr>
          <th style="padding-left: 1.5rem;">Producto</th>
          <th>Colección</th>
          <th>Precio</th>
          <th>Stock</th>
          <th>Estado</th>
          <th style="text-align: right; padding-right: 1.5rem;">Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="product in products" :key="product._id">
          <td style="padding-left: 1.5rem;">
            <div class="pm__product-cell">
              <div class="pm__product-thumb">
                <img v-if="getProductImage(product)" :src="getProductImage(product)!" :alt="product.name" />
                <i v-else class="fa-solid fa-image pm__product-thumb-placeholder"></i>
              </div>
              <div class="pm__product-info">
                <span class="pm__product-name">{{ product.name }}</span>
                <span v-if="product.sku" class="pm__product-sku">SKU: {{ product.sku }}</span>
              </div>
            </div>
          </td>
          <td>
            <span v-if="product.productCollection" :class="['collection-badge', `collection-badge--${COLLECTION_COLORS[product.productCollection] || 'default'}`]">
              {{ product.productCollection }}
            </span>
            <span v-else class="text-muted">—</span>
          </td>
          <td class="pm__price">${{ product.price?.toFixed(2) }}</td>
          <td>
            <span :class="['stock-badge', (product.stock ?? 0) > 0 ? 'stock-badge--ok' : 'stock-badge--empty']">
              {{ product.stock ?? 0 }}
            </span>
          </td>
          <td>
            <span :class="['status-badge', product.isActive ? 'status-badge--success' : 'status-badge--error']">
              {{ product.isActive ? 'Activo' : 'Inactivo' }}
            </span>
          </td>
          <td style="text-align: right; padding-right: 1.5rem;">
            <div class="pm__actions">
              <button class="pm__action-btn pm__action-btn--edit" title="Editar" @click="router.push(`/admin/productos/${product._id}`)">
                <i class="fa-solid fa-pencil"></i>
              </button>
              <button :class="['pm__action-btn', product.isActive ? 'pm__action-btn--deactivate' : 'pm__action-btn--activate']"
                :title="product.isActive ? 'Desactivar' : 'Activar'"
                @click="emit('toggle', product)">
                <i :class="['fa-solid', product.isActive ? 'fa-eye-slash' : 'fa-eye']"></i>
              </button>
              <button class="pm__action-btn pm__action-btn--delete" title="Eliminar" @click="emit('delete', product._id)">
                <i class="fa-solid fa-trash"></i>
              </button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>

  <!-- Pagination -->
  <div v-if="totalPages > 1" class="pm__pagination">
    <button class="pm__page-btn" :disabled="page <= 1" @click="page--">
      <i class="fa-solid fa-chevron-left"></i>
    </button>
    <span class="pm__page-info">{{ page }} / {{ totalPages }}</span>
    <button class="pm__page-btn" :disabled="page >= totalPages" @click="page++">
      <i class="fa-solid fa-chevron-right"></i>
    </button>
  </div>
</template>

<style lang="scss" scoped src="./ProductTable.scss"></style>
