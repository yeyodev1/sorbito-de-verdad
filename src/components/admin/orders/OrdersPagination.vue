<script setup lang="ts">
import { useOrdersContext } from '../../../composables/admin/orders/context';

/** `bottom` muestra la variante inferior con textos "Anterior / Siguiente". */
defineProps<{ bottom?: boolean }>();

const { totalFiltered, currentPage, pageSize, goToPage } = useOrdersContext();
</script>

<template>
  <div :class="['om__pagination', { 'om__pagination--bottom': bottom }]">
    <span class="om__pagination-info">{{ totalFiltered }} orden(es) · Pág. {{ currentPage }}/{{ Math.max(1, Math.ceil(totalFiltered / pageSize)) }}</span>
    <div class="om__pagination-btns">
      <button :disabled="currentPage <= 1" @click="goToPage(currentPage - 1)" class="om__pagination-btn">
        <i class="fa-solid fa-chevron-left"></i><template v-if="bottom"> Anterior</template>
      </button>
      <button :disabled="currentPage >= Math.ceil(totalFiltered / pageSize)" @click="goToPage(currentPage + 1)" class="om__pagination-btn">
        <template v-if="bottom">Siguiente </template><i class="fa-solid fa-chevron-right"></i>
      </button>
    </div>
  </div>
</template>

<style lang="scss" scoped src="./OrdersPagination.scss"></style>
