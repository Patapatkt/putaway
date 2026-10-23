//型定義のバックエンド
import { z } from "zod";
// 商品データの検証ルール
// zodでエラー節を定義する
export const productSchema = z.object({
    id: z.number().int().min(1),//商品を識別するid
    productName: z//商品名の入力ルールは文字列・前後の空白を取り除く・1文字以上
        .string({ error: "商品名を入力してください" })//商品名
        .trim()
        .min(1, "商品名を入力してください"),
    quantity: z.number().int().min(1),//数量(現在庫)
    //棚番の入力ルールは文字列・前後の空白を取り除く・6文字以上の英数字
    shelf: z
        .string()
        .trim()
        .regex(
            /^[A-Za-z0-9]{6}$/,
            "棚番は6文字の半角英数字で入力してください"
        ),
    //仕様の入力ルールは文字列・前後の空白を取り除く・1文字以上
    inquiry: z 
        .string()
        .trim()
        .min(1, "商品仕様を入力してください"),
    memo: z.string(),//メモ
})
// 検証ルールからProduct型を作る
export type Product = z.infer<typeof productSchema>;

export const checkProductSchema = productSchema.pick({
    shelf: true,
    productName: true,
    inquiry: true,
});

// 新規登録時の入庫数量の検証ルール
export const createQuantitySchema = z.object({
    quantity: z.number()
        .int("入庫数量は整数で入力してください")
        .min(1, "入庫数量は1以上で入力してください")
        .max(
            Number.MAX_SAFE_INTEGER,
            "入庫数量が大きすぎます"
        ),
})
// 検証ルールからProduct型を作る
export type CreateQuantity = z.infer<typeof createQuantitySchema>

// 新規登録時の入庫数量の検証ルール
export const restockQuantitySchema =
    productSchema.shape.quantity.max(
        Number.MAX_SAFE_INTEGER,
        "入庫数量が大きすぎます"
    )
// 検証ルールからProduct型を作る
export type RestockQuantity = z.infer<typeof restockQuantitySchema>