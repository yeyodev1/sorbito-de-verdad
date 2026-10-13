<script setup lang="ts">
import { ref, computed, watch, onMounted, nextTick } from 'vue';
import { RouterLink } from 'vue-router';
import MainLayout from '../layout/MainLayout.vue';
import { useCartStore } from '../stores/cart';
import { useAuthStore } from '../stores/auth';
import { useUIStore } from '../stores/ui';
import { orderService } from '../services/order.service';
import { shippingZoneService, type ShippingZone } from '../services/shippingZone.service';

const DRAFT_KEY = 'sorbito-checkout';

const cartStore = useCartStore();
const authStore = useAuthStore();
const uiStore = useUIStore();
const loading = ref(false);
const redirecting = ref(false);
const errorMessage = ref('');
const zones = ref<ShippingZone[]>([]);
const zonesLoading = ref(true);
const selectedZoneId = ref<string>('');
const submitted = ref(false);
const summaryOpen = ref(false);
const showMaps = ref(false);

const COUNTRY_ZONE_MAP: Record<string, string> = {
  'Ecuador': 'Ecuador Continental',
  'Estados Unidos': 'Estados Unidos y Canadá',
  'Canadá': 'Estados Unidos y Canadá',
  'España': 'Europa',
  'Francia': 'Europa',
  'Alemania': 'Europa',
  'Italia': 'Europa',
  'Portugal': 'Europa',
  'Países Bajos': 'Europa',
  'Bélgica': 'Europa',
  'Suiza': 'Europa',
  'Austria': 'Europa',
  'Suecia': 'Europa',
  'Noruega': 'Europa',
  'Dinamarca': 'Europa',
  'Finlandia': 'Europa',
  'Polonia': 'Europa',
  'Grecia': 'Europa',
};

const countryOptions = [
  { label: 'Ecuador', value: 'Ecuador', flag: '🇪🇨' },
  { label: 'Estados Unidos', value: 'Estados Unidos', flag: '🇺🇸' },
  { label: 'Canadá', value: 'Canadá', flag: '🇨🇦' },
  { label: 'España', value: 'España', flag: '🇪🇸' },
  { label: 'Francia', value: 'Francia', flag: '🇫🇷' },
  { label: 'Alemania', value: 'Alemania', flag: '🇩🇪' },
  { label: 'Italia', value: 'Italia', flag: '🇮🇹' },
  { label: 'Portugal', value: 'Portugal', flag: '🇵🇹' },
  { label: 'Países Bajos', value: 'Países Bajos', flag: '🇳🇱' },
  { label: 'Bélgica', value: 'Bélgica', flag: '🇧🇪' },
  { label: 'Suiza', value: 'Suiza', flag: '🇨🇭' },
  { label: 'Austria', value: 'Austria', flag: '🇦🇹' },
  { label: 'Suecia', value: 'Suecia', flag: '🇸🇪' },
  { label: 'Noruega', value: 'Noruega', flag: '🇳🇴' },
  { label: 'Dinamarca', value: 'Dinamarca', flag: '🇩🇰' },
  { label: 'Finlandia', value: 'Finlandia', flag: '🇫🇮' },
  { label: 'Polonia', value: 'Polonia', flag: '🇵🇱' },
  { label: 'Grecia', value: 'Grecia', flag: '🇬🇷' },
];

type CheckoutForm = {
  name: string;
  email: string;
  phone: string;
  identificationNumber: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  mapsUrl: string;
};

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
  const e: Partial<Record<keyof CheckoutForm | 'zone', string>> = {};
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

