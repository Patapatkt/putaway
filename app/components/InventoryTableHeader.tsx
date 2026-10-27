import { flexRender, type Table } from "@tanstack/react-table";
import type { Product } from "../model/product";

type InventoryTableHeaderProps = {
    table: Table<Product>;
};

export default function InventoryTableHeader({
    table,
}: InventoryTableHeaderProps) {
    return (
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
    );
}