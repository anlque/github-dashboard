import { useMemo, useState } from 'react';
import { LoadingSkeleton } from '@/components/LoadingSkeleton';
import { StatusMessage } from '@/components/StatusMessage';
import { ActivitySparklineSection } from '@/features/dashboard/ActivitySparklineSection';
import { LanguageBreakdown } from '@/features/dashboard/LanguageBreakdown';
import { ProfileHeader } from '@/features/dashboard/ProfileHeader';
import { RepoTable } from '@/features/dashboard/RepoTable';
import { SearchForm } from '@/features/dashboard/SearchForm';
import { StatsCards } from '@/features/dashboard/StatsCards';
import { useDebounce } from '@/hooks/useDebounce';
import { useGithubActivity } from '@/hooks/useGithubActivity';
import { useGithubDashboard } from '@/hooks/useGithubDashboard';
import { useGithubRepos } from '@/hooks/useGithubRepos';
import type { GithubRepoSort } from '@/types/github';
import type { PaginationMeta } from '@/types/pagination';

const DEFAULT_USERNAME = 'vercel';
const DEFAULT_SORT: GithubRepoSort = 'updated';

const emptyPagination: PaginationMeta = {
  page: 1,
  perPage: 10,
  hasNext: false,
  hasPrev: false,
  totalPages: null,
};

export function DashboardPage() {
  const [inputValue, setInputValue] = useState(DEFAULT_USERNAME);
  const [activeUsername, setActiveUsername] = useState(DEFAULT_USERNAME);
  const [repoFilter, setRepoFilter] = useState('');
  const [repoPage, setRepoPage] = useState(1);
  const [repoSort, setRepoSort] = useState<GithubRepoSort>(DEFAULT_SORT);
  const debouncedRepoFilter = useDebounce(repoFilter);

  const dashboard = useGithubDashboard(activeUsername);
  const activityState = useGithubActivity(activeUsername);
  const reposQuery = useMemo(
    () =>
      dashboard.status === 'success'
        ? { username: activeUsername, page: repoPage, sort: repoSort }
        : null,
    [activeUsername, dashboard.status, repoPage, repoSort],
  );
  const reposState = useGithubRepos(reposQuery);

  const handleSearch = () => {
    const username = inputValue.trim();
    if (!username) return;

    setRepoPage(1);
    setRepoSort(DEFAULT_SORT);
    setRepoFilter('');
    setActiveUsername(username);
  };

  const handleSortChange = (sort: GithubRepoSort) => {
    setRepoSort(sort);
    setRepoPage(1);
  };

  return (
    <div className="dashboard">
      <SearchForm
        value={inputValue}
        onChange={setInputValue}
        onSubmit={handleSearch}
      />

      {dashboard.status === 'idle' ? (
        <StatusMessage
          title="Search a GitHub profile"
          description="Enter a public username to load profile stats, language breakdown, and repository activity."
        />
      ) : null}

      {dashboard.status === 'loading' ? <LoadingSkeleton /> : null}

      {dashboard.status === 'error' ? (
        <StatusMessage
          title="Unable to load dashboard"
          description={dashboard.message}
          tone="danger"
        />
      ) : null}

      {dashboard.status === 'success' ? (
        <>
          <ProfileHeader user={dashboard.user} />
          <StatsCards
            summary={dashboard.summary}
            repoCount={dashboard.user.public_repos}
          />

          <ActivitySparklineSection state={activityState} />

          <div className="dashboard__split">
            <LanguageBreakdown languages={dashboard.summary.languages} />
            <section className="panel">
              <h3>Filter repositories</h3>
              <input
                className="filter-input"
                type="search"
                placeholder="Search by name or description"
                value={repoFilter}
                onChange={(event) => setRepoFilter(event.target.value)}
              />
            </section>
          </div>

          {reposState.status === 'error' ? (
            <StatusMessage
              title="Unable to load repositories"
              description={reposState.message}
              tone="danger"
            />
          ) : (
            <RepoTable
              key={activeUsername}
              repos={reposState.status === 'success' ? reposState.repos : []}
              pagination={
                reposState.status === 'success'
                  ? reposState.pagination
                  : { ...emptyPagination, page: repoPage }
              }
              query={debouncedRepoFilter}
              sort={repoSort}
              isLoading={reposState.status === 'loading'}
              onPageChange={setRepoPage}
              onSortChange={handleSortChange}
            />
          )}
        </>
      ) : null}
    </div>
  );
}
