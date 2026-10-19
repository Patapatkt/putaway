"use server";//DBを扱う処理をサーバー側で実行する宣言

import { and, eq } from "drizzle-orm";
import { drizzleDb } from "@/lib/db";
import { products } from "@/lib/schema";
// 登録する商品が「登録済」か「未登録」かを判断する関数
export async function checkProduct(
    // 引数設定
    shelf: string,//棚番
    productName: string,//商品名
    inquiry: string,//仕様
) {
    // 入力の前後にある空白を取り除く
    const trimmedShelf = shelf.trim();//棚番の前後の空白を除いたものを定数に格納
    const trimmedProductName = productName.trim();//商品名の前後の空白を除いたものを定数に格納
    const trimmedInquiry = inquiry.trim();//仕様の前後の空白を除いたものを定数に格納
    // 必須項目を確認する(棚番・商品名・仕様が未入力であればエラーメッセージを返す)
    if (
        !trimmedShelf ||
        !trimmedProductName ||
        !trimmedInquiry
    ) {
        return {
            status: "error" as const,// statusの型を"error"に固定する
            error: "棚番・商品名・仕様を入力してください"
        }
    }
    // 棚番・商品名・仕様が一致する商品を探す
    const result = await drizzleDb
        .select()
        .from(products)//productsテーブルで検索
        .where(
            and(
                eq(products.shelf, trimmedShelf),//テーブル内の棚番と入力した棚番が一致
                eq(products.productName, trimmedProductName),//テーブル内の商品名と入力した商品名が一致
                eq(products.inquiry, trimmedInquiry),//テーブル内の仕様と入力した仕様が一致
            )
        )
        .limit(1);

    const product =result[0]//検索結果の先頭行[0]を取得する。0件ならundefined(未定義)

    // 登録済みの商品
    if(product){
        return{
            status:"found"as const,//// statusの型を"found"に固定する
            product:{//productより必要な情報を取得
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
    return{
        status: "notFound" as const,// statusの型を"notFound"に固定する
        inputValues: {
            shelf: trimmedShelf,
            productName: trimmedProductName,
            inquiry: trimmedInquiry,
        },
    }

}