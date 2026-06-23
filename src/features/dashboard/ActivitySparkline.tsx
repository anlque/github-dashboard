import { Sparkline } from '@/components/Sparkline';
import type { ActivitySeries } from '@/types/github';
import { ACTIVITY_WINDOW_DAYS } from '@/types/github';
import { formatDate, formatNumber } from '@/utils/format';

type ActivitySparklineProps = {
  activity: ActivitySeries;
};

export function ActivitySparkline({ activity }: ActivitySparklineProps) {
  const { points, totalEvents, peakCount } = activity;
  const firstDate = points[0]?.date;
  const lastDate = points[points.length - 1]?.date;

  const label =
    totalEvents === 0
      ? `No public GitHub activity in the last ${ACTIVITY_WINDOW_DAYS} days.`
      : `${formatNumber(totalEvents)} public GitHub events over the last ${ACTIVITY_WINDOW_DAYS} days, peaking at ${peakCount} events in one day.`;

  return (
    <section className="panel activity-panel" aria-label="Recent activity">
      <div className="activity-panel__header">
        <div>
          <h3>Recent activity</h3>
          <p className="activity-panel__subtitle">
            Public events over the last {ACTIVITY_WINDOW_DAYS} days
          </p>
        </div>
        <dl className="activity-panel__stats">
          <div>
            <dt>Events</dt>
            <dd>{formatNumber(totalEvents)}</dd>
          </div>
          <div>
            <dt>Peak day</dt>
            <dd>{formatNumber(peakCount)}</dd>
          </div>
        </dl>
      </div>

      {totalEvents === 0 ? (
        <p className="panel__empty">No recent public activity to chart.</p>
      ) : (
        <>
          <Sparkline points={points} label={label} />
          {firstDate && lastDate ? (
            <div className="activity-panel__range" aria-hidden="true">
              <span>{formatDate(firstDate)}</span>
              <span>{formatDate(lastDate)}</span>
            </div>
          ) : null}
        </>
      )}
    </section>
  );
}
