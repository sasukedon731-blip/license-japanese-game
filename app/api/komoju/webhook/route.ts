// app/api/komoju/webhook/route.ts
import crypto from "crypto"
import { headers } from "next/headers"
import { NextResponse } from "next/server"
import { adminDb } from "@/app/lib/firebaseAdmin"
import { setUserBillingMerge, setUserIndustryMerge } from "@/app/lib/billingServer"

export const runtime = "nodejs"

type PlanId = "3" | "5" | "7"
type PaymentMethodType = "convenience" | "card"

type PaymentOrder = {
  uid?: string
  plan?: PlanId
  method?: PaymentMethodType
  durationDays?: 30 | 90 | 180
  industry?: string | null
}

function requireEnv(name: string): string {
  const value = process.env[name]
  if (!value) throw new Error(`Missing ${name}`)
  return value
}

function safeEqualHex(a: string, b: string) {
  const aa = Buffer.from(a, "hex")
  const bb = Buffer.from(b, "hex")
  if (aa.length !== bb.length) return false
  return crypto.timingSafeEqual(aa, bb)
}

function verifySignature(rawBody: string, signature: string, secret: string) {
  const computed = crypto
    .createHmac("sha256", secret)
    .update(rawBody, "utf8")
    .digest("hex")

  return safeEqualHex(computed, signature)
}

function parseDurationDays(v: any): 30 | 90 | 180 {
  const n = Number(v)
  if (n === 90) return 90
  if (n === 180) return 180
  return 30
}

function parsePlan(v: any): PlanId | null {
  return v === "3" || v === "5" || v === "7" ? "7" : null
}

function parseMethod(v: any): PaymentMethodType {
  return v === "convenience" ? "convenience" : "card"
}

async function resolveOrder(data: any): Promise<{
  orderId: string | null
  order: PaymentOrder | null
}> {
  const externalOrderNum =
    typeof data?.external_order_num === "string" ? data.external_order_num : null

  if (externalOrderNum) {
    const snap = await adminDb().collection("paymentOrders").doc(externalOrderNum).get()
    if (snap.exists) {
      return { orderId: externalOrderNum, order: snap.data() as PaymentOrder }
    }
  }

  const sessionId = typeof data?.session === "string" ? data.session : null
  if (sessionId) {
    const q = await adminDb()
      .collection("paymentOrders")
      .where("komojuSessionId", "==", sessionId)
      .limit(1)
      .get()

    const doc = q.docs[0]
    if (doc) return { orderId: doc.id, order: doc.data() as PaymentOrder }
  }

  return { orderId: externalOrderNum, order: null }
}

export async function POST(req: Request) {
  try {
    const webhookSecret = requireEnv("KOMOJU_WEBHOOK_SECRET")
    const h = await headers()
    const signature = h.get("x-komoju-signature")

    if (!signature) {
      return NextResponse.json({ error: "Missing x-komoju-signature" }, { status: 400 })
    }

    const rawBody = await req.text()
    if (!verifySignature(rawBody, signature, webhookSecret)) {
      return NextResponse.json({ error: "Bad signature" }, { status: 400 })
    }

    const event = JSON.parse(rawBody)
    const eventType = String(event?.type ?? h.get("x-komoju-event") ?? "")
    const data = event?.data ?? {}

    if (eventType === "ping") {
      return NextResponse.json({ received: true }, { status: 200 })
    }

    const { orderId, order } = await resolveOrder(data)

    if (!order?.uid) {
      console.warn("KOMOJU webhook: order not found", { eventType, orderId })
      return NextResponse.json({ received: true }, { status: 200 })
    }

    const uid = order.uid
    const plan = parsePlan(order.plan)
    const method = parseMethod(order.method)
    const durationDays = parseDurationDays(order.durationDays)
    const komojuPaymentId = typeof data?.id === "string" ? data.id : null
    const komojuSessionId = typeof data?.session === "string" ? data.session : null

    if (eventType === "payment.captured") {
      await setUserBillingMerge(uid, {
        accountType: "personal",
        method: "komoju",
        status: "active",
        ...(plan ? { currentPlan: plan } : {}),
        purchasedDurationDays: durationDays,
        komojuPaymentMethod: method,
        komojuPaymentId,
        komojuSessionId,
        komojuOrderId: orderId,
      })

      if (order.industry) {
        await setUserIndustryMerge(uid, order.industry)
      }

      if (orderId) {
        await adminDb().collection("paymentOrders").doc(orderId).set(
          {
            status: "captured",
            komojuPaymentId,
            capturedAt: new Date(),
            updatedAt: new Date(),
            rawStatus: data?.status ?? null,
          },
          { merge: true }
        )
      }
    } else if (
      eventType === "payment.failed" ||
      eventType === "payment.cancelled" ||
      eventType === "payment.expired"
    ) {
      await setUserBillingMerge(uid, {
        status: eventType === "payment.failed" ? "past_due" : "canceled",
        komojuPaymentId,
        komojuSessionId,
        komojuOrderId: orderId,
      })

      if (orderId) {
        await adminDb().collection("paymentOrders").doc(orderId).set(
          {
            status: eventType.replace("payment.", ""),
            komojuPaymentId,
            updatedAt: new Date(),
            rawStatus: data?.status ?? null,
          },
          { merge: true }
        )
      }
    }

    return NextResponse.json({ received: true }, { status: 200 })
  } catch (e: any) {
    console.error("KOMOJU webhook error:", e)
    return NextResponse.json(
      { error: e?.message ?? "Webhook error" },
      { status: 500 }
    )
  }
}
