export type MenuIconName =
  | "home"
  | "mypage"
  | "study"
  | "company"
  | "admin"
  | "plan"
  | "contents"

export type AppMenuItem = {
  href: string
  label: string
  description: string
  icon: MenuIconName
  showFor?: "all" | "personal" | "company" | "company_admin" | "admin"
}

export const APP_MENU: AppMenuItem[] = [
  { href: "/", icon: "home", label: "トップ", description: "ホーム画面へ", showFor: "all" },
  { href: "/mypage", icon: "mypage", label: "マイページ", description: "進捗と学習履歴", showFor: "all" },
  { href: "/select-mode", icon: "study", label: "学習を開始", description: "教材・ゲームを選ぶ", showFor: "all" },
  { href: "/contents", icon: "contents", label: "教材一覧", description: "収録教材を確認", showFor: "all" },
  { href: "/company", icon: "company", label: "企業コード登録", description: "企業契約へ切り替え", showFor: "personal" },
  { href: "/company-admin", icon: "admin", label: "企業管理", description: "学習者の状況を確認", showFor: "company_admin" },
  { href: "/plans", icon: "plan", label: "プラン", description: "利用期間を確認・購入", showFor: "personal" },
]
