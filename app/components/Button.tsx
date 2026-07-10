"use client"

import React from "react"

export type Variant =
  | "main"
  | "sub"
  | "accent"
  | "success"
  | "danger"
  | "ghost"
  | "choice"

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant
  isCorrect?: boolean
  isWrong?: boolean
}

export default function Button({
  children,
  variant = "main",
  isCorrect,
  isWrong,
  className = "",
  ...props
}: Props) {
  const classes = ["btn"] as string[]

  switch (variant) {
    case "main":
      classes.push("btnPrimary")
      break

    case "sub":
      classes.push("btnSub")
      break

    case "accent":
      classes.push("btnAccent")
      break

    case "success":
      classes.push("btnSuccess")
      break

    case "danger":
      classes.push("btnDanger")
      break

    case "ghost":
      classes.push("btnGhost")
      break

    case "choice":
      classes.push("choice")
      if (isCorrect) classes.push("choiceCorrect")
      if (isWrong) classes.push("choiceWrong")
      break
  }

  if (className) classes.push(className)

  return (
    <button {...props} className={classes.join(" ")}>
      {children}
    </button>
  )
}
