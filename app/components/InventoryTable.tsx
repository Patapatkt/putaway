"use client";
// 検索結果の表示コンポーネント
import { useState } from "react";
import {
    flexRender,
    getCoreRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table";
import type { ColumnDef, SortingState } from "@tanstack/react-table";
import type { Product } from "@/app/model/product";
// 表の表示に必要な商品情報の型
type InventoryTableProps = {
    productList: Product[]//親から商品データの配列を受け取る
};

// 表の列を定義する
const columns: ColumnDef<Product>[] = [
    {
        accessorKey: "shelf",
        header: "棚番",
        sortingFn: "text",
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
        accessorKey: "quantity",
        header: "現在庫",
    },
    {
        accessorKey: "lastReceivedAt",
        header: "最終入庫時間",
        cell: ({ getValue }) => {
            const value = getValue<string | null>();

            if (!value) {
                return "—";
            }

            return new Date(value).toLocaleString("ja-JP", {
                timeZone: "Asia/Tokyo",
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
                hour12: false,
            });
        },
    },
    {
        accessorKey: "lastShippedAt",
        header: "最終出庫日時",
        cell: ({ getValue }) => {
            const value = getValue<string | null>();

            if (!value) {
                return "—";
            }

            return new Date(value).toLocaleString("ja-JP", {
                timeZone: "Asia/Tokyo",
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
                hour12: false,
            });
        },
    },
];
// 商品一覧の検索結果を表示する
export default function InventoryTable({
    productList,
}: InventoryTableProps) {
    // 初期表示は棚番の昇順
    const [sorting, setSorting] = useState<SortingState>([
        { id: "shelf", desc: false },
    ])
    // 商品データと列の定義を使って表を準備する
    const table = useReactTable({
        data: productList,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getRowId: (product) => String(product.id),

        // 初期表示では日時２列を非表示にする
        initialState: {
            columnVisibility: {
                lastReceivedAt: false,
                lastShippedAt: false,
            },
        },

        state: {
            sorting,
        },
        onSortingChange: setSorting,
        // 列の表示状態が変わっても、並び順を初期化しない
        autoResetAll: false,

        // 昇順と降順の2通りで切り替える
        enableSortingRemoval: false,
        enableMultiSort: false,
    });

    return (
    <div className="table-wrapper">
        <div className="column-controls">
            <label>
                <input
                    type="checkbox"
                    checked={
                        table.getColumn("lastReceivedAt")?.getIsVisible()
                        ?? false
                    }
                    onChange={
                        table.getColumn("lastReceivedAt")
                            ?.getToggleVisibilityHandler()
                    }
                />
                最終入庫日時を表示
            </label>

            <label>
                <input
                    type="checkbox"
                    checked={
                        table.getColumn("lastShippedAt")?.getIsVisible()
                        ?? false
                    }
                    onChange={
                        table.getColumn("lastShippedAt")
                            ?.getToggleVisibilityHandler()
                    }
                />
                最終出庫日時を表示
            </label>
        </div>
        <div className="table-wrapper">
            <table className="common-table">
                <thead>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <tr key={headerGroup.id}>
                            {headerGroup.headers.map((header) => (
                                <th key={header.id} colSpan={header.colSpan}>
                                    {header.isPlaceholder ? null : header.column.id === "shelf" ? (
                                        <button
                                            type="button"
                                            onClick={header.column.getToggleSortingHandler()}
                                        >
                                            {flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}
                                            {header.column.getIsSorted() === "asc"
                                                ? " ↑"
                                                : header.column.getIsSorted() === "desc"
                                                    ? " ↓"
                                                    : ""}
                                        </button>
                                    ) : (
                                        flexRender(
                                            header.column.columnDef.header,
                                            header.getContext()
                                        )
                                    )}
                                </th>
                            ))}
                        </tr>
                    ))}
                </thead>

                <tbody>
                    {productList.length === 0 ? (
                        <tr>
                            <td
                                colSpan={7}
                                className="text-left p-4"
                            >
                                検索条件に一致する商品はありません
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
            </div>
    );
}