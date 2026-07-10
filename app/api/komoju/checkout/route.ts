// app/api/komoju/checkout/route.ts
import { NextResponse } from "next/server"
import { adminAuth, adminDb } from "@/app/lib/firebaseAdmin"
import { setUserBillingMerge } from "@/app/lib/billingServer"

export const runtime = "nodejs"

type DurationDays = 30 | 90 | 180

type Body = {
  idToken: string
  plan: "3" | "5" | "7"
  method: "convenience" | "card"
  durationDays: DurationDays
  industry?: "driver" | "japanese" | "game" | "undecided" | null
}

type KomojuSessionResponse = {
  id?: string
  session_url?: string
  payment?: {
    id?: string
    status?: string
  }
  error?: unknown
  message?: string
}

const FULL_ACCESS_PLAN: Body["plan"] = "7"

const PRICE_TABLE: Record<DurationDays, number> = {
  30: 500,
  90: 1200,
  180: 2000,
}

function requireEnv(name: string) {
  const value = process.env[name]
  if (!value) throw new Error(`Missing ${name}`)
  return value
}

function isValidDuration(v: any): v is DurationDays {
  return v === 30 || v === 90 || v === 180
}

function hasFuturePeriodEnd(value: any) {
  if (!value) return false
  let date: Date | null = null
  if (value instanceof Date) date = value
  else if (typeof value?.toDate === "function") date = value.toDate()
  else {
    const d = new Date(value)
    date = Number.isNaN(d.getTime()) ? null : d
  }
  return !!date && date.getTime() > Date.now()
}

function basicAuth(secretKey: string) {
  return `Basic ${Buffer.from(`${secretKey}:`).toString("base64")}`
}

async function createKomojuSession(payload: Record<string, any>, secretKey: string) {
  const res = await fetch("https://komoju.com/api/v1/sessions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: basicAuth(secretKey),
    },
    body: JSON.stringify(payload),
  })

  const data = (await res.json().catch(() => ({}))) as KomojuSessionResponse
  if (!res.ok) {
    const message =
      data?.message ||
      (typeof data?.error === "string" ? data.error : null) ||
      `KOMOJU session create failed (${res.status})`
    const err = new Error(message) as Error & { status?: number; data?: any }
    err.status = res.status
    err.data = data
    throw err
  }
  return data
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Body

    if (!body?.idToken || !body?.plan || !body?.method) {
      return NextResponse.json({ error: "Bad request" }, { status: 400 })
    }
    if (body.plan !== "3" && body.plan !== "5" && body.plan !== "7") {
      return NextResponse.json({ error: "Bad plan" }, { status: 400 })
    }
    if (body.method !== "convenience" && body.method !== "card") {
      return NextResponse.json({ error: "Bad method" }, { status: 400 })
    }
    if (!isValidDuration(body.durationDays)) {
      return NextResponse.json({ error: "Bad durationDays" }, { status: 400 })
    }

    const appUrl = requireEnv("NEXT_PUBLIC_APP_URL")
    const komojuSecretKey = requireEnv("KOMOJU_SECRET_KEY")
    const decoded = await adminAuth().verifyIdToken(body.idToken)
    const uid = decoded.uid
    const email = typeof decoded.email === "string" ? decoded.email : undefined
    const amount = PRICE_TABLE[body.durationDays]

    const userRef = adminDb().collection("users").doc(uid)
    const userSnapBeforeCheckout = await userRef.get()
    const userBeforeCheckout = userSnapBeforeCheckout.exists ? userSnapBeforeCheckout.data() : null
    if (
      userBeforeCheckout?.accountType === "company" ||
      userBeforeCheckout?.billing?.accountType === "company"
    ) {
      return NextResponse.json({ error: "企業契約ユーザーは支払い不要です。" }, { status: 403 })
    }

    const orderRef = adminDb().collection("paymentOrders").doc()
    const orderId = orderRef.id
    const paymentType = body.method === "convenience" ? "konbini" : "credit_card"

    const sessionPayload: Record<string, any> = {
      amount,
      currency: "JPY",
      return_url: `${appUrl}/plans?checkout=success`,
      external_order_num: orderId,
      payment_types: [paymentType],
      locale: "ja",
      ...(email ? { customer_email: email } : {}),
    }

    let session: KomojuSessionResponse
    try {
      session = await createKomojuSession(sessionPayload, komojuSecretKey)
    } catch (e: any) {
      if (e?.status === 400) {
        const fallbackPayload = { ...sessionPayload }
        delete fallbackPayload.payment_types
        session = await createKomojuSession(fallbackPayload, komojuSecretKey)
      } else {
        throw e
      }
    }

    if (!session?.id || !session?.session_url) {
      throw new Error("KOMOJU session_url was not returned")
    }

    await orderRef.set({
      uid,
      email: email ?? null,
      plan: FULL_ACCESS_PLAN,
      method: body.method,
      durationDays: body.durationDays,
      industry: body.industry ?? "driver",
      amount,
      currency: "JPY",
      status: "pending",
      komojuSessionId: session.id,
      komojuPaymentId: session.payment?.id ?? null,
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    const userSnap = await userRef.get()
    const currentBilling = userSnap.exists ? userSnap.data()?.billing ?? {} : {}
    const keepActive =
      currentBilling?.status === "active" &&
      hasFuturePeriodEnd(currentBilling?.currentPeriodEnd)

    await setUserBillingMerge(uid, {
      accountType: "personal",
      method: "komoju",
      status: keepActive ? "active" : "pending",
      currentPlan: FULL_ACCESS_PLAN,
      komojuPaymentMethod: body.method,
      komojuSessionId: session.id,
      komojuPaymentId: session.payment?.id ?? null,
      komojuOrderId: orderId,
    })

    return NextResponse.json({ url: session.session_url }, { status: 200 })
  } catch (e: any) {
    console.error("KOMOJU checkout error:", e)
    return NextResponse.json(
      { error: e?.message ?? "決済ページの作成に失敗しました" },
      { status: 500 }
    )
  }
}
