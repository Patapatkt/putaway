# GitHubへ変更を送る手順

プロジェクトのフォルダで、次の順番に実行します。

## 1. ビルドを確認する

型やビルドのエラーがないか確認します。
画面の表示や操作は、ブラウザでも別途確認します。

```powershell
npm run build
```

## 2. 変更したファイルを確認する

```powershell
git status
```

## 3. 変更内容（差分）を確認する

```powershell
git diff
```

新しく作った未追跡ファイルは、このコマンドには内容が表示されません。
エディターで中身を確認します。

## 4. 今回記録する変更を選ぶ

ファイルを指定して追加する例：

```powershell
git add app/page.tsx app/globals.css
```

現在のフォルダ以下の変更をすべて追加する場合：

```powershell
git add .
```

`git add .`は、新規作成・変更・削除をまとめて対象にします。
不要なファイルや秘密情報が含まれていないか確認します。

## 5. 記録する内容を最終確認する

```powershell
git diff --cached --stat
git diff --cached
```

## 6. ローカルGitへ記録する

`-m`の後に、変更内容が分かるメッセージを書きます。

```powershell
git commit -m "feat: ZodとTanStack Tableで在庫一覧を整備"
```

## 7. GitHubへ送る

```powershell
git push
```

初めて送るブランチで送信先が未設定の場合は、次を使います。
`ブランチ名`は実際の名前に置き換えます。

```powershell
git push -u origin ブランチ名
```

## 8. 完了を確認する

```powershell
git status
```

次の表示を確認します。

- `Your branch is up to date with 'origin/…'`
- `nothing to commit, working tree clean`

最後にGitHubでも、コミットと変更内容が反映されているか確認します。