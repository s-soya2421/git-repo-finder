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

### 比較画面としての一覧設計

一覧は「検索結果を返す画面」ではなく「候補を比較する画面」として設計した。
一覧を離れなくても Star 数・言語・更新日・説明文・Topics・License が揃って見えるため、「詳細を開く価値があるか」を一覧だけで判断できる情報密度を持たせた。

### Intercepting Routes による文脈を失わない詳細遷移

一覧から詳細へ遷移した際、Intercepting Routes により一覧の上にオーバーレイで詳細を表示する。URL は詳細 URL に変わるため共有・再訪は可能でありながら、背景の一覧が残るため比較の文脈を失わない。URL を直接開いた場合は独立ページとして表示される。

### Server Component による安全な API 連携

GitHub Token はサーバー側の環境変数にのみ存在し、クライアントには渡らない。API 呼び出しはすべて Server Component 経由で行うため、Token がブラウザに露出しない構成になっている。

### URL 駆動の検索状態管理

検索条件（キーワード・ページ・表示件数）は URL クエリパラメータで管理する。入力途中の値はローカル state で保持し、検索確定時のみ URL を更新することで、共有・再訪・ブラウザバック耐性・SSR との整合性を両立した。

### GitHub Search API の制約を考慮したページネーション

`search/repositories` は最大 1,000 件（`per_page × page ≤ 1,000`）の制約がある。この制約を踏まえ、全件閲覧を前提とせず上位候補から目的に合う 1 件を見つけることに特化したページネーション UI を採用した。

### Streaming + Suspense による体感速度の向上

検索フォームとヘッダーを即時表示し、検索結果のみ Suspense でストリーミング配信する。初期表示のブランク時間をなくし、スケルトン UI でレイアウトシフトを抑えた。

---

## AI 利用について

本プロジェクトでは、要件整理・設計方針の検討・ドキュメント化において AI を活用した。

活用した主な用途：

- 要件定義の壁打ち・抜け漏れ確認
- 設計上の論点整理と複数案の比較
- アクセシビリティ・SEO・運用観点でのレビュー
- ドキュメントの構造化支援

AI はコードを生成させる用途ではなく、「その設計が妥当か」「保守しやすいか」「ユーザーにとって使いやすいか」という観点でフィードバックを受けるために使用した。スコープの確定・設計判断・採用内容の決定はすべて自分で行っている。

---

## Docs

設計・要件の詳細は [`docs/`](./docs) を参照。

| ファイル | 内容 |
|---|---|
| [overview.md](./docs/overview.md) | 概要・目的・プロダクト方針・スコープ |
| [requirements.md](./docs/requirements.md) | 画面要件・URL設計・API・各機能要件 |
| [design.md](./docs/design.md) | コンポーネント設計・ルーティング・テスト方針 |
| [plan.md](./docs/plan.md) | 実装フェーズ・チェックリスト |
