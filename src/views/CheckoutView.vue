<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import { RouterLink } from 'vue-router';
import MainLayout from '../layout/MainLayout.vue';
import { useCartStore } from '../stores/cart';
import { useAuthStore } from '../stores/auth';
import { orderService } from '../services/order.service';
import { shippingZoneService, type ShippingZone } from '../services/shippingZone.service';

const cartStore = useCartStore();
const authStore = useAuthStore();
const loading = ref(false);
const errorMessage = ref('');
const zones = ref<ShippingZone[]>([]);
const selectedZoneId = ref<string>('');

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
  { label: '— Ecuador —', value: 'Ecuador', flag: '🇪🇨' },
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

const isInternational = computed(() =>
  form.value.country !== 'Ecuador'
);

const form = ref({
  name: authStore.user?.name || '',
  email: authStore.user?.email || '',
  phone: '',
  street: '',
  city: '',
  state: '',
  zip: '',
  country: 'Ecuador',
  mapsUrl: '',
});

const items = computed(() => cartStore.items);
const subtotal = computed(() => cartStore.subtotal);
const selectedZone = computed(() => zones.value.find((z) => z._id === selectedZoneId.value) ?? null);
const shipping = computed(() => selectedZone.value?.price ?? 0);
const total = computed(() => subtotal.value + shipping.value);

const isFormValid = computed(() => {
  const f = form.value;
  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email);
  const baseOk = f.name.trim() !== '' && emailOk && f.phone.trim() !== '' && f.street.trim() !== '' && f.city.trim() !== '';
  const intlOk = !isInternational.value || (f.zip.trim() !== '');
  return baseOk && intlOk && items.value.length > 0 && !!selectedZoneId.value;
});

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
  try {
    zones.value = await shippingZoneService.getZones();
    // Auto-select zone based on default country (Ecuador)
    autoSelectZoneByCountry(form.value.country);
    if (!selectedZoneId.value && zones.value.length > 0) {
      selectedZoneId.value = zones.value[0]!._id;
    }
  } catch (e) {
    console.error('Error loading shipping zones', e);
  }
});

