'use client'

import { useEffect, useMemo, useState } from 'react'
import Button from '@/app/components/Button'
import { canSpeak, speak, stopSpeak } from '@/app/lib/tts'

type Props = {
  text?: string
  /** localStorage/sessionStorage 用のキー。問題ごとに一意にするのがおすすめ */
  storageKeyPrefix?: string

  /** 自動再生を許可するか（examはfalse推奨） */
  allowAutoPlay?: boolean

  /** 再生回数の上限（examは 2 など）。未指定なら無制限 */
  maxPlays?: number

  /** 再生状態の通知（examで回答ボタンをロックする用） */
  onSpeakingChange?: (speaking: boolean) => void
}

export default function ListeningControls({
  text,
  storageKeyPrefix = 'listening',
  allowAutoPlay = true,
  maxPlays,
  onSpeakingChange,
}: Props) {
  const supported = useMemo(() => canSpeak(), [])

  const keyAuto = `${storageKeyPrefix}-tts-auto`
  const keyRate = `${storageKeyPrefix}-tts-rate`
  const keyPlays = `${storageKeyPrefix}-tts-plays`

  const [isSpeaking, setIsSpeaking] = useState(false)

  const [autoPlay, setAutoPlay] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false
    return localStorage.getItem(keyAuto) === '1'
  })

  const [rate, setRate] = useState<number>(() => {
    if (typeof window === 'undefined') return 1.0
    const v = Number(localStorage.getItem(keyRate) || '1.0')
    return Number.isFinite(v) ? v : 1.0
  })

  const [playsUsed, setPlaysUsed] = useState<number>(() => {
    if (typeof window === 'undefined') return 0
    const v = Number(sessionStorage.getItem(keyPlays) || '0')
    return Number.isFinite(v) ? v : 0
  })

  const canPlayMore = maxPlays == null ? true : playsUsed < maxPlays

  const setSpeaking = (v: boolean) => {
    setIsSpeaking(v)
    onSpeakingChange?.(v)
  }

  useEffect(() => {
    return () => {
      stopSpeak()
      setSpeaking(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

useEffect(() => {
  if (typeof window === "undefined") return
  const v = Number(sessionStorage.getItem(keyPlays) || "0")
  setPlaysUsed(Number.isFinite(v) ? v : 0)
  // speakingも切っておくと安全（問題切替時の音切れ対策）
  stopSpeak()
  setSpeaking(false)
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [keyPlays])

  useEffect(() => {
    if (!supported || !allowAutoPlay || !autoPlay || !text?.trim()) return
    if (!canPlayMore) return

    ;(async () => {
      try {
        // 自動再生も回数に含める
        const next = playsUsed + 1
        setPlaysUsed(next)
        if (typeof window !== 'undefined') sessionStorage.setItem(keyPlays, String(next))

        setSpeaking(true)
        await speak(text, { lang: 'ja-JP', rate, pitch: 1.0 })
      } catch {
      } finally {
        setSpeaking(false)
      }
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [supported, allowAutoPlay, autoPlay, text, rate])

  const onPlay = async () => {
    if (!supported || !text?.trim()) return
    if (!canPlayMore) return

    try {
      const next = playsUsed + 1
      setPlaysUsed(next)
      if (typeof window !== 'undefined') sessionStorage.setItem(keyPlays, String(next))

      setSpeaking(true)
      await speak(text, { lang: 'ja-JP', rate, pitch: 1.0 })
    } catch {
    } finally {
      setSpeaking(false)
    }
  }

  const onStop = () => {
    stopSpeak()
    setSpeaking(false)
  }

  const onReplay = async () => {
    onStop()
    await onPlay()
  }

  const toggleAuto = () => {
    const next = !autoPlay
    setAutoPlay(next)
    if (typeof window !== 'undefined') localStorage.setItem(keyAuto, next ? '1' : '0')
  }

  const changeRate = (next: number) => {
    setRate(next)
    if (typeof window !== 'undefined') localStorage.setItem(keyRate, String(next))
  }

  if (!text?.trim()) return null

  return (
    <div style={{ margin: '12px 0' }}>
      {/* ▶️ ⏹ 🔁 */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: 120 }}>
          <Button
            variant="main"
            onClick={onPlay}
            disabled={!supported || isSpeaking || !canPlayMore}
          >
            {isSpeaking ? '🔊 再生中…' : '▶️ 再生'}
            {maxPlays != null ? `（${playsUsed}/${maxPlays}）` : ''}
          </Button>
        </div>

        <div style={{ flex: 1, minWidth: 120 }}>
          <Button variant="accent" onClick={onStop} disabled={!supported}>
            ⏹ 停止
          </Button>
        </div>

        <div style={{ flex: 1, minWidth: 120 }}>
          <Button
            variant="success"
            onClick={onReplay}
            disabled={!supported || !canPlayMore}
          >
            🔁 もう一度
            {maxPlays != null ? `（残り${Math.max(0, maxPlays - playsUsed)}）` : ''}
          </Button>
        </div>
      </div>

      {/* 設定系 */}
      <div
        style={{
          marginTop: 10,
          display: 'flex',
          gap: 14,
          flexWrap: 'wrap',
          alignItems: 'center',
          opacity: supported ? 1 : 0.7,
        }}
      >
        {/* examは自動再生オフ推奨 */}
        <Button variant="sub" onClick={toggleAuto} disabled={!supported || !allowAutoPlay}>
          {allowAutoPlay ? (autoPlay ? '自動再生：ON' : '自動再生：OFF') : '自動再生：OFF'}
        </Button>

        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <span style={{ fontSize: 12, opacity: 0.8 }}>速度</span>
          <Button variant="sub" onClick={() => changeRate(0.9)} disabled={!supported}>
            0.9
          </Button>
          <Button variant="sub" onClick={() => changeRate(1.0)} disabled={!supported}>
            1.0
          </Button>
          <Button variant="sub" onClick={() => changeRate(1.1)} disabled={!supported}>
            1.1
          </Button>
        </div>

        {maxPlays != null && (
          <span style={{ fontSize: 12, opacity: 0.8 }}>
            ※ 模擬試験では再生回数に制限があります
          </span>
        )}
      </div>
    </div>
  )
}
