"use server";
// 追加入庫(登録済商品)のバックエンド
import { and, eq, lte, sql } from "drizzle-orm";
import { drizzleDb } from "@/lib/db";
import { products,history } from "@/lib/schema";
import { revalidatePath } from "next/cache";
import { productSchema, restockProductSchema, } from "@/app/model/product";

// 入庫対象の商品IDを検証する
const productIdSchema = productSchema.pick({
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
    const result = productIdSchema.safeParse({
        id: Number(formData.get("productId")),
    });
    const rawProductId = formData.get("productId");
    const rawQuantity = formData.get("quantity");
    // 検証に失敗したら、最初のエラーメッセージを返す
    if (!result.success) {
        return {
            error: result.error.issues[0]?.message ??
                "入力内容を確認してください",
        };
    }
    if (
        typeof rawProductId !== "string" ||
        rawProductId.trim() === ""
    ) {
        return {
            error: "商品情報が正しくありません。",
        };
    }

    if (
        typeof rawQuantity !== "string" ||
        rawQuantity.trim() === ""
    ) {
        return {
            error: "入庫数量を入力してください。",
        };
    }
    // 入庫数量を数値に変換してZodで検証する
    const quantityValidation = restockProductSchema.safeParse({
        productId: Number(rawProductId),
        quantity: Number(rawQuantity),
    });

    if (!quantityValidation.success) {
        console.log("追加入庫の検証エラー", quantityValidation.error.issues);
        return {
            error:
                quantityValidation.error.issues[0]?.message ??
                "入庫数量は整数を正しく入力してください。",
        };
    }

    const { productId, quantity } = quantityValidation.data;

    // 加算後に上限を超えないよう、現在庫の上限を求める
    const maxCurrentQuantity = Number.MAX_SAFE_INTEGER - quantity;

    try {
        const updated = await drizzleDb.transaction(async (tx) => {
            // 在庫を加算し、履歴に必要な商品情報を受け取る
            const [product] = await tx
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
                    productName: products.productName,
                    shelf: products.shelf,
                    inquiry: products.inquiry,
                });

            // 更新対象がなければ、履歴も作成しない
            if (!product) {
                return false;
            }

            // 今回の入庫を1件の履歴として保存する
            await tx.insert(history).values({
                productId: product.id,
                createdAt: new Date().toISOString(),
                productName: product.productName,
                shelf: product.shelf,
                inquiry: product.inquiry,
                quantity,
                type: "IN",
                memo: "",
            });

            return true;
        });

        if (!updated) {
            return {
                error: "対象の商品が存在しないか、在庫数量の上限を超えています。商品を再確認してください。",
            };
        }
    } catch (error) {
        // DB処理の失敗はサーバー側に記録する
        console.error("追加入庫の保存に失敗しました", error);

        return {
            error: "入庫を保存できませんでした。時間をおいて再度お試しください。",
        };
    }

    // 保存成功後に、表示内容を更新する
    revalidatePath("/stock/new");
    revalidatePath("/");

    return null;
}