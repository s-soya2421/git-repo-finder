# git-repo-finder 実装計画

## Phase 1: MVP

### セットアップ

- [ ] Next.js App Router セットアップ
- [ ] `next/font` 設定（Google Fonts セルフホスト）
- [ ] `next.config.ts` に `avatars.githubusercontent.com` を許可ドメイン追加
- [ ] shadcn/ui 導入
- [ ] GitHub API クライアント実装 (`shared/github`、React `cache()` 適用)
- [ ] 環境変数設定 (GitHub Token)
- [ ] Middleware 実装（URL パラメータ正規化・リダイレクト）

### 一覧画面

- [ ] 検索フォーム実装
- [ ] URL search params 連携
- [ ] GitHub API 連携 (`search/repositories`)
- [ ] Streaming + Suspense（フォーム即時表示・結果ストリーミング）
- [ ] 一覧比較情報の表示
  - [ ] リポジトリ名
  - [ ] 説明文（先頭 50 文字 + 展開/折りたたみ）
  - [ ] オーナー
  - [ ] 主要言語
  - [ ] Star 数
  - [ ] 最終更新日
  - [ ] Topics
  - [ ] License
- [ ] ページネーション
- [ ] 表示件数切替

### 詳細画面

- [ ] 詳細ページ実装 (`/repositories/[owner]/[repo]`)
- [ ] Intercepting Routes 実装（一覧からオーバーレイ・直接アクセスで独立ページ）
- [ ] GitHub API 連携 (`repos/{owner}/{repo}`)
- [ ] 表示項目
  - [ ] リポジトリ名・オーナーアイコン（next/image）・説明文
  - [ ] 主要言語・Star 数・Watcher 数・Fork 数・Issue 数
  - [ ] License・Topics・最終更新日・Homepage
- [ ] GitHub 外部リンク導線
- [ ] 一覧へ戻る導線

### 状態・エラー

- [ ] スケルトン UI（一覧・詳細）
- [ ] 空状態
- [ ] エラー状態
- [ ] 404 (`not-found.tsx`)

### テスト

- [ ] 基本 unit test（pure functions）
- [ ] 基本 E2E（主要導線）

---

## Phase 2: 品質向上

- [ ] 構造化ログ整備
- [ ] Vercel Analytics 導入
- [ ] Vercel Speed Insights 導入
- [ ] Metadata / robots 制御（index / noindex）
- [ ] アクセシビリティ微調整
- [ ] エラーハンドリング改善
- [ ] 文言調整
- [ ] `incomplete_results=true` 補足表示

---

## Phase 3: スコープ内追加機能

### お気に入り

- [ ] LocalStorage への保存・削除・全削除
- [ ] 詳細画面にお気に入りトグルボタン
- [ ] `/favorites` ページ実装

### 最近見たリポジトリ

- [ ] 詳細画面を開いた際に LocalStorage へ自動記録（上限 20件）
- [ ] トップページ（検索前）に最近見た一覧を表示

### README 表示

- [ ] `GET /repos/{owner}/{repo}/readme` で取得（Base64 デコード）
- [ ] Markdown レンダリングライブラリ導入（react-markdown 等）
- [ ] 詳細画面に README セクション追加
- [ ] README なし時の空状態対応

---

## Phase 4: 拡張候補

以下は確定していない将来候補。必要が明確になってから検討する。

### 一覧画面

- sort 切替
- qualifier 入力支援
- GitHub で開くボタン強化
- 条件サジェスト

### 詳細画面

- Default branch
- Open Graph 情報
- 関連リンク
- Issue / PR / Release への導線

### その他

- 検索補助 UI
