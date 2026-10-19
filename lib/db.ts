// DBへの接続設定
import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
//他のファイルからアクセスできるDBへ接続するためのクライアントを作る
export const db =createClient({
    url:"file:practice.db",//練習用のurlを指定
});
// 同じ接続をDrizzleから使えるようにする
export const drizzleDb = drizzle(db);