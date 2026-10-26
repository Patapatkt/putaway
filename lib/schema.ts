// DrizzleでSQLiteのテーブルを定義するための道具
import { sql } from "drizzle-orm";
import { check, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";


// productsテーブルの構造を定義
export const products = sqliteTable(
    "products",
    {
        id: integer("id").primaryKey(),
        productName: text("productName").notNull(),
        quantity: integer("quantity").notNull().default(0),

        shelf: text("shelf").notNull(),

        inquiry: text("inquiry").notNull(),

        lastReceivedAt:text("lastReceivedAt"),

        lastShippedAt:text("lastShippedAt"),

        memo: text("memo").notNull().default(""),
    },
    (table) => [
        check("products_quantity_nonnegative", sql`${table.quantity} >= 0`),
    ]
)

// historyテーブル(入出庫履歴画面)の構造を定義
export const history = sqliteTable(
    "history",
    {
        id: integer("id").primaryKey(),//履歴を識別するID
        // 同じ商品に複数の履歴を登録できるようにする
        productId: integer("productId")//対象商品を識別するID
            .notNull()
            .references(() => products.id),//履歴と対象商品を関連付ける
        createdAt: text("createdAt").notNull(),//入出庫時間
        //操作時点の商品情報を保存する 
        productName: text("productName").notNull(),//商品名
        shelf: text("shelf").notNull(),//棚番
        inquiry: text("inquiry").notNull(),//仕様
         // 入庫・出庫とも、今回動かした数量を正の数で保存
        quantity: integer("quantity").notNull(),//入出庫時の数量
        type: text("type",{enum:["IN","OUT"]}).notNull(),//区分:入庫・出庫
        memo: text("memo").notNull().default(""),//メモ
    },
    (table) => [
        check("history_quantity_nonnegative", sql`${table.quantity} > 0`
        ),
        check(
            "history_type_volid",
            sql`${table.type} IN ('IN', 'OUT')`
        ),
    ]
)