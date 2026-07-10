'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import QuizLayout from '@/app/components/QuizLayout'
import Button from '@/app/components/Button'
import ListeningControls from '@/app/components/ListeningControls'
import AudioPlayerButton from '@/app/components/AudioPlayerButton'
import QuestionImage from '@/app/components/QuestionImage'
import type { Quiz, QuizType, Question } from '@/app/data/types'
import { formatCorrectAnswerLabels, getCorrectIndexes, isCorrectSelection, isMultiAnswerQuestion, isSelectionComplete, requiredAnswerCount, shuffleQuestionChoices as shuffleQuestionChoicesWithAnswers, stripLeadingAnswerLabel } from '@/app/lib/questionAnswer'

import { useAuth } from '@/app/lib/useAuth'
import { db } from '@/app/lib/firebase'
import { doc, setDoc, serverTimestamp } from 'firebase/firestore'
import { unlockAchievementsForUser } from '@/app/lib/achievementUnlock'
import { enqueueAchievementToasts } from '@/app/lib/achievementToastQueue'

// ✅ 離脱/中断で読み上げ停止
import { stopSpeak } from '@/app/lib/tts'

const STORAGE_PROGRESS_KEY = 'progress'
const STORAGE_WRONG_KEY = 'wrong'
const STORAGE_NORMAL_SESSION_KEY = 'normal-session'
const STORAGE_STUDY_PROGRESS_PREFIX = 'study-progress'

// ✅ 分野選択の保存
const STORAGE_NORMAL_SECTION_PREFIX = 'normal-section'

type Props = {
  quiz: Quiz
}

type StudyProgress = {
  totalSessions: number
  todaySessions: number
  lastStudyDate: string
  streak: number
  streakUpdatedDate: string
  bestStreak: number
}

// ---------- util ----------
function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function buildRandomQuestions(questions: Question[]): Question[] {
  return shuffleArray(questions.map((q) => shuffleQuestionChoicesWithAnswers(q, shuffleArray)))
}

function todayKey() {
  // NOTE: 既存仕様維持（UTC基準）
  return new Date().toISOString().slice(0, 10)
}

function addDays(ymd: string, delta: number) {
  const d = new Date(`${ymd}T00:00:00.000Z`)
  d.setUTCDate(d.getUTCDate() + delta)
  return d.toISOString().slice(0, 10)
}

// 音（素材不要）
function playBeep(freq: number, durationMs: number, type: OscillatorType = 'sine') {
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext
    const ctx = new AudioCtx()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = type
    osc.frequency.value = freq
    const now = ctx.currentTime
    gain.gain.setValueAtTime(0.0001, now)
    gain.gain.exponentialRampToValueAtTime(0.18, now + 0.01)
    gain.gain.exponentialRampToValueAtTime(0.0001, now + durationMs / 1000)
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start(now)
    osc.stop(now + durationMs / 1000 + 0.02)
    osc.onended = () => ctx.close().catch(() => {})
  } catch {}
}

function readProgress(quizType: QuizType): StudyProgress {
  const key = `${STORAGE_STUDY_PROGRESS_PREFIX}-${quizType}`
  const today = todayKey()
  const base: StudyProgress = {
    totalSessions: 0,
    todaySessions: 0,
    lastStudyDate: today,
    streak: 0,
    streakUpdatedDate: '',
    bestStreak: 0,
  }

  try {
    const raw = localStorage.getItem(key)
    if (!raw) return base
    const d = JSON.parse(raw) as Partial<StudyProgress>
    return {
      totalSessions: typeof d.totalSessions === 'number' ? d.totalSessions : 0,
      todaySessions: typeof d.todaySessions === 'number' ? d.todaySessions : 0,
      lastStudyDate: typeof d.lastStudyDate === 'string' ? d.lastStudyDate : today,
      streak: typeof d.streak === 'number' ? d.streak : 0,
      streakUpdatedDate: typeof d.streakUpdatedDate === 'string' ? d.streakUpdatedDate : '',
      bestStreak: typeof d.bestStreak === 'number' ? d.bestStreak : 0,
    }
  } catch {
    return base
  }
}

