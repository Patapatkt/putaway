// 検索テーブル表示・非表示チェックボックスのコンポーネント
import type { Table } from "@tanstack/react-table";
import type {Product}  from "../model/product";

// Propsを定義
// TData:表の１行のデータ型を受け取る仮の名前(データの型を受け取る場所)
type InventoryCheckboxProps = {
    table: Table<Product>; //Product型のデータを扱うテーブルの型
};
// 票のデータを受取りその型にあった引数を受取る
export default function InventoryCheckbox({
    table,
}: InventoryCheckboxProps) {
    return (
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
    );
}