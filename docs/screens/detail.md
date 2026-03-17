# 詳細画面

## 1. 役割

一覧で気になった候補について、**GitHub 本体へ遷移する前の最終判断を支援する画面**。
「何の repo か」「今も保守されているか」「次にどこを見るべきか」が分かる構成とする。

---

## 2. URL

- パス: `/repositories/[owner]/[repo]`
- 例: `/repositories/vercel/next.js`
- パラメータ: なし

### アクセス経路による表示の違い

| 経路 | 表示方式 | 現状 |
|---|---|---|
| 一覧からの遷移 | 独立ページとして表示 | Intercepting Routes 未実装（将来オーバーレイ予定） |
| URL 直接アクセス | 独立ページとして表示 | 実装済み |

> **注**: `app/(.)repositories/[owner]/[repo]/` は plan.md では計画されているが、現時点では未実装。

---

## 3. 状態一覧

| 状態 | 条件 | 表示内容 | 備考 |
|---|---|---|---|
| ローディング | データ取得中 | RepositoryDetailSkeleton | loading.tsx。全セクションのスケルトン |
| 成功 | API 正常応答 | RepositoryDetail（全項目） | README も並列取得 |
| 404 | not_found | 「リポジトリが見つかりませんでした」+ トップへリンク | not-found.tsx。`notFound()` で呼出 |
| レート制限 | rate_limit_primary/secondary | 専用メッセージ + リセット時刻 | page.tsx 内でハンドリング |
| APIエラー | その他エラー | error.tsx（再試行 + トップへ） | Error Boundary にスロー |

---

## 4. 操作 → 結果マッピング

| 操作 | 結果 | URL変化 |
|---|---|---|
| 「GitHub で開く」ボタン | 新しいタブで GitHub を開く | 変化なし |
| 「一覧に戻る」ボタン | `router.back()` で前の画面へ | ブラウザ履歴に依存 |
| タイトル（ヘッダー）クリック | トップ初期状態へ遷移 | `/` |
| お気に入りボタン | トグル（追加/解除） | 変化なし（LocalStorage 更新） |
| Homepage リンク | 新しいタブで外部サイトを開く | 変化なし |
| ブラウザバック | 前の画面へ戻る | 前の URL |

---

## 5. コンポーネント構成

| コンポーネント | Server/Client | 責務 | ファイル |
|---|---|---|---|
| `page.tsx` | Server | params 受取・API取得・エラー分岐 | `src/app/repositories/[owner]/[repo]/page.tsx` |
| `loading.tsx` | Server | 全体スケルトン | `src/app/repositories/[owner]/[repo]/loading.tsx` |
| `not-found.tsx` | Server | 404表示 | `src/app/repositories/[owner]/[repo]/not-found.tsx` |
| `error.tsx` | Client | Error Boundary | `src/app/repositories/[owner]/[repo]/error.tsx` |
| `RepositoryDetail` | Server | 各セクションの合成 | `src/features/repository-detail/components/RepositoryDetail.tsx` |
| `RepositoryHeader` | Server | アイコン・名前・説明文 | `src/features/repository-detail/components/RepositoryHeader.tsx` |
| `RepositoryStats` | Server | Star/Watcher/Fork/Issue | `src/features/repository-detail/components/RepositoryStats.tsx` |
| `RepositoryMeta` | Server | 言語/License/Topics/更新日/Homepage/Security Signals | `src/features/repository-detail/components/RepositoryMeta.tsx` |
| `RepositoryReadme` | Server | README Markdown レンダリング | `src/features/repository-detail/components/RepositoryReadme.tsx` |
| `ExternalLinks` | Server | GitHub ボタン + 戻るボタン wrapper | `src/features/repository-detail/components/ExternalLinks.tsx` |
| `BackToListButton` | Client | `router.back()` | `src/features/repository-detail/components/BackToListButton.tsx` |
| `FavoriteButton` | Client | お気に入りトグル（LocalStorage） | `src/features/favorites/components/FavoriteButton.tsx` |
| `RecentlyViewedRecorder` | Client | 閲覧記録（effect、非表示） | `src/features/recently-viewed/components/RecentlyViewedRecorder.tsx` |
| `ScrollToTop` | Client | ページ遷移時のスクロールリセット | `src/shared/ui/scroll-to-top.tsx` |

### コンポーネントツリー

