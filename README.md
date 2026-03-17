# git-repo-finder

GitHub の公開リポジトリを検索し、候補を比較しながら短時間で目的に合う 1 件を見つけるための Web アプリケーション。

「検索できること」ではなく、**候補を見つける → 比較する → 判断する** という一連の流れを、GitHub 本体より軽く・迷いなく支援することをコア価値としている。

---

## Features

- キーワード検索（GitHub Search API）
- 一覧画面での候補比較（説明文・Star 数・主要言語・License・最終更新・コード最終更新・Topics・Archived/Disabled）
- 並び順切替（関連度 / Star 数 / 更新日）
- 表示件数切替（10 / 30 / 50）とページネーション
- 詳細画面での最終判断支援（README、Stars/Watchers/Forks/Issues、最新リリース、Security Signals、GitHub導線）
- 検索条件の URL 保持（`q`, `page`, `perPage`, `sort`）と URL 正規化リダイレクト
- お気に入り保存・最近見たリポジトリ（LocalStorage）
- ダークモード対応

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Runtime/UI**: React 19, shadcn/ui, Tailwind CSS
- **Language**: TypeScript
- **Test**: Vitest / Playwright
- **Observability**: Vercel Analytics / Speed Insights
- **Deploy**: Vercel

## Getting Started

```bash
# 依存関係のインストール
npm install

# 環境変数の設定
cp .env.example .env.local
# GITHUB_TOKEN を設定（GitHub Settings > Developer settings > Personal access tokens）

# 開発サーバーの起動
npm run dev
```

`.env.local` に設定する環境変数：

```bash
GITHUB_TOKEN=your_github_token
```

> GitHub Token は未設定でも動作しますが、レート制限が 60 req/h になります。Token を設定すると 5,000 req/h になります。

## 工夫した点・拘ったポイント

### 比較と判断を早くする情報設計

一覧は「検索結果の羅列」ではなく比較画面として設計し、候補の見極めに必要な情報を 1 画面に集約した。詳細では README・統計・最新リリース・Security Signals（`SECURITY.md` / Dependabot / CI）をまとめ、GitHub 本体へ遷移する前に判断できる構成にしている。

### URL 駆動を崩さない検索体験

検索状態の正本を URL に置き、入力途中の値だけをローカル state で保持している。`src/proxy.ts` で `q/page/perPage/sort` を正規化し、無効値を含む URL は正規化済み URL にリダイレクトすることで、共有性と再現性を担保している。

### GitHub API 制約を前提にした設計

`search/repositories` の制約（`per_page × page <= 1000`）を前提に、深いページ送りより「上位候補の比較」を優先。並び順・表示件数・ページ遷移を組み合わせて、短時間で候補を絞れるようにしている。

### Next.js の強みを活かした実装

- **Server Components 中心**: API 呼び出しはサーバー側に集約し、Token をクライアントに露出しない
- **Client Component を葉に限定**: フォーム入力・ソート/表示件数変更・LocalStorage 操作など必要箇所だけ Client 化
- **Streaming + Suspense**: 検索フォームは先に表示し、結果一覧だけを遅延表示して体感待ち時間を短縮
- **`generateMetadata` 活用**: トップは index、検索結果と詳細は noindex を動的に制御
- **React `cache()`**: 同一リクエスト内の GitHub API 呼び出し重複を排除
- **`next/image` / `next/link` / `next/font`**: 画像最適化・画面遷移体験・フォント配信最適化を標準機能で実現

---

## AI 利用について

本プロジェクトでは AI を「設計と実装の補助」に使っている。

- 要件整理・論点洗い出し・複数案比較
- UI/状態遷移やエラーケースのレビュー観点の補強
- 実装コードやテストコードの下書き・改善案作成
- ドキュメント整備の補助

一方で、採用判断は常に人間側で行い、次を必ず確認してから反映している。

- `AGENTS.md` と `docs/` の方針に沿っているか
- 実装済みコードと記述に齟齬がないか
- 保守性・可読性・テスト容易性を損なっていないか

---

## Docs

設計・要件の詳細は [`docs/`](./docs) を参照。

| ファイル | 内容 |
|---|---|
| [overview.md](./docs/overview.md) | 概要・目的・プロダクト方針・スコープ |
| [requirements.md](./docs/requirements.md) | 画面要件・URL設計・API・各機能要件 |
| [design.md](./docs/design.md) | コンポーネント設計・ルーティング・テスト方針 |
| [plan.md](./docs/plan.md) | 実装フェーズ・チェックリスト |
| [screens/top-initial.md](./docs/screens/top-initial.md) | トップ初期状態画面 |
| [screens/search.md](./docs/screens/search.md) | 一覧（検索）画面 |
| [screens/detail.md](./docs/screens/detail.md) | 詳細画面 |
| [screens/favorites.md](./docs/screens/favorites.md) | お気に入り画面 |
