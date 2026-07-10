import { arrayUnion, doc, getDoc, setDoc } from "firebase/firestore"
import { db } from "@/app/lib/firebase"
import { computeUnlockedBadges, type BadgeDef, getBadgeMeta } from "@/app/lib/badges"

export type AchievementState = {
  totalAnswers?: number
  listeningAnswers?: number
  gamePlays?: number
  attackPlays?: number
  tileDropClears?: number
  flashJudgeClears?: number
  memoryBurstClears?: number
  examClears?: number
  reviewPlays?: number
  maxScore?: number
  streak?: number
  industryCounts?: Partial<Record<"driver", number>>
}

export async function unlockAchievementsForUser(uid: string, state: AchievementState): Promise<BadgeDef[]> {
  const userRef = doc(db, "users", uid)
  const snap = await getDoc(userRef)
  const currentBadges = Array.isArray(snap.data()?.badges)
    ? snap.data()!.badges.filter((x: unknown): x is string => typeof x === "string")
    : []

  const newBadgeIds = computeUnlockedBadges(currentBadges, state)
  if (!newBadgeIds.length) return []

  await setDoc(
    userRef,
    {
      badges: arrayUnion(...newBadgeIds),
      badgeUpdatedAt: Date.now(),
    },
    { merge: true }
  )

  return newBadgeIds.map((id) => getBadgeMeta(id))
}
