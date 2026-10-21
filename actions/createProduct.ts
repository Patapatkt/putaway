"use server";

import { and, eq, sql } from "drizzle-orm";
import { drizzleDb } from "@/lib/db";
import { products } from "@/lib/schema";
import { revalidatePath } from "next/cache";
import { productSchema, createQuantitySchema } from "@/app/model/product";

// 商品確認に必要な3項目の検証ルールを取り出す
const createProductSchema = productSchema.pick({
    shelf: true,
    productName: true,
    inquiry: true,
}).extend({
    // メモは未送信なら空文字にし、前後の空白を除去する
    memo: productSchema.shape.memo.trim().default(""),
});

// 前回の処理結果として保持する型
type ProductState = {
    error: string;
} | null;
// 登録する商品が未登録の場合新たにデータを作成する
export async function createProduct(
    // 引数設定
    previousState: ProductState,
    formData: FormData
): Promise<ProductState> {
    //safeParse()で検証の成否を返す
    const result = createProductSchema.safeParse({
        shelf: formData.get("shelf"),
        productName: formData.get("productName"),
        inquiry: formData.get("inquiry"),
        memo: formData.get("memo") ?? undefined,
    });

    if (!result.success) {
        return {
            error: result.error.issues[0]?.message ??
                "棚番・商品名・仕様を正しく入力してください。",
        };
    }

    //検証済み・空白除去済みの値を取り出す
    const {
        shelf: trimmedShelf,
        productName: trimmedProductName,
        inquiry: trimmedInquiry,
        memo: trimmedMemo,
    } = result.data;
    // 新規登録時の入庫数量を確認する
    const rawQuantity = formData.get("quantity");

    if (
        typeof rawQuantity !== "string" ||
        rawQuantity.trim() === ""
    ) {
        return {
            error: "入庫数量は整数を正しく入力してください。",
        };
    }

    const resultQuantity = createQuantitySchema.safeParse({
        quantity: Number(rawQuantity),
    });

    if (!resultQuantity.success) {
        return {
            error: resultQuantity.error.issues[0]?.message ??
                "入庫数量は1以上の安全な整数で入力してください。",
        };
    }

    // 検証済みの数量を取り出す
    const quantity = resultQuantity.data.quantity;

    // 同じ棚番・商品名・仕様の商品を探すための検索
    const existingProductQuery = drizzleDb
        .select({ id: products.id })
        .from(products)
        .where(
            and(
                eq(products.shelf, trimmedShelf),
                eq(products.productName, trimmedProductName),
                eq(products.inquiry, trimmedInquiry),
            )
        );

    // 同じ商品が存在しない場合だけ登録する
    const unmatchedProducts = await drizzleDb
        .insert(products)
        .select(
            sql`
                SELECT
                    NULL,
                    ${trimmedProductName},
                    ${quantity},
                    ${trimmedShelf},
                    ${trimmedInquiry},
                    ${trimmedMemo}
                WHERE NOT EXISTS ${existingProductQuery}
            `
        )
        .returning({
            id: products.id,
        })
    //商品確認後に同じ商品が登録された場合など
    if (unmatchedProducts.length === 0) {
        return {
            error: "同じ商品が登録済みです。商品を再確認して追加入庫してください。",
        };
    }
    // 入庫画面のキャッシュを無効にする
    revalidatePath("/stock/new");

    // エラー情報なしを返す
    return null;
}