import { ref, watch, type Ref } from 'vue';
import type { ShippingZone } from '../../services/shippingZone.service';

export type ShippingZonePayload = {
  name: string;
  description?: string;
  price: number;
  estimatedDays: string;
  countries: string[];
  mapsUrl?: string;
  isActive: boolean;
};

function emptyForm() {
  return { name: '', description: '', price: 0, estimatedDays: '', countries: [] as string[], mapsUrl: '', isActive: true };
}

/** Estado del formulario de zona de envío; se reinicia cada vez que se abre el modal. */
export function useShippingZoneForm(show: Ref<boolean>, zone: Ref<ShippingZone | null>) {
  const form = ref(emptyForm());
  const countryInput = ref('');

  watch(show, (open) => {
    if (!open) return;
    const z = zone.value;
    form.value = z
      ? {
          name: z.name,
          description: z.description || '',
          price: z.price,
          estimatedDays: z.estimatedDays,
          countries: [...z.countries],
          mapsUrl: z.mapsUrl || '',
          isActive: z.isActive,
        }
      : emptyForm();
    countryInput.value = '';
  }, { immediate: true });

  function addCountry() {
    const val = countryInput.value.trim();
    if (val && !form.value.countries.includes(val)) {
      form.value.countries.push(val);
    }
    countryInput.value = '';
  }

  function removeCountry(index: number) {
    form.value.countries.splice(index, 1);
  }

  function onCountryKeydown(e: KeyboardEvent) {
    if (e.key === 'Enter') {
      e.preventDefault();
      addCountry();
    }
  }

  function buildPayload(): ShippingZonePayload | null {
    if (!form.value.name.trim() || !form.value.estimatedDays.trim()) return null;
    return {
      name: form.value.name.trim(),
      description: form.value.description.trim() || undefined,
      price: Number(form.value.price),
      estimatedDays: form.value.estimatedDays.trim(),
      countries: form.value.countries,
      mapsUrl: form.value.mapsUrl.trim() || undefined,
      isActive: form.value.isActive,
    };
  }

  return { form, countryInput, addCountry, removeCountry, onCountryKeydown, buildPayload };
}
