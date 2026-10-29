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
import NewDate from "./NewDate";
import InventorySort from "./InventorySort";
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
         // 日本語の比較ルールを使う。降順への反転はTanStack Tableが担当
        sortingFn:(rowA,rowB,columnId)=>
            rowA.getValue<string>(columnId).localeCompare(
                rowB.getValue<string>(columnId),
                "ja"//英数字を含む場合は.localeCompare以降を下記の様に変える
                //.localeCompare(比較する文字列, "en", {numeric: true,})    
            ),    
    },
    {
        accessorKey: "inquiry",
        header: "仕様",
        // 日本語の比較ルールを使う。降順への反転はTanStack Tableが担当
        sortingFn:(rowA,rowB,columnId)=>
            rowA.getValue<string>(columnId).localeCompare(
                rowB.getValue<string>(columnId),
                "ja"
            ),    
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
            return (
                <NewDate
                    value={value}//👆で取得した日時を子コンポーネントに渡す
                />)
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

            return (
                <NewDate
                    value={value}//取得した日時を子コンポーネントに渡す
                />)
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
            <InventorySort
                columns={[
                    table.getColumn("shelf") as Column<Product>,
                    table.getColumn("productName") as Column<Product>,
                    table.getColumn("inquiry") as Column<Product>,
                ]}
            />

            <InventoryCards
                rows={table.getRowModel().rows}
            />

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