"use server";

import { and, eq,sql } from "drizzle-orm";
import { drizzleDb } from "@/lib/db";
import { products } from "@/lib/schema";
import { revalidatePath } from "next/cache";
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
    // フォームから文字列を取得する
    const rawShelf = formData.get("shelf");//棚番を取得
    const rawProductName = formData.get("productName");//商品名取得
    const rawInquiry = formData.get("inquiry");//仕様取得
    const rawMemo = formData.get("memo");//メモ取得
    const rawQuantity = formData.get("quantity");//数量取得
    // 必須項目が文字列で取得されているか確認する(棚番・商品名・仕様)
    if (
        typeof rawShelf !== "string" ||
        typeof rawProductName !== "string" ||
        typeof rawInquiry !== "string"
    ) {
        return {
            error: "棚番・商品名・仕様を正しく入力してください。",
        };
    }
    // メモは省略可能だが、送られてきた場合は文字列か確認する
    if (rawMemo !== null && typeof rawMemo !== "string") {
        return {
            error: "メモを正しく入力してください。",
        };
    }
    // 前後の空白を取り除く
    const shelf = rawShelf.trim();
    const productName = rawProductName.trim();
    const inquiry = rawInquiry.trim();
    const memo = rawMemo === null ? "" : rawMemo.trim();
    // 空白だけの入力も含め、必須項目を確認する
    if (!shelf || !productName || !inquiry) {
        return {
            error: "棚番・商品名・仕様を入力してください。"
        };
    }
    // 新規登録時の入庫数量を確認する
    if (
        typeof rawQuantity !== "string" ||
        rawQuantity.trim() ===""
    ) {
        return {
            error: "入庫数量は整数を正しく入力してください"
        };
    }

    const quantity = Number(rawQuantity);

    if (!Number.isSafeInteger(quantity) || quantity <= 0) {
        return {
            error: "入庫数量は1以上の安全な整数で入力してください。"
        };
    }
    // 同じ棚番・商品名・仕様の商品を探すための検索
    const existingProductQuery = drizzleDb
        .select({ id: products.id })
        .from(products)
        .where(
            and(
                eq(products.shelf, shelf),
                eq(products.productName, productName),
                eq(products.inquiry, inquiry),
            )
        );

    // 同じ商品が存在しない場合だけ登録する
    const result = await drizzleDb
        .insert(products)
        .select(
            sql`
                SELECT
                    NULL,
                    ${productName},
                    ${quantity},
                    ${shelf},
                    ${inquiry},
                    ${memo}
                WHERE NOT EXISTS ${existingProductQuery}
            `
        )
        .returning({
            id: products.id,
        })
    //商品確認後に同じ商品が登録された場合など
    if (result.length === 0) {
        return {
            error: "同じ商品が登録済みです。商品を再確認して追加入庫してください。",
        };
    }
    // 入庫画面のキャッシュを無効にする
    revalidatePath("/stock/new");

    // エラー情報なしを返す
    return null;
}