'use client'

import { useMemo } from 'react'
import { useRouter } from 'next/navigation'
import type { Quiz, QuizType } from '@/app/data/types'
import Button from '@/app/components/Button'
import Card from '@/app/components/Card'

type Props = {
  quiz: Quiz
  quizType: QuizType
}

export default function QuizClient({ quiz, quizType }: Props) {
  const router = useRouter()

  const isListening = useMemo(() => {
    // ✅ quizType固定にしない：
    // - JLPT N4/N3/N2 に聴解を混ぜても自動で「リスニング教材」扱いになる
    // - 現場リスニングのような「全問聴解」もOK
    return quiz.questions.some((q) => !!q.audioUrl || !!q.listeningText)
  }, [quiz.questions])

  return (
    <main className="container">
      <Card>
        <h1 style={{ marginBottom: 8 }}>{quiz.title}</h1>
        <p style={{ marginBottom: 12 }}>全 {quiz.questions.length} 問</p>

        {/* ✅ MP3が無い状態でも出題できることを明示（TTS対応前提） */}
        {isListening && (
          <div
            style={{
              marginBottom: 16,
              padding: 12,
              borderRadius: 12,
              border: '1px solid #e5e7eb',
              background: '#f9fafb',
              color: '#111827',
              lineHeight: 1.6,
              fontSize: 14,
            }}
          >
            <b>この教材にはリスニング問題が含まれます。</b>
            <br />
            MP3が無くても、問題画面の「🔊 音声を聞く」ボタン（読み上げ機能）で学習できます。
            <br />
            ※ 端末によっては読み上げが使えない場合があります（その場合は別ブラウザをお試しください）。
          </div>
        )}

        <div style={{ display: 'grid', gap: 12 }}>
          <Button
            variant="main"
            onClick={() => router.push(`/normal?type=${encodeURIComponent(quizType)}`)}
          >
            通常問題
          </Button>

          <Button
            variant="main"
            onClick={() => router.push(`/exam?type=${encodeURIComponent(quizType)}`)}
          >
            模擬試験
          </Button>

          <Button
            variant="main"
            onClick={() => router.push(`/review?type=${encodeURIComponent(quizType)}`)}
          >
            復習問題
          </Button>

          <Button
            variant="accent"
            onClick={() => router.push(`/select-mode?type=${encodeURIComponent(quizType)}`)}
          >
            モード選択に戻る
          </Button>

          <Button variant="accent" onClick={() => router.push('/')}>
            TOPへ戻る
          </Button>
        </div>
      </Card>
    </main>
  )
}
