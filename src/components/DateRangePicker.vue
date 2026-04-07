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

<style lang="scss" scoped>
.drp {
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
  padding: 0.75rem 1rem;
  background-color: $admin-sidebar-hover;
  border: 1px solid $admin-border;
  border-radius: 10px;

  // ── Timezone row ────────────────────────────────────────────────────────────
  &__tz {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    flex-wrap: wrap;
  }

  &__tz-label {
    font-size: 0.6875rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    color: $admin-text-muted;
    white-space: nowrap;
  }

  &__tz-buttons {
    display: flex;
    gap: 0.25rem;
  }

  &__tz-btn {
    padding: 0.25rem 0.625rem;
    border-radius: 6px;
    border: 1px solid $admin-border;
    background: $admin-card;
    color: $admin-text-muted;
    font-size: 0.8125rem;
    font-family: 'Inter', sans-serif;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.15s;
    white-space: nowrap;

    &:hover { border-color: $admin-accent; color: $admin-text; }
    &--active {
      background: rgba($admin-accent, 0.15);
      border-color: $admin-accent;
      color: $admin-accent;
      font-weight: 600;
    }
  }

  &__tz-offset {
    font-size: 0.75rem;
    font-family: monospace;
    color: $admin-accent;
    font-weight: 700;
    margin-left: auto;
    background: rgba($admin-accent, 0.1);
    padding: 0.2rem 0.5rem;
    border-radius: 4px;
  }

  // ── Pickers row ─────────────────────────────────────────────────────────────
  &__row {
    display: flex;
    align-items: flex-end;
    gap: 0.5rem;
    flex-wrap: wrap;
  }

  &__picker {
    position: relative;   // anchor for hidden input
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    flex: 1;
    min-width: 130px;
  }

  &__picker-label {
    font-size: 0.6875rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: $admin-text-muted;
  }

  &__picker-btn {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5625rem 0.875rem;
    background: $admin-card;
    border: 1px solid $admin-border;
    border-radius: 7px;
    color: $admin-text-muted;
    font-size: 0.875rem;
    font-family: 'Inter', sans-serif;
    font-weight: 500;
    cursor: pointer;
    width: 100%;
    text-align: left;
    transition: border-color 0.15s, color 0.15s, box-shadow 0.15s;
    white-space: nowrap;

    i { font-size: 0.875rem; flex-shrink: 0; }

    &:hover {
      border-color: $admin-accent;
      color: $admin-text;
    }

    &--set {
      border-color: rgba($admin-accent, 0.5);
      color: $admin-text;
      font-weight: 600;

      i { color: $admin-accent; }
    }

    &:focus-visible {
      outline: none;
      box-shadow: 0 0 0 2px rgba($admin-accent, 0.3);
    }
  }

  // Native input: hidden but keeps native picker functionality
  &__hidden {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
    pointer-events: none;
    border: none;
    padding: 0;
    color-scheme: dark;
  }

  &__sep {
    color: $admin-text-muted;
    font-size: 1rem;
    padding-bottom: 0.5rem;
    flex-shrink: 0;
  }

  &__clear {
    display: inline-flex;
    align-items: center;
    gap: 0.3rem;
    padding: 0.5rem 0.75rem;
    border-radius: 7px;
    border: 1px solid rgba($admin-error, 0.35);
    background: rgba($admin-error, 0.07);
    color: $admin-error;
    font-size: 0.8125rem;
    font-weight: 600;
    cursor: pointer;
    font-family: 'Inter', sans-serif;
    align-self: flex-end;
    transition: all 0.15s;
    white-space: nowrap;

    &:hover { background: rgba($admin-error, 0.18); }
  }

  // ── Mobile first (< 480px) ──────────────────────────────────────────────────
  @media (max-width: 480px) {
    padding: 0.625rem 0.75rem;

    &__tz-offset { margin-left: 0; }
    &__sep        { display: none; }

    &__picker { min-width: 0; flex: 1 1 calc(50% - 0.5rem); }

    &__picker-btn { font-size: 0.9375rem; padding: 0.625rem 0.75rem; }

    &__clear { flex: 1 1 100%; justify-content: center; }
  }
}
</style>
