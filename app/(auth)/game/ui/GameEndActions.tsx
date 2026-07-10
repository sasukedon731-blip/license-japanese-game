"use client"

import { ReactNode } from "react"
import { useRouter } from "next/navigation"
import Button from "@/app/components/Button"

type Props = {
  onRetry: () => void
  children?: ReactNode
  className?: string
}

export default function GameEndActions({ onRetry, children, className }: Props) {
  const router = useRouter()

  return (
    <div className={className ?? ""} style={{ display: "grid", gap: 10 }}>
      <Button onClick={onRetry}>もう1回</Button>

      <Button
        onClick={() => {
          router.push("/game")
        }}
      >
        ゲームTOPへ
      </Button>

      {children ? <div style={{ display: "grid", gap: 10 }}>{children}</div> : null}
    </div>
  )
}