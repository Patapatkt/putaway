"use server";
// 追加入庫(登録済商品)のバックエンド
import { db } from "@/lib/db";  
import { revalidatePath } from "next/cache";

type ProductState = {
    error: string;
} | null;

// 登録済み商品を入庫する
export async function restockProduct(
    previousState: ProductState,
    formData: FormData
): Promise<ProductState> {

    const productId = Number(formData.get("productId"));
    const quantity = Number(formData.get("quantity"));

    // 商品IDのガード節
    if (!Number.isInteger(productId) || productId <= 0) {
        return {
            error: "商品情報が正しくありません。商品を再確認してください。",
        };
    }

    // 入庫数量のガード節
    if (!Number.isSafeInteger(quantity) || quantity <= 0) {
        return {
            error: "入庫数量は1以上の安全な整数で入力してください。",
        };
    }

    // 加算前の現在庫に許容できる上限を求める
    const maxCurrentQuantity =
        Number.MAX_SAFE_INTEGER - quantity;

    // DBに保存されている現在庫へ、入庫数量を加算する
    const result = await db.execute({
        sql: `
            UPDATE products
            SET quantity = quantity + ?
            WHERE id = ?
              AND quantity <= ?
        `,
        args: [
            quantity,
            productId,
            maxCurrentQuantity,
        ],
    });

    // 対象商品がない場合、または上限を超える場合
    if (result.rowsAffected === 0) {
        return {
            error: "対象の商品が存在しないか、在庫数量の上限を超えています。商品を再確認してください。",
        };
    }

    // 入庫画面のキャッシュを無効にする
    revalidatePath("/stock/new");
    // エラー情報なしを返す
    return null
}