import { getJson, getPagedJson } from '@/api/http';
import type {
  ActivitySeries,
  DashboardSummary,
  GithubEvent,
  GithubRepo,
  GithubRepoSort,
  GithubUser,
} from '@/types/github';
import { buildActivitySeries } from '@/utils/activity';
import { GITHUB_REPOS_PER_PAGE } from '@/types/github';
import { buildLanguageStats } from '@/utils/languages';

const MAX_SUMMARY_REPO_PAGES = 3;

type FetchReposPageOptions = {
  page: number;
  perPage?: number;
  sort: GithubRepoSort;
};

function buildReposPath(username: string, options: FetchReposPageOptions): string {
  const query = new URLSearchParams({
    per_page: String(options.perPage ?? GITHUB_REPOS_PER_PAGE),
    page: String(options.page),
    sort: options.sort,
    type: 'owner',
  });

  return `/users/${encodeURIComponent(username)}/repos?${query}`;
}

export function fetchGithubUser(
  username: string,
  signal?: AbortSignal,
): Promise<GithubUser> {
  return getJson<GithubUser>(`/users/${encodeURIComponent(username)}`, signal);
}

export function fetchGithubReposPage(
  username: string,
  options: FetchReposPageOptions,
  signal?: AbortSignal,
) {
  return getPagedJson<GithubRepo[]>(
    buildReposPath(username, options),
    options.page,
    options.perPage ?? GITHUB_REPOS_PER_PAGE,
    signal,
  );
}

export async function fetchAllPublicRepos(
  username: string,
  signal?: AbortSignal,
): Promise<GithubRepo[]> {
  const repos: GithubRepo[] = [];
  let page = 1;
  let pagesFetched = 0;

  while (pagesFetched < MAX_SUMMARY_REPO_PAGES) {
    const result = await fetchGithubReposPage(
      username,
      { page, perPage: 100, sort: 'updated' },
      signal,
    );

    repos.push(...result.data.filter((repo) => !repo.private));
    pagesFetched += 1;

    if (!result.pagination.hasNext) break;
    page += 1;
  }

  return repos;
}

export function fetchGithubPublicEvents(
  username: string,
  signal?: AbortSignal,
): Promise<GithubEvent[]> {
  const query = new URLSearchParams({ per_page: '100' });

  return getJson<GithubEvent[]>(
    `/users/${encodeURIComponent(username)}/events/public?${query}`,
    signal,
  );
}

export function buildGithubActivity(events: GithubEvent[]): ActivitySeries {
  return buildActivitySeries(events);
}

export function buildDashboardSummary(repos: GithubRepo[]): DashboardSummary {
  return {
    totalStars: repos.reduce((sum, repo) => sum + repo.stargazers_count, 0),
    totalForks: repos.reduce((sum, repo) => sum + repo.forks_count, 0),
    totalOpenIssues: repos.reduce(
      (sum, repo) => sum + repo.open_issues_count,
      0,
    ),
    languages: buildLanguageStats(repos),
  };
}
