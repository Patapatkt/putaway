// 在庫一覧を表示するページ

import Link from "next/link";
import { Suspense } from "react";
import InventorySearchContent from "./components/InventorySearchContent";

type HomeProps = {
  searchParams: Promise<{
    shelf?: string | string[];
    productName?: string | string[];
    inquiry?: string | string[];
  }>;
};

// 在庫一覧表示の関数を作成
export default async function Home({ searchParams }: HomeProps) {

  return (
    <main className="inventory-page">
      <h1 className="page-title">在庫一覧</h1>
      {/* 検索表示のコンポーネントを呼び出す*/}
      <Suspense fallback={<p>在庫一覧を読み込み中です…</p>}>
        <InventorySearchContent searchParams={searchParams} />
      </Suspense>


      <div className="product-actions">
        <Link
          href="/stock/new"
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