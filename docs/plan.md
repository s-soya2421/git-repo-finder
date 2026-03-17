# git-repo-finder 実装計画

## Phase 1: MVP

### セットアップ

- [x] Next.js App Router セットアップ
- [x] `next/font` 設定（Google Fonts セルフホスト）
- [x] `next.config.ts` に `avatars.githubusercontent.com` を許可ドメイン追加
- [x] shadcn/ui 導入（button, input, card, avatar, select, badge）
- [x] Vitest 導入・共通ユーティリティ（format-number, format-relative-date）
- [x] GitHub API クライアント実装 (`shared/github`、React `cache()` 適用)
- [x] エラー分類（not_found, rate_limit_primary/secondary, server_error 等）
- [x] ViewModel 型定義・mapping 関数（検索・詳細）
- [x] 環境変数設定 (GitHub Token)
- [x] searchParams の parse / normalize / buildSearchUrl
- [x] `proxy.ts` 実装（URL パラメータ正規化・リダイレクト）

### 一覧画面

- [x] 検索フォーム実装
- [x] URL search params 連携
- [x] GitHub API 連携 (`search/repositories`)
- [x] Streaming + Suspense（フォーム即時表示・結果ストリーミング）
- [x] 一覧比較情報の表示
  - [x] リポジトリ名
  - [x] 説明文（先頭 50 文字 + 展開/折りたたみ）
  - [x] オーナー
  - [x] 主要言語
  - [x] Star 数
  - [x] 最終更新日
  - [x] Topics
  - [x] License
- [x] 空状態・エラー状態
- [x] スケルトン UI

### ページネーション

- [x] ページネーション計算（API 上限 1000 件ガード）
- [x] ページネーション UI
- [x] 表示件数切替

### 詳細画面

- [x] 詳細ページ実装 (`/repositories/[owner]/[repo]`)
- [ ] Intercepting Routes 実装（一覧からオーバーレイ・直接アクセスで独立ページ）※未実装・将来検討
- [x] GitHub API 連携 (`repos/{owner}/{repo}`)
- [x] 表示項目
  - [x] リポジトリ名・オーナーアイコン（next/image）・説明文
  - [x] 主要言語・Star 数・Watcher 数・Fork 数・Issue 数
  - [x] License・Topics・最終更新日・Homepage
- [x] GitHub 外部リンク導線
- [x] 一覧へ戻る導線
- [x] スケルトン UI
- [x] 404 (`not-found.tsx`)

### テスト

- [x] 基本 unit test（format-number, format-relative-date）
- [x] API エラー分類テスト（classifyGitHubError）
- [x] ViewModel mapping テスト（mapSearchResponse, mapRepositoryResponse）
- [x] searchParams parse / normalize / buildSearchUrl テスト
- [x] ページネーション計算テスト
- [x] 基本 E2E（主要導線）

---

## Phase 1 実装ブランチ進捗

| # | ブランチ | 状態 | 概要 |
|---|---|---|---|
| 1 | `feature/setup-shadcn` | **merged** | shadcn/ui, Vitest, format-number, format-relative-date |
| 2 | `feature/github-api-client` | **merged** | API client, schemas, ViewModel, mapping |
| 3 | `feature/search-params-middleware` | **merged** | parse, normalize, buildSearchUrl, proxy |
| 4 | `feature/search-list-page` | **merged** | 検索フォーム, 一覧画面, Suspense, 空状態/エラー |
| 5 | `feature/pagination` | **merged** | ページネーション計算, ナビUI, 表示件数セレクト |
| 6 | `feature/repository-detail` | **done** | 詳細画面, 通常ページ遷移, 404 |

---

## Phase 2: 品質向上

- [x] 構造化ログ整備（rateLimitResource ヘッダー追加）
- [x] Vercel Analytics 導入
- [x] Vercel Speed Insights 導入
- [x] Metadata / robots 制御（index / noindex）
- [x] アクセシビリティ微調整（aria-expanded, aria-hidden, aria-label, role="alert/status"）
- [x] エラーハンドリング改善（rate limit 時の retry-after 表示）
- [x] 文言調整（incomplete_results メッセージ改善）
- [x] `incomplete_results=true` 補足表示

---

## Phase 3: スコープ内追加機能

### お気に入り

- [x] LocalStorage への保存・削除・全削除
- [x] 詳細画面にお気に入りトグルボタン
- [x] `/favorites` ページ実装

### 最近見たリポジトリ

- [x] 詳細画面を開いた際に LocalStorage へ自動記録（上限 20件）
- [x] トップページ（検索前）に最近見た一覧を表示

### README 表示

- [x] `GET /repos/{owner}/{repo}/readme` で取得（Base64 デコード）
- [x] Markdown レンダリングライブラリ導入（react-markdown 等）
- [x] 詳細画面に README セクション追加
- [x] README なし時の空状態対応

---

## Phase 4: 拡張候補

以下は確定していない将来候補。必要が明確になってから検討する。

### 一覧画面

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
