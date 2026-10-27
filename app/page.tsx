// 在庫一覧を表示するページ

import Link from "next/link";
import { Suspense } from "react";
import InventorySearchContent from "./components/InventorySearchContent";
import InventorySearchForm from "./components/InventorySearchForm";

type HomeProps = {
  searchParams: Promise<{
    shelf?: string | string[];
    productName?: string | string[];
    inquiry?: string | string[];
  }>;
};

// 在庫一覧表示の関数を作成
export default async function Home({ searchParams }: HomeProps) {
  const {shelf,productName,inquiry} = await searchParams;
  return (
    <main className="inventory-page">
      <h1 className="page-title">在庫一覧</h1>
      {/* 検索表示のコンポーネントを呼び出す*/}
      <InventorySearchForm
        shelf={shelf}
        productName={productName}
        inquiry={inquiry}
      />
      {/* Suspenseを取り除く為に */}
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
        <Link
          href="/history"
          className={
            "button button-primary"
          }
        >
          入出庫履歴
        </Link>
      </div>
    </main >

  );
}