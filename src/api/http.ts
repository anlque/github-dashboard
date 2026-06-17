import { readCache, writeCache } from '@/api/cache';
import type { PagedResult } from '@/types/pagination';
import { formatRateLimitMessage } from '@/utils/rateLimit';
import { buildPaginationMeta } from '@/utils/pagination';

export class ApiError extends Error {
  readonly status: number;
  readonly rateLimitReset: number | null;

  constructor(message: string, status: number, rateLimitReset: number | null = null) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.rateLimitReset = rateLimitReset;
  }
}

const API_BASE = '/api/github';

const inflightRequests = new Map<string, Promise<unknown>>();

function getRateLimitReset(response: Response): number | null {
  const reset = response.headers.get('X-RateLimit-Reset');
  if (!reset) return null;

  const unixSeconds = Number(reset);
  return Number.isFinite(unixSeconds) ? unixSeconds * 1000 : null;
}

function buildApiError(response: Response, message: string): ApiError {
  const rateLimitReset = getRateLimitReset(response);
  const isRateLimited =
    response.status === 403 && message.toLowerCase().includes('rate limit');

  const finalMessage = isRateLimited
    ? formatRateLimitMessage(message, rateLimitReset)
    : message;

  return new ApiError(finalMessage, response.status, rateLimitReset);
}

async function request(path: string, signal?: AbortSignal): Promise<Response> {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: {
      Accept: 'application/vnd.github+json',
    },
    signal,
  });

  if (!response.ok) {
    const fallback = `Request failed with status ${response.status}`;
    let message = fallback;

    try {
      const body = (await response.json()) as { message?: string };
      message = body.message ?? fallback;
    } catch {
      // github occasionally returns non JSON error bodies
    }

    throw buildApiError(response, message);
  }

  return response;
}

async function fetchWithCache<T>(
  path: string,
  signal: AbortSignal | undefined,
  parser: (response: Response) => Promise<T>,
): Promise<T> {
  if (!signal) {
    const cached = readCache<T>(path);
    if (cached) return cached;

    const inflight = inflightRequests.get(path);
    if (inflight) return inflight as Promise<T>;
  }

  const requestPromise = (async () => {
    const response = await request(path, signal);
    const data = await parser(response);

    if (!signal) {
      writeCache(path, data);
    }

    return data;
  })();

  if (!signal) {
    inflightRequests.set(path, requestPromise);
  }

  try {
    return await requestPromise;
  } finally {
    if (!signal) {
      inflightRequests.delete(path);
    }
  }
}

export async function getJson<T>(path: string, signal?: AbortSignal): Promise<T> {
  return fetchWithCache(path, signal, (response) => response.json() as Promise<T>);
}

export async function getPagedJson<T>(
  path: string,
  page: number,
  perPage: number,
  signal?: AbortSignal,
): Promise<PagedResult<T>> {
  return fetchWithCache(path, signal, async (response) => {
    const data = (await response.json()) as T;

    return {
      data,
      pagination: buildPaginationMeta(response.headers.get('Link'), page, perPage),
    };
  });
}
