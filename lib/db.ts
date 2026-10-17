// dbへの接続設定
import { createClient } from "@libsql/client";
//他のファイルからアクセスできるDBへ接続するためのクライアントを作る
export const db =createClient({
    url:"file:practice.db",//練習用のurlを指定
})