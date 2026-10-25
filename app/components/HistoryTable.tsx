"use client";

// 入出庫履歴の表示コンポーネント
import {
    flexRender,
    getCoreRowModel,
    useReactTable,
} from "@tanstack/react-table";
import type { ColumnDef } from "@tanstack/react-table";
import type { StockHistory } from "@/app/model/product";

// 親から受け取るpropsの型
type HistoryTableProps = {
    histories: StockHistory[];
};

// 履歴テーブルの列を定義する
const columns: ColumnDef<StockHistory>[] = [
    {
        accessorKey: "createdAt",
        header: "日時",
        cell: ({ row }) =>
            new Date(row.original.createdAt).toLocaleString(
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
            ),
    },
    {
        accessorKey: "shelf",
        header: "棚番",
    },
    {
        accessorKey: "productName",
        header: "商品名",
    },
    {
        accessorKey: "inquiry",
        header: "仕様",
    },
    {
        accessorKey: "type",
        header: "区分",
        cell: ({ row }) =>
            row.original.type === "IN" ? "入庫" : "出庫",
    },
    {
        accessorKey: "quantity",
        header: "数量",
    },
    {
        accessorKey: "memo",
        header: "メモ",
    },
];

// 取得した履歴を表として表示する
export default function HistoryTable({
    histories,
}: HistoryTableProps) {
    const table = useReactTable({
        data: histories,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getRowId: (history) => String(history.id),
    });

    return (
        <div className="table-wrapper">
            <table className="common-table history-table">
                <thead>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <tr key={headerGroup.id}>
                            {headerGroup.headers.map((header) => (
                                <th
                                    key={header.id}
                                    colSpan={header.colSpan}
                                >
                                    {header.isPlaceholder
                                        ? null
                                        : flexRender(
                                            header.column.columnDef.header,
                                            header.getContext()
                                        )}
                                </th>
                            ))}
                        </tr>
                    ))}
                </thead>

                <tbody>
                    {histories.length === 0 ? (
                        <tr>
                            <td colSpan={table.getVisibleLeafColumns().length}>
                                入出庫履歴はありません
                            </td>
                        </tr>
                    ) : (
                        table.getRowModel().rows.map((row) => (
                            <tr key={row.id}>
                                {row.getVisibleCells().map((cell) => (
                                    <td key={cell.id}>
                                        {flexRender(
                                            cell.column.columnDef.cell,
                                            cell.getContext()
                                        )}
                                    </td>
                                ))}
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}