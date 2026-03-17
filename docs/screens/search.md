# 一覧（検索）画面

## 1. 役割

検索結果を返す画面ではなく、**候補を比較し、次に見るべきリポジトリを絞り込む画面**。
一覧だけである程度の比較が完結する情報密度を持つ。

---

## 2. URL

- パス: `/`
- パラメータ:

| パラメータ | 型 | デフォルト | 許可値 | 省略時の扱い |
|---|---|---|---|---|
| `q` | string | なし | trim後1文字以上 | 検索未実行（初期状態） |
| `page` | number | `1` | 1以上の整数 | 1 |
| `perPage` | number | `30` | 10, 30, 50 | 30 |

- 例: `/?q=nextjs&page=2&perPage=50`
- `page=1`, `perPage=30` は URL から省略される
- 不正値は Middleware が正規化し 308 リダイレクト

---

## 3. 状態一覧

| 状態 | 条件 | 表示内容 | 備考 |
|---|---|---|---|
| 初期（検索前） | `q` なし | EmptyState(initial) + RecentlyViewedList | 別途 [top-initial.md](top-initial.md) 参照 |
| ローディング | `q` あり & 取得中 | SearchForm + RepositoryListSkeleton（5件分） | Suspense fallback。key=`${q}-${page}-${perPage}` |
| 結果あり | `q` あり & count > 0 | SearchResultSummary + 一覧 + PaginationNav | aria-live="polite" で結果通知 |
| 0件 | `q` あり & count = 0 | EmptyState(no-results) | クエリのエコー + 検索見直し案内 |
| レート制限 | 403/429 rate limit | 専用メッセージ + リセット時刻 | role="alert"。primary/secondary 共通UI |
| バリデーション失敗 | 422 | 「検索条件を見直してください」 | キーワード短縮・条件変更を提案 |
| APIエラー | その他失敗 | 「データの取得に失敗しました」 | 再試行 or 条件変更を提案 |
| 予期しないエラー | error.tsx | エラーメッセージ + 再試行/トップへボタン | Client Component（Error Boundary） |

---

## 4. 操作 → 結果マッピング

| 操作 | 結果 | URL変化 |
|---|---|---|
| Enter / 検索ボタン | 検索実行。page=1 にリセット | `/?q={入力値}` |
| 空文字で検索 | 何もしない（送信をブロック） | 変化なし |
| クリアボタン（×） | 入力クリア + トップへ遷移 | `/` |
| 表示件数変更 | page=1 にリセットして再検索 | `/?q={q}&perPage={N}` |
| ページ遷移（前へ/次へ/番号） | 該当ページの結果を取得 | `/?q={q}&page={N}` |
| タイトル（ヘッダー）クリック | トップ初期状態へ遷移 | `/` |
| ブラウザバック | 前の URL 状態を復元 | 前の URL |
| リポジトリカード内リンク | 詳細画面へ遷移 | `/repositories/{owner}/{repo}` |
| 「GitHub で開く」リンク | 新しいタブで GitHub を開く | 変化なし |
| 説明文「続きを読む」 | 説明文を全文展開/折りたたみ | 変化なし |

---

## 5. コンポーネント構成

