# お気に入り画面

## 1. 役割

ユーザーが気に入ったリポジトリを一覧で見返し、管理する画面。
ログイン不要で、ブラウザの LocalStorage に保存する。

---

## 2. URL

- パス: `/favorites`
- パラメータ: なし

---

## 3. 状態一覧

| 状態 | 条件 | 表示内容 |
|---|---|---|
| 空 | LocalStorage に0件 | 「お気に入りはまだありません」 |
| 一覧あり | 1件以上 | 件数 + 「すべて削除」ボタン + リスト |

> ローディング状態は存在しない（LocalStorage からの同期読み取り）。
> SSR 時は空配列をサーバースナップショットとして返し、クライアントで復元する。

---

## 4. 操作 → 結果マッピング

| 操作 | 結果 | URL変化 |
|---|---|---|
| リポジトリ名クリック | 詳細画面へ遷移 | `/repositories/{owner}/{repo}` |
| ゴミ箱ボタン（個別） | 該当アイテムを削除 | 変化なし（LocalStorage 更新） |
| 「すべて削除」ボタン | 全件削除 → 空状態へ | 変化なし（LocalStorage 更新） |
| タイトル（ヘッダー）クリック | トップへ遷移 | `/` |

---

## 5. コンポーネント構成

| コンポーネント | Server/Client | 責務 | ファイル |
|---|---|---|---|
| `page.tsx` | Server | metadata 設定・FavoriteList 描画 | `src/app/favorites/page.tsx` |
| `FavoriteList` | Client | LocalStorage 購読・一覧描画・全削除 | `src/features/favorites/components/FavoriteList.tsx` |
| `FavoriteListItem` | Client | 個別カード・個別削除 | `src/features/favorites/components/FavoriteListItem.tsx` |

---

## 6. データフロー

```
LocalStorage("git-repo-finder:favorites")
  → useSyncExternalStore で購読
  → FavoriteItem[] として取得
  → FavoriteListItem に props として渡す
  → 削除操作 → setStorageItems() + dispatchEvent("storage")
```

### LocalStorage キー

`git-repo-finder:favorites`

### 保存データ型

```typescript
type FavoriteItem = {
  id: number;
  owner: string;
  repo: string;
  description: string | null;
  language: string | null;
  stars: number;
  savedAt: string;  // ISO 8601 タイムスタンプ
};
```

---

## 7. カード表示項目

| 項目 | 表示ルール |
|---|---|
| リポジトリ名 | `{owner}/{repo}` 形式、詳細へのリンク |
| 説明文 | truncate 表示。null なら非表示 |
| 主要言語 | null なら非表示 |
| Star 数 | `formatNumber()` で整形 |
| 削除ボタン | ゴミ箱アイコン |

---

## 8. お気に入り追加の仕様（詳細画面側）

追加は詳細画面の `FavoriteButton` で行う（この画面では閲覧・削除のみ）。

| 操作 | 実装 | 配置 |
|---|---|---|
| トグル（追加/解除） | `addFavorite()` / `removeFavorite()` | 詳細画面 |
| 重複防止 | ID で既存チェック、重複なら追加しない | `favorites-storage.ts` |
| 上限 | なし（LocalStorage 容量に依存） | — |

### FavoriteButton の状態同期

- `useSyncExternalStore` で LocalStorage を購読
- サーバースナップショット: `false`（SSR 時は未お気に入り扱い）
- 操作後に `dispatchEvent(new Event("storage"))` でクロスコンポーネント同期

---

## 9. SEO / Metadata

| 項目 | 値 |
|---|---|
| title | `お気に入り \| git-repo-finder` |
| robots | noindex, follow |

---

## 10. エッジケース・制約

- LocalStorage が無効/満杯の場合、操作は silent fail（エラー表示なし）
- SSR 時は空配列 → クライアントハイドレーション後に実データが表示される
- タブ間同期: `storage` イベント経由で他タブの変更も反映
- `savedAt` は保存時点のタイムスタンプ（表示には現在使用していないが、将来のソート等に利用可能）

---

## 11. a11y

- 削除ボタン: `aria-label` でリポジトリ名を含む説明
- リスト: セマンティックな構造
- 空状態: テキストで次の行動を案内
