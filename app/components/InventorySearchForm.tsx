// 検索のコンポーネント

// 親ページから受け取るpropsの型
type InventorySearchFormProps = {

    shelf?: string | string[];
    productName?: string | string[];
    inquiry?: string | string[];

};
// inventorySearchFormコンポーネントを定義
export default async function InventorySearchForm({
    shelf,
    productName,
    inquiry,
}: InventorySearchFormProps) {

    return (
        <form
            action="/"
            method="get" //入力内容をURLの検索条件として送る
            noValidate
            className="searcharea"
        >
            <div className="search-field">
                <label>
                    棚番
                </label>
                <input
                    type="text"
                    name="shelf"
                    placeholder="例:A1"
                    maxLength={6}
                    className="search-input"
                    defaultValue={shelf}
                />
                <p className="form-help">
                    半角英数字6文字以内・前方一致
                </p>
            </div>

            <div className="search-field">
                <label>
                    商品名
                </label>
                <input
                    type="text"
                    name="productName"
                    placeholder="例:りんご"
                    defaultValue={productName}
                    className="search-input"
                />
                <p className="form-help">
                    商品名の一部を入力・前方一致
                </p>
            </div>

            <div className="search-field">
                <label>
                    仕様
                </label>
                <input
                    type="text"
                    name="inquiry"
                    placeholder="例:国産"
                    defaultValue={inquiry}
                    className="search-input"
                />
                <p className="form-help">
                    仕様の一部を入力・前方一致
                </p>
            </div>

            <button type="submit"
                className="button button-success search-button"
            >
                検索
            </button>
        </form>
    );
}