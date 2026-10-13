import { ref, computed, watch, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useProductsStore } from '../stores/products';

export function useShopFilters() {
  const productsStore = useProductsStore();
  const route = useRoute();

  const searchQuery = ref('');
  const selectedCollection = ref('');
  const selectedSort = ref('');
  const debounceTimer = ref<ReturnType<typeof setTimeout> | null>(null);

  const products = computed(() => productsStore.products);
  const loading = computed(() => productsStore.loading);
  const pagination = computed(() => productsStore.pagination);

  const hasActiveFilters = computed(() => searchQuery.value || selectedCollection.value || selectedSort.value);

  async function applyFilters(page = 1) {
    productsStore.setFilters({
      collection: selectedCollection.value || undefined,
      search: searchQuery.value || undefined,
      sort: selectedSort.value || undefined,
    });
    await productsStore.fetchProducts(page);
  }

  function onSearchInput() {
    if (debounceTimer.value) clearTimeout(debounceTimer.value);
    debounceTimer.value = setTimeout(() => {
      applyFilters(1);
    }, 400);
  }

  function clearFilters() {
    searchQuery.value = '';
    selectedCollection.value = '';
    selectedSort.value = '';
    productsStore.clearFilters();
    productsStore.fetchProducts(1);
  }

  function goToPage(page: number) {
    applyFilters(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  watch(() => route.query.collection, (val) => {
    if (typeof val === 'string') {
      selectedCollection.value = val;
      applyFilters(1);
    }
  }, { immediate: false });

  onMounted(() => {
    const collectionParam = route.query.collection;
    if (collectionParam && typeof collectionParam === 'string') {
      selectedCollection.value = collectionParam;
    }
    applyFilters(1);
  });

  watch(selectedSort, () => applyFilters(1));
  watch(selectedCollection, () => applyFilters(1));

  return {
    searchQuery, selectedCollection, selectedSort,
    products, loading, pagination, hasActiveFilters,
    onSearchInput, clearFilters, goToPage,
  };
}
