"use client";
// 検索結果の表示コンポーネント
import { useState } from "react";
import {
    getCoreRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table";
import type { Column, ColumnDef, HeaderGroup, SortingState } from "@tanstack/react-table";
import type { Product } from "@/app/model/product";
import InventoryCheckbox from "./InventoryCheckbox";
import InventoryTableHeader from "./InventoryTableHeader";
import InventoryTableBody from "./InventoryTableBody";
import InventoryCards from "./InventoryCards";
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
    ]);
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
        <div>
            <InventoryCheckbox
                columns={[
                    // 取得結果を「行データの型がProductまたはundefinedである列」として扱う。
                    table.getColumn("lastReceivedAt") as Column<Product | undefined>,
                    // 取得結果を「行データの型がProductまたはundefinedである列」として扱う。
                    table.getColumn("lastShippedAt") as Column<Product | undefined>,
                ]}
            />

            {/* スマホ用：並び替えボタンと縦型カード */}
            <div className="mt-4 space-y-4 md:hidden">
                <button
                    type="button"
                    className="rounded-md border border-slate-400 px-4 py-2 font-semibold"
                    onClick={
                        table.getColumn("shelf")?.getToggleSortingHandler()
                    }
                >
                    棚番順：
                    {table.getColumn("shelf")?.getIsSorted() === "desc"
                        ? "降順 ↓"
                        : "昇順 ↑"}
                </button>

                <InventoryCards
                    rows={table.getRowModel().rows}
                />
            </div>

            {/* PC用：今までの表 */}
            <div className="mt-4 hidden md:block">
                <div className="table-wrapper">
                    <table className="common-table">
                        <InventoryTableHeader
                            headerGroups={
                                table.getHeaderGroups()
                            }
                        />
                        <InventoryTableBody
                            rows={table.getRowModel().rows}
                            visibleColumnCount={7}
                        />
                    </table>
                </div>
            </div>
        </div>
    );
}