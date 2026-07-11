"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { signOut } from "firebase/auth"

import Button from "@/app/components/Button"
import AppLogo from "@/app/components/AppLogo"
import { auth } from "@/app/lib/firebase"
import { useAuth } from "@/app/lib/useAuth"
import { APP_MENU } from "@/app/components/appMenu"

const APP_NAME = "外免切替 Japanese Learning App"

type Props = {
  title?: string
}

export default function AppHeader({ title }: Props) {
  const router = useRouter()
  const pathname = usePathname()
  const { user } = useAuth()
  const [open, setOpen] = useState(false)

  const close = () => setOpen(false)
  const isTop = pathname === "/"

  const handleLogout = async () => {
    try {
      await signOut(auth)
    } finally {
      router.push("/")
    }
  }

  return (
    <>
      <header className="appHeader" aria-label="header">
        <div className="appHeaderLeft">
          <Link href="/" className="appHeaderBrand" aria-label="トップへ">
            <span className="appHeaderLogo">
              <AppLogo size={28} priority />
            </span>
            <span className="appHeaderName">{APP_NAME}</span>
          </Link>
          {title ? <span className="appHeaderTitle">{title}</span> : null}
        </div>

        {!isTop ? (
          <button className="hamburgerBtn" aria-label="メニュー" onClick={() => setOpen(true)} type="button">
            ≡
          </button>
        ) : null}
      </header>

      {open ? (
        <div className="drawerOverlay" onClick={close} role="dialog" aria-label="menu">
          <div className="drawerPanel" onClick={(e) => e.stopPropagation()}>
            <div className="drawerHead">
              <div style={{ fontWeight: 900 }}>メニュー</div>
              <button className="drawerClose" aria-label="閉じる" onClick={close} type="button">
                ×
              </button>
            </div>

            <div className="drawerBody">
              {APP_MENU.map((it) => (
                <Link key={it.href} href={it.href} className="drawerLink" onClick={close}>
                  <span className="drawerIcon" aria-hidden="true">{it.icon}</span>
                  <span className="drawerLabel">{it.label}</span>
                </Link>
              ))}

              <div className="drawerDivider" />

              {user ? (
                <Button
                  variant="danger"
                  onClick={async () => {
                    close()
                    await handleLogout()
                  }}
                >
                  ログアウト
                </Button>
              ) : (
                <Button
                  variant="main"
                  onClick={() => {
                    close()
                    router.push("/login")
                  }}
                >
                  ログイン
                </Button>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </>
  )
}
