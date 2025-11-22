# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## プロジェクト概要

Chrome DevTools MCP は、MCP (Model-Context-Protocol) サーバーとして動作し、AI コーディングアシスタントが Chrome DevTools の機能にアクセスできるようにするプロジェクトです。Puppeteer を使用してブラウザを制御し、Chrome DevTools Frontend のコードを活用してパフォーマンス分析を提供します。

## 開発環境

- Node.js: v22 (.nvmrc で指定)
- TypeScript: strict mode で記述
- エディタ設定: POSIX 準拠で改行文字必須

## コマンド

### ビルド
```bash
npm run build        # TypeScript をコンパイルし、post-build スクリプトを実行
npm run bundle       # clean、build の後に rollup でバンドル
npm run clean        # build ディレクトリを削除
```

### 型チェック
```bash
npm run typecheck    # tsc --noEmit で型チェックのみ実行
```

### フォーマット・Lint
```bash
npm run format       # ESLint と Prettier で自動修正
npm run check-format # フォーマットチェックのみ（CI 用）
```

### テスト
```bash
npm test                    # 全テスト実行
npm run test:only           # test.only でマークされたテストのみ実行
npm run test:only:no-build  # ビルドせずに test.only 実行
npm run test:update-snapshots  # スナップショットを更新
```

テストは Node.js の組み込みテストランナーを使用しています。

### ドキュメント生成
```bash
npm run docs  # ツールリファレンスドキュメントを生成し、フォーマット
```

ツールの追加や変更時は必ず実行すること。

### デバッグ実行
```bash
npm start              # ビルド後に MCP サーバーを起動
npm run start-debug    # DEBUG=mcp:* で詳細ログ付き起動
```

### MCP Inspector でのテスト
```bash
npx @modelcontextprotocol/inspector node build/src/index.js
```

ログファイルへの出力:
```bash
npx @modelcontextprotocol/inspector node build/src/index.js --log-file=/path/to/log.txt
```

## アーキテクチャ

### エントリーポイント
- [src/index.ts](src/index.ts): パッケージのバージョン情報のみをエクスポート
- [src/main.ts](src/main.ts): MCP サーバーの本体、ツール登録とリクエストハンドラ
- [src/cli.ts](src/cli.ts): コマンドライン引数のパース

### コアコンポーネント
- [src/McpContext.ts](src/McpContext.ts): 各 MCP リクエストのコンテキスト管理（ページ、タイムアウト、設定など）
- [src/browser.ts](src/browser.ts): Puppeteer を使った Chrome の起動と接続管理
- [src/PageCollector.ts](src/PageCollector.ts): ブラウザ内の全ページを追跡
- [src/DevToolsConnectionAdapter.ts](src/DevToolsConnectionAdapter.ts): Chrome DevTools Frontend との接続アダプター

### ツール実装
[src/tools/](src/tools/) 配下にカテゴリごとに分類:
- [input.ts](src/tools/input.ts): クリック、フォーム入力、ドラッグなど
- [pages.ts](src/tools/pages.ts): ページナビゲーション、新規作成、選択など
- [snapshot.ts](src/tools/snapshot.ts): アクセシビリティツリーベースのテキストスナップショット
- [screenshot.ts](src/tools/screenshot.ts): スクリーンショット取得
- [performance.ts](src/tools/performance.ts): パフォーマンストレースの記録と分析
- [network.ts](src/tools/network.ts): ネットワークリクエストの取得
- [console.ts](src/tools/console.ts): コンソールメッセージの取得
- [script.ts](src/tools/script.ts): JavaScript の評価
- [emulation.ts](src/tools/emulation.ts): ネットワークや CPU のエミュレーション
- [ToolDefinition.ts](src/tools/ToolDefinition.ts): ツール定義の共通型と `defineTool` ヘルパー

### フォーマッター
[src/formatters/](src/formatters/) 配下に MCP クライアント向けのデータ整形ロジック:
- [snapshotFormatter.ts](src/formatters/snapshotFormatter.ts): アクセシビリティツリーのフォーマット
- [networkFormatter.ts](src/formatters/networkFormatter.ts): ネットワークリクエストのフォーマット
- [consoleFormatter.ts](src/formatters/consoleFormatter.ts): コンソールメッセージのフォーマット

### Chrome DevTools Frontend 統合
- [src/trace-processing/parse.ts](src/trace-processing/parse.ts): Chrome DevTools の Trace モジュールを使用してパフォーマンストレースを解析
- Chrome DevTools Frontend のコードは `node_modules/chrome-devtools-frontend/mcp/mcp.js` 経由でのみインポート可能（他のパスからのインポートは ESLint で禁止）

## TypeScript 設定

- target: ES2023
- module: ESNext (moduleResolution: bundler)
- strict モードで全ての厳密チェックを有効化
- 型定義は interface を優先（`@typescript-eslint/consistent-type-definitions`）
- type-only import/export を強制（`@typescript-eslint/consistent-type-imports/exports`）

## コーディング規約

### TypeScript
- 未使用変数は `_` プレフィックスで無視可能
- `any` 型は rest 引数でのみ許可
- 配列型は `array-simple` スタイル
- floating promises は禁止（テストファイルを除く）
- 型定義は基本的に interface を使用

### Import
- 常に node: プロトコルを使用（`import/enforce-node-protocol-usage`）
- import は自動的にアルファベット順でソート、カテゴリ間に空行を入れる
- 循環依存は禁止
- Chrome DevTools Frontend のコードは `node_modules/chrome-devtools-frontend/mcp/mcp.js` からのみインポート

### フォーマット
- シングルクォート使用
- セミコロン必須
- トレイリングカンマあり
- arrow function は引数が 1 つの場合は括弧なし
- ブラケットスペースなし: `{foo}` not `{ foo }`
- 改行コードは LF

### ライセンスヘッダー
全ての TypeScript/JavaScript ファイルには Apache 2.0 ライセンスヘッダーが必要:
```typescript
/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
```

カスタム ESLint ルール `@local/check-license` でチェックされています。

## テスト

- テストは Node.js 組み込みテストランナーを使用
- テストファイルは `tests/` ディレクトリに配置し、`*.test.ts` パターン
- スナップショット機能も利用可能
- テストでは `describe` と `it` の promise を await する必要なし

## ツールの追加方法

1. [src/tools/](src/tools/) 配下の適切なカテゴリファイルに `defineTool` を使用してツールを定義
2. [src/main.ts](src/main.ts) で `registerTool` を呼び出してツールを登録
3. `npm run docs` でドキュメントを自動生成
4. [tests/tools/](tests/tools/) にテストを追加

## コミット規約

- Conventional Commits に従う
- Google CLA への署名が必要

## VS Code SSH 使用時の注意

MCP Inspector はポート 6274 と 6277 を使用します。VS Code は 6274 のみ自動検出するため、6277 は手動でポートフォワード設定が必要です。
