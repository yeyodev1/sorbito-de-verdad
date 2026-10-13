<script setup lang="ts">
import { ref, computed, watch } from 'vue';

const ZONES = [
  { id: 'EC', label: 'Ecuador', tz: 'America/Guayaquil', flag: '🇪🇨' },
  { id: 'CA', label: 'Toronto', tz: 'America/Toronto',   flag: '🇨🇦' },
] as const;

type ZoneId = (typeof ZONES)[number]['id'];

const emit = defineEmits<{ change: [{ from: string; to: string }] }>();

const localFrom = ref('');
const localTo   = ref('');
const tzId      = ref<ZoneId>('EC');

// Template refs for the hidden inputs
const inputFrom = ref<HTMLInputElement | null>(null);
const inputTo   = ref<HTMLInputElement | null>(null);

const zone = computed(() => ZONES.find(z => z.id === tzId.value)!);

// ── Date helpers ─────────────────────────────────────────────────────────────

function todayInZone(tz: string): string {
  return new Intl.DateTimeFormat('en-CA', { timeZone: tz }).format(new Date());
}

function offsetMs(dateStr: string, tz: string): number {
  const noon  = new Date(`${dateStr}T12:00:00Z`);
  const local = new Date(noon.toLocaleString('en-US', { timeZone: tz }));
  return noon.getTime() - local.getTime();
}

function startISO(dateStr: string, tz: string): string {
  const ms = offsetMs(dateStr, tz);
  return new Date(new Date(`${dateStr}T00:00:00.000Z`).getTime() + ms).toISOString();
}

function endISO(dateStr: string, tz: string): string {
  const ms = offsetMs(dateStr, tz);
  return new Date(new Date(`${dateStr}T23:59:59.999Z`).getTime() + ms).toISOString();
}

/** Formats a YYYY-MM-DD string to "7 abr. 2026" */
function fmtDate(dateStr: string): string {
  if (!dateStr) return '';
  const [y, m, d] = dateStr.split('-');
  return new Date(Number(y), Number(m) - 1, Number(d))
    .toLocaleDateString('es-VE', { day: 'numeric', month: 'short', year: 'numeric' });
}

const offsetLabel = computed(() => {
  const today = todayInZone(zone.value.tz);
  const ms    = offsetMs(today, zone.value.tz);
  const h     = ms / 3_600_000;
  return `UTC${h <= 0 ? '−' : '+'}${Math.abs(h)}`;
});

// ── Open native picker ───────────────────────────────────────────────────────

function openFrom() {
  try { inputFrom.value?.showPicker(); } catch { inputFrom.value?.click(); }
}
function openTo() {
  try { inputTo.value?.showPicker(); } catch { inputTo.value?.click(); }
}

// ── Watchers ─────────────────────────────────────────────────────────────────

watch(localFrom, (val) => {
  if (val && !localTo.value) localTo.value = todayInZone(zone.value.tz);
  emitChange();
});

watch(localTo, () => emitChange());

watch(tzId, () => {
  const otherZone = ZONES.find(z => z.id !== tzId.value)!;
  if (localTo.value === todayInZone(otherZone.tz)) {
    localTo.value = todayInZone(zone.value.tz);
  }
  emitChange();
});

function emitChange() {
  emit('change', {
    from: localFrom.value ? startISO(localFrom.value, zone.value.tz) : '',
    to:   localTo.value   ? endISO(localTo.value,     zone.value.tz) : '',
  });
}

function clear() {
  localFrom.value = '';
  localTo.value   = '';
  emitChange();
}

const hasFilter = computed(() => localFrom.value || localTo.value);
</script>

<template>
  <div class="drp">

    <!-- Row 1: Timezone + offset -->
    <div class="drp__tz">
      <span class="drp__tz-label">Zona horaria</span>
      <div class="drp__tz-buttons">
        <button
          v-for="z in ZONES"
          :key="z.id"
          type="button"
          :class="['drp__tz-btn', { 'drp__tz-btn--active': tzId === z.id }]"
          @click="tzId = z.id"
        >
          {{ z.flag }} {{ z.label }}
        </button>
      </div>
      <span class="drp__tz-offset">{{ offsetLabel }}</span>
    </div>

    <!-- Row 2: Pickers -->
    <div class="drp__row">

      <!-- FROM -->
      <div class="drp__picker">
        <span class="drp__picker-label">Desde</span>
        <button
          type="button"
          :class="['drp__picker-btn', { 'drp__picker-btn--set': localFrom }]"
          @click="openFrom"
        >
          <i class="fa-regular fa-calendar"></i>
          <span>{{ localFrom ? fmtDate(localFrom) : 'Seleccionar' }}</span>
        </button>
        <!-- Hidden native input -->
        <input
          ref="inputFrom"
          v-model="localFrom"
          type="date"
          :max="localTo || undefined"
          class="drp__hidden"
          tabindex="-1"
          aria-hidden="true"
        />
      </div>

      <span class="drp__sep" aria-hidden="true">→</span>

      <!-- TO -->
      <div class="drp__picker">
        <span class="drp__picker-label">Hasta</span>
        <button
          type="button"
          :class="['drp__picker-btn', { 'drp__picker-btn--set': localTo }]"
          @click="openTo"
        >
          <i class="fa-regular fa-calendar"></i>
          <span>{{ localTo ? fmtDate(localTo) : 'Seleccionar' }}</span>
        </button>
        <!-- Hidden native input -->
        <input
          ref="inputTo"
          v-model="localTo"
          type="date"
          :min="localFrom || undefined"
          class="drp__hidden"
          tabindex="-1"
          aria-hidden="true"
        />
      </div>

      <!-- Clear -->
      <button v-if="hasFilter" type="button" class="drp__clear" @click="clear">
        <i class="fa-solid fa-xmark"></i>
        Limpiar
      </button>

    </div>
  </div>
</template>

<style lang="scss" scoped src="./DateRangePicker.scss"></style>
