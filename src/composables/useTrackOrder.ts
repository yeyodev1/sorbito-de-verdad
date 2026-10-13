import { ref } from 'vue';
import httpBase from '../services/httpBase';
import type { SearchMode, TrackResult } from '../components/track/track';

export function useTrackOrder() {
  const searchQuery = ref('');
  const loading = ref(false);
  const result = ref<TrackResult | null>(null);
  const results = ref<TrackResult[]>([]);  // for email search (multiple orders)
  const selectedResult = ref<TrackResult | null>(null);
  const error = ref('');
  const searchMode = ref<SearchMode>('number');

  function activeResult() {
    return selectedResult.value ?? result.value;
  }

  function switchMode(mode: SearchMode) {
    searchMode.value = mode;
    searchQuery.value = '';
    result.value = null;
    results.value = [];
    selectedResult.value = null;
    error.value = '';
  }

  async function search() {
    const q = searchQuery.value.trim();
    if (!q) return;
    loading.value = true;
    error.value = '';
    result.value = null;
    results.value = [];
    selectedResult.value = null;

    try {
      if (searchMode.value === 'email') {
        const { data } = await httpBase.get(`/orders/track/by-email/${encodeURIComponent(q.toLowerCase())}`);
        results.value = data.data;
        if (results.value.length === 1) selectedResult.value = results.value[0]!;
      } else {
        const { data } = await httpBase.get(`/orders/track/${q.toUpperCase()}`);
        result.value = data.data;
      }
    } catch {
      error.value = searchMode.value === 'email'
        ? 'No se encontraron pedidos confirmados para ese correo.'
        : 'Pedido no encontrado. Verifica el número o aún no fue confirmado.';
    } finally {
      loading.value = false;
    }
  }

  return { searchQuery, loading, results, selectedResult, error, searchMode, activeResult, switchMode, search };
}
