# 英文法ミニレッスン

文法カテゴリを選び、「概論 → 各論 → 練習問題」の順に学ぶ静的アプリです。現在は仮定法と分詞を収録しています。姉妹アプリ（`kobun-vocab-learning`）と同じ画面構成・配色・操作感で作られています。詳細は [DESIGN.md](DESIGN.md) を参照してください。

## 画面構成

- ホーム（アプリ見出し・文法カテゴリ選択・今回の学習カード・4指標・今日の復習・単元一覧）とセッション（各論・練習問題・修了テスト・今日の復習）の1カラム2面構成です。
- カテゴリ切替はホームの`<select>`からのみ行えます。セッション中に他カテゴリへ切り替えるには、まずホームへ戻ってください。
- 単元一覧の各行から、各論・練習問題（続きから）・修了テストへ直接移動できます。

### キーボード操作

- 4択の問題は`1`〜`4`キーで選択できます（未回答時のみ）。
- 回答後は`Enter`キーで「次の問題」「結果を見る」を実行できます。
- IME変換中・修飾キー（Ctrl/Alt/Meta/Shift）併用時・フォーム要素にフォーカスがある間は発火しません。

### レスポンシブ

- 内容レールは`min(920px, 100% - 32px)`。320px以上で横スクロールは発生しません。
- 640px以下では4指標が2列、間隔復習の内訳が3列×2段になります。
- デスクトップ（641px以上）では回答後の「次へ」操作を画面下部に固定表示します。640px以下では解説の直下にインライン表示します。
- 画面高760px以下でセッション中は、共通ヘッダーを隠して学習画面の可視領域を確保します。

## 起動

`index.html`を直接開くか、アプリ管理ポータルから開きます。

公開版: https://shtomi-tech.github.io/english-grammar-learning/

## 確認

```powershell
npm ci
npx playwright install chromium
npm test
```

構文・教材チェックだけを実行する場合は、`npm run check:syntax` と `npm run check:content` を使います。

進捗と回答はブラウザのLocalStorageへ保存します。

## 生徒別進捗（クラウド同期）

生徒別URLの `?s=<id>&t=<token>` でアクセスすると、共通Supabaseスキーマの `app_students` / `app_progress` に `app=english-grammar-learning` として進捗を同期します。共有URLが無い匿名利用では、従来どおりLocalStorageだけで動作します（無回帰）。

生徒の登録とURL発行はアプリ管理ポータルの生徒共有パネルから行います。

公開版（GitHub Pages）は `.github/workflows/pages.yml` でビルドし、リポジトリシークレット（`SUPABASE_URL` / `SUPABASE_ANON_KEY` / `APP_BASE_URL`）から `config.json` を生成します。ローカルで共有URLの動作を試すときは、`config.example.json` を `config.json` にコピーして値を埋めてください（`config.json` はコミットしません）。

```powershell
copy config.example.json config.json
py -3 -m http.server 5912
```

`vendor/harness/cloud.js` は他プロジェクトと共有する生成物です。直接編集しません。
