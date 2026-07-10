import { Suspense } from "react"
import AppHeader from "@/app/components/AppHeader"
import styles from "../page.module.css"
import GameKindClient from "../ui/GameKindClient"

export default function GameKindPage() {
  return (
    <div className={styles.gamePageOuter}>
      <div className={styles.gamePageInner}>
        <AppHeader title="ゲーム" />

        <Suspense fallback={null}>
          <GameKindClient />
        </Suspense>
      </div>
    </div>
  )
}