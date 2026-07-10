'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import QuizLayout from '@/app/components/QuizLayout'
import Button from '@/app/components/Button'
import QuestionImage from '@/app/components/QuestionImage'
import type { Question, Quiz, QuizType } from '@/app/data/types'
import { formatCorrectAnswerLabels, getCorrectIndexes, isCorrectSelection, isMultiAnswerQuestion, isSelectionComplete, requiredAnswerCount, stripLeadingAnswerLabel } from '@/app/lib/questionAnswer'
import { canSpeak, speak, stopSpeak } from '@/app/lib/tts'
import { useAuth } from '@/app/lib/useAuth'
import { unlockAchievementsForUser } from '@/app/lib/achievementUnlock'
import { enqueueAchievementToasts } from '@/app/lib/achievementToastQueue'

const STORAGE_WRONG_KEY = 'wrong'

type Props = {
  quiz: Quiz
}

function isQuestionLike(v: any): v is Question {
  return (
    v &&
    typeof v === 'object' &&
    (typeof v.id === 'number' || typeof v.id === 'string') &&
    typeof v.question === 'string' &&
    Array.isArray(v.choices) &&
    (typeof v.correctIndex === 'number' || Array.isArray(v.correctIndexes))
  )
}

function uniqById(list: Question[]) {
  return Array.from(new Map(list.map((q) => [String((q as any).id), q])).values())
}

