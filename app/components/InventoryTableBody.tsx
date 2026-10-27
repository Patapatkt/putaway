import { flexRender, type Table } from "@tanstack/react-table";
import type { Product } from "../model/product";

type InventoryTableBodyProps = {
    table: Table<Product>;
};

export default function InventoryTableBody({
    table,
}: InventoryTableBodyProps) {
    return (
        <tbody>
            {table.getRowModel().rows.length === 0 ? (
                <tr>
                    <td
                        colSpan={table.getVisibleLeafColumns().length}
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
    );
}