import { Suspense } from "react";
import Link from "next/link";
import HistoryContent from "@/app/components/HistoryContent";
// 入出庫履歴ページを表示する
export default function HistoryPage() {
    return (
        <main className="page-container">
            <h1 className="page-title">入出庫履歴</h1>

            <Suspense fallback={<p>入出庫履歴を読み込み中です…</p>}>
                <HistoryContent />
            </Suspense>

            <div className="product-actions">
                <Link href="/" className="button button-primary">
                    在庫一覧へ戻る
                </Link>
            </div>
        </main>
    );
}