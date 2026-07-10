"use client"

import { useEffect, useMemo, useRef, useState } from "react"

type Props = {
  src: string
  title?: string
  className?: string
}

function formatTime(sec: number) {
  if (!Number.isFinite(sec) || sec < 0) return "0:00"
  const m = Math.floor(sec / 60)
  const s = Math.floor(sec % 60)
  return `${m}:${String(s).padStart(2, "0")}`
}

export default function AudioPlayerButton({
  src,
  title = "音声を聞いて答えてください",
}: Props) {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isReady, setIsReady] = useState(false)
  const [duration, setDuration] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)

  const progress = useMemo(() => {
    if (!duration || !Number.isFinite(duration)) return 0
    return Math.min(100, Math.max(0, (currentTime / duration) * 100))
  }, [currentTime, duration])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const onLoaded = () => {
      setIsReady(true)
      setDuration(audio.duration || 0)
    }
    const onTimeUpdate = () => {
      setCurrentTime(audio.currentTime || 0)
    }
    const onEnded = () => {
      setIsPlaying(false)
      setCurrentTime(audio.duration || 0)
    }
    const onPause = () => setIsPlaying(false)
    const onPlay = () => setIsPlaying(true)

    audio.addEventListener("loadedmetadata", onLoaded)
    audio.addEventListener("timeupdate", onTimeUpdate)
    audio.addEventListener("ended", onEnded)
    audio.addEventListener("pause", onPause)
    audio.addEventListener("play", onPlay)

    return () => {
      audio.removeEventListener("loadedmetadata", onLoaded)
      audio.removeEventListener("timeupdate", onTimeUpdate)
      audio.removeEventListener("ended", onEnded)
      audio.removeEventListener("pause", onPause)
      audio.removeEventListener("play", onPlay)
    }
  }, [src])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    audio.pause()
    audio.currentTime = 0
    setIsPlaying(false)
    setCurrentTime(0)
    setDuration(0)
    setIsReady(false)
  }, [src])

  async function togglePlay() {
    const audio = audioRef.current
    if (!audio) return
    try {
      if (audio.paused) {
        await audio.play()
      } else {
        audio.pause()
      }
    } catch (e) {
      console.error("audio play error", e)
    }
  }

  function replay() {
    const audio = audioRef.current
    if (!audio) return
    audio.currentTime = 0
    audio.play().catch((e) => {
      console.error("audio replay error", e)
    })
  }

  return (
    <div
      style={{
        margin: "12px 0 16px",
        border: "1px solid #dbe3f4",
        borderRadius: 24,
        background: "linear-gradient(135deg, #eef2ff 0%, #ffffff 45%, #eef8ff 100%)",
        boxShadow: "0 10px 28px rgba(37,99,235,0.10)",
        padding: 16,
      }}
    >
      <audio ref={audioRef} src={src} preload="metadata" />

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 14,
        }}
      >
        <button
          type="button"
          onClick={togglePlay}
          aria-label={isPlaying ? "音声を停止" : "音声を再生"}
          style={{
            width: 64,
            height: 64,
            borderRadius: "9999px",
            border: "none",
            cursor: "pointer",
            color: "#fff",
            fontSize: 26,
            fontWeight: 900,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "linear-gradient(135deg, #4f46e5 0%, #0ea5e9 100%)",
            boxShadow: isPlaying
              ? "0 0 0 8px rgba(14,165,233,0.15), 0 10px 20px rgba(37,99,235,0.22)"
              : "0 10px 20px rgba(37,99,235,0.22)",
            transform: isPlaying ? "scale(1.03)" : "scale(1)",
            transition: "all .15s ease",
            flexShrink: 0,
          }}
        >
          {isPlaying ? "⏸" : "▶"}
        </button>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: 12,
              alignItems: "flex-start",
              flexWrap: "wrap",
            }}
          >
            <div>
              <div
                style={{
                  fontSize: 18,
                  fontWeight: 900,
                  color: "#0f172a",
                  lineHeight: 1.35,
                }}
              >
                {title}
              </div>
              <div
                style={{
                  marginTop: 4,
                  fontSize: 13,
                  color: "#64748b",
                  fontWeight: 700,
                }}
              >
                {isPlaying ? "再生中..." : isReady ? "ボタンを押して再生" : "読み込み中..."}
              </div>
            </div>

            <div
              style={{
                fontSize: 14,
                color: "#475569",
                fontWeight: 800,
                whiteSpace: "nowrap",
              }}
            >
              {formatTime(currentTime)} / {formatTime(duration)}
            </div>
          </div>

          <div
            style={{
              marginTop: 12,
              height: 10,
              borderRadius: 9999,
              background: "#dbeafe",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: `${progress}%`,
                height: "100%",
                borderRadius: 9999,
                background: "linear-gradient(90deg, #4f46e5 0%, #0ea5e9 100%)",
                transition: "width .15s ease",
              }}
            />
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              marginTop: 12,
            }}
          >
            <button
              type="button"
              onClick={replay}
              style={{
                borderRadius: 9999,
                border: "1px solid #cbd5e1",
                background: "#fff",
                color: "#334155",
                padding: "8px 14px",
                fontSize: 13,
                fontWeight: 800,
                cursor: "pointer",
              }}
            >
              もう一回
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
