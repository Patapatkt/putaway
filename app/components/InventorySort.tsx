// ソート操作を表示するコンポーネント

// Column：TanStack Tableの「１列」を表す型
import type { Column } from "@tanstack/react-table";

// Product：在庫データ１行分の型
import type { Product } from "../model/product";

// 親から受け取るpropsの型を定義する
type InventorySortProps = {
    // Column<Product>：Productを扱うテーブルの１列を[]配列で取得
    // 列が取得できなかった場合はundefined(未定義)で[]配列で受け取れる
    columns: (Column<Product> | undefined)[];
};

// 親から渡されたpropsの中から、columnsを取り出す
// InventorySortPropsは「受け取る値の形」を確認するための型
export default function InventorySort({
    columns,
}: InventorySortProps) {
    // find：配列の中から、条件に合う最初の要素を探す
    // column：配列から１つずつ確認している列
    // column?.id：列が存在すれば、その識別名を読む
    // 見つからなければfindの結果はundefinedになる
    const shelfColumn = columns.find(
        (column) => column?.id === "shelf"
    );

    // 商品名の列を探す
    const productNameColumn = columns.find(
        (column) => column?.id === "productName"
    );

    // 仕様の列を探す
    const inquiryColumn = columns.find(
        (column) => column?.id === "inquiry"
    );

    // このコンポーネントが表示するJSXを返す
    return (
        // md以上では非表示にする
        <div className="mt-4 space-y-4 md:hidden">
            {/* ３つのボタンを同じ幅の３列に並べる */}
            <div className="grid grid-cols-3 gap-2">
                <button
                    type="button"
                    className="min-w-0 rounded-md border border-slate-400 px-1 py-2 text-sm font-semibold"
                    // クリック時に実行する「棚番の並び替え関数」を取得する
                    // ここで並び替えるのではなく、返された関数をonClickに渡す
                    // ?. は列が存在するときだけメソッドを呼び出す
                    onClick={shelfColumn?.getToggleSortingHandler()}
                >
                    {/* 480px以下では見た目だけ隠し、読み上げ用に残す */}
                    <span className="max-[480px]:sr-only">
                        棚番順：
                        {/* getIsSorted()で現在の並び替え状態を調べる */}
                        {shelfColumn?.getIsSorted() === "desc"
                            ? "降順 🔽"
                            : shelfColumn?.getIsSorted() === "asc"
                                ? "昇順 🔼"
                                : "並び替えなし ↕️"}
                    </span>

                    {/* 480px以下で表示する絵文字。読み上げ対象からは外す */}
                    <span
                        className="hidden max-[480px]:inline max-[480px]:text-2xl"
                        aria-hidden="true"
                    >
                        🗺️:
                        {shelfColumn?.getIsSorted() === "desc"
                            ? "🔽"
                            : shelfColumn?.getIsSorted() === "asc"
                                ? "🔼"
                                : "↕️"}
                    </span>
                </button>

                <button
                    type="button"
                    className="min-w-0 rounded-md border border-slate-400 px-1 py-2 text-sm font-semibold"
                    // 商品名の列を操作する関数を渡す
                    onClick={productNameColumn?.getToggleSortingHandler()}
                >
                    <span className="max-[480px]:sr-only">
                        商品名順：
                        {/* 棚番と同じ処理。調べる対象だけ商品名に変わる */}
                        {productNameColumn?.getIsSorted() === "desc"
                            ? "降順 🔽"
                            : productNameColumn?.getIsSorted() === "asc"
                                ? "昇順 🔼"
                                : "並び替えなし ↕️"}
                    </span>

                    <span
                        className="hidden max-[480px]:inline max-[480px]:text-2xl"
                        aria-hidden="true"
                    >
                        🍎:
                        {productNameColumn?.getIsSorted() === "desc"
                            ? "🔽"
                            : productNameColumn?.getIsSorted() === "asc"
                                ? "🔼"
                                : "↕️"}
                    </span>
                </button>

                <button
                    type="button"
                    className="min-w-0 rounded-md border border-slate-400 px-1 py-2 text-sm font-semibold"
                    // 仕様の列を操作する関数を渡す
                    onClick={inquiryColumn?.getToggleSortingHandler()}
                >
                    <span className="max-[480px]:sr-only">
                        仕様順：
                        {inquiryColumn?.getIsSorted() === "desc"
                            ? "降順 🔽"
                            : inquiryColumn?.getIsSorted() === "asc"
                                ? "昇順 🔼"
                                : "並び替えなし ↕️"}
                    </span>

                    <span
                        className="hidden max-[480px]:inline max-[480px]:text-2xl"
                        aria-hidden="true"
                    >
                        📋:
                        {inquiryColumn?.getIsSorted() === "desc"
                            ? "🔽"
                            : inquiryColumn?.getIsSorted() === "asc"
                                ? "🔼"
                                : "↕️"}
                    </span>
                </button>
            </div>
        </div>
    );
}