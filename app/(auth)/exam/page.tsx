import { Suspense } from "react"
import ExamClientWrapper from "./ExamClientWrapper"

export const dynamic = "force-dynamic"

export default function Page() {
  return (
    <Suspense fallback={null}>
      <ExamClientWrapper />
    </Suspense>
  )
}
