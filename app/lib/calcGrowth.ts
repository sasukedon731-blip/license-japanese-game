export function calcGrowth(scores: number[]) {
  if (scores.length === 0) return null

  const recent = scores.slice(0, 5)
  const prev = scores.slice(5, 10)

  const avgRecent =
    recent.reduce((a, b) => a + b, 0) / recent.length

  const avgPrev =
    prev.length > 0
      ? prev.reduce((a, b) => a + b, 0) / prev.length
      : avgRecent

  const diff = avgRecent - avgPrev

  return {
    avgRecent: Math.round(avgRecent),
    avgPrev: Math.round(avgPrev),
    diff: Math.round(diff),
  }
}