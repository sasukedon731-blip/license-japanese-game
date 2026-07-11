"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { onAuthStateChanged } from "firebase/auth"
import { collection, doc, getDoc, getDocs, limit, orderBy, query } from "firebase/firestore"

import { auth, db } from "@/app/lib/firebase"
import AppHeader from "@/app/components/AppHeader"
import BillingStatusCard from "@/app/components/billing/BillingStatusCard"
import type { BillingLike } from "@/app/lib/billingAccess"

const LICENSE_TYPES = new Set(["gaikoku-license", "road-signs"])
const JAPANESE_TYPES = new Set([
  "japanese-n4", "japanese-n3", "japanese-n2", "genba-listening", "genba-phrasebook",
  "confusing-japanese", "kansai-listening", "dialect-listening", "dialect-meaning",
])

const QUIZ_LABELS: Record<string, string> = {
  "gaikoku-license": "外免切替の知識", "road-signs": "道路標識", "japanese-n4": "JLPT N4",
  "japanese-n3": "JLPT N3", "japanese-n2": "JLPT N2", "genba-listening": "生活・現場リスニング",
  "genba-phrasebook": "よく使う日本語フレーズ", "confusing-japanese": "まぎらわしい日本語",
  "kansai-listening": "関西弁リスニング", "dialect-listening": "方言リスニング", "dialect-meaning": "全国方言 意味あて",
}

type ProgressDoc = {
  id: string
  totalSessions: number
  todaySessions: number
  lastStudyDate: string
  streak: number
  bestStreak: number
}

type ResultDoc = {
  id: string
  quizType: string
  mode: string
  score: number
  total: number
  createdAt?: { toDate?: () => Date } | null
}

type UserStats = {
  jlptBattleXp: number
  jlptBattleLevel: number
  badges: string[]
}

function toNumber(value: unknown) { return typeof value === "number" && Number.isFinite(value) ? value : 0 }
function formatDate(value: string) {
  if (!value) return "まだありません"
  const [y, m, d] = value.split("-")
  return y && m && d ? `${y}/${m}/${d}` : value
}
function formatTimestamp(value: ResultDoc["createdAt"]) {
  const date = value?.toDate?.()
  if (!date) return "日時不明"
  return new Intl.DateTimeFormat("ja-JP", { timeZone: "Asia/Tokyo", month: "numeric", day: "numeric", hour: "2-digit", minute: "2-digit" }).format(date)
}

