import { Suspense } from "react"
import AppHeader from "@/app/components/AppHeader"
import styles from "../page.module.css"
import GameClient from "../GameClient"
import GameAccessGate from "../ui/GameAccessGate"

export default function GamePlayPage() {
  return (
    <div className={styles.gamePageOuter}>
      <div className={styles.gamePageInner}>
        <AppHeader title="ゲーム" />
        <Suspense fallback={null}>
          <GameAccessGate>
            <GameClient />
          </GameAccessGate>
        </Suspense>
      </div>
    </div>
  )
}