function err(field: keyof CheckoutForm | 'zone') {
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

function formatPrice(val: number) {
  return new Intl.NumberFormat('es-VE', { style: 'currency', currency: 'USD' }).format(val);
}
</script>

<template>
  <MainLayout>
    <div class="co">
      <!-- Redirigiendo a PayPhone -->
      <div v-if="redirecting" class="co__redirect">
        <i class="fa-solid fa-circle-notch fa-spin"></i>
        <h1>Abriendo el pago seguro…</h1>
        <p>Te estamos llevando a PayPhone para que ingreses tu tarjeta.</p>
      </div>

      <!-- Carrito vacío -->
      <div v-else-if="items.length === 0" class="container co__empty">
        <div class="co__empty-icon"><i class="fa-solid fa-mug-hot"></i></div>
        <h1>Tu carrito está vacío</h1>
        <p>Elige tu taza favorita y vuelve aquí para pagar en un minuto.</p>
        <RouterLink to="/tienda" class="btn-primary btn-lg">Ir a la tienda</RouterLink>
      </div>

      <div v-else class="container co__container">
        <!-- Resumen móvil (colapsable) -->
        <button type="button" class="co__mobile-summary" :aria-expanded="summaryOpen" @click="summaryOpen = !summaryOpen">
          <span>
            <i class="fa-solid fa-bag-shopping"></i>
            {{ summaryOpen ? 'Ocultar' : 'Ver' }} resumen ({{ totalItems }})
            <i :class="['fa-solid fa-chevron-down co__chev', { 'co__chev--open': summaryOpen }]"></i>
          </span>
          <strong>{{ formatPrice(total) }}</strong>
        </button>

        <div class="co__layout">
          <form class="co__form" @submit.prevent="handleSubmit" novalidate>
            <header class="co__header">
              <span class="eyebrow">Pago seguro</span>
              <h1 class="co__title">Finalizar compra</h1>
              <p class="co__subtitle">Solo tus datos de envío y listo. El pago con tarjeta se hace en PayPhone.</p>
            </header>

            <div v-if="errorMessage" class="co__error" role="alert">
              <i class="fa-solid fa-circle-exclamation"></i>
              {{ errorMessage }}
            </div>

            <!-- Contacto -->
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

            <!-- Envío -->
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

              <!-- Zona de envío -->
              <div class="co__zones" role="radiogroup" aria-label="Zona de envío">
                <p class="field__label">Método de envío</p>
                <div v-if="zonesLoading" class="co__zone co__zone--loading">
                  <i class="fa-solid fa-circle-notch fa-spin"></i> Calculando envío…
                </div>
                <label
                  v-for="zone in zones"
                  :key="zone._id"
                  :class="['co__zone', { 'co__zone--active': selectedZoneId === zone._id }]"
                >
                  <input type="radio" v-model="selectedZoneId" :value="zone._id" class="sr-only" />
                  <span class="co__radio" aria-hidden="true"></span>
                  <span class="co__zone-info">
                    <span class="co__zone-name">{{ zone.name }}</span>
                    <span class="co__zone-eta">{{ zone.estimatedDays }}</span>
                  </span>
                  <span :class="['co__zone-price', { 'co__zone-price--free': zone.price === 0 }]">
                    {{ zone.price === 0 ? 'Gratis' : formatPrice(zone.price) }}
                  </span>
                </label>
                <p v-if="err('zone')" class="co__msg">{{ err('zone') }}</p>
              </div>
            </section>

            <!-- Pago -->
            <section class="co__section co__section--pay">
              <h2 class="co__section-title"><span class="co__step">3</span> Pago</h2>
              <div class="co__pay-info">
                <i class="fa-solid fa-credit-card"></i>
                <div>
                  <strong>Tarjeta de crédito o débito</strong>
                  <p>Al tocar “Pagar” se abre PayPhone, la pasarela segura, para ingresar tu tarjeta.</p>
                </div>
              </div>
            </section>

            <div class="co__submit-bar">
              <button type="submit" class="btn-primary btn-lg btn-block co__submit" :disabled="loading">
                <template v-if="loading">
                  <i class="fa-solid fa-circle-notch fa-spin"></i> Procesando…
                </template>
                <template v-else>
                  <i class="fa-solid fa-lock"></i> Pagar {{ formatPrice(total) }}
                </template>
              </button>
              <p class="co__secure"><i class="fa-solid fa-shield-halved"></i> Pago cifrado y protegido por PayPhone</p>
            </div>
          </form>

          <!-- Resumen -->
          <aside :class="['co__summary', { 'co__summary--open': summaryOpen }]">
            <div class="co__summary-head">
              <h2 class="co__summary-title">Tu pedido</h2>
              <button type="button" class="co__edit" @click="uiStore.openCart()">Editar</button>
            </div>

            <ul class="co__items">
              <li v-for="item in items" :key="`${item.product._id}-${item.selectedSize?.name}`" class="co__item">
                <div class="co__item-media">
                  <img :src="item.product.mainImage" :alt="item.product.name" />
                  <span class="co__item-qty">{{ item.quantity }}</span>
                </div>
                <div class="co__item-info">
                  <span class="co__item-name">{{ item.product.name }}</span>
                  <span v-if="item.selectedSize" class="co__item-size">{{ item.selectedSize.name }}</span>
                </div>
                <span class="co__item-price">{{ formatPrice((item.selectedSize?.price ?? item.product.price) * item.quantity) }}</span>
              </li>
            </ul>

            <dl class="co__rows">
              <div class="co__row">
                <dt>Subtotal</dt>
                <dd>{{ formatPrice(subtotal) }}</dd>
              </div>
              <div class="co__row">
                <dt>Envío<span v-if="selectedZone" class="co__row-sub">{{ selectedZone.estimatedDays }}</span></dt>
                <dd :class="{ 'co__free': selectedZone && shipping === 0 }">
                  {{ !selectedZone ? '—' : shipping === 0 ? 'Gratis' : formatPrice(shipping) }}
                </dd>
              </div>
              <div class="co__row co__row--total">
                <dt>Total</dt>
                <dd>{{ formatPrice(total) }}</dd>
              </div>
            </dl>

            <ul class="co__trust">
              <li><i class="fa-solid fa-shield-halved"></i> Pago 100% seguro</li>
              <li><i class="fa-solid fa-hand-holding-heart"></i> Hecho a mano en Ecuador</li>
              <li><i class="fa-solid fa-truck-fast"></i> Seguimiento de tu pedido</li>
            </ul>
          </aside>
        </div>
      </div>
    </div>
  </MainLayout>
</template>

<style lang="scss" scoped>
.co {
  padding: 1rem 0 4rem;
  min-height: calc(100vh - 70px);

  @media (min-width: 960px) {
    padding: 2.5rem 0 6rem;
  }

  &__container {
    max-width: 1120px;
  }

  // ── Estados especiales ────────────────────────
  &__redirect,
  &__empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 0.875rem;
    min-height: 60vh;
    padding: 3rem 1rem;
    text-align: center;

    h1 { font-size: clamp(1.5rem, 4vw, 2rem); }
    p { max-width: 360px; }
  }

  &__redirect > i {
    font-size: 2rem;
    color: var(--color-accent);
  }

  &__empty-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 80px;
    height: 80px;
    font-size: 2rem;
    color: var(--color-accent);
    background-color: var(--color-accent-light);
    border-radius: 50%;
  }

  // ── Resumen móvil ─────────────────────────────
  &__mobile-summary {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    min-height: 52px;
    margin-bottom: 1rem;
    padding: 0.75rem 1rem;
    font-size: 0.875rem;
    font-weight: 600;
    color: var(--color-accent);
    background-color: var(--color-bg-card);
    border: 1px solid var(--color-border);
    border-radius: $radius-md;

    span { display: inline-flex; align-items: center; gap: 0.5rem; }
    strong { font-size: 1.0625rem; color: var(--color-primary); font-variant-numeric: tabular-nums; }

    @media (min-width: 960px) {
      display: none;
    }
  }

  &__chev {
    font-size: 0.6875rem;
    transition: transform 0.25s ease;

    &--open { transform: rotate(180deg); }
  }

  // ── Layout ────────────────────────────────────
  &__layout {
    display: flex;
    flex-direction: column;

    @media (min-width: 960px) {
      display: grid;
      grid-template-columns: minmax(0, 1fr) 380px;
      gap: 3rem;
      align-items: start;
    }
  }

  &__form {
    order: 2;
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
    min-width: 0;

    @media (min-width: 960px) {
      order: 1;
    }
  }

  &__header {
    display: flex;
    flex-direction: column;
    gap: 0.375rem;
    margin-bottom: 0.25rem;
  }

  &__title {
    font-size: clamp(1.75rem, 4vw, 2.5rem);
  }

  &__subtitle {
    font-size: 0.9375rem;
  }

  &__error {
    display: flex;
    align-items: flex-start;
    gap: 0.625rem;
    padding: 0.875rem 1rem;
    font-size: 0.875rem;
    font-weight: 500;
    color: var(--color-error);
    background-color: var(--color-error-light);
    border: 1px solid color-mix(in srgb, var(--color-error) 30%, transparent);
    border-radius: $radius-md;

    i { margin-top: 0.15rem; }
  }

  // ── Secciones ─────────────────────────────────
  &__section {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding: 1.25rem 1rem;
    background-color: var(--color-bg-card);
    border: 1px solid var(--color-border);
    border-radius: $radius-lg;

    @media (min-width: 640px) {
      padding: 1.5rem;
    }
  }

  &__section-title {
    display: flex;
    align-items: center;
    gap: 0.625rem;
    font-size: 1.25rem;
  }

  &__step {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 26px;
    height: 26px;
    font-family: var(--font-body);
    font-size: 0.8125rem;
    font-weight: 700;
    color: var(--color-on-accent);
    background-color: var(--color-accent);
    border-radius: 50%;
  }

  &__grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 0.875rem;

    @media (min-width: 640px) {
      grid-template-columns: 1fr 1fr;
    }
  }

  &__full {
    @media (min-width: 640px) {
      grid-column: 1 / -1;
    }
  }

  &__select {
    appearance: none;
    padding-right: 2.5rem;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23888' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 1rem center;
    cursor: pointer;
  }

  .field__input[aria-invalid="true"] {
    border-color: var(--color-error);

    &:focus {
      box-shadow: 0 0 0 3px color-mix(in srgb, var(--color-error) 22%, transparent);
    }
  }

  &__msg {
    font-size: 0.75rem;
    font-weight: 500;
    color: var(--color-error);
  }

  &__hint {
    font-size: 0.75rem;
    line-height: 1.5;
  }

  &__opt {
    font-weight: 400;
    color: var(--color-muted);
  }

  &__link-btn {
    align-self: flex-start;
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    min-height: 40px;
    font-size: 0.875rem;
    font-weight: 600;
    color: var(--color-accent);
    text-align: left;

    &:hover { text-decoration: underline; text-underline-offset: 3px; }
  }

  &__notice {
    display: flex;
    align-items: flex-start;
    gap: 0.5rem;
    padding: 0.75rem 0.875rem;
    font-size: 0.8125rem;
    color: var(--color-primary);
    background-color: var(--color-warning-light);
    border-radius: $radius-md;

    i { margin-top: 0.2rem; color: var(--color-warning); }
  }

  // ── Zonas ─────────────────────────────────────
  &__zones {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  &__zone {
    display: flex;
    align-items: center;
    gap: 0.875rem;
    min-height: 60px;
    padding: 0.75rem 1rem;
    border: 1.5px solid var(--color-border);
    border-radius: $radius-md;
    cursor: pointer;
    transition: border-color 0.2s ease, background-color 0.2s ease;

    &:hover { border-color: var(--color-border-strong); }

    &--active {
      border-color: var(--color-accent);
      background-color: color-mix(in srgb, var(--color-accent) 6%, transparent);
    }

    &--loading {
      justify-content: center;
      color: var(--color-muted);
      font-size: 0.875rem;
      cursor: default;
    }

    &:has(input:focus-visible) {
      box-shadow: var(--focus-ring);
    }
  }

  &__radio {
    flex-shrink: 0;
    width: 20px;
    height: 20px;
    border: 2px solid var(--color-border-strong);
    border-radius: 50%;
    transition: all 0.2s ease;

    .co__zone--active & {
      border-color: var(--color-accent);
      box-shadow: inset 0 0 0 4px var(--color-bg-card);
      background-color: var(--color-accent);
    }
  }

  &__zone-info {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
  }

  &__zone-name {
    font-size: 0.9375rem;
    font-weight: 600;
  }

  &__zone-eta {
    font-size: 0.75rem;
    color: var(--color-muted);
  }

  &__zone-price {
    font-weight: 700;
    font-variant-numeric: tabular-nums;

    &--free { color: var(--color-success); }
  }

  // ── Pago ──────────────────────────────────────
  &__pay-info {
    display: flex;
    align-items: flex-start;
    gap: 0.875rem;
    padding: 1rem;
    background-color: var(--color-bg-subtle);
    border-radius: $radius-md;

    > i {
      margin-top: 0.15rem;
      font-size: 1.25rem;
      color: var(--color-accent);
    }

    strong { font-size: 0.9375rem; }
    p { font-size: 0.8125rem; line-height: 1.55; }
  }

  // ── Botón de pago (sticky en móvil) ───────────
  &__submit-bar {
    position: sticky;
    bottom: 0;
    z-index: 5;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    margin: 0 -1rem;
    padding: 0.75rem 1rem calc(0.75rem + env(safe-area-inset-bottom));
    background-color: color-mix(in srgb, var(--color-bg) 92%, transparent);
    backdrop-filter: blur(10px);
    border-top: 1px solid var(--color-border);

    @media (min-width: 768px) {
      margin: 0 -2rem;
      padding-left: 2rem;
      padding-right: 2rem;
    }

    @media (min-width: 960px) {
      position: static;
      margin: 0;
      padding: 0;
      background: none;
      backdrop-filter: none;
      border-top: none;
    }
  }

  &__submit {
    font-size: 1.0625rem;
  }

  &__secure {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.375rem;
    font-size: 0.75rem;

    i { color: var(--color-success); }
  }

  // ── Resumen ───────────────────────────────────
  &__summary {
    order: 1;
    display: none;
    flex-direction: column;
    gap: 1.25rem;
    margin-bottom: 1.25rem;
    padding: 1.25rem;
    background-color: var(--color-bg-card);
    border: 1px solid var(--color-border);
    border-radius: $radius-lg;

    &--open { display: flex; }

    @media (min-width: 960px) {
      order: 2;
      display: flex;
      position: sticky;
      top: 96px;
      margin-bottom: 0;
      padding: 1.5rem;
    }
  }

  &__summary-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  &__summary-title {
    font-size: 1.25rem;
  }

  &__edit {
    min-height: 36px;
    padding: 0 0.75rem;
    font-size: 0.8125rem;
    font-weight: 600;
    color: var(--color-accent);
    border-radius: $radius-full;

    &:hover { background-color: var(--color-accent-light); }
  }

  &__items {
    display: flex;
    flex-direction: column;
    gap: 0.875rem;
  }

  &__item {
    display: flex;
    align-items: center;
    gap: 0.875rem;
  }

  &__item-media {
    position: relative;
    flex-shrink: 0;
    width: 60px;
    height: 60px;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      background-color: var(--color-bg-subtle);
      border-radius: $radius-md;
    }
  }

  &__item-qty {
    position: absolute;
    top: -6px;
    right: -6px;
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 22px;
    height: 22px;
    padding: 0 0.3rem;
    font-size: 0.6875rem;
    font-weight: 700;
    color: var(--color-on-inverse);
    background-color: var(--color-bg-inverse);
    border-radius: $radius-full;
  }

  &__item-info {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
  }

  &__item-name {
    font-size: 0.875rem;
    font-weight: 600;
    line-height: 1.35;
  }

  &__item-size {
    font-size: 0.75rem;
    color: var(--color-muted);
  }

  &__item-price {
    font-size: 0.875rem;
    font-weight: 600;
    font-variant-numeric: tabular-nums;
  }

  &__rows {
    display: flex;
    flex-direction: column;
    gap: 0.625rem;
    padding-top: 1rem;
    border-top: 1px solid var(--color-border);
  }

  &__row {
    display: flex;
    justify-content: space-between;
    gap: 1rem;
    font-size: 0.875rem;

    dt { display: flex; flex-direction: column; color: var(--color-muted); }
    dd { font-weight: 600; font-variant-numeric: tabular-nums; }

    &--total {
      align-items: baseline;
      padding-top: 0.75rem;
      border-top: 1px solid var(--color-border);

      dt { font-size: 1rem; font-weight: 600; color: var(--color-primary); }
      dd { font-size: 1.5rem; font-weight: 700; }
    }
  }

  &__row-sub {
    font-size: 0.75rem;
    opacity: 0.85;
  }

  &__free {
    color: var(--color-success);
  }

  &__trust {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    padding-top: 1rem;
    border-top: 1px solid var(--color-border);
    font-size: 0.8125rem;
    color: var(--color-muted);

    i {
      width: 18px;
      margin-right: 0.375rem;
      color: var(--color-accent);
    }
  }
}
</style>
