import { db } from "@/lib/db";
import InventoryTable from "@/app/components/InventoryTable";
import type { Product } from "@/app/model/product";
import Link from "next/link";
// 在庫一覧表示の関数を作成
export default async function Home() {
  const result = await db.execute(//db.execute(...)	SQLを実行する
    "SELECT * FROM products;"//SQL文にて全てのデータを取得
  );
  // DBの各行の値を変換し、Product型に合う新しい配列を作る
  const productList: Product[] = result.rows.map((row) => ({
    id: Number(row.id),
    productName: String(row.productName),
    quantity: Number(row.quantity),
    shelf: String(row.shelf),
    inquiry: String(row.inquiry),
    memo: String(row.memo),
  }));
  return (
    <main>
      <h1>在庫一覧</h1>
      {/* 親から子コンポーネントへ、propsで商品一覧を渡す */}
      <InventoryTable
        productList={productList} //親ファイル(変数)から子ファイル(コンポーネント)に引数を渡す
      />

      <Link
        href="stock/new"
        className={
          "button button-secondary"
        }
      >
        商品入庫
      </Link>

    </main >

  );
}