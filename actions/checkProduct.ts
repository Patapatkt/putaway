"use server";//DBを扱う処理をサーバー側で実行する宣言

import { productSchema } from "@/app/model/product";
import { and, eq } from "drizzle-orm";
import { drizzleDb } from "@/lib/db";
import { products } from "@/lib/schema";

// 商品確認に必要な3項目の検証ルールを取り出す
const checkProductSchema = productSchema.pick({
    shelf: true,
    productName: true,
    inquiry: true,
});

// 登録する商品が「登録済」か「未登録」かを判断する関数
export async function checkProduct(
    // 引数設定
    shelf: string,//棚番
    productName: string,//商品名
    inquiry: string,//仕様
) {//safeParse()で検証の成否を返す
    const result = checkProductSchema.safeParse({ 
        shelf,
        productName,
        inquiry,
    });
    // 検証に失敗したら、最初のエラーメッセージを返す
    if (!result.success) {
        return {
            error: result.error.issues[0]?.message ??
                "入力内容を確認してください",
        };
    }
    // 検証済み・空白除去済みの値を取り出す
    const {
        shelf: trimmedShelf,
        productName: trimmedProductName,
        inquiry: trimmedInquiry,
    } = result.data;

    // 棚番・商品名・仕様の3項目全てが一致する商品を探す
    const matchedProducts = await drizzleDb
        .select()
        .from(products)//productsテーブルで検索
        .where(
            and(
                eq(products.shelf, trimmedShelf),
                eq(products.productName, trimmedProductName),
                eq(products.inquiry, trimmedInquiry),
            )
        )
        .limit(1);

    const product = matchedProducts[0]//検索結果の先頭行[0]を取得する。0件ならundefined(未定義)

    // 登録済みの商品
    if (product) {
        return {
            status: "found" as const,//// statusの型を"found"に固定する
            product: {//productより必要な情報を取得
                id: Number(product.id),
                productName: String(product.productName),
                quantity: Number(product.quantity),
                shelf: String(product.shelf),
                inquiry: String(product.inquiry),
                memo: String(product.memo),
            },
        };
    }
    // 未登録の商品
    return {
        status: "notFound" as const,// statusの型を"notFound"に固定する
        inputValues: {
            shelf: trimmedShelf,
            productName: trimmedProductName,
            inquiry: trimmedInquiry,
        },
    }

}