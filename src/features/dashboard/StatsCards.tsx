import type { DashboardSummary } from '@/types/github';
import { formatNumber } from '@/utils/format';

type StatsCardsProps = {
  summary: DashboardSummary;
  repoCount: number;
};

const cards = [
  { key: 'repos', label: 'Repositories' },
  { key: 'stars', label: 'Total stars' },
  { key: 'forks', label: 'Total forks' },
  { key: 'issues', label: 'Open issues' },
] as const;

export function StatsCards({ summary, repoCount }: StatsCardsProps) {
  const values: Record<(typeof cards)[number]['key'], number> = {
    repos: repoCount,
    stars: summary.totalStars,
    forks: summary.totalForks,
    issues: summary.totalOpenIssues,
  };

  return (
    <section className="stats-grid" aria-label="Repository summary">
      {cards.map((card) => (
        <article key={card.key} className="stat-card">
          <p className="stat-card__label">{card.label}</p>
          <p className="stat-card__value">{formatNumber(values[card.key])}</p>
        </article>
      ))}
    </section>
  );
}
