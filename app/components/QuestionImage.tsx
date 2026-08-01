// app/components/QuestionImage.tsx
'use client'

import type { Question } from '@/app/data/types'
import {
  resolveQuestionImageSource,
  type QuestionImagePurpose,
} from './questionImageSource'

type Props = {
  q: Question
  size?: number
  mode?: 'sign' | 'auto'
  purpose?: QuestionImagePurpose
}

export default function QuestionImage({
  q,
  size = 240,
  mode = 'auto',
  purpose = 'question',
}: Props) {
  const src = resolveQuestionImageSource(q, purpose)

  if (!src) return null

  const isSign =
    purpose === 'question' && !!q.signId && (!q.imageUrl || mode === 'sign')

  const alt =
    purpose === 'choice'
      ? q.choiceImageAlt || '選択画像'
      : purpose === 'explanation'
        ? q.explanationImageAlt || '解説画像'
        : q.imageAlt || (q.signId ? '標識' : '問題の画像')

  return (
    <div
      style={{
        margin: '12px 0',
        padding: 10,
        borderRadius: 12,
        border: '1px solid #e5e7eb',
        background: '#fff',
        display: isSign ? 'flex' : 'block',
        justifyContent: isSign ? 'center' : undefined,
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        style={{
          width: isSign ? size : '100%',
          maxWidth: '100%',
          height: 'auto',
          display: 'block',
          borderRadius: 10,
          objectFit: 'contain',
        }}
      />
    </div>
  )
}
