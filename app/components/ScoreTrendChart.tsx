"use client"

type Point = {
  label: string
  score: number
}

function clampScore(value: number) {
  if (!Number.isFinite(value)) return 0
  return Math.max(0, Math.min(100, Math.round(value)))
}

export default function ScoreTrendChart({
  title,
  points,
}: {
  title: string
  points: Point[]
}) {
  const safePoints = points.map((p) => ({
    label: p.label,
    score: clampScore(p.score),
  }))

  if (safePoints.length === 0) {
    return null
  }

  if (safePoints.length === 1) {
    const only = safePoints[0]
    return (
      <div
        style={{
          background: "#ffffff",
          border: "1px solid #e5e7eb",
          borderRadius: 18,
          padding: 18,
          boxShadow: "0 10px 30px rgba(17,24,39,0.05)",
        }}
      >
        <div
          style={{
            fontSize: 16,
            fontWeight: 800,
            color: "#111827",
            marginBottom: 12,
          }}
        >
          {title}
        </div>

        <div
          style={{
            background: "#f9fafb",
            border: "1px solid #e5e7eb",
            borderRadius: 14,
            padding: 16,
          }}
        >
          <div
            style={{
              fontSize: 13,
              color: "#6b7280",
              fontWeight: 700,
              marginBottom: 6,
            }}
          >
            {only.label}
          </div>
          <div
            style={{
              fontSize: 32,
              color: "#111827",
              fontWeight: 900,
              lineHeight: 1,
            }}
          >
            {only.score}点
          </div>
        </div>
      </div>
    )
  }

  const width = 640
  const height = 220
  const paddingX = 30
  const paddingTop = 20
  const paddingBottom = 36

  const innerWidth = width - paddingX * 2
  const innerHeight = height - paddingTop - paddingBottom

  const toX = (index: number) => {
    if (safePoints.length === 1) return paddingX
    return paddingX + (innerWidth * index) / (safePoints.length - 1)
  }

  const toY = (score: number) => {
    return paddingTop + ((100 - score) / 100) * innerHeight
  }

  const polyline = safePoints
    .map((point, index) => `${toX(index)},${toY(point.score)}`)
    .join(" ")

  const gridScores = [100, 75, 50, 25, 0]

  return (
    <div
      style={{
        background: "#ffffff",
        border: "1px solid #e5e7eb",
        borderRadius: 18,
        padding: 18,
        boxShadow: "0 10px 30px rgba(17,24,39,0.05)",
      }}
    >
      <div
        style={{
          fontSize: 16,
          fontWeight: 800,
          color: "#111827",
          marginBottom: 12,
        }}
      >
        {title}
      </div>

      <div style={{ overflowX: "auto" }}>
        <svg
          viewBox={`0 0 ${width} ${height}`}
          style={{ width: "100%", minWidth: 520, display: "block" }}
        >
          {gridScores.map((score) => {
            const y = toY(score)
            return (
              <g key={score}>
                <line
                  x1={paddingX}
                  y1={y}
                  x2={width - paddingX}
                  y2={y}
                  stroke="#e5e7eb"
                  strokeWidth="1"
                />
                <text
                  x={6}
                  y={y + 4}
                  fontSize="11"
                  fill="#6b7280"
                  fontWeight="700"
                >
                  {score}
                </text>
              </g>
            )
          })}

          <polyline
            fill="none"
            stroke="#16a34a"
            strokeWidth="3"
            strokeLinejoin="round"
            strokeLinecap="round"
            points={polyline}
          />

          {safePoints.map((point, index) => {
            const x = toX(index)
            const y = toY(point.score)

            return (
              <g key={`${point.label}-${index}`}>
                <circle cx={x} cy={y} r="5" fill="#16a34a" />
                <text
                  x={x}
                  y={height - 10}
                  textAnchor="middle"
                  fontSize="11"
                  fill="#6b7280"
                  fontWeight="700"
                >
                  {point.label}
                </text>
                <text
                  x={x}
                  y={y - 10}
                  textAnchor="middle"
                  fontSize="11"
                  fill="#111827"
                  fontWeight="800"
                >
                  {point.score}
                </text>
              </g>
            )
          })}
        </svg>
      </div>
    </div>
  )
}