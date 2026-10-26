"use server";

import { and, eq, sql } from "drizzle-orm";
import { drizzleDb } from "@/lib/db";
import { products, history } from "@/lib/schema";
import { revalidatePath } from "next/cache";
import {
    createQuantitySchema, createProductSchema,
} from "@/app/model/product";

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
    const result = createProductSchema
        .omit({ quantity: true })
        .safeParse({
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

    try {
        const created = await drizzleDb.transaction(async (tx) => {
            // 商品と初回入庫履歴に、同じ日時を記録する
            const now =new Date().toISOString();
            // 同じ棚番・商品名・仕様の商品を探す
            const existingProductQuery = tx
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
            const [product] = await tx
                .insert(products)
                .select(
                    sql`
                        SELECT
                            NULL,
                            ${trimmedProductName},
                            ${quantity},
                            ${trimmedShelf},
                            ${trimmedInquiry},
                            ${now},
                            NULL,
                            ${trimmedMemo}
                        WHERE NOT EXISTS ${existingProductQuery}
                    `
                )
                // 登録した商品のIDを .returning() で受け取り、そのIDで履歴を作る
                .returning({
                    id: products.id,
                    productName: products.productName,
                    shelf: products.shelf,
                    inquiry: products.inquiry,
                });

            // 登録されなかった場合、履歴も作成しない
            if (!product) {
                return false;
            }

            // 新規登録時の初回入庫を履歴へ保存する
            await tx.insert(history).values({
                productId: product.id,
                createdAt: now,
                productName: product.productName,
                shelf: product.shelf,
                inquiry: product.inquiry,
                quantity,
                type: "IN",
                memo: "新規登録時の初回入庫",
            });

            return true;
        });

        if (!created) {
            return {
                error: "同じ商品が登録済みです。商品を再確認して追加入庫してください。",
            };
        }
    } catch (error) {
        console.error("新規商品と初回入庫履歴の保存に失敗しました", error);

        return {
            error: "商品を登録できませんでした。時間をおいて再度お試しください。",
        };
    }

    // 保存成功後に、表示内容を更新する
    revalidatePath("/stock/new");
    revalidatePath("/");

    return null;
}