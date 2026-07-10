import styles from "./page.module.css"
import GameTopClient from "./ui/GameTopClient"

export default function GameTopPage() {
  return (
    <div className={styles.gamePageOuter}>
      <div className={styles.gamePageInner}>
        <GameTopClient />
      </div>
    </div>
  )
}