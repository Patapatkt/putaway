// 検索テーブル表示・非表示チェックボックスのコンポーネント
import type {Product}  from "../model/product";
import type { Column } from "@tanstack/react-table";

// Propsを定義
type InventoryCheckboxProps = {
    columns: Column<Product | undefined>[]; //Product型のデータを扱うテーブルの型
};
//表のデータを受取りその型にあった引数を受取る
export default function InventoryCheckbox({
    columns,
}: InventoryCheckboxProps) {
    // 最終入庫日の列を取得　columns.findでcolumnsからidに一致したものを取得
    const lastReceivedAtColumn = columns.find(
        (columns) => columns.id === "lastReceivedAt",
    );
    // 最終出庫日の列を取得　columns.findでcolumnsからidに一致したものを取得
    const lastShippedAtColumn = columns.find(
        (columns) => columns.id === "lastShippedAt",
    );

    return (
        <div className="grid grid-cols-2 gap-4">
            <label className="flex items-center gap-2">
                <input
                    type="checkbox"
                    checked={lastReceivedAtColumn?.getIsVisible() ?? false}//デフォルトは非表示
                    onChange={lastReceivedAtColumn?.getToggleVisibilityHandler()}//チェックボックスを押すと表示
                />
                最終入庫日時🕗
            </label>

            <label className="flex items-center gap-2">
                <input
                    type="checkbox"
                    checked={lastShippedAtColumn?.getIsVisible() ?? false}//デフォルトは非表示
                    onChange={lastShippedAtColumn?.getToggleVisibilityHandler()}//チェックボックスを押すと表示
                />
                最終出庫日時🕔
            </label>
        </div>
    );
}