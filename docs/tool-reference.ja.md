<!-- 自動生成されたファイル - 編集しないでください。更新する場合は 'npm run docs' を実行してください -->

# Chrome DevTools MCP ツールリファレンス

- **[入力の自動化](#入力の自動化)** (8 ツール)
  - [`click`](#click)
  - [`drag`](#drag)
  - [`fill`](#fill)
  - [`fill_form`](#fill_form)
  - [`handle_dialog`](#handle_dialog)
  - [`hover`](#hover)
  - [`press_key`](#press_key)
  - [`upload_file`](#upload_file)
- **[ナビゲーションの自動化](#ナビゲーションの自動化)** (6 ツール)
  - [`close_page`](#close_page)
  - [`list_pages`](#list_pages)
  - [`navigate_page`](#navigate_page)
  - [`new_page`](#new_page)
  - [`select_page`](#select_page)
  - [`wait_for`](#wait_for)
- **[エミュレーション](#エミュレーション)** (2 ツール)
  - [`emulate`](#emulate)
  - [`resize_page`](#resize_page)
- **[パフォーマンス](#パフォーマンス)** (3 ツール)
  - [`performance_analyze_insight`](#performance_analyze_insight)
  - [`performance_start_trace`](#performance_start_trace)
  - [`performance_stop_trace`](#performance_stop_trace)
- **[ネットワーク](#ネットワーク)** (2 ツール)
  - [`get_network_request`](#get_network_request)
  - [`list_network_requests`](#list_network_requests)
- **[デバッグ](#デバッグ)** (5 ツール)
  - [`evaluate_script`](#evaluate_script)
  - [`get_console_message`](#get_console_message)
  - [`list_console_messages`](#list_console_messages)
  - [`take_screenshot`](#take_screenshot)
  - [`take_snapshot`](#take_snapshot)

## 入力の自動化

### `click`

**説明:** 指定された要素をクリックします

**パラメータ:**

- **dblClick** (boolean) _(オプション)_: ダブルクリックの場合は true に設定します。デフォルトは false です。
- **uid** (string) **(必須)**: ページコンテンツスナップショットから取得した、ページ上の要素の uid

---

### `drag`

**説明:** ある要素を別の要素の上にドラッグします

**パラメータ:**

- **from_uid** (string) **(必須)**: ドラッグする要素の uid
- **to_uid** (string) **(必須)**: ドロップ先の要素の uid

---

### `fill`

**説明:** input、textarea にテキストを入力するか、&lt;select&gt; 要素からオプションを選択します。

**パラメータ:**

- **uid** (string) **(必須)**: ページコンテンツスナップショットから取得した、ページ上の要素の uid
- **value** (string) **(必須)**: 入力する値

---

### `fill_form`

**説明:** 複数のフォーム要素を一度に入力します

**パラメータ:**

- **elements** (array) **(必須)**: スナップショットから取得した、入力する要素の配列

---

### `handle_dialog`

**説明:** ブラウザダイアログが開かれた場合、このコマンドを使用して処理します

**パラメータ:**

- **action** (enum: "accept", "dismiss") **(必須)**: ダイアログを閉じるか受け入れるか
- **promptText** (string) _(オプション)_: ダイアログに入力するプロンプトテキスト (オプション)

---

### `hover`

**説明:** 指定された要素の上にホバーします

**パラメータ:**

- **uid** (string) **(必須)**: ページコンテンツスナップショットから取得した、ページ上の要素の uid

---

### `press_key`

**説明:** キーまたはキーの組み合わせを押します。[`fill`](#fill)() などの他の入力方法が使用できない場合に使用します (例: キーボードショートカット、ナビゲーションキー、または特殊なキーの組み合わせ)。

**パラメータ:**

- **key** (string) **(必須)**: キーまたは組み合わせ (例: "Enter", "Control+A", "Control++", "Control+Shift+R")。修飾キー: Control, Shift, Alt, Meta

---

### `upload_file`

**説明:** 指定された要素を通じてファイルをアップロードします。

**パラメータ:**

- **filePath** (string) **(必須)**: アップロードするファイルのローカルパス
- **uid** (string) **(必須)**: ページコンテンツスナップショットから取得した、ファイル入力要素またはファイル選択を開く要素の uid

---

## ナビゲーションの自動化

### `close_page`

**説明:** インデックスでページを閉じます。最後に開いているページは閉じることができません。

**パラメータ:**

- **pageIdx** (number) **(必須)**: 閉じるページのインデックス。[`list_pages`](#list_pages) を呼び出してページを一覧表示します。

---

### `list_pages`

**説明:** ブラウザで開いているページのリストを取得します。

**パラメータ:** なし

---

### `navigate_page`

**説明:** 現在選択されているページを URL に移動します。

**パラメータ:**

- **ignoreCache** (boolean) _(オプション)_: リロード時にキャッシュを無視するかどうか
- **timeout** (integer) _(オプション)_: 最大待機時間 (ミリ秒)。0 に設定すると、デフォルトのタイムアウトが使用されます。
- **type** (enum: "url", "back", "forward", "reload") _(オプション)_: URL でページを移動、履歴の戻る・進む、またはリロード
- **url** (string) _(オプション)_: ターゲット URL (type=url の場合のみ)

---

### `new_page`

**説明:** 新しいページを作成します

**パラメータ:**

- **timeout** (integer) _(オプション)_: 最大待機時間 (ミリ秒)。0 に設定すると、デフォルトのタイムアウトが使用されます。
- **url** (string) **(必須)**: 新しいページで読み込む URL

---

### `select_page`

**説明:** 今後のツール呼び出しのコンテキストとしてページを選択します。

**パラメータ:**

- **pageIdx** (number) **(必須)**: 選択するページのインデックス。[`list_pages`](#list_pages) を呼び出してページを一覧表示します。

---

### `wait_for`

**説明:** 指定されたテキストが選択されたページに表示されるのを待ちます。

**パラメータ:**

- **text** (string) **(必須)**: ページに表示されるテキスト
- **timeout** (integer) _(オプション)_: 最大待機時間 (ミリ秒)。0 に設定すると、デフォルトのタイムアウトが使用されます。

---

## エミュレーション

### `emulate`

**説明:** 選択されたページでさまざまな機能をエミュレートします。

**パラメータ:**

- **cpuThrottlingRate** (number) _(オプション)_: CPU スローダウン係数を表します。スロットリングを無効にするには、レートを 1 に設定します。省略すると、スロットリングは変更されません。
- **networkConditions** (enum: "No emulation", "Offline", "Slow 3G", "Fast 3G", "Slow 4G", "Fast 4G") _(オプション)_: ネットワークのスロットリング。無効にするには "No emulation" に設定します。省略すると、条件は変更されません。

---

### `resize_page`

**説明:** 選択されたページのウィンドウをリサイズして、ページが指定された寸法になるようにします

**パラメータ:**

- **height** (number) **(必須)**: ページの高さ
- **width** (number) **(必須)**: ページの幅

---

## パフォーマンス

### `performance_analyze_insight`

**説明:** トレース記録の結果で強調表示されたインサイトセットの特定のパフォーマンスインサイトに関する詳細情報を提供します。

**パラメータ:**

- **insightName** (string) **(必須)**: 詳細情報を取得したいインサイトの名前。例: "DocumentLatency" または "LCPBreakdown"
- **insightSetId** (string) **(必須)**: 特定のインサイトセットの ID。"利用可能なインサイトセット" リストに記載されている ID のみを使用してください。

---

### `performance_start_trace`

**説明:** 選択されたページでパフォーマンストレースの記録を開始します。これは、パフォーマンスの問題を探し、ページのパフォーマンスを改善するためのインサイトを得るために使用できます。また、ページの Core Web Vital (CWV) スコアも報告します。

**パラメータ:**

- **autoStop** (boolean) **(必須)**: トレース記録を自動的に停止するかどうかを決定します
- **reload** (boolean) **(必須)**: トレースが開始されたら、ページを自動的にリロードするかどうかを決定します

---

### `performance_stop_trace`

**説明:** 選択されたページでアクティブなパフォーマンストレース記録を停止します。

**パラメータ:** なし

---

## ネットワーク

### `get_network_request`

**説明:** オプションの reqid でネットワークリクエストを取得します。省略すると、DevTools ネットワークパネルで現在選択されているリクエストを返します。

**パラメータ:**

- **reqid** (number) _(オプション)_: ネットワークリクエストの reqid。省略すると、DevTools ネットワークパネルで現在選択されているリクエストを返します。

---

### `list_network_requests`

**説明:** 最後のナビゲーション以降、現在選択されているページのすべてのリクエストをリストします。

**パラメータ:**

- **includePreservedRequests** (boolean) _(オプション)_: 過去 3 回のナビゲーションで保存されたリクエストを返す場合は true に設定します
- **pageIdx** (integer) _(オプション)_: 返すページ番号 (0 ベース)。省略すると、最初のページを返します。
- **pageSize** (integer) _(オプション)_: 返すリクエストの最大数。省略すると、すべてのリクエストを返します。
- **resourceTypes** (array) _(オプション)_: 指定されたリソースタイプのリクエストのみを返すようにフィルタリングします。省略または空の場合、すべてのリクエストを返します。

---

## デバッグ

### `evaluate_script`

**説明:** 現在選択されているページ内で JavaScript 関数を評価します。レスポンスは JSON として返されるため、返される値は JSON シリアライズ可能である必要があります。

**パラメータ:**

- **args** (array) _(オプション)_: 関数に渡す引数のオプションリスト
- **function** (string) **(必須)**: 現在選択されているページでツールによって実行される JavaScript 関数宣言。
  引数なしの例: `() => {
  return document.title
}` または `async () => {
  return await fetch("example.com")
}`
  引数ありの例: `(el) => {
  return el.innerText;
}`

---

### `get_console_message`

**説明:** ID でコンソールメッセージを取得します。[`list_console_messages`](#list_console_messages) を呼び出すことですべてのメッセージを取得できます。

**パラメータ:**

- **msgid** (number) **(必須)**: リストされたコンソールメッセージから取得した、ページ上のコンソールメッセージの msgid

---

### `list_console_messages`

**説明:** 最後のナビゲーション以降、現在選択されているページのすべてのコンソールメッセージをリストします。

**パラメータ:**

- **includePreservedMessages** (boolean) _(オプション)_: 過去 3 回のナビゲーションで保存されたメッセージを返す場合は true に設定します
- **pageIdx** (integer) _(オプション)_: 返すページ番号 (0 ベース)。省略すると、最初のページを返します。
- **pageSize** (integer) _(オプション)_: 返すメッセージの最大数。省略すると、すべてのリクエストを返します。
- **types** (array) _(オプション)_: 指定されたリソースタイプのメッセージのみを返すようにフィルタリングします。省略または空の場合、すべてのメッセージを返します。

---

### `take_screenshot`

**説明:** ページまたは要素のスクリーンショットを撮影します。

**パラメータ:**

- **filePath** (string) _(オプション)_: レスポンスに添付する代わりに、スクリーンショットを保存する絶対パスまたは現在の作業ディレクトリからの相対パス
- **format** (enum: "png", "jpeg", "webp") _(オプション)_: スクリーンショットを保存する形式のタイプ。デフォルトは "png" です
- **fullPage** (boolean) _(オプション)_: true に設定すると、現在表示されているビューポートの代わりにページ全体のスクリーンショットを撮影します。uid とは互換性がありません。
- **quality** (number) _(オプション)_: JPEG および WebP 形式の圧縮品質 (0-100)。値が高いほど品質が良くなりますが、ファイルサイズが大きくなります。PNG 形式では無視されます。
- **uid** (string) _(オプション)_: ページコンテンツスナップショットから取得した、ページ上の要素の uid。省略すると、ページのスクリーンショットを撮影します。

---

### `take_snapshot`

**説明:** a11y ツリーに基づいて、現在選択されているページのテキストスナップショットを撮影します。スナップショットには、一意の識別子 (uid) とともにページ要素がリストされます。常に最新のスナップショットを使用してください。スクリーンショットよりもスナップショットの撮影を優先してください。スナップショットには、DevTools 要素パネルで選択された要素 (ある場合) が示されます。

**パラメータ:**

- **filePath** (string) _(オプション)_: レスポンスに添付する代わりに、スナップショットを保存する絶対パスまたは現在の作業ディレクトリからの相対パス
- **verbose** (boolean) _(オプション)_: 完全な a11y ツリーで利用可能なすべての情報を含めるかどうか。デフォルトは false です。

---
