"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { signOut } from "firebase/auth"
import { doc, getDoc } from "firebase/firestore"

import AppLogo from "@/app/components/AppLogo"
import { auth, db } from "@/app/lib/firebase"
import { useAuth } from "@/app/lib/useAuth"
import { APP_MENU, type MenuIconName } from "@/app/components/appMenu"

type Props = { title?: string }
type Profile = { accountType: "personal" | "company"; role: string }

function MenuIcon({ name }: { name: MenuIconName }) {
  const common = { width: 21, height: 21, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round" as const, strokeLinejoin: "round" as const }
  const paths: Record<MenuIconName, React.ReactNode> = {
    home: <><path d="m3 11 9-8 9 8"/><path d="M5 10v10h14V10"/><path d="M9 20v-6h6v6"/></>,
    mypage: <><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></>,
    study: <><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z"/></>,
    company: <><path d="M3 21h18"/><path d="M6 21V7l6-4 6 4v14"/><path d="M9 10h1M14 10h1M9 14h1M14 14h1"/></>,
    admin: <><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M7 8h10M7 12h4M7 16h7"/></>,
    plan: <><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 10h18M7 15h4"/></>,
    contents: <><path d="M8 6h13M8 12h13M8 18h13"/><circle cx="3" cy="6" r="1"/><circle cx="3" cy="12" r="1"/><circle cx="3" cy="18" r="1"/></>,
  }
  return <svg {...common} aria-hidden="true">{paths[name]}</svg>
}

export default function AppHeader({ title }: Props) {
  const router = useRouter()
  const pathname = usePathname()
  const { user } = useAuth()
  const [open, setOpen] = useState(false)
  const [profile, setProfile] = useState<Profile>({ accountType: "personal", role: "user" })

  useEffect(() => {
    if (!user) return
    getDoc(doc(db, "users", user.uid)).then((snap) => {
      const data = snap.data()
      setProfile({
        accountType: data?.accountType === "company" ? "company" : "personal",
        role: typeof data?.role === "string" ? data.role : "user",
      })
    }).catch(() => undefined)
  }, [user])

  useEffect(() => {
    if (!open) return
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && setOpen(false)
    const previous = document.body.style.overflow
    document.body.style.overflow = "hidden"
    window.addEventListener("keydown", onKey)
    return () => {
      document.body.style.overflow = previous
      window.removeEventListener("keydown", onKey)
    }
  }, [open])

  const menu = useMemo(() => APP_MENU.filter((item) => {
    if (item.showFor === "all" || !item.showFor) return true
    if (item.showFor === "personal") return profile.accountType === "personal" && profile.role === "user"
    if (item.showFor === "company") return profile.accountType === "company"
    return profile.role === item.showFor
  }), [profile])

  const handleLogout = async () => {
    try { await signOut(auth) } finally { router.push("/") }
  }

  return (
    <>
      <header className="appHeader" aria-label="ヘッダー">
        <div className="appHeaderLeft">
          <Link href="/" className="appHeaderBrand" aria-label="トップへ">
            <span className="appHeaderLogo"><AppLogo size={40} priority /></span>
            <span className="appHeaderBrandText">
              <span className="appHeaderName">外免切替</span>
              <span className="appHeaderSubName">Japanese Learning App</span>
            </span>
          </Link>
          {title ? <span className="appHeaderTitle">{title}</span> : null}
        </div>

        <button className="hamburgerBtn" aria-label="メニューを開く" aria-expanded={open} onClick={() => setOpen(true)} type="button">
          <span/><span/><span/>
        </button>
      </header>

      <div className={`drawerOverlay ${open ? "drawerOverlayOpen" : ""}`} onClick={() => setOpen(false)} aria-hidden={!open}>
        <aside className={`drawerPanel ${open ? "drawerPanelOpen" : ""}`} onClick={(e) => e.stopPropagation()} aria-label="メニュー">
          <div className="drawerHead">
            <div className="drawerBrand">
              <span className="drawerBrandLogo"><AppLogo size={48} priority /></span>
              <div><strong>外免切替</strong><span>Japanese Learning App</span></div>
            </div>
            <button className="drawerClose" aria-label="メニューを閉じる" onClick={() => setOpen(false)} type="button">×</button>
          </div>

          <nav className="drawerBody">
            {menu.map((item) => {
              const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href)
              return (
                <Link key={item.href} href={item.href} className={`drawerLink ${active ? "drawerLinkActive" : ""}`} onClick={() => setOpen(false)}>
                  <span className="drawerIcon"><MenuIcon name={item.icon}/></span>
                  <span className="drawerLinkText"><strong>{item.label}</strong><small>{item.description}</small></span>
                  <span className="drawerArrow">›</span>
                </Link>
              )
            })}
          </nav>

          <div className="drawerFooter">
            {profile.accountType === "company" ? <div className="drawerAccountBadge">企業契約アカウント</div> : null}
            {user ? (
              <button className="drawerLogout" onClick={handleLogout} type="button">ログアウト</button>
            ) : (
              <button className="drawerLogin" onClick={() => router.push("/login")} type="button">ログイン</button>
            )}
          </div>
        </aside>
      </div>
    </>
  )
}
