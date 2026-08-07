import { useState, useEffect } from 'react';

/**
 * Shared source of truth for the "names sent" number shown in the footer,
 * on the press page and in the standalone counter.
 *
 * Reads the hourly cache written by updateNameCountCache, and falls back to a
 * direct Firestore aggregation if the functions backend is unreachable.
 * Firestore keeps serving on the free Spark plan, so the number survives an
 * outage that takes every Cloud Function down.
 *
 * Returns null only when both paths fail; callers render their own placeholder.
 */
export function useNameCount(): number | null {
  const [nameCount, setNameCount] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const response = await fetch(
          'https://us-central1-orbital-temple.cloudfunctions.net/getCachedNameCount'
        );
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.total) {
            if (!cancelled) setNameCount(data.total);
            return;
          }
        }
        throw new Error(`getCachedNameCount responded ${response.status}`);
      } catch (err) {
        console.error('Cached name count unavailable, counting directly:', err);
      }

      try {
        const { countNamesDirect } = await import('./firebaseClient');
        const total = await countNamesDirect();
        if (!cancelled) setNameCount(total);
      } catch (fallbackErr) {
        console.error('Direct name count also failed:', fallbackErr);
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, []);

  return nameCount;
}
