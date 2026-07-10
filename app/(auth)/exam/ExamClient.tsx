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
import { arrayUnion, collection, doc, serverTimestamp, setDoc } from 'firebase/firestore'
import { stopSpeak } from '@/app/lib/tts'
import { getBadgeMeta, getBadgeLabelFromBadgeId, getPerfectBadgeId } from '@/app/lib/badges'
import { enqueueAchievementToasts } from '@/app/lib/achievementToastQueue'

const EXAM_TIME_SEC = 20 * 60
const STORAGE_WRONG_KEY = 'wrong'
const STORAGE_EXAM_SESSION_KEY = 'exam-session'
const STORAGE_EXAM_PROGRESS_KEY = 'exam-progress'

type Props = { quiz: Quiz }

type ExamAnswer = {
  questionId: number
  selectedIndexes: number[]
  correctIndexes: number[]
  isCorrect: boolean
  question: string
  choices: string[]
  explanation?: string
  explanationEn?: string
  audioUrl?: string
  listeningText?: string
}

function getExamQuestionCount(quizType: QuizType) {
  if (quizType === 'gaikoku-license') return 50
  return 30
}

function getPassScore(quizType: QuizType, total: number) {
  if (total <= 0) return 0
  if (quizType === 'gaikoku-license') return Math.min(45, total)
  return Math.ceil(total * 0.8)
}

function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function buildExamQuestions(all: Question[], count: number): Question[] {
  const built = shuffleArray(all.map((q) => shuffleQuestionChoicesWithAnswers(q, shuffleArray)))
  return built.slice(0, Math.min(count, built.length))
}

