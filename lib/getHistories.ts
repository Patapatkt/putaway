import "server-only";

import { desc } from "drizzle-orm";
import { drizzleDb } from "@/lib/db";
import { history } from "@/lib/schema";
import { historySchema } from "@/app/model/product";

// 入出庫履歴を新しい順に取得し、検証して返す
export async function getHistories() {
    const result =await drizzleDb
        .select()
        .from(history)//historyテーブルより
        .orderBy(
            desc(history.createdAt),//historyテーブルの入庫日時の降順
            desc(history.id)//入庫日が同じならhistoryテーブルのidの降順
        );
        //検証ルールを通過した配列を返す//parseは1件でも検証に失敗するとエラーになる   
        return historySchema.array().parse(result);
}