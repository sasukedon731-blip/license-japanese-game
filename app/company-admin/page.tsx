

import BusinessDashboard from "@/app/components/business-dashboard/BusinessDashboard"
export default function Page() {
  return (
    <BusinessDashboard
      appName="運転免許日本語"
      appHomeHref="/select-mode"
      appHomeLabel="アプリへ戻る"
      loginHref="/login"
    />
  )
}
