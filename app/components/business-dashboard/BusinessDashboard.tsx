"use client";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, signOut } from "firebase/auth";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { auth, db } from "@/app/lib/firebase";
import { getQuizDef } from "@/app/data/quizCatalog";
type A = Record<string, any>;
type R = {
  id: string;
  name: string;
  email: string;
  count: number;
  score: number | null;
  last: Date | null;
  status: string;
  course: string;
  correct: number;
  answered: number;
  courseMetrics: CourseMetric[];
};
type CourseMetric = {
  course: string;
  studyCount: number;
  correct: number;
  answered: number;
};
type CourseStat = {
  course: string;
  learners: number;
  studyCount: number;
  averageScore: number | null;
  studying: number;
  followUp: number;
  notStarted: number;
};
type LoadError = "permission" | "general" | null;
type LoadStage = "auth" | "user" | "company" | "learners";
const tabs = ["Dashboard", "Learners", "Analytics", "Reports", "Company"] as const;
const d = (v: any): Date | null => {
  if (!v) return null;
  const x =
    typeof v.toDate === "function"
      ? v.toDate()
      : v.seconds
        ? new Date(v.seconds * 1000)
        : typeof v === "number" && v < 100000000000
          ? new Date(v * 1000)
          : new Date(v);
  return Number.isNaN(x.getTime()) || x.getTime() > Date.now() + 86400000
    ? null
    : x;
};
const scoredParts = (result: A): { correct: number; answered: number } | null => {
  if (result.completed === false || result.finished === false || result.byTimeout === true) return null;
  if (!result.completedAt && !result.createdAt) return null;
  const correct = Number(result.correctCount ?? result.score);
  const answered = Number(
    result.totalQuestions ?? result.answeredCount ?? result.total,
  );
  if (
    !Number.isFinite(correct) ||
    !Number.isFinite(answered) ||
    answered <= 0 ||
    correct < 0 ||
    correct > answered
  ) {
    return null;
  }
  return { correct, answered };
};
const pct = (x: number | null) =>
  x == null ? "採点対象外" : Math.round(x) + "%";
