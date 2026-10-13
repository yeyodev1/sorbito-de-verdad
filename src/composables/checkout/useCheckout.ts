import { ref, computed, watch, onMounted, nextTick, provide, inject, type InjectionKey } from 'vue';
import { useCartStore } from '../../stores/cart';
import { useAuthStore } from '../../stores/auth';
import { orderService } from '../../services/order.service';
import { shippingZoneService, type ShippingZone } from '../../services/shippingZone.service';
import { COUNTRY_ZONE_MAP, type CheckoutForm, type CheckoutField } from './constants';

const DRAFT_KEY = 'sorbito-checkout';

/** Estado y lógica del checkout: formulario, borrador, zonas, validación y pago. */
export function useCheckout() {
  const cartStore = useCartStore();
  const authStore = useAuthStore();
  const loading = ref(false);
  const redirecting = ref(false);
  const errorMessage = ref('');
  const zones = ref<ShippingZone[]>([]);
  const zonesLoading = ref(true);
  const selectedZoneId = ref<string>('');
  const submitted = ref(false);
  const summaryOpen = ref(false);
  const showMaps = ref(false);

  function loadDraft(): Partial<CheckoutForm> {
    try {
      const raw = localStorage.getItem(DRAFT_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  }

  const draft = loadDraft();

  const form = ref<CheckoutForm>({
    name: draft.name || authStore.user?.name || '',
    email: draft.email || authStore.user?.email || '',
    phone: draft.phone || '',
    identificationNumber: draft.identificationNumber || '',
    street: draft.street || '',
    city: draft.city || '',
    state: draft.state || '',
    zip: draft.zip || '',
    country: draft.country || 'Ecuador',
    mapsUrl: draft.mapsUrl || '',
  });

  if (form.value.mapsUrl) showMaps.value = true;

  // Autocompleta con la cuenta si la sesión carga después de montar la página
  watch(() => authStore.user, (user) => {
    if (!user) return;
    if (!form.value.name) form.value.name = user.name;
    if (!form.value.email) form.value.email = user.email;
  });

  // Guarda los datos para que la próxima compra sea más rápida
  watch(form, (val) => {
    try { localStorage.setItem(DRAFT_KEY, JSON.stringify(val)); } catch {}
  }, { deep: true });

  const isInternational = computed(() => form.value.country !== 'Ecuador');

  const items = computed(() => cartStore.items);
  const totalItems = computed(() => cartStore.totalItems);
  const subtotal = computed(() => cartStore.subtotal);
  const selectedZone = computed(() => zones.value.find((z) => z._id === selectedZoneId.value) ?? null);
  const shipping = computed(() => selectedZone.value?.price ?? 0);
  const total = computed(() => subtotal.value + shipping.value);

  const isGuest = computed(() => !authStore.user);

  const errors = computed(() => {
    const f = form.value;
    const e: Partial<Record<CheckoutField, string>> = {};
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email.trim())) e.email = 'Ingresa un correo válido';
    if (f.phone.replace(/\D/g, '').length < 7) e.phone = 'Ingresa un teléfono válido';
    if (!f.name.trim()) e.name = 'Ingresa tu nombre';
    if (!f.identificationNumber.trim()) e.identificationNumber = 'La necesitamos para el envío';
    if (!f.street.trim()) e.street = 'Ingresa tu dirección';
    if (!f.city.trim()) e.city = 'Ingresa tu ciudad';
    if (isInternational.value && !f.zip.trim()) e.zip = 'Requerido para envíos internacionales';
    if (!selectedZoneId.value) e.zone = 'Elige una zona de envío';
    return e;
  });

  const isFormValid = computed(() => Object.keys(errors.value).length === 0 && items.value.length > 0);

  function err(field: CheckoutField) {
    return submitted.value ? errors.value[field] : undefined;
  }

  function autoSelectZoneByCountry(country: string) {
    const zoneName = COUNTRY_ZONE_MAP[country];
    if (zoneName) {
      const match = zones.value.find(z => z.name === zoneName);
      if (match) selectedZoneId.value = match._id;
    }
  }

  watch(() => form.value.country, (country) => {
    autoSelectZoneByCountry(country);
  });

  onMounted(async () => {
    // Si el cliente vuelve de un pago rechazado, recupera su carrito
    if (cartStore.isEmpty) cartStore.restorePending();
    try {
      zones.value = await shippingZoneService.getZones();
      autoSelectZoneByCountry(form.value.country);
      if (!selectedZoneId.value && zones.value.length > 0) {
        selectedZoneId.value = zones.value[0]!._id;
      }
    } catch (e) {
      console.error('Error loading shipping zones', e);
    } finally {
      zonesLoading.value = false;
    }
  });

  async function focusFirstError() {
    await nextTick();
    const el = document.querySelector<HTMLElement>('.co [aria-invalid="true"]');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      el.focus({ preventScroll: true });
    }
  }

  async function handleSubmit() {
    if (loading.value || items.value.length === 0) return;
    submitted.value = true;
    if (!isFormValid.value) {
      focusFirstError();
      return;
    }
    loading.value = true;
    errorMessage.value = '';
    try {
      const shippingAddress = {
        name: form.value.name.trim(),
        phone: form.value.phone.trim(),
        street: form.value.street.trim(),
        city: form.value.city.trim(),
        state: form.value.state.trim(),
        country: form.value.country,
        zip: form.value.zip.trim(),
        ...(form.value.mapsUrl.trim() && { mapsUrl: form.value.mapsUrl.trim() }),
      };
      const response = await orderService.initiatePayphonePayment(
        items.value,
        shippingAddress,
        form.value.email.trim(),
        undefined,
        selectedZoneId.value || undefined,
        form.value.identificationNumber.trim() || undefined,
      );
      redirecting.value = true;
      cartStore.stashForPayment();
      // Redirige a la página de pago de PayPhone
      window.location.href = response.data.payWithPayPhone;
    } catch (e: unknown) {
      type AxiosErr = { response?: { data?: { message?: string } }; message?: string };
      const ax = e as AxiosErr;
      errorMessage.value = ax.response?.data?.message || 'Error al procesar el pedido. Intenta de nuevo.';
      await nextTick();
      document.querySelector('.co__error')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } finally {
      loading.value = false;
    }
  }

  return {
    form, loading, redirecting, errorMessage, zones, zonesLoading, selectedZoneId,
    summaryOpen, showMaps, isInternational, items, totalItems, subtotal,
    selectedZone, shipping, total, isGuest, err, handleSubmit,
  };
}

export type CheckoutContext = ReturnType<typeof useCheckout>;

const CHECKOUT_KEY: InjectionKey<CheckoutContext> = Symbol('checkout');

export function provideCheckout() {
  const ctx = useCheckout();
  provide(CHECKOUT_KEY, ctx);
  return ctx;
}

export function useCheckoutContext(): CheckoutContext {
  const ctx = inject(CHECKOUT_KEY);
  if (!ctx) throw new Error('useCheckoutContext debe usarse dentro de CheckoutView');
  return ctx;
}
