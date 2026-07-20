import { after, before, test } from "node:test"
import fs from "node:fs"
import {
  assertFails,
  assertSucceeds,
  initializeTestEnvironment,
} from "@firebase/rules-unit-testing"
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore"

const PROJECT_ID = "demo-license-japanese-game"
let testEnv
const user = (uid) => testEnv.authenticatedContext(uid).firestore()
const guest = () => testEnv.unauthenticatedContext().firestore()

before(async () => {
  testEnv = await initializeTestEnvironment({
    projectId: PROJECT_ID,
    firestore: { rules: fs.readFileSync("firestore.rules", "utf8") },
  })
  await testEnv.withSecurityRulesDisabled(async (context) => {
    const db = context.firestore()
    await Promise.all([
      setDoc(doc(db, "users", "learnerA"), {
        uid: "learnerA", role: "user", accountType: "company",
        companyCode: "COMPANY_A", billing: { accountType: "company", method: "company", status: "active" },
      }),
      setDoc(doc(db, "users", "learnerB"), {
        uid: "learnerB", role: "user", accountType: "company", companyCode: "COMPANY_B",
      }),
      setDoc(doc(db, "users", "companyAdminA"), {
        uid: "companyAdminA", role: "company_admin", accountType: "company", companyCode: "COMPANY_A",
      }),
      setDoc(doc(db, "users", "companyAdminB"), {
        uid: "companyAdminB", role: "company_admin", accountType: "company", companyCode: "COMPANY_B",
      }),
      setDoc(doc(db, "users", "rootAdmin"), { uid: "rootAdmin", role: "admin" }),
      setDoc(doc(db, "users", "personalUser"), {
        uid: "personalUser", role: "user", accountType: "personal",
      }),
      setDoc(doc(db, "users", "learnerA", "results", "result1"), {
        quizType: "gaikoku-license", score: 8, total: 10,
      }),
      setDoc(doc(db, "users", "learnerA", "progress", "gaikoku-license"), {
        totalSessions: 3, lastStudyDate: "2026-07-20",
      }),
      setDoc(doc(db, "companies", "COMPANY_A"), { name: "Company A", active: true }),
      setDoc(doc(db, "companies", "COMPANY_B"), { name: "Company B", active: true }),
      setDoc(doc(db, "companies", "COMPANY_INACTIVE"), {
        name: "Inactive Company", active: false,
      }),
    ])
  })
})

after(async () => testEnv?.cleanup())

test("01 [DENY] unauthenticated user cannot read users", async () => {
  await assertFails(getDoc(doc(guest(), "users", "learnerA")))
})
test("02 [ALLOW] learner can read own user document", async () => {
  await assertSucceeds(getDoc(doc(user("learnerA"), "users", "learnerA")))
})
test("03 [DENY] learner cannot read another user", async () => {
  await assertFails(getDoc(doc(user("learnerA"), "users", "learnerB")))
})
test("04 [ALLOW] company admin can query users in own company", async () => {
  const users = collection(user("companyAdminA"), "users")
  await assertSucceeds(getDocs(query(users, where("companyCode", "==", "COMPANY_A"))))
})
test("05 [DENY] company admin cannot query another company", async () => {
  const users = collection(user("companyAdminA"), "users")
  await assertFails(getDocs(query(users, where("companyCode", "==", "COMPANY_B"))))
})
test("06 [DENY] company admin cannot list all users", async () => {
  await assertFails(getDocs(collection(user("companyAdminA"), "users")))
})
test("07 [ALLOW] admin can read management data", async () => {
  await assertSucceeds(getDoc(doc(user("rootAdmin"), "users", "learnerB")))
})
test("08 [ALLOW] learner can read own results", async () => {
  await assertSucceeds(getDoc(doc(user("learnerA"), "users", "learnerA", "results", "result1")))
})
test("09 [ALLOW] learner can write own results", async () => {
  await assertSucceeds(setDoc(doc(user("learnerA"), "users", "learnerA", "results", "result2"), {
    quizType: "road-signs", score: 9, total: 10,
  }))
})
test("10 [ALLOW] same-company admin can read results", async () => {
  await assertSucceeds(getDoc(doc(user("companyAdminA"), "users", "learnerA", "results", "result1")))
})
test("11 [DENY] other-company admin cannot read results", async () => {
  await assertFails(getDoc(doc(user("companyAdminB"), "users", "learnerA", "results", "result1")))
})
test("12 [ALLOW] learner can read own progress", async () => {
  await assertSucceeds(getDoc(doc(user("learnerA"), "users", "learnerA", "progress", "gaikoku-license")))
})
test("13 [ALLOW] learner can write own progress", async () => {
  await assertSucceeds(setDoc(doc(user("learnerA"), "users", "learnerA", "progress", "road-signs"), {
    totalSessions: 2,
  }))
})
test("14 [ALLOW] same-company admin can read progress", async () => {
  await assertSucceeds(getDoc(doc(user("companyAdminA"), "users", "learnerA", "progress", "gaikoku-license")))
})
test("15 [DENY] other-company admin cannot read progress", async () => {
  await assertFails(getDoc(doc(user("companyAdminB"), "users", "learnerA", "progress", "gaikoku-license")))
})
test("16 [DENY] learner cannot change role", async () => {
  await assertFails(updateDoc(doc(user("learnerA"), "users", "learnerA"), { role: "admin" }))
})
test("17 [DENY] learner cannot change companyCode", async () => {
  await assertFails(updateDoc(doc(user("learnerA"), "users", "learnerA"), { companyCode: "COMPANY_B" }))
})
test("18 [DENY] learner cannot change billing", async () => {
  await assertFails(updateDoc(doc(user("learnerA"), "users", "learnerA"), { billing: { status: "canceled" } }))
})
test("19 [DENY] learner cannot change accountType", async () => {
  await assertFails(updateDoc(doc(user("learnerA"), "users", "learnerA"), { accountType: "personal" }))
})
test("20 [DENY] learner cannot list companies", async () => {
  await assertFails(getDocs(collection(user("personalUser"), "companies")))
})
test("21 [DENY] company admin cannot list companies", async () => {
  await assertFails(getDocs(collection(user("companyAdminA"), "companies")))
})
test("22 [ALLOW] authenticated user can get active company", async () => {
  await assertSucceeds(getDoc(doc(user("personalUser"), "companies", "COMPANY_A")))
})
test("23 [DENY] authenticated user cannot get inactive company", async () => {
  await assertFails(getDoc(doc(user("personalUser"), "companies", "COMPANY_INACTIVE")))
})
