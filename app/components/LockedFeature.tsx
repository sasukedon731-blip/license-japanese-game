"use client"

import { useRouter } from "next/navigation"

type LockedFeatureProps = {
  title: string
  description?: string
  onClickPlan?: () => void
  ctaLabel?: string
}

export default function LockedFeature({
  title,
  description,
  onClickPlan,
  ctaLabel = "プランを見る",
}: LockedFeatureProps) {
  const router = useRouter()

  return (
    <div className="bg-white rounded-2xl shadow p-6 text-center">
      <h2 className="text-lg font-bold mb-2">🔒 この機能は有料プランで利用できます</h2>

      <h3 className="text-md font-semibold mb-3">{title}</h3>

      <p className="text-sm text-gray-600 mb-4">
        {description || "実践的な日本語を学習し、仕事や試験に活かせます。"}
      </p>

      <div className="bg-gray-100 rounded-lg p-3 text-left text-sm mb-4">
        <p className="font-semibold">📚 この教材でできること</p>
        <ul className="mt-1 space-y-1 text-gray-700">
          <li>・現場で使う日本語を学習</li>
          <li>・問題形式で理解を深める</li>
          <li>・実践的な会話力を向上</li>
        </ul>
      </div>

      <div className="text-xs text-gray-500 mb-4">
        無料ユーザーは日本語バトルを1日1回利用できます。有料プランでは選んだ教材を1か月利用できます。
      </div>

      <button
        onClick={() => (onClickPlan ? onClickPlan() : router.push("/plans"))}
        className="bg-blue-600 text-white px-5 py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
      >
        {ctaLabel}
      </button>
    </div>
  )
}
