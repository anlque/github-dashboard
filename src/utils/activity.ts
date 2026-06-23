import type { ActivityPoint, ActivitySeries, GithubEvent } from '@/types/github';
import { ACTIVITY_WINDOW_DAYS } from '@/types/github';

const CONTRIBUTION_EVENT_TYPES = new Set([
  'PushEvent',
  'PullRequestEvent',
  'IssuesEvent',
  'CreateEvent',
  'DeleteEvent',
  'ReleaseEvent',
  'ForkEvent',
]);

function toUtcDateKey(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function buildDateBuckets(days: number): Map<string, number> {
  const buckets = new Map<string, number>();
  const end = new Date();
  end.setUTCHours(0, 0, 0, 0);

  const start = new Date(end);
  start.setUTCDate(start.getUTCDate() - (days - 1));

  for (let index = 0; index < days; index += 1) {
    const day = new Date(start);
    day.setUTCDate(start.getUTCDate() + index);
    buckets.set(toUtcDateKey(day), 0);
  }

  return buckets;
}

export function buildActivitySeries(
  events: GithubEvent[],
  days = ACTIVITY_WINDOW_DAYS,
): ActivitySeries {
  const buckets = buildDateBuckets(days);

  let totalEvents = 0;

  for (const event of events) {
    if (!CONTRIBUTION_EVENT_TYPES.has(event.type)) continue;

    const day = event.created_at.slice(0, 10);
    if (!buckets.has(day)) continue;

    buckets.set(day, (buckets.get(day) ?? 0) + 1);
    totalEvents += 1;
  }

  const points: ActivityPoint[] = Array.from(buckets.entries()).map(
    ([date, count]) => ({ date, count }),
  );

  return {
    points,
    totalEvents,
    peakCount: Math.max(...points.map((point) => point.count), 0),
  };
}
