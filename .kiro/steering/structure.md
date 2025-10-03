# プロジェクト構造

## ルートディレクトリ構成

```
ai-training-chat-app/
├── .kiro/                    # Kiro仕様駆動開発ドキュメント
│   ├── specs/               # フィーチャー仕様書
│   └── steering/            # プロジェクトステアリングドキュメント
├── app/                      # Next.js App Routerアプリケーションコード
│   ├── api/                 # API Routes（Route Handlers）
│   ├── layout.tsx           # ルートレイアウト
│   ├── page.tsx             # ホームページ
│   └── globals.css          # グローバルスタイル
├── .claude/                  # Claude Code設定（カスタムコマンド）
│   └── commands/            # スラッシュコマンド定義
├── node_modules/            # 依存関係（gitignore対象）
├── .next/                   # Next.jsビルド出力（gitignore対象）
├── public/                  # 静的アセット
├── CLAUDE.md                # Claude Codeプロジェクト指示
├── README.md                # プロジェクトドキュメント
├── package.json             # 依存関係・スクリプト定義
├── tsconfig.json            # TypeScript設定
├── next.config.ts           # Next.js設定
├── tailwind.config.js       # Tailwind CSS設定（将来的に追加）
├── vitest.config.ts         # Vitestテスト設定（将来的に追加）
└── .gitignore               # Git除外設定
```

## 主要ディレクトリ詳細

### `.kiro/` - 仕様駆動開発ドキュメント

Kiroスタイルのspec-driven development用ドキュメント格納場所。

```
.kiro/
├── specs/                         # フィーチャー仕様書
│   └── openrouter-chat-app/      # チャットアプリ仕様
│       ├── spec.json             # メタデータ・承認状態
│       ├── requirements.md       # 要件定義（5要件、20受入基準）
│       ├── design.md             # 技術設計（アーキテクチャ・コンポーネント）
│       └── tasks.md              # 実装タスク（24タスク）
└── steering/                      # ステアリングドキュメント
    ├── product.md                # プロダクト概要
    ├── tech.md                   # 技術スタック
    └── structure.md              # プロジェクト構造（本ファイル）
```

**命名規則**:
- 仕様名: ケバブケース（`openrouter-chat-app`）
- 必須ファイル: `spec.json`, `requirements.md`, `design.md`, `tasks.md`

### `app/` - Next.js App Routerアプリケーション

Next.js 15 App Routerベースのアプリケーションコード。

```
app/
├── api/                    # バックエンドAPI Routes
│   └── chat/              # チャットAPI
│       └── route.ts       # POST /api/chat（ストリーミングレスポンス）
├── components/            # Reactコンポーネント（将来的に追加）
│   ├── chat/             # チャット関連コンポーネント
│   │   ├── ChatUI.tsx           # メインチャットコンポーネント
│   │   ├── MessageList.tsx      # メッセージ表示
│   │   ├── MessageItem.tsx      # 個別メッセージ
│   │   └── ChatInput.tsx        # 入力フィールド
│   └── ui/               # 汎用UIコンポーネント
├── lib/                   # ユーティリティ・ヘルパー関数
│   ├── openrouter.ts     # OpenRouter初期化
│   └── validators.ts     # バリデーション関数
├── types/                 # TypeScript型定義
│   ├── chat.ts           # チャット関連型
│   └── api.ts            # API契約型
├── layout.tsx            # ルートレイアウト（フォント・メタデータ）
├── page.tsx              # ホームページ（チャットUI配置予定）
├── globals.css           # Tailwindディレクティブ・グローバルスタイル
└── favicon.ico           # ファビコン
```

**ファイル命名規則**:
- コンポーネント: PascalCase（`ChatUI.tsx`）
- ユーティリティ: camelCase（`openrouter.ts`）
- API Routes: `route.ts`（Next.js規約）

### `.claude/` - Claude Code設定

カスタムスラッシュコマンドと設定ファイル。

```
.claude/
└── commands/
    ├── kiro:spec-init.md          # 仕様初期化コマンド
    ├── kiro:spec-requirements.md  # 要件生成コマンド
    ├── kiro:spec-design.md        # 設計生成コマンド
    ├── kiro:spec-tasks.md         # タスク生成コマンド
    ├── kiro:spec-impl.md          # 実装実行コマンド
    ├── kiro:spec-status.md        # ステータス確認コマンド
    └── kiro:steering.md           # ステアリング管理コマンド
```

## コード組織パターン

### レイヤーアーキテクチャ

**プレゼンテーション層** (`app/components/`, `app/page.tsx`)
- UI/UXロジックのみ
- ビジネスロジックを含まない
- Propsによるデータ受け渡し

**アプリケーション層** (`app/lib/`, カスタムHooks)
- ビジネスロジック
- 状態管理（useChat hook）
- データ変換・バリデーション

**インフラストラクチャ層** (`app/api/`, `app/lib/openrouter.ts`)
- 外部API統合
- データ永続化（将来的な拡張）
- サードパーティサービス連携

### コンポーネント分類

**Serverコンポーネント** (デフォルト)
- `app/layout.tsx`
- 静的コンテンツ、メタデータ設定

