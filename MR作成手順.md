###MR(マージリクエスト)作成手順

##ターミナルで下記を実行しブランチを作成
#git switch main
#git pull --ff-only origin main
#git switch -c feat/restock-validation

##編集後、メモのビルド・差分確認・add・commitを行い、作業ブランチをGitLabへ送ります。
#git push -u gitlab feat/restock-validation

##GitLabでMRを作成し、次を指定します。
#項目	指定
#取り込み元（Source）	feat/restock-validation
#取り込み先（Target）	main


##レビューと必要なチェックを終えてマージしたら、手元を更新します。
#git switch main
#git pull --ff-only gitlab main
#git push origin main
#git status