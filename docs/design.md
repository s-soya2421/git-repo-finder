# git-repo-finder システム設計

## 1. コンポーネント設計

コンポーネント設計は **機能ベース + 薄い共有 UI 層** とする。
過剰な BaseButton などの独自抽象は作らず、shadcn/ui を基盤として必要最小限の共通化に留める。

### ディレクトリ構成

```text
app/
  layout.tsx
  page.tsx
  loading.tsx
  error.tsx
  not-found.tsx
  (.)repositories/[owner]/[repo]/   ← Intercepting Routes（一覧からのオーバーレイ）
    page.tsx
  repositories/[owner]/[repo]/      ← 直接アクセス時の独立ページ
    page.tsx
    loading.tsx
    not-found.tsx
  favorites/
    page.tsx

features/
  repository-search/
    components/
      SearchForm.tsx
      SearchResultSummary.tsx
      RepositoryList.tsx
      RepositoryListItem.tsx
      PaginationNav.tsx
      PerPageSelect.tsx
      EmptyState.tsx
    lib/
      parse-search-params.ts
      build-search-query.ts
      get-visible-pages.ts
      map-search-response.ts
      normalize-search-params.ts
    types.ts

  repository-detail/
    components/
      RepositoryHeader.tsx
      RepositoryMeta.tsx
      RepositoryStats.tsx
      RepositoryTopics.tsx
      RepositoryReadme.tsx
      ExternalLinks.tsx
      FavoriteButton.tsx
    lib/
      map-repository-response.ts
    types.ts

  favorites/
    components/
      FavoriteList.tsx
      FavoriteListItem.tsx
    lib/
      favorites-storage.ts
    types.ts

  recently-viewed/
    components/
      RecentlyViewedList.tsx
    lib/
      recently-viewed-storage.ts
    types.ts

shared/
  ui/
    button.tsx
    input.tsx
    card.tsx
    avatar.tsx
    select.tsx
    badge.tsx
  lib/
    cn.ts
    format-number.ts
    format-relative-date.ts
    logger.ts
  github/
    client.ts
    schemas.ts
    constants.ts
```

### 設計原則

- `shared/ui` は汎用 UI のみ
- 機能固有 UI は `features` 配下
- 整形ロジックは純粋関数で分離
- 共通化は必要になってから行う
- ViewModel を導入し、API フィールド名を UI へ漏らさない

### Server / Client Component 境界

App Router では原則 Server Component として実装し、インタラクションが必要な箇所のみ Client Component に切り出す。

| Component | Server / Client | 理由 |
|---|---|---|
| `page.tsx`（一覧・詳細） | Server | searchParams 受け取り・データ取得 |
| `SearchForm.tsx` | Client | state・form submit |
| `RepositoryList.tsx` | Server | 純粋な描画 |
| `RepositoryListItem.tsx` | Client | 説明文の展開/折りたたみ state |
| `PaginationNav.tsx` | Server | 純粋な描画 |
| `PerPageSelect.tsx` | Client | onChange でルーター操作 |
| `FavoriteButton.tsx` | Client | LocalStorage 読み書き |
| `RecentlyViewed.tsx` | Client | LocalStorage 読み書き |

**原則**: データ取得・描画のみのコンポーネントは Server、state・イベント・LocalStorage が必要なものは Client。`'use client'` は末端の葉コンポーネントに留め、親は Server のまま保つ。

---

## 2. レンダリング・ルーティング設計

### 2.1 Intercepting Routes

一覧から詳細への遷移に Intercepting Routes を採用する。

```
app/
  (.)repositories/[owner]/[repo]/   ← 一覧から遷移した場合のオーバーレイ
    page.tsx
  repositories/[owner]/[repo]/      ← URL 直接アクセス時の独立ページ
    page.tsx
```

- 一覧コンテキストからの遷移 → オーバーレイ表示（背景に一覧が残る）
- URL 直接アクセス / リロード → 独立ページとして表示
- URL は両ケースで同一（共有・再訪が可能）

### 2.2 Streaming + Suspense

検索フォームとヘッダーを即時表示し、検索結果のみ Suspense で包んでストリーミング配信する。

```tsx
// app/page.tsx
<SearchForm />
<Suspense fallback={<RepositoryListSkeleton />}>
  <RepositoryList />   {/* ← ここだけ遅延 */}
</Suspense>
```

- 初期表示のブランク時間をなくす
- `loading.tsx` と Suspense 境界を意図的に使い分ける

### 2.3 next/image