**Clientコンポーネント** (`'use client'`ディレクティブ)
- `app/components/chat/*`
- インタラクティブUI、useState/useEffect使用

**API Routes** (`route.ts`)
- `app/api/chat/route.ts`
- サーバーサイド処理、OpenRouter統合

## ファイル命名規則

### TypeScriptファイル
- **コンポーネント**: `ComponentName.tsx`（PascalCase）
- **ユーティリティ**: `utilityName.ts`（camelCase）
- **型定義**: `typeName.ts`（camelCase）
- **API Route**: `route.ts`（Next.js規約）

### テストファイル
- **ユニットテスト**: `ComponentName.test.tsx`
- **統合テスト**: `integration.test.ts`
- **E2Eテスト**: `e2e/feature.spec.ts`

### 設定ファイル
- **TypeScript**: `tsconfig.json`, `tsconfig.*.json`
- **Next.js**: `next.config.ts`（TypeScript形式）
- **Tailwind**: `tailwind.config.js`
- **Vitest**: `vitest.config.ts`
- **Biome**: `biome.json`（自動生成）

## インポート整理

### インポート順序（Biome推奨）
1. **Reactインポート**: `import React from 'react'`
2. **外部ライブラリ**: `import { useChat } from '@ai-sdk/react'`
3. **絶対パスインポート**: `import { ChatMessage } from '@/types/chat'`
4. **相対パスインポート**: `import { ChatInput } from './ChatInput'`
5. **スタイル/アセット**: `import './styles.css'`

### パスエイリアス（tsconfig.json）
```typescript
"paths": {
  "@/*": ["./*"]    // ルートディレクトリへのエイリアス
}
```

**使用例**:
```typescript
import { ChatMessage } from '@/app/types/chat'      // ❌ appディレクトリ含める
import { ChatMessage } from '@/types/chat'          // ✅ 正しい形
import { openrouter } from '@/lib/openrouter'       // ✅ 正しい形
```

## 主要アーキテクチャ原則

### 1. 関心の分離（Separation of Concerns）
- **UI**: プレゼンテーションロジックのみ
- **ビジネスロジック**: カスタムHooks・ユーティリティ関数
- **データアクセス**: API Routes・プロバイダー

### 2. 依存性注入（Dependency Injection）
- Propsによる依存関係の注入
- Context APIの適切な利用（グローバル状態最小化）
- テスタビリティの確保

### 3. 型安全性（Type Safety）
- `any`型使用禁止
- 明示的な型定義（interface/type）
- ジェネリクス活用

### 4. コンポーネント設計
- **単一責任原則**: 1コンポーネント1責務
- **再利用性**: 汎用コンポーネントは`app/components/ui/`
- **Props命名**: 明確で一貫性のある命名

### 5. エラーハンドリング
- **API層**: 構造化エラーレスポンス（ErrorResponse型）
- **UI層**: エラー境界（Error Boundary）
- **ユーザー通知**: 適切なエラーメッセージ表示

## ディレクトリ追加ガイドライン

### 新規機能追加時
1. **仕様書作成**: `.kiro/specs/[feature-name]/`
2. **コンポーネント配置**: `app/components/[feature-name]/`
3. **API作成**: `app/api/[feature-name]/route.ts`
4. **型定義**: `app/types/[feature-name].ts`

### テスト配置
- **ユニット**: コンポーネントと同階層（`Component.test.tsx`）
- **統合**: `app/__tests__/integration/`
- **E2E**: `e2e/` ルート直下

### 静的アセット
- **画像**: `public/images/`
- **フォント**: `public/fonts/`（next/font使用推奨）
- **アイコン**: `public/icons/` または `app/components/icons/`

## 設定ファイル詳細

### TypeScript設定（tsconfig.json）
- **strict mode有効**: すべてのstrictオプション有効
- **target**: ES2017（モダンブラウザ対応）
- **jsx**: preserve（Next.jsが処理）
- **paths**: `@/*`エイリアス設定済み

### Next.js設定（next.config.ts）
- **Turbopack**: 開発・ビルドで有効化
- **TypeScript形式**: `.ts`拡張子使用
- **将来的な設定**: 環境変数、リダイレクト、rewrites

### Biome設定（biome.json）
- **リンター**: 厳格なルール適用
- **フォーマッター**: 一貫したコードスタイル
- **インポートソート**: 自動整列

## バージョン管理

### Git除外対象（.gitignore）
- `node_modules/` - 依存関係
- `.next/` - ビルド出力
- `.env*.local` - 環境変数
- `coverage/` - テストカバレッジ
- `.DS_Store` - macOSシステムファイル

### コミット推奨単位
- 1サブタスク完了時（`.kiro/specs/*/tasks.md`参照）
- 動作確認済みの機能追加
- リファクタリング完了時

## 将来的な拡張

### 追加予定ディレクトリ
- `app/middleware/` - カスタムミドルウェア
- `app/hooks/` - カスタムReact Hooks
- `app/__tests__/` - テストファイル集約
- `docs/` - プロジェクトドキュメント
- `scripts/` - ビルド・デプロイスクリプト

### 検討中の機能
- データベース統合（`app/db/`, `prisma/`）
- 認証システム（`app/auth/`）
- 多言語対応（`app/i18n/`, `locales/`）
