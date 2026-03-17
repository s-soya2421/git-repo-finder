# テスト方針

このドキュメントは、テストの書き方・判断基準を明文化するものである。

---

## 1. テスト構成

| 種別 | フレームワーク | 場所 | 実行コマンド |
|---|---|---|---|
| 単体テスト | Vitest | `src/**/__tests__/*.test.ts` | `npm test` |
| カバレッジ | @vitest/coverage-v8 | — | `npm test -- --coverage` |
| E2E テスト | Playwright | `e2e/*.spec.ts` | `npm run test:e2e` |

### ディレクトリ規約

テストファイルは対象モジュールと同じ feature ディレクトリ内の `__tests__/` に配置する。

```
src/features/repository-search/
  lib/
    parse-search-params.ts
    __tests__/
      parse-search-params.test.ts
```

---

## 2. 単体テストの対象

### テストすべきもの（lib の純粋関数中心）

| 対象 | 例 | 理由 |
|---|---|---|
| searchParams の parse / validate / normalize | `parseSearchParams`, `normalizeSearchParams` | URL 駆動のコア。バリデーション境界が多い |
| URL 生成 | `buildSearchUrl` | 不正な URL がユーザーに見える |
| ページネーション計算 | `calcPagination` | API 上限ガード（1000件）など非自明なロジック |
| ViewModel 変換 | `mapSearchResponse`, `mapRepositoryResponse` | フィールド名読み替え、null 安全性 |
| 数値 / 日付整形 | `formatNumber`, `formatRelativeDate` | 境界値（1000→1k）、単数/複数形 |
| エラー分類 | `classifyGitHubError` | rate limit 種別の分岐が UI 表示に直結 |
| API クライアント | `searchRepositories`, `getRepository` 等 | エラーハンドリング、ヘッダー処理 |
| ストレージ操作 | `favorites-storage`, `recently-viewed-storage` | SSR ガード、重複排除、不正 JSON 回復 |
| 表示ロジック | `truncateDescription`, `sliceVisibleTopics` | コンポーネントから抽出した計算 |

### テストしないもの

| 対象 | 理由 |
|---|---|
| コンポーネント描画 | E2E で担保する。jsdom + testing-library は Server Component との相性が悪い |
| 定数・型定義 | `constants.ts`, `schemas.ts` — TypeScript コンパイラが保証する |
| CSS / スタイル | E2E のビジュアルテストまたは手動確認 |
| 外部ライブラリのラッパー | `cn()` (clsx + twMerge) など — 自前ロジックがない |

---

## 3. テストの書き方

### 3.1 構造

```typescript
import { describe, expect, it } from "vitest";
import { targetFunction } from "../target-module";

describe("targetFunction", () => {
  it("describes expected behavior", () => {
    expect(targetFunction(input)).toBe(expected);
  });
});
```

- `describe` は関数名またはモジュール名
- `it` は振る舞いを英語または日本語で記述（プロダクトのドメイン用語に合わせてよい）
- 日本語の例: `calc-pagination.test.ts` — `it("API上限ガード: totalCount=50000, perPage=50 → maxPage=20")`

### 3.2 日付テスト

日付に依存するテストでは、固定 `now` を引数で注入する。`Date.now()` のモックは使わない。

```typescript
const now = new Date("2026-03-18T00:00:00Z");
expect(classifyCodeFreshness("2025-09-19T00:00:00Z", now)).toBe("stale");
```

### 3.3 ブラウザ API のモック

localStorage 等は `vi.stubGlobal` + `Map` ベースの軽量モックを使う。

```typescript
const mockStorage = new Map<string, string>();
beforeEach(() => {
  mockStorage.clear();
  vi.stubGlobal("window", {});
  vi.stubGlobal("localStorage", {
    getItem: (key: string) => mockStorage.get(key) ?? null,
    setItem: (key: string, value: string) => mockStorage.set(key, value),
    removeItem: (key: string) => mockStorage.delete(key),
  });
});
afterEach(() => {
  vi.unstubAllGlobals();
});
```

### 3.4 fetch のモック（API クライアントテスト）

`globalThis.fetch` を直接差し替える。React `cache` は pass-through でモックする。

```typescript
vi.mock("react", () => ({
  cache: <T extends (...args: unknown[]) => unknown>(fn: T) => fn,
}));

globalThis.fetch = vi.fn().mockResolvedValue(
  new Response(JSON.stringify(body), { status: 200 }),
);
```

### 3.5 テストデータのファクトリ

`makeResponse()` / `makeItem()` のようなファクトリ関数で、テストごとに必要なフィールドだけ override する。全フィールドをテストごとにコピーしない。

