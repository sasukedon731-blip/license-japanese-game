"use client"

import { useCallback, useEffect, useState } from "react"
import AchievementUnlockToast, { type BadgeToastItem } from "./AchievementUnlockToast"
import { shiftAchievementToast } from "@/app/lib/achievementToastQueue"

export default function AchievementUnlockViewport() {
  const [item, setItem] = useState<BadgeToastItem | null>(null)
  const [visible, setVisible] = useState(false)

  const playNext = useCallback(() => {
    const next = shiftAchievementToast()
    if (!next) {
      setItem(null)
      setVisible(false)
      return
    }

    setItem(next)
    setVisible(true)

    window.setTimeout(() => {
      setVisible(false)
      window.setTimeout(() => {
        playNext()
      }, 260)
    }, 2200)
  }, [])

  useEffect(() => {
    playNext()
  }, [playNext])

  useEffect(() => {
    const onFocus = () => {
      if (!item) playNext()
    }
    window.addEventListener("focus", onFocus)
    return () => window.removeEventListener("focus", onFocus)
  }, [item, playNext])

  return <AchievementUnlockToast item={item} visible={visible} />
}
