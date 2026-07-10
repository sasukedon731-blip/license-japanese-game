export type AppMenuItem = {
  href: string
  label: string
  icon: string
}

export const APP_MENU: AppMenuItem[] = [
  { href: "/", icon: "⌂", label: "トップ" },
  { href: "/mypage", icon: "□", label: "マイページ" },
  { href: "/select-mode", icon: "✓", label: "学習を開始" },
  { href: "/company", icon: "◇", label: "企業コード登録" },
  { href: "/company-admin", icon: "▦", label: "企業管理" },
  { href: "/plans", icon: "Y", label: "プラン" },
  { href: "/contents", icon: "≡", label: "教材一覧" },
]
