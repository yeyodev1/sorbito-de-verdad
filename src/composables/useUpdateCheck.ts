import { ref, onUnmounted } from 'vue';

const POLL_INTERVAL = 3 * 60 * 1000; // 3 minutes

export function useUpdateCheck() {
  const updateAvailable = ref(false);
  let initialBuildTime: string | null = null;
  let timer: ReturnType<typeof setInterval> | null = null;

  async function fetchBuildTime(): Promise<string | null> {
    try {
      const res = await fetch(`/version.json?t=${Date.now()}`, { cache: 'no-store' });
      if (!res.ok) return null;
      const data = await res.json();
      return data.buildTime ?? null;
    } catch {
      return null;
    }
  }

  async function checkForUpdate() {
    const buildTime = await fetchBuildTime();
    if (!buildTime) return;

    if (!initialBuildTime) {
      initialBuildTime = buildTime;
      return;
    }

    if (buildTime !== initialBuildTime) {
      updateAvailable.value = true;
      if (timer) clearInterval(timer); // stop polling once detected
    }
  }

  async function start() {
    // Store the initial build time on first load
    initialBuildTime = await fetchBuildTime();
    timer = setInterval(checkForUpdate, POLL_INTERVAL);
  }

  function reload() {
    window.location.reload();
  }

  onUnmounted(() => {
    if (timer) clearInterval(timer);
  });

  return { updateAvailable, start, reload };
}
