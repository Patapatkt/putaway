import { flexRender, type Table } from "@tanstack/react-table";
import type { Product } from "@/app/model/product";

type InventoryCardsProps = {
    table: Table<Product>;
};

export default function InventoryCards({
    table,
}: InventoryCardsProps) {
    const rows = table.getRowModel().rows;

    if (rows.length === 0) {
        return (
            <p className="rounded-lg border border-slate-300 p-4">
                検索条件に一致する商品はありません
            </p>
        );
    }

    return (
        <div className="space-y-4">
            {rows.map((row) => (
                <article
                    key={row.id}
                    className="rounded-lg border border-slate-300 bg-white p-4 text-slate-900 shadow-sm"
                >
                    <dl className="space-y-3">
                        {row.getVisibleCells().map((cell) => (
                            <div
                                key={cell.id}
                                className="grid grid-cols-[7rem_minmax(0,1fr)] gap-3"
                            >
                                <dt className="font-semibold text-slate-600">
                                    {cell.column.columnDef.header as string}
                                </dt>
                                <dd className="min-w-0 wrap-anywhere">
                                    {flexRender(
                                        cell.column.columnDef.cell,
                                        cell.getContext()
                                    )}
                                </dd>
                            </div>
                        ))}
                    </dl>
                </article>
            ))}
        </div>
    );
}