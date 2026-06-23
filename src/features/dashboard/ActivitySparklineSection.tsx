import { StatusMessage } from '@/components/StatusMessage';
import { ActivitySparkline } from '@/features/dashboard/ActivitySparkline';
import type { ActivityState } from '@/hooks/useGithubActivity';

type ActivitySparklineSectionProps = {
  state: ActivityState;
};

export function ActivitySparklineSection({ state }: ActivitySparklineSectionProps) {
  if (state.status === 'idle' || state.status === 'loading') {
    return (
      <section className="panel activity-panel activity-panel--loading" aria-busy="true">
        <h3>Recent activity</h3>
        <div className="activity-panel__skeleton" />
      </section>
    );
  }

  if (state.status === 'error') {
    return (
      <StatusMessage
        title="Unable to load activity"
        description={state.message}
        tone="danger"
      />
    );
  }

  return <ActivitySparkline activity={state.activity} />;
}
