// サーバー専用の処理
import "server-only";

import {and,like} from "drizzle-orm";
import { drizzleDb } from "./db";
import { products } from "./schema";
import { 
    InventorySearchSchema,
    productSchema, } from "@/app/model/product";
import type { SearchSchema, Product } from "@/app/model/product";

// DBから商品一覧を取得し、Zodで検証してHomeへ返す
export async function getProducts(
    conditions:SearchSchema
):Promise<{
    productList: Product[];
    error: string | null;
}> {
   // DBを検索する前に、検索条件を検証する
   const parsed = InventorySearchSchema.safeParse(conditions);
   if(!parsed.success){
         return {
            productList: [],
            error: parsed.error.issues[0]?.message
                ?? "検索条件を確認してください",
        };
   }
   // 検証後の値を取り出す（前後の空白は除去済み）
    const { shelf, productName, inquiry } = parsed.data;

    const result = await drizzleDb
        .select()
        .from(products)
        .where(
            and(
                shelf
                    ? like(products.shelf, `${shelf}%`)//棚番、前方部分一致
                    : undefined,
                productName
                    ? like(products.productName, `${productName}%`)//商品名、前方部分一致
                    : undefined,
                inquiry
                    ? like(products.inquiry, `${inquiry}%`)//仕様、前方部分一致
                    : undefined,
            )
        );

    return {
        productList: productSchema.array().parse(result),
        error: null,
    };
}