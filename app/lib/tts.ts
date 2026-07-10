// app/lib/tts.ts

export type SpeakOptions = {
  lang?: string
  rate?: number
  pitch?: number
}

let currentUtterance: SpeechSynthesisUtterance | null = null

export function canSpeak(): boolean {
  if (typeof window === 'undefined') return false
  return !!window.speechSynthesis && typeof window.SpeechSynthesisUtterance !== 'undefined'
}

export function stopSpeak() {
  if (typeof window === 'undefined') return
  if (!window.speechSynthesis) return
  window.speechSynthesis.cancel()
  currentUtterance = null
}

export function speak(text: string, options: SpeakOptions = {}) {
  return new Promise<void>((resolve, reject) => {
    if (!text?.trim()) {
      resolve()
      return
    }
    if (!canSpeak()) {
      reject(new Error('SpeechSynthesis is not supported'))
      return
    }

    stopSpeak()

    const uttr = new SpeechSynthesisUtterance(text)
    uttr.lang = options.lang ?? 'ja-JP'
    uttr.rate = options.rate ?? 0.9
    uttr.pitch = options.pitch ?? 1.0

    uttr.onend = () => {
      if (currentUtterance === uttr) currentUtterance = null
      resolve()
    }
    uttr.onerror = () => {
      if (currentUtterance === uttr) currentUtterance = null
      reject(new Error('SpeechSynthesis error'))
    }

    currentUtterance = uttr
    window.speechSynthesis.speak(uttr)
  })
}
