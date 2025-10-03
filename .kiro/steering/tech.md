# 技術スタック

## アーキテクチャ

**システム設計**: クライアント・サーバー分離型アーキテクチャ

- **フロントエンド**: Next.js 15 App Router + React 19（クライアントコンポーネント）
- **バックエンド**: Next.js API Routes（Route Handlers）
- **AI統合**: Vercel AI SDK 5.0 + OpenRouter Provider
- **スタイリング**: Tailwind CSS 4（ユーティリティファースト）
- **型システム**: TypeScript 5（strict mode有効）

**設計原則**:
- Server Components（RSC）とClient Componentsの適切な分離
- APIキーのサーバーサイド管理（クライアント露出防止）
- ストリーミングレスポンスによる体感速度向上
- 型安全性の徹底（`any`型使用禁止）

## フロントエンド

### コアフレームワーク
- **Next.js**: 15.5.4（App Router、Turbopack有効）
- **React**: 19.1.0 + React DOM 19.1.0
- **TypeScript**: 5.x（厳格モード）

### AI/チャット統合
- **Vercel AI SDK Core**: `ai@5.0.60`（streamText関数）
- **Vercel AI SDK React**: `@ai-sdk/react`（useChatフック）
- **OpenRouter Provider**: `@openrouter/ai-sdk-provider@1.2.0`

### スタイリング
- **Tailwind CSS**: 4.x（最新版）
- **PostCSS**: `@tailwindcss/postcss@4.x`
- **フォント**: next/font（Geist、Geist Mono）

### 開発ツール
- **ビルドツール**: Turbopack（Next.js 15標準）
- **リンター**: Biome 2.2.0（ESLint + Prettier代替）
- **Git Hooks**: Lefthook 1.13.6

## バックエンド

### ランタイム
- **Node.js**: 20.x以上推奨
- **実行環境**: Vercel Serverless Functions

### API層
- **Route Handlers**: Next.js 15 App Router（`app/api/`）
- **ストリーミング**: Server-Sent Events（SSE）
- **AI統合**: Vercel AI SDK streamText関数

### 主要機能
- リクエストバリデーション（TypeScript型ガード）
- エラーハンドリング（構造化エラーレスポンス）
- OpenRouter API統合（プロバイダーパターン）

## テスト環境

### テストフレームワーク
- **ユニット/統合テスト**: Vitest 3.2.4
- **React Testing**: @testing-library/react 16.3.0 + @testing-library/dom 10.4.1
- **DOM環境**: jsdom 27.0.0
- **E2Eテスト**: （将来的にPlaywright導入予定）

### テストツール
- **vite-node**: Vitestランナー
- **@vitejs/plugin-react**: React JSX変換
- **vite-tsconfig-paths**: TypeScriptパスエイリアス解決

### テスト戦略
- ユニットテスト: コンポーネント、バリデーション関数
- 統合テスト: API Route + OpenRouter、useChat + API Route
- E2Eテスト: チャット送信フロー、エラーハンドリング

## 開発環境

### 必須ツール
- **Node.js**: 20.x以上
- **パッケージマネージャー**: npm、yarn、pnpm、bunのいずれか
- **Git**: バージョン管理
- **VSCode**: 推奨エディタ（TypeScript LSP活用）

### 推奨VSCode拡張
- Biome（公式リンター/フォーマッター）
- Tailwind CSS IntelliSense
- TypeScript + JavaScript Language Features

### 環境構築手順
```bash
# 依存関係インストール
npm install

# 環境変数設定
cp .env.example .env.local
# OPENROUTER_API_KEYを設定

# 開発サーバー起動
npm run dev
```

## よく使うコマンド

### 開発
```bash
npm run dev          # 開発サーバー起動（Turbopack有効）
npm run build        # 本番ビルド
npm start            # 本番サーバー起動
```

### コード品質
```bash
npm run lint         # Biomeリンター実行
npm run format       # Biomeフォーマッター実行
npm run format:check # フォーマットチェック（CI用）
npm run typecheck    # TypeScript型チェック
```

### テスト
```bash
npm test            # Vitestテスト実行（ウォッチモード）
npm run test:ci     # CI用テスト実行（シングルラン）
```

## 環境変数

### 必須環境変数
| 変数名 | 説明 | 例 |
|--------|------|-----|
| `OPENROUTER_API_KEY` | OpenRouter APIキー | `sk-or-v1-...` |

### オプション環境変数
| 変数名 | 説明 | デフォルト値 |
|--------|------|------------|
| `OPENROUTER_MODEL` | 使用するAIモデル名 | `anthropic/claude-3.7-sonnet:thinking` |
| `NEXT_PUBLIC_APP_URL` | アプリケーションURL | `http://localhost:3000` |

### セキュリティ
- `.env.local`は`.gitignore`に登録済み
- クライアント側で環境変数を使う場合は`NEXT_PUBLIC_`プレフィックス必須
- APIキーは絶対にクライアントサイドに露出させない

## ポート設定

| サービス | ポート | 説明 |
|---------|--------|------|
| Next.js開発サーバー | 3000 | フロントエンド・API Routes |
| Vitest UI（オプション） | 51204 | テストUIダッシュボード |

## 技術的制約

- **ブラウザサポート**: モダンブラウザ（ES2017対応）
- **Node.js**: 20.x以上必須
- **TypeScript**: strict mode有効（any型使用禁止）
- **Next.js**: App Routerのみ使用（Pages Router非推奨）
- **Vercel AI SDK**: 5.0系のみ対応（v4以前は非互換）

## 依存関係管理

### バージョン管理方針
- **メジャーバージョン**: Next.js、React、Vercel AI SDKは明示的にアップデート
- **マイナー/パッチ**: セキュリティパッチは自動適用
- **peerDependencies**: package.jsonで厳密に管理

### アップデート推奨タイミング
- Vercel AI SDK: 新機能追加時
- Next.js: LTS版リリース時
- セキュリティ脆弱性: 即座に対応
