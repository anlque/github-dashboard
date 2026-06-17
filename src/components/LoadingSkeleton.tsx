export function LoadingSkeleton() {
  return (
    <div className="skeleton" aria-live="polite" aria-busy="true">
      <div className="skeleton__profile" />
      <div className="skeleton__grid">
        <div />
        <div />
        <div />
      </div>
      <div className="skeleton__panel" />
      <div className="skeleton__panel skeleton__panel--tall" />
    </div>
  );
}