async function handleSubmit() {
  if (loading.value || items.value.length === 0) return;
  loading.value = true;
  errorMessage.value = '';
  try {
    const shippingAddress = {
      name: form.value.name,
      phone: form.value.phone,
      street: form.value.street,
      city: form.value.city,
      state: form.value.state,
      country: form.value.country,
      zip: form.value.zip,
      ...(form.value.mapsUrl && { notes: `Google Maps: ${form.value.mapsUrl}` }),
    };
    const response = await orderService.initiatePayphonePayment(
      items.value,
      shippingAddress,
      form.value.email,
      undefined,
      selectedZoneId.value || undefined,
    );
    cartStore.clearCart();
    // Redirect to PayPhone's hosted payment page
    window.location.href = response.data.payWithPayPhone;
  } catch (err: unknown) {
    type AxiosErr = { response?: { data?: { message?: string } }; message?: string };
    const e = err as AxiosErr;
    errorMessage.value = e.response?.data?.message || 'Error al procesar el pedido. Intenta de nuevo.';
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
      <div class="container co__container">

        <!-- Breadcrumb -->
        <nav class="co__breadcrumb">
          <RouterLink to="/" class="co__breadcrumb-link">Inicio</RouterLink>
          <i class="fa-solid fa-chevron-right co__breadcrumb-sep"></i>
          <RouterLink to="/carrito" class="co__breadcrumb-link">Carrito</RouterLink>
          <i class="fa-solid fa-chevron-right co__breadcrumb-sep"></i>
          <span class="co__breadcrumb-current">Pago</span>
        </nav>

        <!-- Page header -->
        <div class="co__header">
          <h1 class="co__title">Finalizar compra</h1>
          <p class="co__subtitle">Completa tus datos para procesar el pedido</p>
        </div>

        <!-- Layout -->
        <div class="co__layout">
          <!-- Form -->
          <form class="co__form" @submit.prevent="handleSubmit" novalidate>

            <!-- Error -->
            <div v-if="errorMessage" class="co__error" role="alert">
              <i class="fa-solid fa-circle-exclamation"></i>
              {{ errorMessage }}
            </div>

            <!-- Step 1: Datos personales -->
            <div class="co__section">
              <div class="co__section-head">
                <span class="co__step-badge">1</span>
                <div>
                  <h2 class="co__section-title">Datos personales</h2>
                  <p class="co__section-desc">¿A quién le enviamos?</p>
                </div>
              </div>
              <div class="co__fields co__fields--2col">
                <div class="co__field">
                  <label class="co__label" for="co-name">Nombre completo</label>
                  <div class="co__input-wrap">
                    <i class="fa-solid fa-user co__input-icon"></i>
                    <input id="co-name" v-model="form.name" type="text" class="co__input" placeholder="Juan Pérez" required autocomplete="name" />
                  </div>
                </div>
                <div class="co__field">
                  <label class="co__label" for="co-email">Correo electrónico</label>
                  <div class="co__input-wrap">
                    <i class="fa-solid fa-envelope co__input-icon"></i>
                    <input id="co-email" v-model="form.email" type="email" class="co__input" placeholder="juan@email.com" required autocomplete="email" />
                  </div>
                </div>
                <div class="co__field">
                  <label class="co__label" for="co-phone">Teléfono de contacto</label>
                  <div class="co__input-wrap">
                    <i class="fa-solid fa-phone co__input-icon"></i>
                    <input id="co-phone" v-model="form.phone" type="tel" class="co__input" placeholder="+58 414 000 0000" required autocomplete="tel" />
                  </div>
                </div>
                <div class="co__field">
                  <label class="co__label" for="co-country">País de destino</label>
                  <div class="co__input-wrap">
                    <i class="fa-solid fa-globe co__input-icon"></i>
                    <select id="co-country" v-model="form.country" class="co__input co__input--select" required>
                      <option v-for="c in countryOptions" :key="c.value" :value="c.value">
                        {{ c.flag }} {{ c.label }}
                      </option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <!-- Step 2: Dirección de envío -->
            <div class="co__section">
              <div class="co__section-head">
                <span class="co__step-badge">2</span>
                <div>
                  <h2 class="co__section-title">Dirección de envío</h2>
                  <p class="co__section-desc">¿A dónde enviamos tu pedido?</p>
                </div>
              </div>
              <div class="co__fields co__fields--2col">
                <div class="co__field co__field--full">
                  <label class="co__label" for="co-street">Dirección completa</label>
                  <div class="co__input-wrap">
                    <i class="fa-solid fa-location-dot co__input-icon"></i>
                    <input id="co-street" v-model="form.street" type="text" class="co__input" placeholder="Calle, número, urbanización, sector" required autocomplete="street-address" />
                  </div>
                </div>
                <div class="co__field">
                  <label class="co__label" for="co-city">Ciudad</label>
                  <div class="co__input-wrap">
                    <i class="fa-solid fa-city co__input-icon"></i>
                    <input id="co-city" v-model="form.city" type="text" class="co__input" placeholder="Guayaquil" required autocomplete="address-level2" />
                  </div>
                </div>

                <!-- Provincia/Estado — siempre visible -->
                <div class="co__field">
                  <label class="co__label" for="co-state">
                    {{ isInternational ? 'Estado / Provincia' : 'Provincia' }}
                  </label>
                  <div class="co__input-wrap">
                    <i class="fa-solid fa-map co__input-icon"></i>
                    <input id="co-state" v-model="form.state" type="text" class="co__input"
                      :placeholder="isInternational ? 'Ej: California' : 'Ej: Guayas'"
                      autocomplete="address-level1" />
                  </div>
                </div>

                <!-- Código postal — obligatorio para internacional -->
                <div class="co__field">
                  <label class="co__label" for="co-zip">
                    Código postal
                    <span v-if="!isInternational" class="co__label-opt">Opcional</span>
                    <span v-else class="co__label-req">*</span>
                  </label>
                  <div class="co__input-wrap">
                    <i class="fa-solid fa-hashtag co__input-icon"></i>
                    <input id="co-zip" v-model="form.zip" type="text" class="co__input"
                      :placeholder="isInternational ? 'Ej: 90210' : 'Ej: 090101'"
                      :required="isInternational"
                      inputmode="numeric"
                      autocomplete="postal-code" />
                  </div>
                </div>
              </div>

              <!-- Google Maps pin -->
              <div class="co__field co__field--maps">
                <label class="co__label" for="co-maps">
                  <i class="fa-solid fa-map-location-dot" style="color: var(--color-accent-light)"></i>
                  Ubícanos en Google Maps
                  <span class="co__label-opt">Opcional</span>
                </label>
                <div class="co__input-wrap">
                  <i class="fa-brands fa-google co__input-icon"></i>
                  <input
                    id="co-maps"
                    v-model="form.mapsUrl"
                    type="url"
                    class="co__input"
                    placeholder="https://maps.app.goo.gl/..."
                    autocomplete="off"
                  />
                </div>
                <p class="co__field-hint">
                  <i class="fa-solid fa-circle-info"></i>
                  En Google Maps: comparte → copiar enlace → pega aquí. Nos ayuda a llegar sin problemas.
                </p>
              </div>

              <!-- Zone selector -->
              <div class="co__zone-section">
                <h3 class="co__zone-section-title">
                  <i class="fa-solid fa-truck"></i>
                  Zona de envío
                </h3>
                <div class="co__zone-list">
                  <label
                    v-for="zone in zones"
                    :key="zone._id"
                    :class="['co__zone-card', { 'co__zone-card--active': selectedZoneId === zone._id }]"
                  >
                    <input type="radio" v-model="selectedZoneId" :value="zone._id" class="co__zone-radio-hidden" />
                    <!-- Custom radio dot -->
                    <div class="co__zone-dot">
                      <div class="co__zone-dot-inner"></div>
                    </div>
                    <!-- Left: icon + info -->
                    <div class="co__zone-body">
                      <div class="co__zone-icon">
                        <i :class="zone.price === 0 ? 'fa-solid fa-box-open' : zone.countries.length > 5 ? 'fa-solid fa-earth-europe' : 'fa-solid fa-earth-americas'"></i>
                      </div>
                      <div class="co__zone-info">
                        <span class="co__zone-name">{{ zone.name }}</span>
                        <span class="co__zone-eta">
                          <i class="fa-regular fa-clock"></i>
                          {{ zone.estimatedDays }}
                        </span>
                      </div>
                    </div>
                    <!-- Right: price -->
                    <div class="co__zone-price-wrap">
                      <span :class="['co__zone-price', { 'co__zone-price--free': zone.price === 0 }]">
                        {{ zone.price === 0 ? 'Gratis' : '$' + zone.price.toFixed(0) }}
                      </span>
                      <span v-if="zone.price > 0" class="co__zone-price-note">USD</span>
                    </div>
                  </label>
                  <div v-if="zones.length === 0" class="co__zone-empty">
                    <i class="fa-solid fa-circle-notch fa-spin"></i> Cargando zonas...
                  </div>
                </div>
              </div>
            </div>

            <!-- Step 3: Pago -->
            <div class="co__section co__section--payment">
              <div class="co__section-head">
                <span class="co__step-badge co__step-badge--accent">3</span>
                <div>
                  <h2 class="co__section-title">Pago con tarjeta</h2>
                  <p class="co__section-desc">Pago seguro con tarjeta de crédito o débito</p>
                </div>
                <div class="co__payphone-badge">
                  <i class="fa-solid fa-shield-halved"></i>
                  Seguro
                </div>
              </div>
              <div class="co__payphone-info">
                <i class="fa-solid fa-credit-card"></i>
                <p>Serás redirigido a una página segura para ingresar los datos de tu tarjeta.</p>
              </div>
            </div>

            <!-- Submit -->
            <button type="submit" class="co__submit" :disabled="loading || !isFormValid">
              <template v-if="loading">
                <i class="fa-solid fa-circle-notch fa-spin"></i>
                Procesando pago...
              </template>
              <template v-else>
                <i class="fa-solid fa-lock"></i>
                Pagar {{ formatPrice(total) }}
              </template>
            </button>

            <p v-if="!isFormValid && !loading" class="co__form-incomplete">
              <i class="fa-solid fa-circle-exclamation"></i>
              Completa todos los campos requeridos para continuar
            </p>

            <p class="co__secure-note">
              <i class="fa-solid fa-shield-halved"></i>
              Tus datos están protegidos con encriptación SSL
            </p>

          </form>

          <!-- Order Summary -->
          <aside class="co__summary">
            <div class="co__summary-header">
              <h2 class="co__summary-title">Resumen del pedido</h2>
              <span class="co__summary-count">{{ items.length }} {{ items.length === 1 ? 'producto' : 'productos' }}</span>
            </div>

            <div class="co__summary-items">
              <div v-for="item in items" :key="`${item.product._id}-${item.selectedSize?.name}`" class="co__summary-item">
                <div class="co__summary-img-wrap">
                  <img :src="item.product.mainImage" :alt="item.product.name" class="co__summary-img" />
                  <span class="co__summary-qty">{{ item.quantity }}</span>
                </div>
                <div class="co__summary-item-info">
                  <span class="co__summary-item-name">{{ item.product.name }}</span>
                  <span v-if="item.selectedSize" class="co__summary-item-size">
                    <i class="fa-solid fa-ruler-horizontal"></i> {{ item.selectedSize.name }}
                  </span>
                  <span class="co__summary-item-unit">{{ formatPrice(item.selectedSize?.price ?? item.product.price) }} c/u</span>
                </div>
                <span class="co__summary-item-price">{{ formatPrice((item.selectedSize?.price ?? item.product.price) * item.quantity) }}</span>
              </div>
            </div>

            <div class="co__summary-divider"></div>

            <div class="co__summary-rows">
              <div class="co__summary-row">
                <span>Subtotal</span>
                <span>{{ formatPrice(subtotal) }}</span>
              </div>
              <div class="co__summary-row">
                <span>
                  Envío
                  <span v-if="selectedZone" class="co__summary-zone-name"> · {{ selectedZone.name }}</span>
                </span>
                <span :class="{ 'co__summary-free': shipping === 0 }">
                  <template v-if="shipping === 0">
                    <i class="fa-solid fa-gift"></i> Gratis
                  </template>
                  <template v-else>{{ formatPrice(shipping) }}</template>
                </span>
              </div>
              <div v-if="selectedZone" class="co__summary-shipping-hint">
                <i class="fa-solid fa-clock"></i> {{ selectedZone.estimatedDays }}
              </div>
            </div>

            <div class="co__summary-divider"></div>

            <div class="co__summary-total">
              <span>Total a pagar</span>
              <span class="co__summary-total-amount">{{ formatPrice(total) }}</span>
            </div>

            <div class="co__summary-footer">
              <div class="co__summary-footer-item">
                <i class="fa-solid fa-shield-halved"></i>
                Pago 100% seguro
              </div>
              <div class="co__summary-footer-item">
                <i class="fa-solid fa-rotate-left"></i>
                Política de devolución
              </div>
            </div>
          </aside>
        </div>

      </div>
    </div>

  </MainLayout>
</template>

<style lang="scss" scoped>
@use "sass:color";

.co {
  padding: 2.5rem 0 6rem;
  background-color: var(--color-bg-subtle);
  min-height: calc(100vh - 70px);

  &__container {
    max-width: 1140px;
  }

  // ── Breadcrumb ──────────────────────────────────────────────
  &__breadcrumb {
    display: flex;
    align-items: center;
    gap: 0.375rem;
    margin-bottom: 2rem;
    flex-wrap: wrap;
  }

  &__breadcrumb-link {
    font-size: 0.8125rem;
    color: var(--color-muted);
    text-decoration: none;
    transition: color 0.2s ease;
    &:hover { color: $color-accent; }
  }

  &__breadcrumb-sep {
    font-size: 0.6rem;
    color: var(--color-border);
  }

  &__breadcrumb-current {
    font-size: 0.8125rem;
    color: var(--color-primary);
    font-weight: 600;
  }

  // ── Page header ─────────────────────────────────────────────
  &__header {
    margin-bottom: 2rem;
  }

  &__title {
    font-family: var(--font-heading);
    font-size: 1.875rem;
    font-weight: 700;
    color: var(--color-primary);
    margin: 0 0 0.25rem;
    line-height: 1.2;
  }

  &__subtitle {
    font-size: 0.9375rem;
    color: var(--color-muted);
    margin: 0;
  }

  // ── Layout grid ─────────────────────────────────────────────
  &__layout {
    display: grid;
    grid-template-columns: 1fr 360px;
    gap: 2rem;
    align-items: start;

    @media (max-width: 960px) {
      grid-template-columns: 1fr;
    }
  }

  // ── Form ────────────────────────────────────────────────────
  &__form {
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
  }

  &__error {
    display: flex;
    align-items: center;
    gap: 0.625rem;
    padding: 0.875rem 1.125rem;
    background-color: rgba(239, 68, 68, 0.08);
    border: 1px solid rgba(239, 68, 68, 0.25);
    border-radius: $radius-md;
    font-size: 0.9rem;
    color: var(--color-error);

    i { flex-shrink: 0; }
  }

  // ── Section card ────────────────────────────────────────────
  &__section {
    background-color: var(--color-bg-card);
    border: 1px solid var(--color-border);
    border-radius: $radius-xl;
    padding: 1.75rem;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    transition: box-shadow 0.2s ease;

    &--payment {
      border-color: rgba($color-accent, 0.4);
      background: linear-gradient(
        135deg,
        var(--color-bg-card) 0%,
        rgba($color-accent, 0.03) 100%
      );
    }

    @media (max-width: 600px) { padding: 1.25rem; }
  }

  &__section-head {
    display: flex;
    align-items: flex-start;
    gap: 0.875rem;
  }

  &__step-badge {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background-color: var(--color-bg-subtle);
    border: 2px solid var(--color-border);
    color: var(--color-muted);
    font-size: 0.8125rem;
    font-weight: 700;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    margin-top: 2px;

    &--accent {
      background-color: $color-accent;
      border-color: $color-accent;
      color: white;
    }
  }

  &__section-title {
    font-family: var(--font-heading);
    font-size: 1rem;
    font-weight: 700;
    color: var(--color-primary);
    margin: 0 0 2px;
    line-height: 1.3;
  }

  &__section-desc {
    font-size: 0.8125rem;
    color: var(--color-muted);
    margin: 0;
  }

  &__payphone-badge {
    margin-left: auto;
    display: flex;
    align-items: center;
    gap: 0.3rem;
    padding: 0.3rem 0.75rem;
    background-color: rgba(34, 197, 94, 0.1);
    border: 1px solid rgba(34, 197, 94, 0.25);
    border-radius: $radius-full;
    font-size: 0.75rem;
    font-weight: 600;
    color: #16a34a;
    white-space: nowrap;

    i { font-size: 0.6875rem; }
  }

  &__payphone-info {
    display: flex;
    align-items: flex-start;
    gap: 0.75rem;
    padding: 1rem 1.25rem;
    background-color: rgba($color-accent, 0.06);
    border: 1px solid rgba($color-accent, 0.2);
    border-radius: $radius-md;
    margin-top: 0.5rem;

    i {
      color: $color-accent;
      font-size: 1.125rem;
      margin-top: 2px;
      flex-shrink: 0;
    }

    p {
      margin: 0;
      font-size: 0.9rem;
      color: var(--color-muted);
      line-height: 1.6;
    }
  }

  // ── Fields ──────────────────────────────────────────────────
  &__fields {
    display: flex;
    flex-direction: column;
    gap: 1rem;

    &--2col {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;

      @media (max-width: 560px) { grid-template-columns: 1fr; }
    }
  }

  &__field {
    display: flex;
    flex-direction: column;
    gap: 0.375rem;

    &--full { grid-column: 1 / -1; }
  }

  &__label {
    font-size: 0.8125rem;
    font-weight: 600;
    color: var(--color-primary);
    letter-spacing: 0.01em;
    display: flex;
    align-items: center;
    gap: 0.375rem;
    flex-wrap: wrap;
  }

  &__label-opt {
    font-size: 0.7rem;
    font-weight: 500;
    color: var(--color-muted);
    background-color: var(--color-bg-subtle);
    border: 1px solid var(--color-border);
    border-radius: $radius-full;
    padding: 0.1rem 0.5rem;
  }

  &__label-req {
    color: #e53e3e;
    font-weight: 700;
  }

  &__field--maps {
    margin-top: 0.5rem;
  }

  &__input-wrap {
    position: relative;
    display: flex;
    align-items: center;
  }

  &__input-icon {
    position: absolute;
    left: 0.875rem;
    font-size: 0.8125rem;
    color: var(--color-muted);
    pointer-events: none;
    transition: color 0.2s ease;
  }

  &__input {
    width: 100%;
    box-sizing: border-box;
    padding: 0.8125rem 1rem 0.8125rem 2.5rem;
    background-color: var(--color-bg);
    border: 1.5px solid var(--color-border);
    border-radius: $radius-md;
    font-size: 0.9375rem;
    color: var(--color-primary);
    font-family: var(--font-body);
    transition: border-color 0.2s ease, box-shadow 0.2s ease;

    &::placeholder {
      color: var(--color-muted);
      opacity: 0.5;
    }

    &:focus {
      outline: none;
      border-color: $color-accent;
      box-shadow: 0 0 0 3px rgba($color-accent, 0.12);

      ~ .co__input-icon,
      & + .co__input-icon { color: $color-accent; }
    }
  }

  &__input--select {
    appearance: none;
    -webkit-appearance: none;
    cursor: pointer;
  }

  // Fix icon color on focus (icon is before input in DOM, use parent selector trick)
  &__input-wrap:focus-within &__input-icon {
    color: $color-accent;
  }

  &__field-hint {
    display: flex;
    align-items: flex-start;
    gap: 0.375rem;
    font-size: 0.8125rem;
    color: var(--color-muted);
    line-height: 1.5;
    margin: 0;

    i { margin-top: 2px; flex-shrink: 0; font-size: 0.75rem; color: $color-accent; }
  }

  // ── Shipping zone cards ──────────────────────────────────────
  &__zone-section {
    margin-top: 1.5rem;
    padding-top: 1.5rem;
    border-top: 1px solid var(--color-border);
  }

  &__zone-section-title {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.8125rem;
    font-weight: 700;
    color: var(--color-muted);
    text-transform: uppercase;
    letter-spacing: 0.1em;
    margin: 0 0 1rem;

    i { color: $color-accent; font-size: 0.75rem; }
  }

  &__zone-list {
    display: flex;
    flex-direction: column;
    gap: 0.625rem;
  }

  &__zone-radio-hidden {
    position: absolute;
    opacity: 0;
    width: 0;
    height: 0;
    pointer-events: none;
  }

  &__zone-card {
    display: flex;
    align-items: center;
    gap: 0.875rem;
    padding: 0.875rem 1rem;
    background-color: var(--color-bg);
    border: 1.5px solid var(--color-border);
    border-radius: $radius-md;
    cursor: pointer;
    transition: border-color 0.2s ease, background-color 0.2s ease, box-shadow 0.2s ease;

    &:hover {
      border-color: rgba($color-accent, 0.5);
      background-color: rgba($color-accent, 0.03);
    }

    &--active {
      border-color: $color-accent;
      background-color: rgba($color-accent, 0.06);
      box-shadow: 0 0 0 3px rgba($color-accent, 0.1);

      .co__zone-dot {
        border-color: $color-accent;
      }
      .co__zone-dot-inner {
        opacity: 1;
        transform: scale(1);
      }
      .co__zone-icon {
        color: $color-accent;
        background-color: rgba($color-accent, 0.15);
      }
      .co__zone-name {
        color: var(--color-primary);
        font-weight: 700;
      }
    }
  }

  &__zone-dot {
    width: 18px;
    height: 18px;
    border-radius: 50%;
    border: 2px solid var(--color-border);
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: border-color 0.2s ease;
  }

  &__zone-dot-inner {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background-color: $color-accent;
    opacity: 0;
    transform: scale(0.4);
    transition: opacity 0.2s ease, transform 0.2s ease;
  }

  &__zone-body {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    flex: 1;
    min-width: 0;
  }

  &__zone-icon {
    width: 36px;
    height: 36px;
    border-radius: $radius-sm;
    background-color: var(--color-bg-subtle);
    color: var(--color-muted);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.9375rem;
    flex-shrink: 0;
    transition: color 0.2s ease, background-color 0.2s ease;
  }

  &__zone-info {
    display: flex;
    flex-direction: column;
    gap: 0.2rem;
    min-width: 0;
  }

  &__zone-name {
    font-size: 0.9rem;
    font-weight: 600;
    color: var(--color-primary);
    line-height: 1.2;
    transition: font-weight 0.15s ease;
  }

  &__zone-eta {
    display: flex;
    align-items: center;
    gap: 0.3rem;
    font-size: 0.75rem;
    color: var(--color-muted);

    i { font-size: 0.6875rem; }
  }

  &__zone-price-wrap {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 0.1rem;
    flex-shrink: 0;
    margin-left: auto;
  }

  &__zone-price {
    font-family: var(--font-heading);
    font-size: 1.0625rem;
    font-weight: 700;
    color: var(--color-primary);

    &--free {
      color: #16a34a;
    }
  }

  &__zone-price-note {
    font-size: 0.65rem;
    color: var(--color-muted);
    letter-spacing: 0.06em;
    text-transform: uppercase;
  }

  &__zone-empty {
    text-align: center;
    padding: 1.5rem;
    color: var(--color-muted);
    font-size: 0.9rem;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    opacity: 0.7;
  }

  // ── Submit button ────────────────────────────────────────────
  &__submit {
    width: 100%;
    padding: 1.0625rem;
    background-color: $color-accent;
    color: white;
    border: none;
    border-radius: $radius-lg;
    font-size: 1.0625rem;
    font-weight: 700;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.625rem;
    transition: all 0.25s ease;
    font-family: var(--font-body);
    letter-spacing: 0.01em;

    i { font-size: 0.9375rem; }

    &:hover:not(:disabled) {
      background-color: color.adjust($color-accent, $lightness: -8%);
      transform: translateY(-2px);
      box-shadow: 0 8px 24px rgba($color-accent, 0.35);
    }

    &:active:not(:disabled) {
      transform: translateY(0);
    }

    &:disabled {
      opacity: 0.55;
      cursor: not-allowed;
    }
  }

  &__form-incomplete {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.375rem;
    font-size: 0.8125rem;
    color: var(--color-muted);
    margin: 0;
    opacity: 0.75;

    i { color: $color-accent; font-size: 0.75rem; }
  }

  &__secure-note {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.375rem;
    font-size: 0.8125rem;
    color: var(--color-muted);
    margin: 0;

    i { color: #16a34a; font-size: 0.75rem; }
  }

  // ── Summary sidebar ──────────────────────────────────────────
  &__summary {
    background-color: var(--color-bg-card);
    border: 1px solid var(--color-border);
    border-radius: $radius-xl;
    padding: 1.75rem;
    display: flex;
    flex-direction: column;
    gap: 1.125rem;
    position: sticky;
    top: 90px;

    @media (max-width: 600px) { padding: 1.25rem; }
  }

  &__summary-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.5rem;
  }

  &__summary-title {
    font-family: var(--font-heading);
    font-size: 1rem;
    font-weight: 700;
    color: var(--color-primary);
    margin: 0;
  }

  &__summary-count {
    font-size: 0.75rem;
    font-weight: 600;
    color: var(--color-muted);
    padding: 0.2rem 0.6rem;
    background-color: var(--color-bg-subtle);
    border-radius: $radius-full;
  }

  &__summary-items {
    display: flex;
    flex-direction: column;
    gap: 0.875rem;
  }

  &__summary-item {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  &__summary-img-wrap {
    position: relative;
    width: 56px;
    height: 56px;
    flex-shrink: 0;
  }

  &__summary-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: $radius-md;
    border: 1px solid var(--color-border);
  }

  &__summary-qty {
    position: absolute;
    top: -7px;
    right: -7px;
    min-width: 20px;
    height: 20px;
    padding: 0 4px;
    background-color: $color-accent;
    color: white;
    font-size: 0.625rem;
    font-weight: 700;
    border-radius: $radius-full;
    display: flex;
    align-items: center;
    justify-content: center;
    line-height: 1;
  }

  &__summary-item-info {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 2px;
    min-width: 0;
  }

  &__summary-item-name {
    font-size: 0.875rem;
    font-weight: 500;
    color: var(--color-primary);
    line-height: 1.35;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  &__summary-item-size {
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
    font-size: 0.7rem;
    font-weight: 600;
    color: $color-accent;
    background-color: rgba($color-accent, 0.1);
    border-radius: $radius-full;
    padding: 0.1rem 0.5rem;
    width: fit-content;

    i { font-size: 0.6rem; }
  }

  &__summary-item-unit {
    font-size: 0.75rem;
    color: var(--color-muted);
  }

  &__summary-item-price {
    font-size: 0.875rem;
    font-weight: 700;
    color: var(--color-primary);
    white-space: nowrap;
  }

  &__summary-divider {
    height: 1px;
    background-color: var(--color-border);
  }

  &__summary-rows {
    display: flex;
    flex-direction: column;
    gap: 0.625rem;
  }

  &__summary-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 0.9rem;
    color: var(--color-muted);
  }

  &__summary-free {
    color: #16a34a;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 0.25rem;
    i { font-size: 0.75rem; }
  }

  &__summary-shipping-hint {
    font-size: 0.75rem;
    color: var(--color-muted);
    opacity: 0.7;
    font-style: italic;
    text-align: right;
    margin-top: -0.25rem;
  }

  &__summary-total {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  &__summary-total span:first-child {
    font-size: 0.9375rem;
    font-weight: 600;
    color: var(--color-primary);
  }

  &__summary-total-amount {
    font-family: var(--font-heading);
    font-size: 1.375rem;
    font-weight: 700;
    color: $color-accent;
  }

  &__summary-footer {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    padding-top: 0.25rem;
    border-top: 1px solid var(--color-border);
    margin-top: -0.25rem;
  }

  &__summary-footer-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.8125rem;
    color: var(--color-muted);

    i {
      font-size: 0.75rem;
      color: var(--color-muted);
      width: 14px;
      text-align: center;
    }
  }
}
</style>

