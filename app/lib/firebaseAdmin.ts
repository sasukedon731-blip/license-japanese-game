import "server-only"

import { cert, getApps, initializeApp } from "firebase-admin/app"
import { getAuth } from "firebase-admin/auth"
import { getFirestore } from "firebase-admin/firestore"

function getServiceAccount() {
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT_KEY
  if (!raw) {
    throw new Error("Missing FIREBASE_SERVICE_ACCOUNT_KEY env var (JSON)")
  }

  let parsed: any
  try {
    parsed = JSON.parse(raw)
  } catch {
    throw new Error("FIREBASE_SERVICE_ACCOUNT_KEY must be valid JSON")
  }

  return {
    projectId: parsed.project_id,
    clientEmail: parsed.client_email,
    privateKey: parsed.private_key.replace(/\\n/g, "\n"),
  }
}

export function getAdminApp() {
  if (getApps().length) return getApps()[0]!
  const serviceAccount = getServiceAccount()

  return initializeApp({
    credential: cert(serviceAccount),
  })
}

export const adminAuth = () => getAuth(getAdminApp())
export const adminDb = () => getFirestore(getAdminApp())