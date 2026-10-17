// 検索結果の表示コンポーネント
import type { Product } from "@/app/model/product";
// 表の表示に必要な商品情報の型
type InventoryTableProps = {
    productList: Product[]
};

// 商品一覧の検索結果を表示する
export default function InventoryTable({
    productList,
}: InventoryTableProps) {
    return (
        <div className="table-wrapper">
            <table className="common-table">
                <thead>
                    <tr>
                        <th>棚番</th>
                        <th>商品名</th>
                        <th>仕様</th>
                        <th>現在庫</th>
                        <th>メモ</th>
                    </tr>
                </thead>

                <tbody>
                    {productList.length === 0 ? (
                        <tr>
                            <td
                                colSpan={5}
                                className="text-left p-4"
                            >
                                登録されている商品はありません
                            </td>
                        </tr>
                    ) : (
                        productList.map((product) => (
                            <tr key={product.id}>
                                <td>{product.shelf}</td>
                                <td>{product.productName}</td>
                                <td>{product.inquiry}</td>
                                <td>{product.quantity}</td>
                                <td>{product.memo}</td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}