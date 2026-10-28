import { flexRender, Row } from "@tanstack/react-table";
import type { Product } from "../model/product";

type InventoryTableBodyProps = {
    rows: Row<Product | undefined>[];
    visibleColumnCount: number;
};

export default function InventoryTableBody({
    rows,
    visibleColumnCount,
}: InventoryTableBodyProps) {
    return (
        <tbody>
            {rows.length === 0 ? (
                <tr>
                    <td
                        colSpan={visibleColumnCount}
                        className="text-left p-4"
                    >
                        検索条件に一致する商品はありません
                    </td>
                </tr>
            ) : (
                rows.map((row) => (
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