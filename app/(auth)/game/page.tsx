import styles from "./page.module.css"
import GameTopClient from "./ui/GameTopClient"
import GameAccessGate from "./ui/GameAccessGate"

export default function GameTopPage() {
  return (
    <div className={styles.gamePageOuter}>
      <div className={styles.gamePageInner}>
        <GameAccessGate>
          <GameTopClient />
        </GameAccessGate>
      </div>
    </div>
  )
}
