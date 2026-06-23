const CACHE_PREFIX = 'dash:github:';
const CACHE_TTL_MS = 10 * 60 * 1000;

type CacheEntry<T> = {
  expiresAt: number;
  value: T;
};

function getStorage(): Storage | null {
  try {
    return window.sessionStorage;
  } catch {
    return null;
  }
}

export function readCache<T>(key: string): T | null {
  const storage = getStorage();
  if (!storage) return null;

  const raw = storage.getItem(`${CACHE_PREFIX}${key}`);
  if (!raw) return null;

  try {
    const entry = JSON.parse(raw) as CacheEntry<T>;
    if (Date.now() > entry.expiresAt) {
      storage.removeItem(`${CACHE_PREFIX}${key}`);
      return null;
    }

    return entry.value;
  } catch {
    storage.removeItem(`${CACHE_PREFIX}${key}`);
    return null;
  }
}

export function writeCache<T>(key: string, value: T): void {
  const storage = getStorage();
  if (!storage) return;

  const entry: CacheEntry<T> = {
    expiresAt: Date.now() + CACHE_TTL_MS,
    value,
  };

  storage.setItem(`${CACHE_PREFIX}${key}`, JSON.stringify(entry));
}
