# 外免切替 Japanese Learning App

外国免許切替向けの日本語・知識学習アプリです。個人ユーザーは1日無料体験後にKOMOJU決済、企業ユーザーは企業コードで支払い不要の学習アカウントとして利用します。

## セットアップ

```bash
npm ci
cp .env.example .env.local
npm run build
npm run dev
```

`.env.local` に以下を設定してください。

```env
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
NEXT_PUBLIC_APP_URL=
KOMOJU_SECRET_KEY=
KOMOJU_WEBHOOK_SECRET=
FIREBASE_SERVICE_ACCOUNT_KEY=
```

## Firebase

- `firestore.rules` をFirebaseプロジェクトへデプロイしてください。
- 企業コードは `companies/{companyCode}` に作成します。
- 例: `companies/OUTINPLUS` に `{ name: "株式会社アウトインプラス", active: true }` を設定します。
- 企業管理者は `users/{uid}.role = "company_admin"` と `companyCode` を管理者権限で設定してください。

## 決済

- 決済はKOMOJUに統一しています。
- Checkout: `/api/komoju/checkout`
- Webhook: `/api/komoju/webhook`
- 決済成功後は `users/{uid}.billing.status = "active"`、`method = "komoju"` 相当のKOMOJU識別子、`currentPeriodEnd` が設定されます。
- コンビニ決済は入金完了Webhookまで `pending` です。

## 納品ZIP

ZIPには以下を含めないでください。

- `node_modules`
- `.next`
- `.env.local`
- `*.tsbuildinfo`

ZIPには `.env.example`、`firestore.rules`、`firebase.json`、`public/manifest.json`、`public/icons/*` を含めます。
