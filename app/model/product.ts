//型定義のバックエンド
import {z} from "zod";
// 商品データの検証ルール
// zodでエラー節を定義する
export const productSchema = z.object({
    id:z.number().int().positive(),//商品を識別するid
    productName:z.string(),//商品名
    quantity:z.number().int().min(1),//数量(現在庫)
    shelf:z.string().max(6).min(6),//棚番
    inquiry:z.string(),//仕様
    memo:z.string(),//メモ
})
// 検証ルールからProduct型を作る
export type Product = z.infer<typeof productSchema>;