"use server";

import { db } from "@/lib/db";
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
    // 同じ棚番・商品名・仕様がなければ、新しい商品を登録する
    const result = await db.execute({
        sql: `
         -- productsテーブルの指定した5列へ新しい行を追加する
        INSERT INTO products (
                productName,
                quantity,
                shelf,
                inquiry,
                memo
            )
            -- args(引数)の先頭5つの値を、追加用の1行として用意する
            SELECT ?, ?, ?, ?, ?
            -- 内側の検索に一致する行が存在しない場合だけ追加する
            WHERE NOT EXISTS (
            -- 商品の詳細ではなく、存在するかを確認する
                SELECT 1
                FROM products
                WHERE shelf = ?
                  AND productName = ?
                  AND inquiry = ?
    )
        `,
        args: [
            productName,//SELECTの引数
            quantity,//SELECTの引数
            shelf,//SELECTの引数
            inquiry,//SELECTの引数
            memo,//SELECTの引数
            shelf,//WHERE NOT EXISTSの引数
            productName,//WHERE NOT EXISTSの引数
            inquiry//WHERE NOT EXISTSの引数
        ],
    });
    //商品確認後に同じ商品が登録された場合など
    if (result.rowsAffected === 0) {
        return {
            error: "同じ商品が登録済みです。商品を再確認して追加入庫してください。",
        };
    }
    // 入庫画面のキャッシュを無効にする
    revalidatePath("/stock/new");

    // エラー情報なしを返す
    return null;
}