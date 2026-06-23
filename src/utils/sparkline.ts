type SparklineGeometry = {
  linePath: string;
  areaPath: string;
};

export function buildSparklineGeometry(
  values: number[],
  width: number,
  height: number,
  padding = 4,
): SparklineGeometry {
  if (values.length === 0) {
    return { linePath: '', areaPath: '' };
  }

  const max = Math.max(...values, 1);
  const innerHeight = height - padding * 2;
  const stepX = values.length > 1 ? width / (values.length - 1) : 0;
  const baseline = height - padding;

  const coordinates = values.map((value, index) => {
    const x = index * stepX;
    const y = baseline - (value / max) * innerHeight;
    return { x, y };
  });

  const linePath = coordinates
    .map((point, index) => `${index === 0 ? 'M' : 'L'}${point.x},${point.y}`)
    .join(' ');

  const first = coordinates[0];
  const last = coordinates[coordinates.length - 1];
  const areaPath = `${linePath} L${last.x},${baseline} L${first.x},${baseline} Z`;

  return { linePath, areaPath };
}
