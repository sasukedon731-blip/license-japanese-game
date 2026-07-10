import { Suspense } from "react"
import ReviewClientWrapper from "./ReviewClientWrapper"

export const dynamic = "force-dynamic"

export default function Page() {
  return (
    <Suspense fallback={null}>
      <ReviewClientWrapper />
    </Suspense>
  )
}