function formatTime(sec: number) {
  const m = Math.floor(sec / 60)
  const s = sec % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

export default function ExamClient({ quiz }: Props) {
  const router = useRouter()
  const { user } = useAuth()
  const quizType: QuizType = quiz.id

  const wrongKey = `${STORAGE_WRONG_KEY}-${quizType}`
  const sessionKey = `${STORAGE_EXAM_SESSION_KEY}-${quizType}`
  const progressKey = `${STORAGE_EXAM_PROGRESS_KEY}-${quizType}`

  const [questions, setQuestions] = useState<Question[]>([])
  const [index, setIndex] = useState(0)
  const [selected, setSelected] = useState<number[]>([])
  const [isListeningSpeaking, setIsListeningSpeaking] = useState(false)
  const [timeLeft, setTimeLeft] = useState(EXAM_TIME_SEC)
  const [finished, setFinished] = useState(false)
  const [answers, setAnswers] = useState<ExamAnswer[]>([])
  const [earnedBadgeLabel, setEarnedBadgeLabel] = useState<string | null>(null)

  const advancingRef = useRef(false)
  const indexRef = useRef(0)
  const timeLeftRef = useRef(EXAM_TIME_SEC)
  const answersRef = useRef<ExamAnswer[]>([])
  const scoreRef = useRef(0)

  const score = useMemo(() => answers.filter((a) => a?.isCorrect).length, [answers])

  useEffect(() => {
    indexRef.current = index
  }, [index])
  useEffect(() => {
    timeLeftRef.current = timeLeft
  }, [timeLeft])
  useEffect(() => {
    answersRef.current = answers
  }, [answers])
  useEffect(() => {
    scoreRef.current = score
  }, [score])

  const contentSig = `${quizType}:${quiz.questions.length}:${quiz.questions[0]?.id ?? 0}:${quiz.questions[quiz.questions.length - 1]?.id ?? 0}`

  const goModeSelect = () => router.push(`/select-mode?type=${quizType}`)

  const finishExam = useCallback(async (byTimeout: boolean) => {
    if (finished) return
    setFinished(true)
    stopSpeak()

    if (user) {
      const resultRef = doc(collection(db, 'users', user.uid, 'results'))
      await setDoc(resultRef, {
        quizType,
        mode: 'exam',
        score: scoreRef.current,
        total: questions.length,
        passScore: getPassScore(quizType, questions.length),
        passed: scoreRef.current >= getPassScore(quizType, questions.length),
        byTimeout,
        timeLeft: timeLeftRef.current,
        createdAt: serverTimestamp(),
      }, { merge: true })

      if (!byTimeout && questions.length > 0 && scoreRef.current === questions.length) {
        const badgeId = getPerfectBadgeId(quizType)
        await setDoc(doc(db, 'users', user.uid), { badges: arrayUnion(badgeId) }, { merge: true })
        const badgeLabel = getBadgeLabelFromBadgeId(badgeId)
        setEarnedBadgeLabel(badgeLabel)
        const badgeMeta = getBadgeMeta(badgeId)
        enqueueAchievementToasts([{ id: badgeId, icon: badgeMeta.icon, label: badgeLabel, rarity: badgeMeta.rarity }])
      }
    }

    try {
      localStorage.setItem(sessionKey, JSON.stringify({
        questions,
        answers: answersRef.current,
        score: scoreRef.current,
        meta: { contentSig },
      }))
      localStorage.setItem(progressKey, JSON.stringify({
        index: indexRef.current,
        timeLeft: timeLeftRef.current,
        finished: true,
      }))
    } catch {}
  }, [contentSig, finished, progressKey, questions, quizType, sessionKey, user])

  const goNext = useCallback(() => {
    setSelected([])
    const nextIndex = indexRef.current + 1
    if (nextIndex >= questions.length) {
      finishExam(false).catch(() => {})
      return
    }
    setIndex(nextIndex)
    try {
      localStorage.setItem(progressKey, JSON.stringify({ index: nextIndex, timeLeft: timeLeftRef.current, finished: false }))
    } catch {}
  }, [finishExam, progressKey, questions.length])

  useEffect(() => {
    stopSpeak()

    const savedSessionRaw = localStorage.getItem(sessionKey)
    const savedProgressRaw = localStorage.getItem(progressKey)
    if (savedSessionRaw && savedProgressRaw) {
      try {
        const s = JSON.parse(savedSessionRaw) as {
          questions: Question[]
          answers: ExamAnswer[]
          meta?: { contentSig?: string }
        }
        const p = JSON.parse(savedProgressRaw) as { index: number; timeLeft: number; finished?: boolean }
        if (s?.meta?.contentSig !== contentSig) throw new Error('exam session mismatch')

        if (Array.isArray(s.questions) && s.questions.length > 0) {
          setQuestions(s.questions)
          setAnswers(Array.isArray(s.answers) ? s.answers : [])
          setIndex(typeof p.index === 'number' ? p.index : 0)
          setTimeLeft(typeof p.timeLeft === 'number' ? p.timeLeft : EXAM_TIME_SEC)
          setFinished(Boolean(p.finished))
          setSelected([])
          return
        }
      } catch {}
    }

    const built = buildExamQuestions(quiz.questions, getExamQuestionCount(quizType))
    setQuestions(built)
    setIndex(0)
    setSelected([])
    setTimeLeft(EXAM_TIME_SEC)
    setFinished(false)
    setAnswers([])

    localStorage.setItem(sessionKey, JSON.stringify({ questions: built, answers: [], score: 0, meta: { contentSig } }))
    localStorage.setItem(progressKey, JSON.stringify({ index: 0, timeLeft: EXAM_TIME_SEC, finished: false }))
  }, [contentSig, progressKey, quiz.questions, quizType, sessionKey])

  useEffect(() => {
    if (!questions.length || finished) return
    const t = window.setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          window.clearInterval(t)
          finishExam(true).catch(() => {})
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => window.clearInterval(t)
  }, [questions.length, finished, finishExam])

  useEffect(() => {
    const handler = () => {
      try {
        if (!questions.length) return
        localStorage.setItem(sessionKey, JSON.stringify({
          questions,
          answers: answersRef.current,
          score: answersRef.current.filter((a) => a?.isCorrect).length,
          meta: { contentSig },
        }))
        localStorage.setItem(progressKey, JSON.stringify({ index: indexRef.current, timeLeft: timeLeftRef.current, finished }))
      } catch {}
    }
    window.addEventListener('beforeunload', handler)
    return () => window.removeEventListener('beforeunload', handler)
  }, [contentSig, finished, progressKey, questions, sessionKey])

  const current = useMemo(() => questions[index] ?? null, [questions, index])

  const toggleChoice = (choiceIndex: number) => {
    if (!current || advancingRef.current) return
    if (!isMultiAnswerQuestion(current)) {
      setSelected([choiceIndex])
      return
    }
    const needed = requiredAnswerCount(current)
    setSelected((prev) => {
      if (prev.includes(choiceIndex)) return prev.filter((v) => v !== choiceIndex)
      if (prev.length >= needed) return prev
      return [...prev, choiceIndex].sort((a, b) => a - b)
    })
  }

  const submitAnswer = () => {
    if (!current || advancingRef.current) return
    if (!isSelectionComplete(current, selected)) return

    const isCorrect = isCorrectSelection(current, selected)
    if (!isCorrect) {
      try {
        const raw = localStorage.getItem(wrongKey)
        const arr = raw ? (JSON.parse(raw) as Question[]) : []
        const exists = Array.isArray(arr) && arr.some((q) => q.id === current.id)
        if (!exists) localStorage.setItem(wrongKey, JSON.stringify(Array.isArray(arr) ? [...arr, current] : [current]))
      } catch {}
    }

    const a: ExamAnswer = {
      questionId: current.id,
      selectedIndexes: [...selected].sort((a, b) => a - b),
      correctIndexes: getCorrectIndexes(current),
      isCorrect,
      question: current.question,
      choices: current.choices,
      explanation: current.explanation,
      explanationEn: current.explanationEn,
      audioUrl: current.audioUrl,
      listeningText: current.listeningText,
    }

    setAnswers((prev) => {
      const next = [...prev]
      next[indexRef.current] = a
      return next
    })

    advancingRef.current = true
    window.setTimeout(() => {
      advancingRef.current = false
      goNext()
    }, 650)
  }

  const interrupt = () => {
    stopSpeak()
    try {
      localStorage.setItem(sessionKey, JSON.stringify({
        questions,
        answers: answersRef.current,
        score: answersRef.current.filter((a) => a?.isCorrect).length,
        meta: { contentSig },
      }))
      localStorage.setItem(progressKey, JSON.stringify({ index: indexRef.current, timeLeft: timeLeftRef.current, finished }))
    } catch {}
    goModeSelect()
  }

  const resetExam = () => {
    stopSpeak()
    const built = buildExamQuestions(quiz.questions, getExamQuestionCount(quizType))
    setQuestions(built)
    setIndex(0)
    setSelected([])
    setTimeLeft(EXAM_TIME_SEC)
    setFinished(false)
    setAnswers([])
    try {
      localStorage.setItem(sessionKey, JSON.stringify({ questions: built, answers: [], score: 0, meta: { contentSig } }))
      localStorage.setItem(progressKey, JSON.stringify({ index: 0, timeLeft: EXAM_TIME_SEC, finished: false }))
    } catch {}
  }

  if (!questions.length || !current) return null

  if (finished) {
    const total = questions.length
    const pct = total > 0 ? Math.round((score / total) * 100) : 0
    const passScore = getPassScore(quizType, total)
    const passed = score >= passScore

    const sectionLabelMap = new Map<string, string>()
    ;(quiz.sections ?? []).forEach((s) => sectionLabelMap.set(s.id, s.label))

    const sectionStats = (() => {
      const map = new Map<string, { id: string; label: string; total: number; correct: number }>()
      questions.forEach((q, i) => {
        const sid = q.sectionId ?? 'all'
        const label = sectionLabelMap.get(sid) ?? (sid === 'all' ? '全体' : sid)
        const a = answers[i]
        const ok = a ? isCorrectSelection(q, a.selectedIndexes) : false
        const cur = map.get(sid) ?? { id: sid, label, total: 0, correct: 0 }
        cur.total += 1
        if (ok) cur.correct += 1
        map.set(sid, cur)
      })
      return Array.from(map.values())
        .map((s) => ({ ...s, accuracy: s.total > 0 ? Math.round((s.correct / s.total) * 100) : 0, wrong: s.total - s.correct }))
        .sort((a, b) => a.accuracy - b.accuracy || b.wrong - a.wrong || b.total - a.total)
    })()

    return (
      <QuizLayout title={`${quiz.title}（模擬試験）結果`}>
        <div className="resultMeta">
          <div style={{ fontWeight: 900, fontSize: 20 }}>{score} / {total}（{pct}%）</div>
          <div style={{ fontWeight: 800, marginTop: 6 }}>{passed ? '🎉 合格' : '❗ 不合格'}（合格ライン: {passScore} / {total}）</div>
          <div style={{ opacity: 0.8 }}>残り時間: {formatTime(timeLeft)}</div>
        </div>

        {earnedBadgeLabel ? (
          <div className="panelSoft" style={{ marginTop: 14, background: '#fff7ed', border: '1px solid #fdba74' }}>
            <div style={{ fontWeight: 900, fontSize: 18 }}>🏅 満点バッジ獲得！</div>
            <div style={{ marginTop: 6, fontWeight: 800 }}>{earnedBadgeLabel}</div>
            <div style={{ marginTop: 6, opacity: 0.8 }}>マイページの実績に追加されます。</div>
          </div>
        ) : null}

        <div className="panelSoft" style={{ marginTop: 14 }}>
          <div style={{ fontWeight: 900, marginBottom: 8 }}>弱点分析（分野別）</div>
          {sectionStats.length <= 1 ? (
            <div style={{ opacity: 0.85 }}>この教材は分野設定がないため、分野別分析はありません。</div>
          ) : (
            <div style={{ display: 'grid', gap: 10 }}>
              <div style={{ opacity: 0.9 }}>正答率が低い分野から表示します（未回答は不正解としてカウント）。</div>
              {sectionStats.filter((s) => s.id !== 'all').slice(0, 5).map((s) => (
                <div key={s.id} style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
                  <div style={{ fontWeight: 800 }}>{s.label}</div>
                  <div style={{ whiteSpace: 'nowrap' }}>{s.correct}/{s.total}（{s.accuracy}%）</div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="actions">
          <Button variant="main" onClick={resetExam}>もう一度（再挑戦）</Button>
          <Button variant="choice" onClick={() => router.push(`/review?type=${quizType}`)}>復習へ（間違えた問題）</Button>
          <Button variant="sub" onClick={() => router.push(`/normal?type=${quizType}`)}>通常学習へ</Button>
          <Button variant="accent" onClick={goModeSelect}>モード選択へ戻る</Button>
        </div>

        <hr />
        <h3 style={{ marginTop: 0 }}>解答・解説（全問）</h3>

        <div className="resultList">
          {questions.map((q, i) => {
            const a = answers[i]
            const selectedIndexes = a?.selectedIndexes ?? []
            const correctIndexes = getCorrectIndexes(q)
            const ok = isCorrectSelection(q, selectedIndexes)
            return (
              <div key={q.id} className="resultItem">
                <div className="resultHead">
                  <div className="resultQ">Q{i + 1}. {q.question}</div>
                  <div className="resultMark">{selectedIndexes.length === 0 ? '—' : ok ? '✅' : '❌'}</div>
                </div>

                <QuestionImage q={q} mode="auto" />
                <QuestionImage q={q} purpose="choice" />
                <QuestionImage q={q} purpose="explanation" />

                {q.audioUrl ? (
                  <div style={{ marginTop: 10 }}><AudioPlayerButton src={q.audioUrl} title="この問題の音声" /></div>
                ) : q.listeningText ? (
                  <div style={{ marginTop: 10 }}><ListeningControls text={q.listeningText} storageKeyPrefix={`${quizType}-exam-result-${q.id}`} /></div>
                ) : null}

                <div className="resultChoices">
                  {q.choices.map((c, idx) => {
                    const isCorrect = correctIndexes.includes(idx)
                    const isSelected = selectedIndexes.includes(idx)
                    const badge = isCorrect ? '（正）' : isSelected ? '（選）' : ''
                    return <div key={idx} style={{ opacity: isCorrect || isSelected ? 1 : 0.85 }}>{idx + 1}. {c} {badge}</div>
                  })}
                </div>

                <div className="resultExplain">
                  <div style={{ fontWeight: 700, marginBottom: 6 }}>【正解】 {formatCorrectAnswerLabels(q)}</div>
                  {q.explanation ? stripLeadingAnswerLabel(q.explanation) : ''}
                  {q.explanationEn ? (
                    <div style={{ marginTop: 12, padding: 12, border: '1px solid #bae6fd', background: '#f0f9ff', borderRadius: 12 }}>
                      <div style={{ fontWeight: 800, color: '#0369a1', marginBottom: 6 }}>English</div>
                      <div style={{ whiteSpace: 'pre-wrap', lineHeight: 1.7 }}>{q.explanationEn}</div>
                    </div>
                  ) : null}
                </div>
              </div>
            )
          })}
        </div>
      </QuizLayout>
    )
  }

  return (
    <QuizLayout title={`${quiz.title}（模擬試験）`} subtitle="回答すると自動で次の問題へ進みます（正誤は表示されません）">
      <div className="kicker">
        <span className="badge">模擬</span>
        <span>{index + 1} / {questions.length}</span>
        <span className="spacer" />
        <span className="timer">残り {formatTime(timeLeft)}</span>
      </div>

      <h2 className="question">{current.question}</h2>
      <QuestionImage q={current} mode="auto" />
      <QuestionImage q={current} purpose="choice" />

      {current.audioUrl ? (
        <div style={{ margin: '12px 0' }}><AudioPlayerButton src={current.audioUrl} title="音声を聞いて答えてください" /></div>
      ) : current.listeningText ? (
        <ListeningControls
          key={`${quizType}-${current.id}`}
          text={current.listeningText}
          storageKeyPrefix={`${quizType}-exam-${current.id}`}
          allowAutoPlay={false}
          maxPlays={2}
          onSpeakingChange={setIsListeningSpeaking}
        />
      ) : null}

      {isMultiAnswerQuestion(current) && (
        <div style={{ margin: '8px 0 12px', fontSize: 13, opacity: 0.8 }}>
          この問題は <b>{requiredAnswerCount(current)}つ選択</b> です。
        </div>
      )}

      <div className="choiceList">
        {current.choices.map((c, i) => {
          const isChosen = selected.includes(i)
          return (
            <Button
              key={i}
              variant="choice"
              onClick={() => toggleChoice(i)}
              disabled={isListeningSpeaking || advancingRef.current}
              style={isChosen ? { outline: '3px solid #60a5fa', outlineOffset: 1 } : undefined}
            >
              {c}
            </Button>
          )
        })}
      </div>

      <p className="note">※ 中断すると途中から再開できます（タイマーも保存されます）</p>

      <div className="actions">
        <Button variant="main" onClick={submitAnswer} disabled={!isSelectionComplete(current, selected) || isListeningSpeaking}>回答する</Button>
        <Button variant="sub" onClick={interrupt}>中断して戻る</Button>
      </div>
    </QuizLayout>
  )
}
