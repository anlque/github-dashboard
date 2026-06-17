export type GithubUser = {
  login: string;
  name: string | null;
  avatar_url: string;
  html_url: string;
  bio: string | null;
  public_repos: number;
  followers: number;
  following: number;
  created_at: string;
};

export type GithubRepo = {
  id: number;
  name: string;
  html_url: string;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  open_issues_count: number;
  updated_at: string;
  private: boolean;
};

export type GithubEvent = {
  id: string;
  type: string;
  created_at: string;
  repo: {
    name: string;
  };
};

export type ActivityPoint = {
  date: string;
  count: number;
};

export type ActivitySeries = {
  points: ActivityPoint[];
  totalEvents: number;
  peakCount: number;
};

export type LanguageStat = {
  language: string;
  count: number;
  percentage: number;
};

export type DashboardSummary = {
  totalStars: number;
  totalForks: number;
  totalOpenIssues: number;
  languages: LanguageStat[];
};

export type GithubRepoSort = 'updated' | 'full_name' | 'created';

export const GITHUB_REPOS_PER_PAGE = 10;
export const ACTIVITY_WINDOW_DAYS = 90;