const fmt = (x: Date | null) => (x ? x.toLocaleDateString("ja-JP") : "—");
const courseLabel = (id: string) => {
  try {
    return getQuizDef(id)?.title ?? id;
  } catch {
    return id || "教材未設定";
  }
};
const jstDay = (x: Date) => Math.floor((x.getTime() + 32400000) / 86400000);
export default function BusinessDashboard({
  appName,
  loginHref = "/company/login",
  companyField = "companyCode",
}: {
  appName: string;
  loginHref?: string;
  companyField?: "companyCode" | "companyId";
}) {
  const router = useRouter(),
    [tab, setTab] = useState<(typeof tabs)[number]>("Dashboard"),
    [rows, setRows] = useState<R[]>([]),
    [loading, setLoading] = useState(true),
    [loadStage, setLoadStage] = useState<LoadStage>("auth"),
    [loadError, setLoadError] = useState<LoadError>(null),
    [companyMissing, setCompanyMissing] = useState(false),
    [reloadKey, setReloadKey] = useState(0),
    [company, setCompany] = useState<A>({}),
    [code, setCode] = useState(""),
    [role, setRole] = useState(""),
    [search, setSearch] = useState(""),
    [filter, setFilter] = useState("すべて"),
    [sort, setSort] = useState("last"),
    [menu, setMenu] = useState(false),
    [copied, setCopied] = useState(false),
    [notice, setNotice] = useState("");
  useEffect(
    () => {
      setLoading(true);
      setLoadStage("auth");
      setLoadError(null);
      setCompanyMissing(false);
      setRole("");
      return onAuthStateChanged(auth, async (user) => {
        if (!user) {
          router.replace(loginHref);
          return;
        }
        try {
          setLoadStage("user");
          const ms = await getDoc(doc(db, "users", user.uid));
          if (!ms.exists()) throw Error("管理者情報が見つかりません。");
          const me = ms.data() as A,
            role = String(me.role ?? "");
          if (!["admin", "company_admin"].includes(role))
            throw Error("閲覧権限がありません。");
          setRole(role);
          const cc = String(me[companyField] ?? "");
          setCode(cc);
          if (role === "company_admin" && !cc) {
            setCompany({ name: me.companyName });
            setCompanyMissing(true);
            setRows([]);
            return;
          }
          if (cc) {
            setLoadStage("company");
            const cs = await getDoc(doc(db, "companies", cc));
            setCompanyMissing(!cs.exists());
            setCompany(cs.exists() ? cs.data() : { name: me.companyName });
          }
          setLoadStage("learners");
          const users = collection(db, "users"),
            snap =
              role === "admin" && !cc
                ? await getDocs(users)
                : await getDocs(query(users, where(companyField, "==", cc))),
            people = snap.docs
              .map((x) => ({ id: x.id, ...x.data() }) as A)
              .filter(
                (x) =>
                  x.id !== user.uid && !String(x.role ?? "").includes("admin"),
              );
          setRows(
            await Promise.all(
              people.map(async (p) => {
                const [rs, ps] = await Promise.all([
                    getDocs(collection(db, "users", p.id, "results")),
                    getDocs(collection(db, "users", p.id, "progress")),
                  ]),
                  results = rs.docs.map((x) => x.data() as A),
                  progress = ps.docs.map(
                    (x) => ({ id: x.id, ...x.data() }) as A,
                  ),
                  scoredResults = results
                    .map((result) => ({ result, parts: scoredParts(result) }))
                    .filter(
                      (
                        item,
                      ): item is {
                        result: A;
                        parts: { correct: number; answered: number };
                      } => item.parts != null,
                    ),
                  metricMap = new Map<string, CourseMetric>(),
                  dates = [
                    ...scoredResults.map(({ result: x }) =>
                      d(
                        x.completedAt ??
                          x.createdAt ??
                          x.lastStudyAt ??
                          x.updatedAt,
                      ),
                    ),
                    ...progress.map((x) =>
                      d(
                        x.lastStudyAt ??
                          x.lastStudiedAt ??
                          x.completedAt ??
                          x.updatedAt ??
                          x.lastStudyDate,
                      ),
                    ),
                  ].filter((x): x is Date => !!x),
                  last = dates.length
                    ? new Date(Math.max(...dates.map((x) => x.getTime())))
                    : null;
                for (const { result, parts } of scoredResults) {
                  const id = String(
                    result.quizType ?? result.courseId ?? result.materialId ?? "教材未設定",
                  );
                  const course = courseLabel(id);
                  const metric = metricMap.get(id) ?? {
                    course,
                    studyCount: 0,
                    correct: 0,
                    answered: 0,
                  };
                  metric.studyCount += 1;
                  metric.correct += parts.correct;
                  metric.answered += parts.answered;
                  metricMap.set(id, metric);
                }
                for (const item of progress) {
                  const sessions = Number(item.totalSessions);
                  if (!Number.isFinite(sessions) || sessions <= 0) continue;
                  const id = String(item.quizType ?? item.courseId ?? item.materialId ?? item.id);
                  const metric = metricMap.get(id) ?? {
                    course: courseLabel(id),
                    studyCount: 0,
                    correct: 0,
                    answered: 0,
                  };
                  metric.studyCount += Math.floor(sessions);
                  metricMap.set(id, metric);
                }
                const courseMetrics = [...metricMap.values()];
                const correct = courseMetrics.reduce((total, metric) => total + metric.correct, 0);
                const answered = courseMetrics.reduce((total, metric) => total + metric.answered, 0);
                const count = courseMetrics.reduce((total, metric) => total + metric.studyCount, 0);
                return {
                  id: p.id,
                  name: String(p.displayName ?? p.name ?? "名前未設定"),
                  email: String(p.email ?? ""),
                  count,
                  score: answered > 0 ? (correct / answered) * 100 : null,
                  correct,
                  answered,
                  courseMetrics,
                  last,
                  status: !count
                    ? "未学習"
                    : last && jstDay(new Date()) - jstDay(last) >= 7
                      ? "要フォロー"
                      : "学習中",
                  course: courseMetrics[0]?.course ?? "教材未設定",
                };
              }),
            ),
          );
        } catch (e) {
          console.error("Business Dashboard data load failed", e);
          const firebaseCode =
            typeof e === "object" && e !== null && "code" in e
              ? String((e as { code?: unknown }).code)
              : "";
          setLoadError(
            firebaseCode === "permission-denied" ||
              firebaseCode === "firestore/permission-denied"
              ? "permission"
              : "general",
          );
        } finally {
          setLoading(false);
        }
      });
    },
    [router, loginHref, companyField, reloadKey],
  );
  const shown = useMemo(
      () =>
        rows
          .filter(
            (x) =>
              (filter === "すべて" || x.status === filter) &&
              (x.name + " " + x.email)
                .toLowerCase()
                .includes(search.toLowerCase()),
          )
          .sort((a, b) =>
            sort === "name"
              ? a.name.localeCompare(b.name, "ja")
              : sort === "count"
                ? b.count - a.count
                : sort === "score"
                  ? (b.score ?? -1) - (a.score ?? -1)
                  : (b.last?.getTime() ?? 0) - (a.last?.getTime() ?? 0),
          ),
      [rows, search, filter, sort],
    );
  const totalCorrect = rows.reduce((total, row) => total + row.correct, 0);
  const totalAnswered = rows.reduce((total, row) => total + row.answered, 0);
  const overallAccuracy =
    totalAnswered > 0 ? (totalCorrect / totalAnswered) * 100 : null;
  const courseStats = useMemo<CourseStat[]>(() => {
    const grouped = new Map<string, {
      learners: number;
      studyCount: number;
      correct: number;
      answered: number;
      studying: number;
      followUp: number;
      notStarted: number;
    }>();
    for (const row of rows) {
      for (const metric of row.courseMetrics) {
        const current = grouped.get(metric.course) ?? {
          learners: 0, studyCount: 0, correct: 0, answered: 0,
          studying: 0, followUp: 0, notStarted: 0,
        };
        current.learners += 1;
        current.studyCount += metric.studyCount;
        current.correct += metric.correct;
        current.answered += metric.answered;
        current.studying += row.status === "学習中" ? 1 : 0;
        current.followUp += row.status === "要フォロー" ? 1 : 0;
        current.notStarted += row.status === "未学習" ? 1 : 0;
        grouped.set(metric.course, current);
      }
    }
    return [...grouped.entries()]
      .map(([course, values]) => ({
        course,
        learners: values.learners,
        studyCount: values.studyCount,
        averageScore:
          values.answered > 0 ? (values.correct / values.answered) * 100 : null,
        studying: values.studying,
        followUp: values.followUp,
        notStarted: values.notStarted,
      }))
      .sort((a, b) => b.studyCount - a.studyCount || a.course.localeCompare(b.course, "ja"));
  }, [rows]);
  const exportCsv = () => {
    const data = [
        [
          "氏名",
          "メール",
          "状態",
          "学習回数",
          "平均正答率",
          "最終学習日",
          "教材",
        ],
        ...shown.map((x) => [
          x.name,
          x.email,
          x.status,
          x.count,
          pct(x.score),
          fmt(x.last),
          x.course,
        ]),
      ],
      safe = (v: unknown) => {
        const s = String(v);
        return (
          '"' +
          (["=", "+", "-", "@"].includes(s.charAt(0)) ? "'" : "") +
          s.replaceAll('"', '""') +
          '"'
        );
      },
      blob = new Blob(
        ["\uFEFF" + data.map((x) => x.map(safe).join(",")).join("\r\n")],
        { type: "text/csv" },
      ),
      a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download =
      appName + "-learners-" + new Date().toISOString().slice(0, 10) + ".csv";
    a.click();
    URL.revokeObjectURL(a.href);
  };
  const copyCode = async () => {
    if (!code) return;
    try {
      if (navigator.clipboard?.writeText)
        await navigator.clipboard.writeText(code);
      else {
        const t = document.createElement("textarea");
        t.value = code;
        document.body.appendChild(t);
        t.select();
        document.execCommand("copy");
        t.remove();
      }
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch (error) {
      console.error("Company code copy failed", error);
      setNotice("企業コードをコピーできませんでした。手動で選択してコピーしてください。");
    }
  };
  if (loading)
    return (
      <main style={s.center}>
        {loadStage === "auth"
          ? "認証確認中…"
          : loadStage === "user"
            ? "ユーザーデータ取得中…"
            : loadStage === "company"
              ? "企業情報取得中…"
              : "学習データ取得中…"}
      </main>
    );
  return (
    <div style={s.shell}>
      <style>{responsive}</style>
      <aside className={menu ? "bdSide open" : "bdSide"} style={s.side}>
        <div style={s.sideTop}>
          <h2>OutIN Academy</h2>
          <small>
            Business Dashboard
            <br />
            企業向け学習管理画面
          </small>
          <b style={s.app}>{appName}</b>
          {["admin", "company_admin"].includes(role) && (
            <CompanyCodeCard
              companyName={String(company.name ?? company.companyName ?? "")}
              code={code}
              copied={copied}
              onCopy={copyCode}
            />
          )}
          <a href="/home" style={{ color: "white", padding: 10 }}>
            アプリへ戻る
          </a>
        </div>
        <nav style={s.sideNav} aria-label="Business Dashboard">
          {tabs.map((x) => (
            <button
              key={x}
              onClick={() => {
                setTab(x);
                setMenu(false);
              }}
              style={tab === x ? s.on : s.nav}
            >
              {x}
            </button>
          ))}
        </nav>
        <div style={s.logoutArea}>
          <button onClick={() => signOut(auth)} style={s.nav}>
            ログアウト
          </button>
        </div>
      </aside>
      {menu && (
        <button
          className="bdScrim"
          onClick={() => setMenu(false)}
          aria-label="メニューを閉じる"
        />
      )}
      <main className="bdMain" style={s.main}>
        <header style={s.head}>
          <button
            className="bdHamb"
            onClick={() => setMenu(true)}
            aria-label="メニューを開く"
          >
            ☰
          </button>
          <b>{tab}</b>
          <span>{company.name ?? company.companyName ?? code}</span>
        </header>
        <div style={s.content}>
          {loadError ? (
            <LoadErrorCard
              kind={loadError}
              onRetry={() => setReloadKey((value) => value + 1)}
            />
          ) : (
            <>
              <h1>{tab}</h1>
              {companyMissing && (
                <InfoCard
                  title="企業情報が登録されていません"
                  body="企業コードに対応する企業情報を確認してください。"
                />
              )}
              {!companyMissing && rows.length === 0 && (
                <InfoCard
                  title="表示できる学習者データはありません"
                  body="学習者が登録されると、ここに学習状況が表示されます。"
                />
              )}
              {notice && <div style={s.info}>{notice}</div>}
              {tab === "Dashboard" && (
                <>
                  <div style={s.grid}>
                    <Card a="登録学習者数" b={rows.length} />
                    <Card
                      a="学習中"
                      b={rows.filter((x) => x.status === "学習中").length}
                    />
                    <Card
                      a="要フォロー"
                      b={rows.filter((x) => x.status === "要フォロー").length}
                    />
                    <Card
                      a="平均正答率"
                      b={pct(overallAccuracy)}
                    />
                  </div>
                  <p style={s.accuracyNote}>
                    正答率は、正解数と回答数を取得できるクイズ・テストから集計しています。
                  </p>
                  <CourseProgress stats={courseStats} />
                </>
              )}
              {tab === "Learners" && (
                <>
                  <div style={s.tools}>
                    <input
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="氏名・メールで検索"
                      aria-label="氏名またはメールで検索"
                    />
                    <select
                      value={filter}
                      onChange={(e) => setFilter(e.target.value)}
                      aria-label="状態フィルター"
                    >
                      {["すべて", "未学習", "学習中", "要フォロー"].map((x) => (
                        <option key={x}>{x}</option>
                      ))}
                    </select>
                    <select
                      value={sort}
                      onChange={(e) => setSort(e.target.value)}
                      aria-label="並び替え"
                    >
                      <option value="last">最終学習日</option>
                      <option value="name">氏名</option>
                      <option value="count">学習回数</option>
                      <option value="score">平均正答率</option>
                    </select>
                    <button onClick={exportCsv}>CSV出力</button>
                  </div>
                  <div style={s.table}>
                    <table>
                      <thead>
                        <tr>
                          {[
                            "氏名",
                            "状態",
                            "学習回数",
                            "平均正答率",
                            "最終学習日",
                            "教材",
                          ].map((x) => (
                            <th key={x}>{x}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {shown.map((x) => (
                          <tr key={x.id}>
                            <td>
                              <b>{x.name}</b>
                              <small>{x.email}</small>
                            </td>
                            <td>{x.status}</td>
                            <td>{x.count}</td>
                            <td>{pct(x.score)}</td>
                            <td>{fmt(x.last)}</td>
                            <td>{x.course}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              )}
              {tab === "Analytics" && (
                <>
                  <div style={s.card}>
                    全体平均正答率 {pct(overallAccuracy)}{" "}
                    ／ 学習中 {rows.filter((x) => x.status === "学習中").length}名
                    <p style={s.accuracyNote}>
                      正答率は、正解数と回答数を取得できるクイズ・テストから集計しています。
                    </p>
                  </div>
                  <CourseAnalytics stats={courseStats} />
                </>
              )}
              {tab === "Reports" && (
                <div style={s.card}>
                  <p>出力対象 {shown.length}件</p>
                  <button onClick={exportCsv}>学習者一覧CSVを出力</button>
                  <p>PDFレポートは準備中です。</p>
                </div>
              )}
              {tab === "Company" && (
                <div style={s.card}>
                  <p>
                    会社名: {String(company.name ?? company.companyName ?? "—")}
                  </p>
                  <p>企業コード: {code || "—"}</p>
                  <p>契約状態: {String(company.status ?? "有効")}</p>
                  <p>登録学習者数: {rows.length}名</p>
                  <p>利用中のアプリ: {appName}</p>
                  <button onClick={copyCode} disabled={!code}>
                    {copied ? "コピーしました" : "企業コードをコピー"}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}
function LoadErrorCard({
  kind,
  onRetry,
}: {
  kind: Exclude<LoadError, null>;
  onRetry: () => void;
}) {
  return (
    <section style={s.errorCard} role="alert">
      <h1>データを読み込めませんでした</h1>
      <p>
        {kind === "permission"
          ? "企業管理画面の閲覧権限を確認してください。問題が続く場合は管理者へお問い合わせください。"
          : "企業管理画面の読み込み中に問題が発生しました。時間をおいて再度お試しください。"}
      </p>
      <button onClick={onRetry}>再読み込み</button>
    </section>
  );
}
function InfoCard({ title, body }: { title: string; body: string }) {
  return (
    <section style={s.info}>
      <b>{title}</b>
      <p>{body}</p>
    </section>
  );
}
function CompanyCodeCard({
  companyName,
  code,
  copied,
  onCopy,
}: {
  companyName: string;
  code: string;
  copied: boolean;
  onCopy: () => void;
}) {
  return (
    <section style={s.companyCodeCard} aria-label="企業情報">
      {companyName && <b style={s.companyName}>{companyName}</b>}
      <span style={s.companyCodeLabel}>企業コード</span>
      <code style={s.companyCode}>{code || "企業コードが登録されていません"}</code>
      <button
        type="button"
        onClick={onCopy}
        disabled={!code}
        aria-label={code ? "企業コードをコピー" : "企業コードが登録されていません"}
        style={s.copyButton}
      >
        <span aria-live="polite">{copied ? "コピー済み" : "コピー"}</span>
      </button>
    </section>
  );
}
function CourseProgress({ stats }: { stats: CourseStat[] }) {
  if (!stats.length) return null;
  return (
    <section style={s.card}>
      <h2>教材別進捗</h2>
      <div style={s.courseGrid}>
        {stats.map((stat) => (
          <article key={stat.course} style={s.courseItem}>
            <b>{stat.course}</b>
            <p>
              学習中 {stat.studying}名 ・ 要フォロー {stat.followUp}名 ・ 未学習{" "}
              {stat.notStarted}名
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
function CourseAnalytics({ stats }: { stats: CourseStat[] }) {
  if (!stats.length) return null;
  return (
    <section style={s.card}>
      <h2>教材別分析</h2>
      <div style={s.table}>
        <table>
          <thead>
            <tr>
              <th>教材</th>
              <th>学習者数</th>
              <th>学習回数</th>
              <th>平均正答率</th>
              <th>進捗</th>
            </tr>
          </thead>
          <tbody>
            {stats.map((stat) => (
              <tr key={stat.course}>
                <td><b>{stat.course}</b></td>
                <td>{stat.learners}</td>
                <td>{stat.studyCount}</td>
                <td>{pct(stat.averageScore)}</td>
                <td>
                  学習中 {stat.studying} / 要フォロー {stat.followUp} / 未学習{" "}
                  {stat.notStarted}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
const Card = ({ a, b }: { a: string; b: any }) => (
  <article style={s.card}>
    <span>{a}</span>
    <strong style={s.num}>{b}</strong>
  </article>
);
const s: Record<string, React.CSSProperties> = {
  shell: {
    minHeight: "100dvh",
    background: "#f5f7fb",
    color: "#10213b",
    fontFamily: "system-ui",
  },
  side: {
    position: "fixed",
    inset: "0 auto 0 0",
    width: 250,
    height: "100dvh",
    boxSizing: "border-box",
    padding: "22px 22px max(16px, env(safe-area-inset-bottom))",
    background: "#102342",
    color: "white",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
  },
  sideTop: { flexShrink: 0, display: "flex", flexDirection: "column", gap: 10 },
  sideNav: {
    flex: "1 1 auto",
    minHeight: 0,
    overflowY: "auto",
    overscrollBehavior: "contain",
    display: "flex",
    flexDirection: "column",
    gap: 10,
    padding: "8px 2px",
  },
  logoutArea: {
    flexShrink: 0,
    display: "flex",
    flexDirection: "column",
    paddingTop: 10,
    borderTop: "1px solid #ffffff22",
  },
  app: { padding: "15px 0" },
  companyCodeCard: {
    display: "grid",
    gap: 5,
    minWidth: 0,
    padding: 10,
    border: "1px solid #ffffff2b",
    borderRadius: 10,
    background: "#ffffff10",
  },
  companyName: {
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    fontSize: 13,
  },
  companyCodeLabel: { color: "#aebed4", fontSize: 11 },
  companyCode: {
    maxWidth: "100%",
    color: "white",
    fontFamily: "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace",
    fontSize: 12,
    overflowWrap: "anywhere",
    wordBreak: "break-word",
  },
  copyButton: {
    justifySelf: "start",
    padding: "6px 10px",
    border: "1px solid #ffffff3d",
    borderRadius: 8,
    background: "#ffffff18",
    color: "white",
  },
  nav: {
    flexShrink: 0,
    padding: 12,
    border: 0,
    borderRadius: 10,
    background: "transparent",
    color: "#ccd7e8",
    textAlign: "left",
  },
  on: {
    flexShrink: 0,
    padding: 12,
    border: 0,
    borderRadius: 10,
    background: "white",
    color: "#102342",
    textAlign: "left",
  },
  main: { marginLeft: 250 },
  head: {
    height: 70,
    padding: "0 28px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    background: "white",
  },
  content: { maxWidth: 1200, margin: "auto", padding: 28 },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))",
    gap: 15,
  },
  card: {
    padding: 22,
    background: "white",
    border: "1px solid #e2e8f0",
    borderRadius: 18,
    marginBottom: 15,
  },
  errorCard: {
    padding: 24,
    background: "white",
    border: "1px solid #f0b8b8",
    borderRadius: 18,
  },
  info: {
    padding: 18,
    background: "#eef5ff",
    border: "1px solid #c9dcf7",
    borderRadius: 14,
    marginBottom: 15,
  },
  num: { display: "block", fontSize: 30, marginTop: 10 },
  accuracyNote: { color: "#64748b", fontSize: 13, lineHeight: 1.6 },
  tools: { display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 15 },
  table: { overflowX: "auto", background: "white", borderRadius: 16 },
  courseGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))",
    gap: 12,
  },
  courseItem: {
    padding: 16,
    background: "#f8fafc",
    border: "1px solid #e2e8f0",
    borderRadius: 12,
  },
  center: { minHeight: "100dvh", display: "grid", placeItems: "center" },
};

const responsive = `.bdHamb,.bdScrim{display:none}.bdSide button{cursor:pointer}@media(max-width:800px){.bdSide{transform:translateX(-105%);transition:transform .2s;width:min(250px,calc(100vw - 32px))!important}.bdSide.open{transform:none}.bdMain{margin-left:0!important}.bdHamb{display:block}.bdScrim{display:block;position:fixed;inset:0;border:0;border-radius:0;background:#09142688;z-index:20}}@media(max-width:430px){.bdMain header{padding:0 12px!important}.bdMain>div{padding:18px!important}}@media(max-height:650px){.bdSide{padding-top:12px!important}.bdSide h2{font-size:18px;margin:0}.bdSide small{font-size:11px}.bdSide>div:first-child{gap:4px!important}.bdSide>div:first-child>b{padding-block:4px!important}.bdSide>div:first-child section{padding:7px!important;gap:3px!important}.bdSide nav{padding-block:4px!important;gap:4px!important}.bdSide nav button{padding-block:9px!important}}@media(prefers-reduced-motion:reduce){*{transition:none!important}}button:focus-visible,a:focus-visible,input:focus-visible,select:focus-visible{outline:3px solid #ff9a65;outline-offset:2px}`;
