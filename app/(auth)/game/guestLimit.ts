// app/(auth)/game/guestLimit.ts

export const GUEST_LAST_PLAYED_KEY = 'guest-game-last-played'

function todayKey() {
  const d = new Date()
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export function canGuestPlayToday(): boolean {
  try {
    const last = localStorage.getItem(GUEST_LAST_PLAYED_KEY)
    return last !== todayKey()
  } catch {
    return true
  }
}

export function markGuestPlayedToday() {
  try {
    localStorage.setItem(GUEST_LAST_PLAYED_KEY, todayKey())
  } catch {}
}
