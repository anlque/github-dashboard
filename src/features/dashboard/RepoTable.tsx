import { useMemo, useState } from 'react';
import { Pagination } from '@/components/Pagination';
import type { GithubRepo, GithubRepoSort } from '@/types/github';
import type { PaginationMeta } from '@/types/pagination';
import { formatDate, formatNumber } from '@/utils/format';

type RepoTableProps = {
  repos: GithubRepo[];
  pagination: PaginationMeta;
  query: string;
  sort: GithubRepoSort;
  isLoading?: boolean;
  onPageChange: (page: number) => void;
  onSortChange: (sort: GithubRepoSort) => void;
};

type ClientSortKey = GithubRepoSort | 'stargazers_count';

export function RepoTable({
  repos,
  pagination,
  query,
  sort,
  isLoading = false,
  onPageChange,
  onSortChange,
}: RepoTableProps) {
  const [clientSort, setClientSort] = useState<ClientSortKey>(sort);

  const visibleRepos = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    const filtered = normalizedQuery
      ? repos.filter((repo) => {
          const haystack = `${repo.name} ${repo.description ?? ''}`.toLowerCase();
          return haystack.includes(normalizedQuery);
        })
      : repos;

    if (clientSort !== 'stargazers_count') {
      return filtered;
    }

    return [...filtered].sort(
      (left, right) => right.stargazers_count - left.stargazers_count,
    );
  }, [clientSort, query, repos]);

  const handleSortChange = (nextSort: ClientSortKey) => {
    setClientSort(nextSort);

    if (nextSort !== 'stargazers_count') {
      onSortChange(nextSort);
    }
  };

  return (
    <section className="panel" aria-busy={isLoading}>
      <div className="panel__header">
        <div>
          <h3>Repositories</h3>
          {query.trim() && (
            <p className="panel__hint">Filtering repositories on this page.</p>
          )}
        </div>
        <label className="sort-control">
          <span>Sort by</span>
          <select
            value={clientSort}
            onChange={(event) =>
              handleSortChange(event.target.value as ClientSortKey)
            }
          >
            <option value="updated">Recently updated</option>
            <option value="created">Recently created</option>
            <option value="full_name">Name</option>
            <option value="stargazers_count">Stars (this page)</option>
          </select>
        </label>
      </div>

      {visibleRepos.length === 0 ? (
        <p className="panel__empty">
          {isLoading ? 'Loading repositories…' : 'No repositories match your filter.'}
        </p>
      ) : (
        <div className="table-wrap">
          <table className="repo-table">
            <thead>
              <tr>
                <th scope="col">Name</th>
                <th scope="col">Language</th>
                <th scope="col">Stars</th>
                <th scope="col">Forks</th>
                <th scope="col">Updated</th>
              </tr>
            </thead>
            <tbody>
              {visibleRepos.map((repo) => (
                <tr key={repo.id}>
                  <td>
                    <a href={repo.html_url} target="_blank" rel="noreferrer">
                      {repo.name}
                    </a>
                    {repo.description && (
                      <p className="repo-table__description">{repo.description}</p>
                    )}
                  </td>
                  <td>{repo.language ?? '—'}</td>
                  <td>{formatNumber(repo.stargazers_count)}</td>
                  <td>{formatNumber(repo.forks_count)}</td>
                  <td>{formatDate(repo.updated_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Pagination pagination={pagination} onPageChange={onPageChange} />
    </section>
  );
}