```
page.tsx [Server]
├── ScrollToTop [Client]
└── RepositoryDetail [Server]
    ├── RecentlyViewedRecorder [Client] ← effect のみ、描画なし
    ├── RepositoryHeader [Server]
    ├── FavoriteButton [Client]
    ├── RepositoryStats [Server]
    ├── RepositoryMeta [Server]
    ├── ExternalLinks [Server]
    │   └── BackToListButton [Client]
    └── RepositoryReadme [Server]
```

---

## 6. データフロー

```
URL params: { owner, repo }
  → page.tsx: getRepository() で基本情報取得
  → Promise.all([getReadme(), getLatestRelease(), getSecurityPolicyStatus(), getDependabotStatus(), getLatestCiStatus()]) [並列取得]
  → mapRepositoryResponse() → RepositoryDetailViewModel
  → securitySignals を組み立て（取得失敗は unknown）
  → Base64 デコード（README）
  → <RepositoryDetail repository={vm} readmeContent={string|null} securitySignals={...} />
  → 副作用: RecentlyViewedRecorder が LocalStorage に記録
  → 副作用: FavoriteButton が LocalStorage を購読
```

---

## 7. 表示項目

### ヘッダー

| 項目 | 表示ルール |
|---|---|
| オーナーアイコン | 48×48 rounded, next/image |
| リポジトリ名 | h1, xl, bold |
| オーナー名 | muted, sm |
| 説明文 | 全文表示。null なら非表示 |

### 統計（Stats）

| 項目 | APIフィールド | ViewModelフィールド | UIラベル |
|---|---|---|---|
| Star | `stargazers_count` | `stars` | Star アイコン + 数値 |
| Watcher | `subscribers_count` | `watchers` | Eye アイコン + 数値 |
| Fork | `forks_count` | `forks` | GitFork アイコン + 数値 |
| Open Issues | `open_issues_count` | `openIssues` | CircleDot アイコン + 数値 |

> **重要**: `watchers` は `subscribers_count` を使用。GitHub の `watchers_count` は非推奨。

### メタ情報（Meta）

| 項目 | 表示ルール |
|---|---|
| 主要言語 | null なら非表示 |
| License | Badge (outline)。SPDX ID。null なら非表示 |
| Topics | Badge (secondary)。全件表示 |
| 最終更新日 | `formatRelativeDate()` で相対表示 |
| コード最終更新日 | `pushed_at` を `formatRelativeDate()` で相対表示。180日以上で「要注意」 |
| Archived / Disabled | true のとき警告バッジ表示 |
| Homepage | 外部リンク（target=_blank）。null なら非表示 |

### Security Signals

| 項目 | 表示ルール |
|---|---|
| SECURITY.md | present / absent / unknown をバッジ表示 |
| Dependabot | present / absent / unknown をバッジ表示 |
| CI | success / failed / none / unknown をバッジ表示 |

### README

| 条件 | 表示 |
|---|---|
| README あり | `react-markdown` + remarkGfm + rehypeRaw |
| README なし | 「README が見つかりませんでした」 |

---

## 8. SEO / Metadata

| 項目 | 値 |
|---|---|
| title | `{owner}/{repo}` |
| robots | noindex, follow |

---

## 9. 副作用

| 副作用 | タイミング | 実装 |
|---|---|---|
| 最近見た記録 | コンポーネントマウント時 | `RecentlyViewedRecorder` の `useEffect` |
| スクロールリセット | pathname 変更時 | `ScrollToTop` の `useEffect` |

保存データ（StoredRepository）:

```typescript
{ id, owner, repo, description, language, stars }
```

---

## 10. エッジケース・制約

- README の Base64 デコードはサーバー側で実行
- README の HTML は `rehypeRaw` でレンダリング
- `getReadme()` が 404 の場合は null を返す（エラーにしない）
- レート制限時はリポジトリ情報・README ともに取得不可
- Security Signals の取得失敗は unknown として表示（ページ自体は表示継続）
- `BackToListButton` は `router.back()` なので、直接アクセス時は前のページに戻る（一覧とは限らない）

---

## 11. a11y

- アバター: 適切な alt テキスト（オーナー名含む）
- 統計アイコン: `aria-hidden="true"`（装飾）
- メタ情報: `<dl>/<dt>/<dd>` で構造化
- GitHub リンク: 適切な `aria-label`（外部リンクであることを明示）
- お気に入りボタン: 状態に応じたアイコン変化
- 外部リンク: `target="_blank"` + `rel="noopener noreferrer"`
