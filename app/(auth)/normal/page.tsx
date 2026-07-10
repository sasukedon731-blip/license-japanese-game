import { Suspense } from "react"
import NormalClientWrapper from "./NormalClientWrapper"

export const dynamic = "force-dynamic"

export default function Page() {
  return (
    <Suspense fallback={null}>
      <NormalClientWrapper />
    </Suspense>
  )
}
