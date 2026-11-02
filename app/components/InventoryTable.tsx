"use client";

// 検索結果の表示コンポーネント
import { useState } from "react";
import {
    createSortedRowModel,
    stockFeatures,
    tableFeatures,
    useTable,
} from "@tanstack/react-table";
import type {
    ColumnDef,
    SortingState,
} from "@tanstack/react-table";

import type { Product } from "@/app/model/product";
import InventoryCheckbox from "./InventoryCheckbox";
import InventoryTableHeader from "./InventoryTableHeader";
import InventoryTableBody from "./InventoryTableBody";
import InventoryCards from "./InventoryCards";
import NewDate from "./NewDate";
import InventorySort from "./InventorySort";

type InventoryTableProps = {
    productList: Product[];
};

// 標準機能に、実際に行を並び替える処理を追加する
const features = tableFeatures({
    ...stockFeatures,
    sortedRowModel: createSortedRowModel(),
});

// 「使う機能の型」「行データの型」の順に指定する
const columns: ColumnDef<typeof features, Product>[] = [
    {
        accessorKey: "shelf",
        header: "棚番",
        sortFn: (rowA, rowB) =>
            rowA.original.shelf.localeCompare(
                rowB.original.shelf,
                "ja",
            ),
    },
    {
        accessorKey: "productName",
        header: "商品名",
        // 昇順の比較を定義し、降順への反転はテーブルに任せる
        sortFn: (rowA, rowB) =>
            rowA.original.productName.localeCompare(
                rowB.original.productName,
                "ja",
            ),
    },
    {
        accessorKey: "inquiry",
        header: "仕様",
        sortFn: (rowA, rowB) =>
            rowA.original.inquiry.localeCompare(
                rowB.original.inquiry,
                "ja",
            ),
    },
    {
        accessorKey: "quantity",
        header: "現在庫",
        sortFn: (rowA, rowB) =>
            rowA.original.quantity - rowB.original.quantity,
    },
    {
        accessorKey: "lastReceivedAt",
        header: "最終入庫時間",
        cell: (info) => {
            const value = info.getValue<string | null>();

            if (!value) {
                return "—";
            }

            return <NewDate value={value} />;
        },
    },
    {
        accessorKey: "lastShippedAt",
        header: "最終出庫日時",
        cell: (info) => {
            const value = info.getValue<string | null>();

            if (!value) {
                return "—";
            }

            return <NewDate value={value} />;
        },
    },
];

export default function InventoryTable({
    productList,
}: InventoryTableProps) {
    // 初期表示は棚番の昇順
    const [sorting, setSorting] = useState<SortingState>([
        { id: "shelf", desc: false },
    ]);

    const table = useTable({
        features,

        data: productList,
        columns,
        getRowId: (product) => String(product.id),

        // 初期表示では日時2列を非表示にする
        initialState: {
            columnVisibility: {
                lastReceivedAt: false,
                lastShippedAt: false,
            },
        },

        // ソート状態をReactで管理する
        state: {
            sorting,
        },
        onSortingChange: setSorting,

        // 列の表示状態が変わっても並び順を初期化しない
        autoResetAll: false,

        // 昇順と降順の2通りで切り替える
        enableSortingRemoval: false,
        enableMultiSort: false,
    });

    // 日時の表示切替に使う列を取得する
    const dateColumns = table.getAllLeafColumns().filter(
        (column) =>
            column.id === "lastReceivedAt" ||
            column.id === "lastShippedAt",
    );

    // 並び替えボタンに使う列を取得する
    const sortColumns = table.getAllLeafColumns().filter(
        (column) =>
            column.id === "shelf" ||
            column.id === "productName" ||
            column.id === "inquiry",
    );

    return (
        <div>
            <InventoryCheckbox columns={dateColumns} />

            <InventorySort columns={sortColumns} />

            <InventoryCards rows={table.getRowModel().rows} />

            {/* PC用の表 */}
            <div className="mt-4 hidden md:block">
                <div className="table-wrapper">
                    <table className="common-table">
                        <InventoryTableHeader
                            headerGroups={table.getHeaderGroups()}
                        />

                        <InventoryTableBody
                            rows={table.getRowModel().rows}
                            visibleColumnCount={
                                table.getVisibleLeafColumns().length
                            }
                        />
                    </table>
                </div>
            </div>
        </div>
    );
}