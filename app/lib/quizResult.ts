import { collection, query, getDocs, orderBy, doc, setDoc, serverTimestamp } from "firebase/firestore"
import { db } from "./firebase"

export type QuizResult = {
  score: number
  total: number
  mode: string
  createdAt: any
}

// 指定ユーザーの過去結果を取得
export async function getQuizResults(uid: string): Promise<QuizResult[]> {
  const q = query(
    collection(db, "users", uid, "results"),
    orderBy("createdAt", "desc")
  )
  const snapshot = await getDocs(q)
  const results: QuizResult[] = []
  snapshot.forEach(doc => {
    results.push(doc.data() as QuizResult)
  })
  return results
}

// クイズ結果を保存
export async function saveQuizResult(
  uid: string,
  result: Omit<QuizResult, "createdAt">
) {
  const ref = doc(db, "users", uid, "results", Date.now().toString())

  await setDoc(ref, {
    ...result,
    createdAt: serverTimestamp(),
  })
}