```typescript
function makeItem(overrides: Partial<GitHubSearchItem> = {}): GitHubSearchItem {
  return { id: 1, name: "repo", /* ...defaults... */ ...overrides };
}

it("license が null の場合 null を返す", () => {
  const result = mapSearchResponse(makeResponse({
    items: [makeItem({ license: null })],
  }));
  expect(result.items[0].license).toBeNull();
});
```

---

## 4. テストの品質基準

### 意味のあるテストを書く

以下の観点でテストの価値を判断する。

| 観点 | 良い例 | 避けるべき例 |
|---|---|---|
| 変換ロジック | `license?.spdx_id ?? null` の null 分岐 | `expect(item.name).toBe("repo")` — 代入のテスト |
| 境界値 | `formatNumber(999)` → `"999"`, `formatNumber(1000)` → `"1k"` | 正常系 1 パターンだけ |
| フォールバック | `unknown` に対して `"不明"` が返ること | 全 enum 値の文字列一致をべた書き |
| エラーパス | 不正 JSON → 空配列で回復 | 正常系のみ |

### 避けるべきパターン

1. **TypeScript が保証する範囲のテスト**: フィールド代入 `item.name = response.name` の一致確認は型チェックで十分
2. **過剰モック**: ページモジュールを import して全コンポーネントをモックするより、テスト対象のロジックだけを直接テストする
3. **自明なルックアップテスト**: `presenceLabel("present") === "あり"` のような 1:1 マッピングは、enum 網羅性と fallback にフォーカスする

---

## 5. E2E テスト

### 対象

- 検索実行 → 結果表示 → ページ遷移
- 一覧 → 詳細 → 戻る
- お気に入り追加 / 削除 / 一覧表示
- 最近見たリポジトリの記録 / 削除
- 0 件表示 / エラー表示 / 404 表示

### 方針

- ユーザーフローを role / label ベースのセレクタで検証する
- 外部 API に直接依存させず、モックまたは録画レスポンスを使う
- コンポーネント単体の描画確認は E2E の責務とする（jsdom は使わない）

---

## 6. カバレッジ

### 設定

```typescript
// vitest.config.ts
coverage: {
  provider: "v8",
  reporter: ["text", "html"],
}
```

### 運用方針

- lib 層（純粋関数）は高カバレッジを維持する
- コンポーネント層はカバレッジ対象外（E2E で担保）
- カバレッジ数値自体をゴールにしない。テストの意味を優先する

---

## 7. 現在のテストファイル一覧

### 単体テスト

| ファイル | テスト対象 |
|---|---|
| `shared/lib/__tests__/classify-code-freshness.test.ts` | コード鮮度分類 |
| `shared/lib/__tests__/format-number.test.ts` | 数値整形 |
| `shared/lib/__tests__/format-relative-date.test.ts` | 相対日付整形 |
| `shared/lib/__tests__/logger.test.ts` | JSON ロガー |
| `shared/lib/__tests__/storage.test.ts` | localStorage 抽象化 |
| `shared/github/__tests__/client.test.ts` | エラー分類・GitHubApiError |
| `shared/github/__tests__/client-fetch.test.ts` | API クライアント fetch 系 |
| `features/repository-search/lib/__tests__/parse-search-params.test.ts` | searchParams パース |
| `features/repository-search/lib/__tests__/normalize-search-params.test.ts` | searchParams 正規化 |
| `features/repository-search/lib/__tests__/calc-pagination.test.ts` | ページネーション計算 |
| `features/repository-search/lib/__tests__/map-search-response.test.ts` | 検索レスポンス変換 |
| `features/repository-search/lib/__tests__/display-helpers.test.ts` | 表示ロジック |
| `features/repository-search/lib/__tests__/sort-mapping.test.ts` | ソートマッピング |
| `features/repository-detail/lib/__tests__/map-repository-response.test.ts` | 詳細レスポンス変換 |
| `features/repository-detail/lib/__tests__/meta-labels.test.ts` | ラベル関数 |
| `features/favorites/lib/__tests__/favorites-storage.test.ts` | お気に入りストレージ |
| `features/recently-viewed/lib/__tests__/recently-viewed-storage.test.ts` | 閲覧履歴ストレージ |
| `app/__tests__/metadata.test.ts` | metadata 生成ロジック |

### E2E テスト

| ファイル | テスト対象 |
|---|---|
| `e2e/search.spec.ts` | 検索フロー |
| `e2e/detail.spec.ts` | 詳細ページ |
| `e2e/favorites.spec.ts` | お気に入り |
| `e2e/recently-viewed.spec.ts` | 閲覧履歴 |