function writeProgress(quizType: QuizType, p: StudyProgress) {
  const key = `${STORAGE_STUDY_PROGRESS_PREFIX}-${quizType}`
  localStorage.setItem(key, JSON.stringify(p))
}

/**
 * ✅ 全問完了した時だけ呼ぶ
 */
function updateProgressOnSessionComplete(quizType: QuizType) {
  const today = todayKey()
  const p = readProgress(quizType)

  const isSameDay = p.lastStudyDate === today
  const nextTodaySessions = isSameDay ? p.todaySessions + 1 : 1

  const shouldUpdateStreak = p.streakUpdatedDate !== today

  let nextStreak = p.streak
  if (shouldUpdateStreak) {
    if (p.lastStudyDate === addDays(today, -1)) nextStreak = p.streak + 1
    else if (p.lastStudyDate === today) nextStreak = p.streak
    else nextStreak = 1
  }

  const nextBest = Math.max(p.bestStreak, nextStreak)

  const next: StudyProgress = {
    totalSessions: p.totalSessions + 1,
    todaySessions: nextTodaySessions,
    lastStudyDate: today,
    streak: nextStreak,
    streakUpdatedDate: shouldUpdateStreak ? today : p.streakUpdatedDate,
    bestStreak: nextBest,
  }

  writeProgress(quizType, next)
  return next
}

// ✅ 分野フィルタ（sectionId 未設定の問題は「すべて」扱い）
function filterBySection(questions: Question[], sectionId: string | null) {
  if (!sectionId || sectionId === 'all') return questions
  return questions.filter(q => q.sectionId === sectionId)
}

type NormalSession = { questions: Question[]; sectionId?: string | null }

type SavedNormalProgress = {
  index?: number
  correctCount?: number
}

