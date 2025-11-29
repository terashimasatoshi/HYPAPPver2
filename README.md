# HRV Report Fullstack App

Next.js (App Router) + TypeScript + Tailwind CSS で構築した、
森の日々向け HRVレポート管理アプリのサンプル実装です。

## 開発サーバー

```bash
npm install
npm run dev
```

ブラウザで http://localhost:3000 を開くとアプリが表示されます。

## デプロイ (Vercel)

1. このフォルダを GitHub などに push
2. Vercel の「New Project」からこのリポジトリを選択
3. Build Command: `npm run build`
4. Output Directory: `.next`

でそのままデプロイできます。

- `/api/clients` と `/api/sessions` は簡易的なインメモリAPIです
- 永続化や認証、AIレポート生成は今後拡張してください
