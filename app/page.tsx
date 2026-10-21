import { db } from "@/lib/db";
import InventoryTable from "@/app/components/InventoryTable";
import { productSchema } from "@/app/model/product";
import Link from "next/link";
import { Suspense } from "react";
// 在庫一覧表示の関数を作成
export default async function Home() {
  const result = await db.execute(//db.execute(...)	SQLを実行する
    "SELECT * FROM products;"//SQL文にて全てのデータを取得
  );
  // DBの各行の値を変換し、Product型に合う新しい配列を作る //parse:ルールに値を確認
  const productList = productSchema.array().parse(
    result.rows.map((row) => ({
      id: Number(row.id),
      productName: String(row.productName),
      quantity: Number(row.quantity),
      shelf: String(row.shelf),
      inquiry: String(row.inquiry),
      memo: String(row.memo),
    }))
  );
  return (
    <main className="inventory-page">
      <h1 className="page-title">在庫一覧</h1>
      {/* 親から子コンポーネントへ、propsで商品一覧を渡す */}
      {/* Suspenseはコンポーネントを読み込むまで表示されるコンポーネント */}
      <Suspense fallback={<p>在庫一覧を読み込み中です…</p>}>
        <InventoryTable
          productList={productList} //親ファイル(変数)から子ファイル(コンポーネント)に引数を渡す
        />
      </Suspense>
      <div className="product-actions">
        <Link
          href="stock/new"
          className={
            "button button-primary"
          }
        >
          商品入庫
        </Link>
      </div>
    </main >

  );
}