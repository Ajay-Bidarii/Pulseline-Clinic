const WEEK = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export function ActivityChart({ data = [18, 24, 20, 30, 26, 14, 9] }) {
  const max = Math.max(...data);
  const width = 560;
  const height = 180;
  const barGap = 18;
  const barWidth = (width - barGap * (data.length - 1)) / data.length;

  return (
    <svg viewBox={`0 0 ${width} ${height + 28}`} className="w-full h-auto" role="img" aria-label="Weekly appointment volume">
      {data.map((value, i) => {
        const barHeight = (value / max) * height;
        const x = i * (barWidth + barGap);
        const y = height - barHeight;
        return (
          <g key={WEEK[i]}>
            <rect
              x={x}
              y={y}
              width={barWidth}
              height={barHeight}
              rx={8}
              fill={i === data.length - 2 ? "#146356" : "#B7DBCF"}
              className="transition-all duration-300"
            />
            <text
              x={x + barWidth / 2}
              y={height + 20}
              textAnchor="middle"
              fontSize="11"
              fill="#5B6D66"
              fontFamily="Inter, sans-serif"
            >
              {WEEK[i]}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
