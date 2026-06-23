import { useEffect, useMemo, useState } from 'react';
import { buildGithubActivity, fetchGithubPublicEvents } from '@/api/github';
import { ApiError } from '@/api/http';
import type { ActivitySeries } from '@/types/github';

type ActivityResult =
  | { status: 'loading' }
  | { status: 'success'; activity: ActivitySeries }
  | { status: 'error'; message: string };

export type ActivityState = { status: 'idle' } | ActivityResult;

const initialState: ActivityState = { status: 'idle' };

type ActivityCache = Record<string, Exclude<ActivityResult, { status: 'loading' }>>;

function getErrorMessage(error: unknown): string {
  if (error instanceof ApiError) {
    return error.message;
  }

  return 'Unable to load recent activity.';
}

export function useGithubActivity(username: string) {
  const [cache, setCache] = useState<ActivityCache>({});

  useEffect(() => {
    if (!username || cache[username]) return;

    const controller = new AbortController();

    async function load() {
      try {
        const events = await fetchGithubPublicEvents(username, controller.signal);
        if (controller.signal.aborted) return;

        setCache((current) => ({
          ...current,
          [username]: {
            status: 'success',
            activity: buildGithubActivity(events),
          },
        }));
      } catch (error) {
        if (controller.signal.aborted) return;

        setCache((current) => ({
          ...current,
          [username]: {
            status: 'error',
            message: getErrorMessage(error),
          },
        }));
      }
    }

    void load();

    return () => controller.abort();
  }, [cache, username]);

  return useMemo((): ActivityState => {
    if (!username) return initialState;
    return cache[username] ?? { status: 'loading' };
  }, [cache, username]);
}
