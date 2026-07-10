"use client"

import Link from "next/link"

export default function KonbiniGuideNotice() {
  return (
    <section
      style={{
        border: "1px solid #fde68a",
        background: "#fffbeb",
        borderRadius: 18,
        padding: 16,
      }}
    >
      <div style={{ fontWeight: 900, fontSize: 16, color: "#92400e" }}>
        コンビニ決済について
      </div>

      <div
        style={{
          marginTop: 8,
          fontSize: 14,
          lineHeight: 1.8,
          color: "#78350f",
        }}
      >
        コンビニ決済では、お支払い番号が表示されたあとに元の画面へ自動で戻らない場合があります。
        番号を確認したあと、この画面を閉じてください。
        お支払い後の反映状況は
        <Link
          href="/mypage"
          style={{
            marginLeft: 4,
            marginRight: 4,
            color: "#92400e",
            fontWeight: 900,
            textDecoration: "underline",
          }}
        >
          マイページ
        </Link>
        で確認できます。
      </div>
    </section>
  )
}