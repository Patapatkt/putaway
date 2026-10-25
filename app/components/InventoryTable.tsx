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
import { get } from "http";
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
        accessorKey: "memo",
        header: "メモ",
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

        state: {
            sorting,
        },
        onSortingChange: setSorting,
        // 昇順と降順の2通りで切り替える
        enableSortingRemoval: false,
        enableMultiSort: false,
    });

    return (
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
                                colSpan={5}
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
    );
}