# git-repo-finder

GitHub の公開リポジトリを検索し、候補を比較しながら短時間で目的に合う 1 件を見つけるための Web アプリケーション。

「検索できること」ではなく、**候補を見つける → 比較する → 判断する** という一連の流れを、GitHub 本体より軽く・迷いなく支援することをコア価値としている。

---

## Features

- キーワードによるリポジトリ検索（GitHub Search API）
- 一覧画面での候補比較（Star 数・言語・更新日・Topics・License を一覧で確認）
- 詳細画面での最終判断支援（README・全統計情報）
- 検索条件の URL 保持（共有・再訪・ブラウザバック対応）
- お気に入り保存・最近見たリポジトリ（LocalStorage）
- ダークモード対応

## Tech Stack

- **Framework**: Next.js (App Router)
- **UI**: shadcn/ui, Tailwind CSS
- **Language**: TypeScript
- **Test**: Vitest / Playwright
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

```
GITHUB_TOKEN=your_github_token
```

> GitHub Token は未設定でも動作しますが、レート制限が 60 req/h になります。Token を設定すると 5,000 req/h になります。

## 工夫した点・拘ったポイント

### 「比較→判断」を最短にする情報設計

一覧画面は「検索結果を返す画面」ではなく「候補を比較する画面」として設計した。Star 数・言語・更新日・説明文・Topics・License を一覧内に並べることで、詳細を開かなくても「どれを深掘りすべきか」が判断できる。詳細画面では GitHub 本体を開く前に必要な判断材料（README・統計・最新リリース・直接リンク）を 1 画面に集約し、「使うかどうか」の最終判断までをこのアプリ内で完結させることを目指した。

### Server Component 中心のセキュリティと描画戦略

GitHub Token はサーバー側の環境変数にのみ存在し、API 呼び出しはすべて Server Component 経由で行う。Client Component は検索フォーム・お気に入りトグル・ソート/フィルター切替など state が必須な箇所のみに限定し、Token がブラウザに漏れない構成と、Server Component 主体の描画パフォーマンスを両立した。

### URL 駆動の検索状態管理

検索条件（キーワード・ページ・表示件数・ソート）はすべて URL クエリパラメータで管理する。入力途中の値はローカル state で保持し、確定時のみ URL を更新することで、共有・再訪・ブラウザバック耐性・SSR 整合性を実現した。デフォルト値は URL から省略し、最短の URL を保つ。

### GitHub Search API の制約を前提としたページネーション

`search/repositories` は最大 1,000 件（`per_page × page ≤ 1,000`）の制約がある。全件閲覧を前提とせず、上位候補から目的に合う 1 件を見つけることに特化したページネーション設計を採用した。ソート（関連度/Star 数/更新日）で候補の並び順を変えられるため、深いページ送りの必要性自体を減らしている。

### Streaming + Suspense による体感速度の向上

検索フォームとヘッダーを即時表示し、検索結果のみ Suspense でストリーミング配信する。初期表示のブランク時間をなくし、スケルトン UI でレイアウトシフトを抑えた。

---

## AI 利用について

本プロジェクトでは、設計・実装の両面で AI を活用した。

活用した主な用途：

- **設計支援**: 要件定義の壁打ち・抜け漏れ確認、設計上の論点整理と複数案の比較
- **レビュー**: アクセシビリティ・SEO・運用観点でのフィードバック
- **ドキュメント**: 構造化支援、仕様の整理
- **コード生成**: 機能実装のコード生成・リファクタリング提案

AI が生成したコードはそのまま採用するのではなく、プロダクトの設計方針（`AGENTS.md`）に沿っているか、保守しやすいか、ユーザー体験を損なわないかを確認した上で採用・修正している。スコープの確定・設計判断・最終的な採用内容の決定はすべて自分で行っている。

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
