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

        memo: text("memo").notNull().default(""),
    },
    (table) => [
        check("products_quantity_nonnegative", sql`${table.quantity} >= 0`),
    ]
)