オーナーアイコンに `next/image` を使用する。

- 自動 WebP 変換・遅延読み込み・blur プレースホルダー
- `next.config.ts` に `avatars.githubusercontent.com` を許可ドメインとして追加

### 2.4 next/link prefetch

`<Link>` コンポーネントはビューポート内に入った時点で自動 prefetch される。一覧の各カードを `<Link>` で実装することで、詳細への遷移がほぼ瞬時になる。

### 2.5 React `cache()`

同一リクエスト内での GitHub API 呼び出しを重複排除する。

```ts
import { cache } from 'react'
export const getRepository = cache(async (owner: string, repo: string) => {
  // 同一レンダリングツリー内で複数回呼ばれても1回だけ実行される
})
```

### 2.6 Middleware

URL パラメータの正規化・リダイレクトを Middleware で処理する。

```ts
// middleware.ts
// 不正な page / perPage を正規化して redirect
```

- `page < 1` → `page=1` へリダイレクト
- `perPage` が許可値以外 → デフォルト値へリダイレクト
- API レイヤーに不正値が到達しないようにする

### 2.7 next/font

Google Fonts をビルド時にセルフホストする。外部フォントリクエストがなくなりパフォーマンスと安定性が向上する。

```ts
import { Geist } from 'next/font/google'
```

---

## 3. キャッシュ / レンダリング方針

### 方針

- 一覧ページは基本動的
- 詳細ページも基本動的寄り
- MVP では正しさと実装単純性を優先する
- 過剰なキャッシュ最適化は初期段階では行わない

### 設計意図

一覧は検索結果の鮮度と URL 駆動の一貫性を重視する。
詳細も当面はシンプルに扱い、必要が出てから短い revalidate を検討する。

### 初期ルール

| ページ | 方針 |
|---|---|
| 一覧 | 毎回 fresh に取得 |
| 詳細 | 初期は一覧と同様 |

stale 表示や複雑な再検証戦略は採用しない。

---

## 5. ログ・観測設計

### 最低導入

- Vercel Web Analytics
- Vercel Speed Insights
- サーバー側の構造化ログ

### 構造化ログで記録する項目

| フィールド | 内容 |
|---|---|
| `route` | リクエストルート |
| `q` | 検索クエリ |
| `page` | ページ番号 |
| `perPage` | 表示件数 |
| `githubApiStatus` | GitHub API のステータスコード |
| `durationMs` | レスポンスタイム |
| `rateLimitResource` | レート制限リソース種別 |
| `xRateLimitRemaining` | 残リクエスト数 |
| `xRateLimitReset` | リセット時刻 |
| `retryAfter` | retry-after 値 |
| `errorType` | エラー種別 |

### 観測する最小指標

- 検索実行数
- 検索成功率
- 0 件率
- 詳細遷移数
- GitHub API エラー率
- レート制限発生率

### MVP のイベント

| イベント名 | タイミング |
|---|---|
| `search_submitted` | 検索実行時 |
| `search_succeeded` | 検索成功時 |
| `search_failed` | 検索失敗時 |
| `repository_detail_opened` | 詳細画面表示時 |
| `outbound_github_clicked` | GitHub 外部リンククリック時 |

---

## 6. セキュリティ・運用設計

### 環境変数

- GitHub Token はサーバー側環境変数で管理する
- クライアントへ露出させない
- `NEXT_PUBLIC_` は必要最小限にする

### API 利用

- クライアントから GitHub API を直接叩かない
- Server Component もしくはサーバー側コード経由で取得する
- Search API 用レート制限は通常枠と別管理であるため、残量をログに出す

### エラー耐性

- 失敗時はユーザー向けメッセージと運用向けログを分離する
- 404 と API 失敗を混同しない
- API バージョンは定数で固定管理する

---

## 7. テスト方針

### 7.1 単体テスト対象

- searchParams の parse / validate / normalize
- URL 生成
- ページネーション計算
- GitHub レスポンス → ViewModel 変換
- 数値整形
- 相対日付整形
- エラー分類

### 7.2 結合 / E2E テスト対象

- 検索実行
- 検索結果表示
- 表示件数切替
- ページネーション遷移
- 一覧 → 詳細 → 戻る
- 0 件 / エラー / 404 表示
- GitHub 外部リンク導線

### 7.3 テスト原則

- UI 表示とデータ整形を分離する
- 純粋関数を増やして unit test しやすくする
- 主要導線は E2E で担保する
- E2E は外部 API 実呼び出しに依存させず、モックまたは録画レスポンスを使う
