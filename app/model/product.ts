//型定義のバックエンド
import { z } from "zod";
// 商品データの検証ルール
// zodでエラー節を定義する
export const productSchema = z.object({
    id:z.number().int().positive(),//商品を識別するid
    productName:z.string(),//商品名
    quantity:z.number().int().min(1),//数量(現在庫)
    shelf:z.string(),//棚番
    inquiry:z.string(),//仕様
    memo:z.string(),//メモ
})
// 検証ルールからProduct型を作る
export type Product = z.infer<typeof productSchema>;

// 新規登録時の入庫数量の検証ルール
export const createQuantitySchema =z.object({
    quantity:z.number()
    .int("入庫数量は整数で入力してください")
    .min(1,"入庫数量は1以上で入力してください")
    .max(
            Number.MAX_SAFE_INTEGER,
            "入庫数量が大きすぎます"
        ),
})
// 検証ルールからProduct型を作る
export type CreateQantity =z.infer<typeof createQuantitySchema>