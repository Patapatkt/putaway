"use server";
// 追加入庫(登録済商品)のバックエンド
import { and, eq, lte, sql } from "drizzle-orm";
import { drizzleDb } from "@/lib/db";
import { products } from "@/lib/schema";
import { revalidatePath } from "next/cache";
import { productSchema, restockQuantitySchema, } from "@/app/model/product";

// 入庫対象の商品IDを検証する
const restockProductSchema = productSchema.pick({
    id: true,
})

// 前回の処理結果として保持する型
type ProductState = {
    error: string;
} | null;

// 登録済み商品を入庫する
export async function restockProduct(
    // 引数設定
    previousState: ProductState,
    formData: FormData
): Promise<ProductState> {
    //フォームのproductIdを数値に変換してsafeParse()で検証の成否を返す
    const result = restockProductSchema.safeParse({
        id: Number(formData.get("productId")),
    });

    // 検証に失敗したら、最初のエラーメッセージを返す
    if (!result.success) {
        return {
            error: result.error.issues[0]?.message ??
                "入力内容を確認してください",
        };
    }
    // 検証済み・空白除去済みの値を取り出す
    const { id: productId } = result.data;
    // 入庫数量を数値に変換してZodで検証する
    const quantityValidation = restockQuantitySchema.safeParse(
        Number(formData.get("quantity"))
    );

    if (!quantityValidation.success) {
        return {
            error:
                quantityValidation.error.issues[0]?.message ??
                "入庫数量は整数を正しく入力してください。",
        };
    }

    const quantity = quantityValidation.data;

    // 加算後に上限を超えないよう、現在庫の上限を求める
    const maxCurrentQuantity = Number.MAX_SAFE_INTEGER - quantity;

    // DBに保存されている現在庫へ、入庫数量を加算する
    const quantityResult = await drizzleDb
        .update(products)
        .set({
            quantity: sql`${products.quantity} + ${quantity}`,
        })
        .where(
            and(
                eq(products.id, productId),
                lte(products.quantity, maxCurrentQuantity),
            )
        )
        .returning({
            id: products.id,
        });

    // 対象商品がない場合、または上限を超える場合
    if (quantityResult.length === 0) {
        return {
            error: "対象の商品が存在しないか、在庫数量の上限を超えています。商品を再確認してください。",
        };
    }

    // 入庫画面のキャッシュを無効にする
    revalidatePath("/stock/new");
    // エラー情報なしを返す
    return null
}