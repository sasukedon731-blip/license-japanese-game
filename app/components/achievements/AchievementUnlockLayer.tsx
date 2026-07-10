"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import AchievementUnlockToast, { type BadgeToastItem } from "./AchievementUnlockToast"

export default function AchievementUnlockLayer({
  initialItems = [],
}: {
  initialItems?: BadgeToastItem[]
}) {
  const [queue, setQueue] = useState<BadgeToastItem[]>(initialItems)
  const [visible, setVisible] = useState(false)

  const item = useMemo(() => (queue.length ? queue[0] : null), [queue])

  const playNext = useCallback(() => {
    if (!queue.length) {
      setVisible(false)
      return
    }

    setVisible(true)

    const hideTimer = window.setTimeout(() => {
      setVisible(false)

      window.setTimeout(() => {
        setQueue((prev) => prev.slice(1))
      }, 260)
    }, 2200)

    return () => window.clearTimeout(hideTimer)
  }, [queue])

  useEffect(() => {
    if (!item) return
    const cleanup = playNext()
    return cleanup
  }, [item, playNext])

  if (!item) return null

  return <AchievementUnlockToast item={item} visible={visible} />
}
