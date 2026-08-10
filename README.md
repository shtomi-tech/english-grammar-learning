# 英文法ミニレッスン

文法カテゴリを選び、「概論 → 各論 → 練習問題」の順に学ぶ静的アプリです。現在は仮定法と分詞を収録しています。

## 起動

`index.html`を直接開くか、アプリ管理ポータルから開きます。

公開版: https://shtomi-tech.github.io/english-grammar-learning/

## 確認

```powershell
node --check app.js
node content.js --check
```

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