export default function NormalClient({ quiz }: Props) {
  const router = useRouter()
  const { user } = useAuth()

  // ✅ quizType は quiz.id（唯一の真実）
  const quizType: QuizType = quiz.id

  const [questions, setQuestions] = useState<Question[]>([])
  const [index, setIndex] = useState(0)
  const indexRef = useRef(0)

  const [selected, setSelected] = useState<number[]>([])
  const [showExplanation, setShowExplanation] = useState(false)
  const [correct, setCorrect] = useState(false)
  const [correctCount, setCorrectCount] = useState(0)
  const [finished, setFinished] = useState(false)
  const achievementHandledRef = useRef(false)

  // ✅ 続きから/はじめから選択
  const [startChoice, setStartChoice] = useState<'continue' | 'restart' | null>('restart')

  // ✅ 分野選択
  const hasSections = Array.isArray(quiz.sections) && quiz.sections.length > 0
  const [sectionChoice, setSectionChoice] = useState<string>('all')

  // ✅ 分野ごとの件数（表示用）
  const sectionCounts = useMemo(() => {
    const counts: Record<string, number> = {}
    if (!hasSections) return counts
    for (const s of quiz.sections!) {
      counts[s.id] = quiz.questions.filter(q => q.sectionId === s.id).length
    }
    return counts
  }, [hasSections, quiz.sections, quiz.questions])

  const allCount = useMemo(() => quiz.questions.length, [quiz.questions])

  const wrongKey = `${STORAGE_WRONG_KEY}-${quizType}`
  const wrongRef = useRef<Question[]>([])

  useEffect(() => {
    indexRef.current = index
  }, [index])

  const progressKey = `${STORAGE_PROGRESS_KEY}-${quizType}`
  const sessionKey = `${STORAGE_NORMAL_SESSION_KEY}-${quizType}`
  const sectionKey = `${STORAGE_NORMAL_SECTION_PREFIX}-${quizType}`

  const goModeSelect = () => {
    router.push(`/select-mode?type=${quizType}`)
  }

  const industryCountsForCurrentQuiz = useCallback((count: number) => {
    const id = String(quizType)
    return {
      driver: id.includes('license') || id.includes('gaikoku') || id.includes('road-signs') ? count : 0,
    }
  }, [quizType])


  const startSession = (mode: 'continue' | 'restart', sectionId: string | null) => {
    // wrong は常に最新を保持
    const savedWrongRaw = localStorage.getItem(wrongKey)
    if (savedWrongRaw) {
      try {
        wrongRef.current = JSON.parse(savedWrongRaw) as Question[]
      } catch {
        wrongRef.current = []
      }
    } else {
      wrongRef.current = []
    }

    // ✅ 分野保存
    try {
      localStorage.setItem(sectionKey, JSON.stringify({ sectionId }))
    } catch {}

    if (mode === 'restart') {
      const filtered = filterBySection(quiz.questions, sectionId)

      // ✅ 0件ガード：白画面防止
      if (filtered.length === 0) {
        setQuestions([])
        setIndex(0)
        setSelected([])
        setShowExplanation(false)
        setCorrect(false)
        setCorrectCount(0)
        setFinished(false)
        return
      }

      const built = buildRandomQuestions(filtered)
      setQuestions(built)
      setIndex(0)
      setSelected([])
      setShowExplanation(false)
      setCorrect(false)
      setCorrectCount(0)
      setFinished(false)

      const session: NormalSession = { questions: built, sectionId }
      localStorage.setItem(sessionKey, JSON.stringify(session))
      localStorage.removeItem(progressKey)
      return
    }

    // continue
    let loadedQuestions: Question[] | null = null
    let loadedSectionId: string | null = null

    const savedSessionRaw = localStorage.getItem(sessionKey)
    if (savedSessionRaw) {
      try {
        const d = JSON.parse(savedSessionRaw) as NormalSession
        if (Array.isArray(d.questions) && d.questions.length > 0) loadedQuestions = d.questions
        loadedSectionId = (d.sectionId ?? null) as any
      } catch {}
    }

    if (!loadedQuestions) {
      const filtered = filterBySection(quiz.questions, sectionId)
      if (filtered.length === 0) {
        setQuestions([])
        setIndex(0)
        setSelected([])
        setShowExplanation(false)
        setCorrect(false)
        setCorrectCount(0)
        setFinished(false)
        return
      }
      const built = buildRandomQuestions(filtered)
      setQuestions(built)
      setIndex(0)
      setSelected([])
      setShowExplanation(false)
      setCorrect(false)
      setCorrectCount(0)
      setFinished(false)
      localStorage.setItem(sessionKey, JSON.stringify({ questions: built, sectionId }))
      localStorage.removeItem(progressKey)
      return
    }

    // ✅ continue は前回の分野で復元（事故防止）
    const effectiveSectionId = loadedSectionId ?? sectionId ?? 'all'
    setSectionChoice(effectiveSectionId ?? 'all')

    // index
    let resumeIndex = 0
    const savedProgressRaw = localStorage.getItem(progressKey)
    if (savedProgressRaw) {
      try {
        const d = JSON.parse(savedProgressRaw) as SavedNormalProgress
        if (typeof d.index === 'number') resumeIndex = d.index
        if (typeof d.correctCount === 'number') setCorrectCount(d.correctCount)
      } catch {}
    }

    // 範囲外なら最初から
    if (resumeIndex < 0 || resumeIndex >= loadedQuestions.length) {
      resumeIndex = 0
      localStorage.removeItem(progressKey)
    }

    setQuestions(loadedQuestions)
    setIndex(resumeIndex)
    setSelected([])
    setShowExplanation(false)
    setCorrect(false)
    setFinished(false)
  }

  // ✅ 初期化
  useEffect(() => {
    stopSpeak()

    // wrong
    const savedWrongRaw = localStorage.getItem(wrongKey)
    if (savedWrongRaw) {
      try {
        wrongRef.current = JSON.parse(savedWrongRaw) as Question[]
      } catch {
        wrongRef.current = []
      }
    } else {
      wrongRef.current = []
    }

    // 前回の分野
    let savedSection: string | null = null
    try {
      const raw = localStorage.getItem(sectionKey)
      if (raw) {
        const d = JSON.parse(raw) as { sectionId?: string | null }
        savedSection = (d.sectionId ?? null) as any
      }
    } catch {}

    // 中断確認
    const savedProgressRaw = localStorage.getItem(progressKey)
    if (savedProgressRaw) {
      try {
        const d = JSON.parse(savedProgressRaw) as SavedNormalProgress
        if ((typeof d.index === 'number' && d.index > 0) || (typeof d.correctCount === 'number' && d.correctCount > 0)) {
          setStartChoice(null)
          return
        }
      } catch {}
    }

    setStartChoice('restart')
    setSectionChoice(savedSection ?? 'all')
    startSession('restart', savedSection ?? 'all')

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quizType])

  // ✅ 離脱時保存
  useEffect(() => {
    const handler = () => {
      try {
        if (questions.length > 0) {
          localStorage.setItem(progressKey, JSON.stringify({ index: indexRef.current, correctCount }))
          localStorage.setItem(wrongKey, JSON.stringify(wrongRef.current))
        }
      } catch {}
    }
    window.addEventListener('beforeunload', handler)
    return () => window.removeEventListener('beforeunload', handler)
  }, [questions.length, progressKey, wrongKey, correctCount])


  useEffect(() => {
    if (!finished || !user || achievementHandledRef.current) return
    achievementHandledRef.current = true

    ;(async () => {
      try {
        const totalCount = questions.length
        const accuracy = totalCount > 0 ? Math.round((correctCount / totalCount) * 100) : 0
        const progress = readProgress(quizType)

        const unlocked = await unlockAchievementsForUser(user.uid, {
          totalAnswers: totalCount,
          maxScore: accuracy,
          streak: progress.streak,
          industryCounts: industryCountsForCurrentQuiz(totalCount),
        })

        if (unlocked.length) {
          enqueueAchievementToasts(
            unlocked.map((b) => ({
              id: b.id,
              icon: b.icon,
              label: b.label,
              rarity: b.rarity,
            }))
          )
        }
      } catch (e) {
        console.error('normal achievement unlock failed:', e)
      }
    })()
  }, [finished, user, questions.length, correctCount, quizType, industryCountsForCurrentQuiz])

  // ✅ 続き/最初
  if (startChoice === null) {
    return (
      <QuizLayout title={quiz.title}>
        <h2 style={{ marginTop: 0 }}>前回の続きがあります</h2>
        <p style={{ opacity: 0.85 }}>どちらから始めますか？</p>

        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 16 }}>
          <Button
            variant="main"
            onClick={() => {
              setStartChoice('continue')
              startSession('continue', sectionChoice ?? 'all')
            }}
          >
            続きから
          </Button>

          <Button
            variant="accent"
            onClick={() => {
              setStartChoice('restart')
              startSession('restart', sectionChoice ?? 'all')
            }}
          >
            はじめから
          </Button>
        </div>

        <div style={{ marginTop: 12, opacity: 0.75, fontSize: 13 }}>
          ※「はじめから」を選ぶと、通常問題の並びは新しくシャッフルされます
        </div>

        <div style={{ marginTop: 16 }}>
          <Button variant="success" onClick={goModeSelect}>
            いったん戻る
          </Button>
        </div>
      </QuizLayout>
    )
  }

  // ✅ 0件は案内UI
  if (!questions.length) {
    const label =
      sectionChoice === 'all'
        ? `すべて（${allCount}）`
        : `${quiz.sections?.find(s => s.id === sectionChoice)?.label ?? 'この分野'}（${sectionCounts[sectionChoice] ?? 0}）`

    return (
      <QuizLayout title={quiz.title} subtitle={hasSections ? label : undefined}>
        <p style={{ fontWeight: 900, marginTop: 0 }}>この分野にはまだ問題がありません</p>
        <p style={{ opacity: 0.75, fontSize: 13 }}>
          問題データに <code>sectionId</code> を付けると、この分野で出題されます。
        </p>

        <div style={{ marginTop: 12, display: 'grid', gap: 10 }}>
          {hasSections && (
            <Button
              variant="main"
              onClick={() => {
                setSectionChoice('all')
                startSession('restart', 'all')
              }}
            >
              すべてに戻す
            </Button>
          )}

          <Button variant="accent" onClick={goModeSelect}>
            モード選択へ戻る
          </Button>
        </div>
      </QuizLayout>
    )
  }

  const activeSectionLabel =
    sectionChoice === 'all'
      ? `すべて（${allCount}）`
      : `${quiz.sections?.find(s => s.id === sectionChoice)?.label ?? '分野'}（${sectionCounts[sectionChoice] ?? 0}）`

  if (finished) {
    const totalCount = questions.length
    const accuracy = totalCount > 0 ? Math.round((correctCount / totalCount) * 100) : 0

    return (
      <QuizLayout title={quiz.title} subtitle={hasSections ? activeSectionLabel : undefined}>
        <div
          style={{
            border: '1px solid var(--border)',
            borderRadius: 20,
            padding: 20,
            background: 'white',
            boxShadow: '0 10px 30px rgba(0,0,0,0.06)',
          }}
        >
          <div style={{ fontSize: 28, fontWeight: 900, marginBottom: 8 }}>🎉 学習完了！</div>
          <div style={{ opacity: 0.8, marginBottom: 18 }}>最後までおつかれさまでした。</div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
              gap: 10,
              marginBottom: 18,
            }}
          >
            <div style={{ border: '1px solid var(--border)', borderRadius: 16, padding: 14 }}>
              <div style={{ fontSize: 12, opacity: 0.7, marginBottom: 6 }}>問題数</div>
              <div style={{ fontSize: 24, fontWeight: 900 }}>{totalCount}</div>
            </div>
            <div style={{ border: '1px solid var(--border)', borderRadius: 16, padding: 14 }}>
              <div style={{ fontSize: 12, opacity: 0.7, marginBottom: 6 }}>正解数</div>
              <div style={{ fontSize: 24, fontWeight: 900 }}>{correctCount}</div>
            </div>
            <div style={{ border: '1px solid var(--border)', borderRadius: 16, padding: 14 }}>
              <div style={{ fontSize: 12, opacity: 0.7, marginBottom: 6 }}>正答率</div>
              <div style={{ fontSize: 24, fontWeight: 900 }}>{accuracy}%</div>
            </div>
          </div>

          <div style={{ display: 'grid', gap: 10 }}>
            <Button
              variant="main"
              onClick={() => {
                startSession('restart', sectionChoice ?? 'all')
              }}
            >
              もう一度やる
            </Button>

            <Button
              variant="accent"
              onClick={() => {
                router.push(`/review?type=${quizType}`)
              }}
            >
              復習する
            </Button>

            <Button variant="success" onClick={goModeSelect}>
              学習選択へ戻る
            </Button>
          </div>
        </div>
      </QuizLayout>
    )
  }

  const current = questions[index]

  const submitSelection = (selection: number[]) => {
    if (showExplanation) return
    if (!isSelectionComplete(current, selection)) return

    const isCorrect = isCorrectSelection(current, selection)
    setSelected(selection)
    setCorrect(isCorrect)
    setShowExplanation(true)

    if (isCorrect) playBeep(880, 120, 'triangle')
    else playBeep(220, 180, 'sawtooth')

    if (isCorrect) {
      setCorrectCount((prev) => prev + 1)
    }

    if (!isCorrect) {
      const exists = wrongRef.current.some(q => q.id === current.id)
      if (!exists) {
        wrongRef.current = [...wrongRef.current, current]
        localStorage.setItem(wrongKey, JSON.stringify(wrongRef.current))
      }
    }
  }

  const toggleChoice = (choiceIndex: number) => {
    if (showExplanation) return

    const needed = requiredAnswerCount(current)
    const isMulti = isMultiAnswerQuestion(current)

    if (!isMulti) {
      submitSelection([choiceIndex])
      return
    }

    const nextSelected = selected.includes(choiceIndex)
      ? selected.filter((v) => v !== choiceIndex)
      : selected.length >= needed
        ? selected
        : [...selected, choiceIndex].sort((a, b) => a - b)

    setSelected(nextSelected)

    if (isSelectionComplete(current, nextSelected)) {
      submitSelection(nextSelected)
    }
  }

  const next = async () => {
    setSelected([])
    setShowExplanation(false)

    if (index + 1 >= questions.length) {
      const p = updateProgressOnSessionComplete(quizType)

      if (user) {
        const ref = doc(db, 'users', user.uid, 'progress', quizType)
        await setDoc(
          ref,
          {
            totalSessions: p.totalSessions,
            todaySessions: p.todaySessions,
            streak: p.streak,
            bestStreak: p.bestStreak,
            updatedAt: serverTimestamp(),
          },
          { merge: true }
        )
      }

      localStorage.removeItem(progressKey)
      localStorage.removeItem(sessionKey)

      setFinished(true)
      return
    }

    const nextIndex = index + 1
    setIndex(nextIndex)
    localStorage.setItem(progressKey, JSON.stringify({ index: nextIndex, correctCount }))
  }

  const interrupt = () => {
    stopSpeak()
    localStorage.setItem(progressKey, JSON.stringify({ index, correctCount }))
    localStorage.setItem(wrongKey, JSON.stringify(wrongRef.current))
    goModeSelect()
  }

  return (
    <QuizLayout title={quiz.title} subtitle={hasSections ? activeSectionLabel : undefined}>
      {/* ✅ 分野切替（Normalのみ） */}
      {hasSections && (
        <div style={{ marginBottom: 10 }}>
          <div style={{ fontSize: 12, opacity: 0.7, marginBottom: 6 }}>分野（Normalのみ）</div>

          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {/* すべて */}
            <button
              type="button"
              onClick={() => {
                setSectionChoice('all')
                startSession('restart', 'all')
              }}
              style={{
                padding: '8px 10px',
                borderRadius: 999,
                border: '1px solid var(--border)',
                background: sectionChoice === 'all' ? '#111' : 'white',
                color: sectionChoice === 'all' ? 'white' : '#111',
                cursor: 'pointer',
                fontWeight: 800,
              }}
            >
              すべて（{allCount}）
            </button>

            {/* 各分野 */}
            {quiz.sections!.map(s => {
              const cnt = sectionCounts[s.id] ?? 0
              const active = sectionChoice === s.id
              const disabled = cnt === 0

              return (
                <button
                  key={s.id}
                  type="button"
                  disabled={disabled}
                  onClick={() => {
                    if (disabled) return
                    setSectionChoice(s.id)
                    startSession('restart', s.id) // ✅ 分野変更はrestartが安全
                  }}
                  style={{
                    padding: '8px 10px',
                    borderRadius: 999,
                    border: '1px solid var(--border)',
                    background: active ? '#111' : 'white',
                    color: active ? 'white' : '#111',
                    cursor: disabled ? 'not-allowed' : 'pointer',
                    fontWeight: 800,
                    opacity: disabled ? 0.45 : 1,
                  }}
                  title={disabled ? 'この分野はまだ問題がありません' : undefined}
                >
                  {s.label}（{cnt}）
                </button>
              )
            })}
          </div>

          <div style={{ marginTop: 6, fontSize: 12, opacity: 0.7 }}>
            ※ 分野を変えると安全のため「はじめから」で開始します（0件の分野は押せません）
          </div>
        </div>
      )}

      <p>
        {index + 1} / {questions.length}
      </p>

      <h2>{current.question}</h2>
      {/* ✅ 問題画像（従来の signId / imageUrl） */}
      <QuestionImage q={current} mode="auto" />

      {/* ✅ 4択の選択画像 */}
      <QuestionImage q={current} purpose="choice" />


      {current.audioUrl ? (
        <div style={{ margin: '12px 0' }}>
          <AudioPlayerButton
            src={current.audioUrl}
            title="音声を聞いて答えてください"
          />
        </div>
      ) : current.listeningText ? (
        <ListeningControls
          text={current.listeningText}
          storageKeyPrefix={quizType}
        />
      ) : null}

      {isMultiAnswerQuestion(current) && (
        <div style={{ margin: '8px 0 12px', fontSize: 13, opacity: 0.8 }}>
          この問題は <b>{requiredAnswerCount(current)}つ選択</b> です。必要数そろうと自動で判定されます。
        </div>
      )}

      {current.choices.map((c, i) => {
        const selectedNow = selected.includes(i)
        const correctIndexes = getCorrectIndexes(current)
        return (
          <Button
            key={i}
            variant="choice"
            onClick={() => toggleChoice(i)}
            disabled={showExplanation}
            isCorrect={showExplanation && correctIndexes.includes(i)}
            isWrong={showExplanation && selectedNow && !correctIndexes.includes(i)}
            style={!showExplanation && selectedNow ? { outline: '3px solid #60a5fa', outlineOffset: 1 } : undefined}
          >
            {c}
          </Button>
        )
      })}

      {!showExplanation && (
        <div style={{ marginTop: 12, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <Button variant="accent" onClick={interrupt}>
            中断して戻る
          </Button>
        </div>
      )}

      {showExplanation && (
  <div style={{ marginTop: 12 }}>
    <div style={{ fontWeight: 900, marginBottom: 6 }}>
      {correct ? '✅ 正解！' : '❌ 不正解'}
    </div>

    <div style={{ fontWeight: 700, marginBottom: 8 }}>
      【正解】 {formatCorrectAnswerLabels(current)}
    </div>

    <QuestionImage q={current} purpose="explanation" />

    <div style={{ whiteSpace: 'pre-wrap', lineHeight: 1.7 }}>
      {stripLeadingAnswerLabel(current.explanation)}
    </div>

    {current.explanationEn && (
      <div style={{ marginTop: 12, padding: 12, border: '1px solid #bae6fd', background: '#f0f9ff', borderRadius: 12 }}>
        <div style={{ fontWeight: 800, color: '#0369a1', marginBottom: 6 }}>English</div>
        <div style={{ whiteSpace: 'pre-wrap', lineHeight: 1.7 }}>{current.explanationEn}</div>
      </div>
    )}

    {current.point && (
      <div style={{ marginTop: 12 }}>
        <div style={{ fontWeight: 700, color: '#16a34a', marginBottom: 4 }}>
          ポイント
        </div>
        <div style={{ whiteSpace: 'pre-wrap', lineHeight: 1.7 }}>
          {current.point}
        </div>
      </div>
    )}

    {current.trap && (
      <div style={{ marginTop: 12 }}>
        <div style={{ fontWeight: 700, color: '#dc2626', marginBottom: 4 }}>
          注意
        </div>
        <div style={{ whiteSpace: 'pre-wrap', lineHeight: 1.7 }}>
          {current.trap}
        </div>
      </div>
    )}

    <div style={{ marginTop: 12, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
      <Button variant="main" onClick={next}>
        {index + 1 >= questions.length ? '学習完了へ' : '次の問題へ'}
      </Button>
            <Button variant="accent" onClick={interrupt}>
              中断して戻る
            </Button>
          </div>
        </div>
      )}

    </QuizLayout>
  )
}