export default function ReviewClient({ quiz }: Props) {
  const router = useRouter()
  const { user } = useAuth()
  const quizType: QuizType = quiz.id
  const storageKey = `${STORAGE_WRONG_KEY}-${quizType}`

  const [questions, setQuestions] = useState<Question[]>([])
  const [index, setIndex] = useState(0)
  const [selected, setSelected] = useState<number[]>([])
  const [submitted, setSubmitted] = useState(false)
  const achievementHandledRef = useRef(false)

  const goModeSelect = () => {
    stopSpeak()
    router.push(`/select-mode?type=${encodeURIComponent(quizType)}`)
  }

  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey)
      if (!saved) {
        setQuestions([])
        setIndex(0)
        setSelected([])
        setSubmitted(false)
        return
      }

      const data = JSON.parse(saved)
      if (Array.isArray(data)) {
        setQuestions(uniqById(data.filter(isQuestionLike) as Question[]))
        setIndex(0)
        setSelected([])
        setSubmitted(false)
        return
      }

      setQuestions([])
      setIndex(0)
      setSelected([])
      setSubmitted(false)
    } catch {
      localStorage.removeItem(storageKey)
      setQuestions([])
      setIndex(0)
      setSelected([])
      setSubmitted(false)
    }
  }, [storageKey])

  useEffect(() => {
    stopSpeak()
    setSelected([])
    setSubmitted(false)
  }, [index])

  useEffect(() => {
    return () => stopSpeak()
  }, [])

  useEffect(() => {
    if (!user || achievementHandledRef.current || !questions.length) return
    achievementHandledRef.current = true

    ;(async () => {
      try {
        const unlocked = await unlockAchievementsForUser(user.uid, { reviewPlays: 1 })
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
        console.error('review achievement unlock failed:', e)
      }
    })()
  }, [user, questions.length])


  const current = questions[index]
  const isCorrect = useMemo(() => {
    if (!current || !submitted) return false
    return isCorrectSelection(current, selected)
  }, [current, selected, submitted])

  const removeCurrentFromWrong = (qid: any) => {
    const key = String(qid)
    setQuestions((prev) => {
      const next = prev.filter((q) => String((q as any).id) !== key)
      try {
        localStorage.setItem(storageKey, JSON.stringify(next))
      } catch {}
      setIndex((i) => Math.min(i, Math.max(0, next.length - 1)))
      return next
    })
  }

  if (!questions.length) {
    return (
      <QuizLayout title={`${quiz.title}（復習）`} subtitle="復習リストは空です">
        <p className="note">復習する問題はありません</p>
        <div className="actions">
          <Button variant="accent" onClick={goModeSelect}>モード選択に戻る</Button>
        </div>
      </QuizLayout>
    )
  }

  if (!current) {
    return (
      <QuizLayout title={`${quiz.title}（復習）`} subtitle="読み込みエラー">
        <p className="note">問題の読み込みに失敗しました</p>
        <div className="actions">
          <Button variant="accent" onClick={goModeSelect}>モード選択に戻る</Button>
        </div>
      </QuizLayout>
    )
  }

  const toggleChoice = (i: number) => {
    if (submitted) return
    stopSpeak()

    if (!isMultiAnswerQuestion(current)) {
      setSelected([i])
      return
    }

    const needed = requiredAnswerCount(current)
    setSelected((prev) => {
      if (prev.includes(i)) return prev.filter((v) => v !== i)
      if (prev.length >= needed) return prev
      return [...prev, i].sort((a, b) => a - b)
    })
  }

  const submitAnswer = () => {
    if (!isSelectionComplete(current, selected)) return
    setSubmitted(true)
  }

  const onListen = () => {
    if (current.listeningText) {
      speak(current.listeningText, { lang: 'ja-JP', rate: 0.9, pitch: 1.0 })
    }
  }

  const next = () => {
    stopSpeak()
    if (isCorrect) {
      const qid = current.id
      const willBe = questions.filter((q) => String((q as any).id) !== String(qid))
      if (willBe.length === 0) {
        try {
          localStorage.setItem(storageKey, JSON.stringify([]))
        } catch {}
        goModeSelect()
        return
      }
      removeCurrentFromWrong(qid)
      return
    }

    setSelected([])
    setSubmitted(false)
    if (index + 1 < questions.length) setIndex((prev) => prev + 1)
    else goModeSelect()
  }

  const isLastNow = index >= questions.length - 1
  const correctIndexes = getCorrectIndexes(current)

  return (
    <QuizLayout title={`${quiz.title}（復習）`} subtitle="正解した問題はリストから消えます">
      <div className="kicker">
        <span className="badge">復習</span>
        <span>{index + 1} / {questions.length}</span>
      </div>

      <h2 className="question">{current.question}</h2>
      <QuestionImage q={current} mode="auto" />
      <QuestionImage q={current} purpose="choice" />

      {(current.audioUrl || current.listeningText) && (
        <div className="panelSoft" style={{ margin: '12px 0' }}>
          {current.audioUrl ? (
            <audio controls src={current.audioUrl} preload="none" />
          ) : (
            <div className="listenRow">
              <Button variant="sub" onClick={onListen} disabled={!canSpeak()}>🔊 音声を聞く</Button>
              <Button variant="sub" onClick={() => stopSpeak()}>⏹ 停止</Button>
              {!canSpeak() && <span className="listenHint">この端末/ブラウザでは読み上げが使えない可能性があります</span>}
            </div>
          )}
        </div>
      )}

      {isMultiAnswerQuestion(current) && (
        <div style={{ margin: '8px 0 12px', fontSize: 13, opacity: 0.8 }}>
          この問題は <b>{requiredAnswerCount(current)}つ選択</b> です。
        </div>
      )}

      <div className="choiceList">
        {current.choices.map((c, i) => {
          const selectedNow = selected.includes(i)
          return (
            <Button
              key={i}
              variant="choice"
              onClick={() => toggleChoice(i)}
              disabled={submitted}
              isCorrect={submitted && correctIndexes.includes(i)}
              isWrong={submitted && selectedNow && !correctIndexes.includes(i)}
              style={!submitted && selectedNow ? { outline: '3px solid #60a5fa', outlineOffset: 1 } : undefined}
            >
              {c}
            </Button>
          )
        })}
      </div>

      {!submitted ? (
        <div className="actions">
          <Button variant="main" onClick={submitAnswer} disabled={!isSelectionComplete(current, selected)}>回答する</Button>
          <Button variant="accent" onClick={goModeSelect}>モード選択に戻る</Button>
        </div>
      ) : (
        <div className="explainBox">
          <div className="explainTitle">
            {isCorrect ? '⭕ 正解！（この問題は復習リストから消えます）' : '❌ 不正解（復習に残します）'}
          </div>
          <div style={{ fontWeight: 700, marginBottom: 8 }}>【正解】 {formatCorrectAnswerLabels(current)}</div>
          <QuestionImage q={current} purpose="explanation" />
          {current.explanation && <p className="explainText">{stripLeadingAnswerLabel(current.explanation)}</p>}
          {current.explanationEn ? (
            <div className="mt-3 rounded-2xl border border-sky-200 bg-sky-50 px-4 py-3 text-sm leading-7 text-slate-700">
              <div className="mb-1 text-xs font-bold uppercase tracking-[0.16em] text-sky-700">English</div>
              <div>{current.explanationEn}</div>
            </div>
          ) : null}
          {current.point && (
            <div style={{ marginTop: 12 }}>
              <div style={{ fontWeight: 700, color: '#16a34a' }}>ポイント</div>
              <div className="explainText" style={{ marginTop: 4 }}>{current.point}</div>
            </div>
          )}
          {current.trap && (
            <div style={{ marginTop: 12 }}>
              <div style={{ fontWeight: 700, color: '#dc2626' }}>注意</div>
              <div className="explainText" style={{ marginTop: 4 }}>{current.trap}</div>
            </div>
          )}
          <div className="actions">
            <Button variant="main" onClick={next}>{isCorrect ? '次へ（克服して進む）' : isLastNow ? '終了（モード選択へ）' : '次へ'}</Button>
          </div>
        </div>
      )}
    </QuizLayout>
  )
}
