const STORAGE_KEY = "achievement-toast-queue"

export type QueuedAchievementToast = {
  id: string
  icon: string
  label: string
  rarity?: "common" | "rare" | "epic" | "legend"
}

function readQueue(): QueuedAchievementToast[] {
  if (typeof window === "undefined") return []
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function writeQueue(items: QueuedAchievementToast[]) {
  if (typeof window === "undefined") return
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  } catch {}
}

export function enqueueAchievementToasts(items: QueuedAchievementToast[]) {
  if (!items.length) return
  const current = readQueue()
  writeQueue([...current, ...items])
}

export function shiftAchievementToast(): QueuedAchievementToast | null {
  const current = readQueue()
  if (!current.length) return null
  const first = current[0]
  writeQueue(current.slice(1))
  return first
}