export default function MyPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [displayName, setDisplayName] = useState("")
  const [email, setEmail] = useState("")
  const [billing, setBilling] = useState<BillingLike | null>(null)
  const [progress, setProgress] = useState<ProgressDoc[]>([])
  const [results, setResults] = useState<ResultDoc[]>([])
  const [stats, setStats] = useState<UserStats>({ jlptBattleXp: 0, jlptBattleLevel: 1, badges: [] })
  const [loadError, setLoadError] = useState("")

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) { router.replace("/login"); return }
      setLoading(true)
      setLoadError("")
      try {
        const userRef = doc(db, "users", user.uid)
        const [userSnap, progressSnap, resultsSnap] = await Promise.all([
          getDoc(userRef),
          getDocs(collection(db, "users", user.uid, "progress")),
          getDocs(query(collection(db, "users", user.uid, "results"), orderBy("createdAt", "desc"), limit(12))),
        ])
        const data = userSnap.exists() ? userSnap.data() : {}
        setDisplayName(data?.displayName || user.displayName || "")
        setEmail(user.email || data?.email || "")
        setBilling((data?.billing ?? null) as BillingLike | null)
        setStats({
          jlptBattleXp: toNumber(data?.jlptBattleXp),
          jlptBattleLevel: Math.max(1, toNumber(data?.jlptBattleLevel) || 1),
          badges: Array.isArray(data?.badges) ? data.badges.filter((x: unknown): x is string => typeof x === "string") : [],
        })
        setProgress(progressSnap.docs.map((item) => {
          const p = item.data()
          return {
            id: item.id,
            totalSessions: toNumber(p.totalSessions), todaySessions: toNumber(p.todaySessions),
            lastStudyDate: typeof p.lastStudyDate === "string" ? p.lastStudyDate : "",
            streak: toNumber(p.streak), bestStreak: toNumber(p.bestStreak),
          }
        }))
        setResults(resultsSnap.docs.map((item) => {
          const r = item.data()
          return { id: item.id, quizType: String(r.quizType ?? ""), mode: String(r.mode ?? "exam"), score: toNumber(r.score), total: toNumber(r.total), createdAt: r.createdAt ?? null }
        }))
      } catch (error) {
        console.error("Failed to load mypage progress:", error)
        setLoadError("一部の学習記録を読み込めませんでした。再読み込みをお試しください。")
      } finally { setLoading(false) }
    })
    return () => unsub()
  }, [router])

  const summary = useMemo(() => {
    const totalSessions = progress.reduce((sum, p) => sum + p.totalSessions, 0)
    const totalScore = results.reduce((sum, r) => sum + r.score, 0)
    const totalQuestions = results.reduce((sum, r) => sum + r.total, 0)
    const accuracy = totalQuestions > 0 ? Math.round((totalScore / totalQuestions) * 100) : null
    const lastStudyDate = progress.map((p) => p.lastStudyDate).filter(Boolean).sort().reverse()[0] ?? ""
    const currentStreak = Math.max(0, ...progress.map((p) => p.streak))
    return { totalSessions, accuracy, lastStudyDate, currentStreak }
  }, [progress, results])

  const categories = useMemo(() => {
    const collect = (types: Set<string>) => {
      const rows = progress.filter((p) => types.has(p.id))
      const sessions = rows.reduce((sum, p) => sum + p.totalSessions, 0)
      const latest = rows.map((p) => p.lastStudyDate).filter(Boolean).sort().reverse()[0] ?? ""
      return { sessions, latest, learned: rows.filter((p) => p.totalSessions > 0).length, total: types.size }
    }
    return [
      { title: "外免切替対策", icon: "🚘", href: "/select-mode?group=license", ...collect(LICENSE_TYPES) },
      { title: "日本語学習", icon: "📘", href: "/select-mode?group=japanese", ...collect(JAPANESE_TYPES) },
      { title: "反復ゲーム", icon: "🎮", href: "/game", sessions: stats.jlptBattleXp > 0 ? 1 : 0, latest: "", learned: stats.jlptBattleLevel > 1 ? 1 : 0, total: 1 },
    ]
  }, [progress, stats])

  if (loading) return <main className="mypagePage"><div className="mypageShell">読み込み中...</div></main>

  return (
    <main className="mypagePage">
      <div className="mypageShell">
        <AppHeader title="マイページ" />

        <section className="mypageProfile">
          <div className="mypageAvatar">{(displayName || email || "U").slice(0, 1).toUpperCase()}</div>
          <div className="mypageProfileText"><span>WELCOME BACK</span><h1>{displayName || "ユーザー"} さん</h1><p>{email}</p></div>
          <Link href="/select-mode" className="mypagePrimaryButton">学習を始める</Link>
        </section>

        {loadError ? <div className="mypageError">{loadError}</div> : null}
        <BillingStatusCard billing={billing} />

        <section className="mypageSummaryGrid" aria-label="学習サマリー">
          <SummaryCard label="学習回数" value={`${summary.totalSessions}回`} sub="完了した学習セッション" icon="✓" />
          <SummaryCard label="平均正答率" value={summary.accuracy === null ? "—" : `${summary.accuracy}%`} sub="模擬試験の実績" icon="%" />
          <SummaryCard label="連続学習" value={`${summary.currentStreak}日`} sub="現在のストリーク" icon="🔥" />
          <SummaryCard label="最終学習日" value={formatDate(summary.lastStudyDate)} sub="最後に学習した日" icon="◷" compact />
        </section>

        <div className="mypageTwoColumn">
          <section className="mypagePanel">
            <div className="mypageSectionHead"><div><span>LEARNING PROGRESS</span><h2>カテゴリ別の進捗</h2></div></div>
            <div className="mypageCategoryList">
              {categories.map((category) => {
                const percent = category.total > 0 ? Math.min(100, Math.round((category.learned / category.total) * 100)) : 0
                return <Link key={category.title} href={category.href} className="mypageCategoryCard">
                  <div className="mypageCategoryIcon">{category.icon}</div>
                  <div className="mypageCategoryMain">
                    <div className="mypageCategoryTop"><strong>{category.title}</strong><span>{category.sessions}回</span></div>
                    <div className="mypageProgressTrack"><span style={{ width: `${percent}%` }}/></div>
                    <div className="mypageCategoryMeta"><span>{category.learned}/{category.total} 教材を学習</span><span>{category.latest ? `最終 ${formatDate(category.latest)}` : "学習記録なし"}</span></div>
                  </div><span className="mypageChevron">›</span>
                </Link>
              })}
            </div>
          </section>

          <section className="mypagePanel">
            <div className="mypageSectionHead"><div><span>GAME & BADGES</span><h2>ゲーム実績</h2></div><Link href="/mypage/achievements">バッジを見る</Link></div>
            <div className="mypageGameHero"><div><span>日本語バトル</span><strong>LEVEL {stats.jlptBattleLevel}</strong><small>累計 {stats.jlptBattleXp.toLocaleString()} XP</small></div><div className="mypageGameBadge">🏆</div></div>
            <div className="mypageMiniStats"><div><strong>{stats.badges.length}</strong><span>獲得バッジ</span></div><div><strong>{stats.jlptBattleLevel}</strong><span>ゲームレベル</span></div></div>
            <Link href="/game" className="mypageSecondaryButton">ゲームをプレイ</Link>
          </section>
        </div>

        <section className="mypagePanel mypageHistoryPanel">
          <div className="mypageSectionHead"><div><span>RECENT ACTIVITY</span><h2>最近の学習履歴</h2></div></div>
          {results.length === 0 ? <div className="mypageEmpty"><strong>まだ学習履歴がありません</strong><p>模擬試験を完了すると、ここに正答率と日時が表示されます。</p></div> :
            <div className="mypageHistoryList">{results.slice(0, 8).map((r) => {
              const accuracy = r.total > 0 ? Math.round((r.score / r.total) * 100) : 0
              return <div className="mypageHistoryRow" key={r.id}><div className="mypageHistoryMark">{accuracy >= 80 ? "✓" : "•"}</div><div className="mypageHistoryText"><strong>{QUIZ_LABELS[r.quizType] ?? r.quizType ?? "学習"}</strong><span>{r.mode === "exam" ? "模擬試験" : r.mode}・{formatTimestamp(r.createdAt)}</span></div><div className="mypageHistoryScore"><strong>{accuracy}%</strong><span>{r.score}/{r.total}</span></div></div>
            })}</div>}
        </section>
      </div>
    </main>
  )
}

function SummaryCard({ label, value, sub, icon, compact = false }: { label: string; value: string; sub: string; icon: string; compact?: boolean }) {
  return <div className="mypageSummaryCard"><div className="mypageSummaryIcon">{icon}</div><div><span>{label}</span><strong className={compact ? "compact" : ""}>{value}</strong><small>{sub}</small></div></div>
}
