# トップ初期状態（検索前）

## 1. 役割

検索を開始する前の状態。ユーザーに**何をすべきかを案内**し、過去に見たリポジトリへの再アクセス導線を提供する。
一覧画面（`/`）の `q` パラメータがない場合にこの状態になる。

---

## 2. URL

- パス: `/`
- パラメータ: なし（`q` なし）

---

## 3. 状態一覧

| 状態 | 条件 | 表示内容 |
|---|---|---|
| 初期（履歴なし） | 最近見たリポジトリ 0件 | SearchForm + EmptyState(initial) |
| 初期（履歴あり） | 最近見たリポジトリ 1件以上 | SearchForm + EmptyState(initial) + RecentlyViewedList |

---

## 4. 表示構成

### 検索フォーム（常時表示）

| 要素 | 内容 |
|---|---|
| ラベル | 「リポジトリを検索」（visible label） |
| 入力欄 | placeholder: `例: nextjs auth` |
| 検索ボタン | 検索アイコン + 「検索」テキスト |
| 補助テキスト | `nextjs auth` / `nextjs stars:>500 language:typescript` の例示 |

### EmptyState（初期）

| 要素 | 内容 |
|---|---|
| 見出し | 「GitHub リポジトリを検索・比較し、目的に合う候補を素早く見つける」 |
| 補助文 | 「キーワードを入力して検索を開始してください」 |

### 最近見たリポジトリ（RecentlyViewedList）

条件: LocalStorage に1件以上ある場合のみ表示。0件なら非表示（空状態メッセージなし）。

| 要素 | 内容 |
|---|---|
| 見出し | 「最近見たリポジトリ」 |
| 「すべて削除」ボタン | 全件クリア |
| リスト | RecentlyViewedListItem の繰り返し |

---

## 5. 操作 → 結果マッピング

| 操作 | 結果 | URL変化 |
|---|---|---|
| Enter / 検索ボタン | 検索実行 → 結果状態へ | `/?q={入力値}` |
| 最近見たリポジトリをクリック | 詳細画面へ遷移 | `/repositories/{owner}/{repo}` |
| 個別削除（ゴミ箱ボタン） | 該当アイテム削除 | 変化なし |
| 「すべて削除」 | 全件削除 → RecentlyViewedList 非表示 | 変化なし |

---

## 6. コンポーネント構成

| コンポーネント | Server/Client | 責務 |
|---|---|---|
| `page.tsx` | Server | q なし判定・EmptyState + RecentlyViewedList 描画 |
| `SearchForm` | Client | 入力 state・submit |
| `EmptyState` | Server | 案内メッセージ表示 |
| `RecentlyViewedList` | Client | LocalStorage 購読・一覧描画 |
| `RecentlyViewedListItem` | Client | 個別カード・個別削除 |

---

## 7. 最近見たリポジトリの仕様

### LocalStorage キー

`git-repo-finder:recently-viewed`

### 保存データ型

```typescript
type RecentlyViewedItem = {
  id: number;
  owner: string;
  repo: string;
  description: string | null;
  language: string | null;
  stars: number;
  viewedAt: string;  // ISO 8601 タイムスタンプ
};
```

### ルール

| ルール | 内容 |
|---|---|
| 記録タイミング | 詳細画面を開いた時点で自動記録 |
| 上限 | 最大 20件。超過時は古いものから自動削除 |
| 重複 | 同じリポジトリは `viewedAt` を更新して先頭に移動 |
| 削除 | 個別削除・全削除が可能 |
| 保存場所 | LocalStorage（ログイン不要、ブラウザ間同期なし） |

### カード表示項目

| 項目 | 表示ルール |
|---|---|
| リポジトリ名 | `{owner}/{repo}` 形式、詳細へのリンク |
| 主要言語 | null なら非表示 |
| Star 数 | `formatNumber()` で整形 |
| 削除ボタン | ゴミ箱アイコン |

> お気に入りカードと異なり、**説明文は表示しない**（コンパクト表示）。

---

## 8. SEO / Metadata

| 項目 | 値 |
|---|---|
| title | `git-repo-finder`（デフォルト） |
| robots | index, follow |

---

## 9. エッジケース・制約

- SSR 時は RecentlyViewedList が空配列 → ハイドレーション後に LocalStorage から復元
- LocalStorage が無効/満杯の場合、RecentlyViewedList は表示されないだけ（エラーなし）
- タブ間同期: `storage` イベント経由

---

## 10. a11y

- 検索フォーム: `role="search"`, visible label, `label[for]` 紐付け
- 検索例: 補助テキストとして表示（スクリーンリーダーでも読める）
- 削除ボタン: `aria-label` でリポジトリ名を含む説明
