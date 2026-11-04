"use client";

// 入出庫履歴の表示コンポーネント

import type { StockHistory } from "@/app/model/product";

// 親から受け取るpropsの型
type HistoryTableProps = {
    histories: StockHistory[];
};

// 取得した履歴を表として表示する
export default function HistoryTable({
    histories,
}: HistoryTableProps) {
    return (
        <div className="table-wrapper">
            <table className="common-table history-table">
                <thead>
                    <tr>
                        <th>日時</th>
                        <th>棚番</th>
                        <th>商品名</th>
                        <th>仕様</th>
                        <th>区分</th>
                        <th>数量</th>
                        <th>メモ</th>
                    </tr>
                </thead>

                <tbody>
                    {histories.length === 0 ? (
                        <tr>
                            <td colSpan={7}>
                                入出庫履歴はありません
                            </td>
                        </tr>
                    ) : (
                        histories.map((history) => (
                            <tr key={history.id}>
                                <td>
                                    {new Date(history.createdAt).toLocaleString(
                                        "ja-JP",
                                        {
                                            timeZone: "Asia/Tokyo",
                                            year: "numeric",
                                            month: "2-digit",
                                            day: "2-digit",
                                            hour: "2-digit",
                                            minute: "2-digit",
                                            second: "2-digit",
                                            hour12: false,
                                        }
                                    )}
                                </td>
                                <td>{history.shelf}</td>
                                <td>{history.productName}</td>
                                <td>{history.inquiry}</td>
                                <td>{history.type === "IN" ? "入庫" : "出庫"}</td>
                                <td>{history.quantity}</td>
                                <td>{history.memo}</td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}