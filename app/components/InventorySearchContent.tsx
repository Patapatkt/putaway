import { getProducts } from "@/lib/getProducts";
import InventorySearchForm from "./InventorySearchForm";
import InventoryTable from "./InventoryTable";

// URLから受け取る検索条件の型
type HomeParams = {
    searchParams: Promise<{
        shelf?: string | string[];
        productName?: string | string[];
        inquiry?: string | string[];
    }>;
}

export default async function InventorySearchContent({ searchParams }: HomeParams) {
    // URLから検索条件を受け取る
    const params = await searchParams;
    // 一つの文字列として受け取り、未指定の場合は空文字にする
    const shelf = typeof params.shelf === "string" ? params.shelf : "";
    const productName =
        typeof params.productName === "string" ? params.productName : "";
    const inquiry =
        typeof params.inquiry === "string" ? params.inquiry : "";

    // 検索条件を渡して、商品一覧と検証エラーを受け取る
    const { productList, error } = await getProducts({
        shelf,
        productName,
        inquiry,
    });

    return (
        <>
            {
                error ? (
                    <p className="form-error">{error}</p>
                ) : (
                    <InventoryTable productList={productList} />
                )
            }
        </>
    );
}