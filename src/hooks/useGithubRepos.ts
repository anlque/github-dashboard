import { useEffect, useMemo, useState } from 'react';
import { fetchGithubReposPage } from '@/api/github';
import { ApiError } from '@/api/http';
import type { GithubRepo, GithubRepoSort } from '@/types/github';
import type { PaginationMeta } from '@/types/pagination';

type ReposResult =
  | { status: 'loading' }
  | { status: 'success'; repos: GithubRepo[]; pagination: PaginationMeta }
  | { status: 'error'; message: string };

type ReposState = { status: 'idle' } | ReposResult;

const initialState: ReposState = { status: 'idle' };

type ReposQuery = {
  username: string;
  page: number;
  sort: GithubRepoSort;
};

type ReposCache = Record<string, Exclude<ReposResult, { status: 'loading' }>>;

function getCacheKey({ username, page, sort }: ReposQuery): string {
  return `${username}:${page}:${sort}`;
}

function getErrorMessage(error: unknown): string {
  if (error instanceof ApiError) {
    return error.message;
  }

  return 'Unable to load repositories for this page.';
}

export function useGithubRepos(query: ReposQuery | null) {
  const [cache, setCache] = useState<ReposCache>({});

  const cacheKey = query ? getCacheKey(query) : '';
  const username = query?.username;
  const page = query?.page;
  const sort = query?.sort;

  useEffect(() => {
    if (!username || page === undefined || !sort || cache[cacheKey]) return;

    const request = { username, page, sort };
    const controller = new AbortController();

    async function load() {
      try {
        const result = await fetchGithubReposPage(
          request.username,
          { page: request.page, sort: request.sort },
          controller.signal,
        );

        if (controller.signal.aborted) return;

        setCache((current) => ({
          ...current,
          [cacheKey]: {
            status: 'success',
            repos: result.data.filter((repo) => !repo.private),
            pagination: result.pagination,
          },
        }));
      } catch (error) {
        if (controller.signal.aborted) return;

        setCache((current) => ({
          ...current,
          [cacheKey]: {
            status: 'error',
            message: getErrorMessage(error),
          },
        }));
      }
    }

    void load();

    return () => controller.abort();
  }, [cache, cacheKey, page, sort, username]);

  return useMemo((): ReposState => {
    if (!query) return initialState;
    return cache[cacheKey] ?? { status: 'loading' };
  }, [cache, cacheKey, query]);
}