| コンポーネント | Server/Client | 責務 | ファイル |
|---|---|---|---|
| `page.tsx` | Server | searchParams 受取・Suspense 境界・条件分岐 | `src/app/page.tsx` |
| `loading.tsx` | Server | ページ全体のスケルトン | `src/app/loading.tsx` |
| `error.tsx` | Client | Error Boundary（再試行/トップへ） | `src/app/error.tsx` |
| `SearchForm` | Client | 入力 state・submit・クリア | `src/features/repository-search/components/SearchForm.tsx` |
| `RepositoryList` | Server | API取得・エラー分岐・一覧描画 | `src/features/repository-search/components/RepositoryList.tsx` |
| `RepositoryListItem` | Client | カード描画・説明文展開 | `src/features/repository-search/components/RepositoryListItem.tsx` |
| `SearchResultSummary` | Server | 見出し・件数・incomplete警告 | `src/features/repository-search/components/SearchResultSummary.tsx` |
| `PaginationNav` | Server | ページネーションリンク生成 | `src/features/repository-search/components/PaginationNav.tsx` |
| `PerPageSelect` | Client | 表示件数セレクト・router.push | `src/features/repository-search/components/PerPageSelect.tsx` |
| `EmptyState` | Server | 初期/0件の案内表示 | `src/features/repository-search/components/EmptyState.tsx` |
| `RepositoryListSkeleton` | Server | 一覧部分のスケルトン | `src/features/repository-search/components/RepositoryListSkeleton.tsx` |
| `RecentlyViewedList` | Client | 最近見たリポジトリ一覧 | `src/features/recently-viewed/components/RecentlyViewedList.tsx` |

---

## 6. データフロー

```
URL searchParams
  → Middleware: normalizeSearchParams() → 不正値なら 308 リダイレクト
  → page.tsx: parseSearchParams() → { q, page, perPage }
  → q がなければ EmptyState(initial) + RecentlyViewedList
  → q があれば Suspense 境界内で RepositoryList を描画
    → searchRepositories(q, page, perPage) [Server]
    → mapSearchResponse() → RepositoryListItemViewModel[]
    → 各 RepositoryListItem に props として渡す
```

---

## 7. 一覧カード表示項目

| 項目 | 優先度 | 表示ルール |
|---|---|---|
| リポジトリ名 | 第一 | 詳細へのリンク |
| 説明文 | 第一 | 先頭50文字 + 展開/折りたたみ。null なら非表示 |
| Star 数 | 第二 | `formatNumber()` で整形（1.2k等） |
| 主要言語 | 第二 | null なら非表示 |
| 最終更新日 | 第二 | `formatRelativeDate()` で相対表示 |
| Topics | 第二 | 最大3件 + `+N` バッジ |
| License | 第二 | SPDX ID。null なら非表示 |
| オーナーアイコン | 第三 | 32×32 rounded |
| オーナー名 | 第三 | アイコン横 |
| GitHub で開く | 第三 | 外部リンク（新しいタブ） |

---

## 8. ページネーション仕様

- 形式: `< 2 3 [4] 5 6 >`
- 現在ページ ±2 を表示（最大5ページ分）
- 1ページしかない場合は非表示
- GitHub API 上限 1000件ガード: `maxPage = min(ceil(totalCount/perPage), floor(1000/perPage))`
- 現在ページに `aria-current="page"`

---

## 9. SEO / Metadata

| 条件 | title | robots |
|---|---|---|
| `q` なし | デフォルト（`git-repo-finder`） | index, follow |
| `q` あり | `"{q}" の検索結果 \| git-repo-finder` | noindex, follow |

---

## 10. エッジケース・制約

- 空文字では検索しない（フォーム側でガード）
- `incomplete_results=true` 時は amber 色で補足メッセージを表示
- API 上限超過ページへのアクセスは PaginationNav が maxPage でガード
- Suspense key が `${q}-${page}-${perPage}` なので、パラメータ変更で必ず再取得
- レート制限時は `x-ratelimit-reset` からリセット時刻を HH:mm で表示
- `retry-after` ヘッダーがあれば秒数も併記

---

## 11. a11y

- 検索フォーム: `role="search"`, visible label, `label[for]` 紐付け
- クリアボタン: `aria-label` 付き
- 説明文展開: `aria-expanded` 付きボタン
- 結果エリア: `aria-live="polite"`
- レート制限・エラー: `role="alert"`
- ページネーション: `nav[aria-label="ページネーション"]`, `aria-current="page"`
- 表示件数: `aria-label="表示件数"`
- Star アイコン: `sr-only` ラベル
