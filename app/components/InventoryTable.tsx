"use client";

// 検索結果の表示コンポーネント
import { useState } from "react";
import {
    stockFeatures,
    useTable,
} from "@tanstack/react-table";
import type {
    ColumnDef,
    SortingState,
    StockFeatures,
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

// v9では「使う機能の型」「行データの型」の順に指定する
const columns: ColumnDef<StockFeatures, Product>[] = [
    {
        accessorKey: "shelf",
        header: "棚番",
        sortFn: "text",
    },
    {
        accessorKey: "productName",
        header: "商品名",
        sortFn: (rowA, rowB, columnId) =>
            rowA.getValue<string>(columnId).localeCompare(
                rowB.getValue<string>(columnId),
                "ja",
            ),
    },
    {
        accessorKey: "inquiry",
        header: "仕様",
        sortFn: (rowA, rowB, columnId) =>
            rowA.getValue<string>(columnId).localeCompare(
                rowB.getValue<string>(columnId),
                "ja",
            ),
    },
    {
        accessorKey: "quantity",
        header: "現在庫",
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
        // ソート・列の表示切替などの標準機能を使う
        features: stockFeatures,

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

        state: {
            sorting,
        },
        onSortingChange: setSorting,

        autoResetAll: false,
        enableSortingRemoval: false,
        enableMultiSort: false,
    });

    // 型アサーションを使わず、取得した列を渡す
    const dateColumns = table.getAllLeafColumns().filter(
        (column) =>
            column.id === "lastReceivedAt" ||
            column.id === "lastShippedAt",
    );

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