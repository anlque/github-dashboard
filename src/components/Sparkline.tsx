import { useMemo } from 'react';
import type { ActivityPoint } from '@/types/github';
import { buildSparklineGeometry } from '@/utils/sparkline';

type SparklineProps = {
  points: ActivityPoint[];
  label: string;
  width?: number;
  height?: number;
};

const DEFAULT_WIDTH = 640;
const DEFAULT_HEIGHT = 72;

export function Sparkline({
  points,
  label,
  width = DEFAULT_WIDTH,
  height = DEFAULT_HEIGHT,
}: SparklineProps) {
  const values = useMemo(() => points.map((point) => point.count), [points]);

  const geometry = useMemo(
    () => buildSparklineGeometry(values, width, height),
    [height, values, width],
  );

  if (points.length === 0) {
    return null;
  }

  return (
    <svg
      className="sparkline"
      viewBox={`0 0 ${width} ${height}`}
      width="100%"
      height={height}
      role="img"
      aria-label={label}
      preserveAspectRatio="none"
    >
      <title>{label}</title>
      {geometry.areaPath ? (
        <path className="sparkline__area" d={geometry.areaPath} />
      ) : null}
      {geometry.linePath ? (
        <path className="sparkline__line" d={geometry.linePath} />
      ) : null}
    </svg>
  );
}
