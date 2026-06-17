import { useEffect, useMemo, useState } from 'react';
import { buildDashboardSummary, fetchAllPublicRepos, fetchGithubUser } from '@/api/github';
import { ApiError } from '@/api/http';
import type { DashboardSummary, GithubUser } from '@/types/github';

type DashboardResult =
  | { status: 'loading' }
  | { status: 'success'; user: GithubUser; summary: DashboardSummary }
  | { status: 'error'; message: string };

type DashboardState = { status: 'idle' } | DashboardResult;

const initialState: DashboardState = { status: 'idle' };

type DashboardCache = Record<string, Exclude<DashboardResult, { status: 'loading' }>>;

function getErrorMessage(error: unknown, username: string): string {
  if (error instanceof ApiError) {
    return error.status === 404
      ? `GitHub user "${username}" was not found.`
      : error.message;
  }

  return 'Something went wrong while loading GitHub data.';
}

export function useGithubDashboard(username: string) {
  const [cache, setCache] = useState<DashboardCache>({});

  useEffect(() => {
    if (!username || cache[username]) return;

    const controller = new AbortController();

    async function load() {
      try {
        const user = await fetchGithubUser(username, controller.signal);
        if (controller.signal.aborted) return;

        const repos = await fetchAllPublicRepos(username, controller.signal);
        if (controller.signal.aborted) return;

        setCache((current) => ({
          ...current,
          [username]: {
            status: 'success',
            user,
            summary: buildDashboardSummary(repos),
          },
        }));
      } catch (error) {
        if (controller.signal.aborted) return;

        setCache((current) => ({
          ...current,
          [username]: {
            status: 'error',
            message: getErrorMessage(error, username),
          },
        }));
      }
    }

    void load();

    return () => controller.abort();
  }, [username, cache]);

  return useMemo((): DashboardState => {
    if (!username) return initialState;
    return cache[username] ?? { status: 'loading' };
  }, [username, cache]);
}
