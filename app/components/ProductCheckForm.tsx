type ProductCheckFormProps = {
    shelf: string;
    setShelf: (shelf: string) => void;

    productName: string;
    setProductName: (productName: string) => void;

    inquiry: string;
    setInquiry: (inquiry: string) => void;

    resetCheckResult: () => void;

    errors: {
        shelf?: string[];
        productName?: string[];
        inquiry?: string[];
    }
};

export default function ProductCheckForm({
    // 引数設定
    shelf,
    setShelf,
    productName,
    setProductName,
    inquiry,
    setInquiry,
    resetCheckResult,
    errors,
}: ProductCheckFormProps) {
    return (

        <div className="product-form">
            <div className="form-group">
                <label>棚番</label>
                <input
                    type="text"
                    name="shelf"
                    value={shelf}
                    onChange={(event) => {
                        setShelf(event.target.value);
                        resetCheckResult();
                    }}
                    placeholder="例: A12345"
                    className="form-input"
                    maxLength={6}
                    required
                />
                {errors.shelf && (
                    <p className="error-message">
                        {errors.shelf.join(" / ")}
                    </p>
                )}
                <p>6文字の棚番を半角英数字で入力してください</p>
            </div>

            <div className="form-group">
                <label>商品名</label>
                <input
                    type="text"
                    name="productName"
                    value={productName}
                    onChange={(event) => {
                        setProductName(event.target.value);
                        resetCheckResult();
                    }}
                    placeholder="例: りんご"
                    className="form-input"
                    required
                />
                {errors.productName && (
                    <p className="error-message">
                        {errors.productName.join(" / ")}
                    </p>
                )}
                <p>商品名を全角で入力してください</p>
            </div>

            <div className="form-group">
                <label>商品仕様</label>
                <input
                    type="text"
                    name="inquiry"
                    value={inquiry}
                    onChange={(event) => {
                        setInquiry(
                            event.target.value
                        );
                        resetCheckResult();
                    }}
                    placeholder="例: 国産品"
                    className="form-input"
                    required
                />
                {errors.inquiry && (
                    <p className="error-message">
                        {errors.inquiry.join(" / ")}
                    </p>
                )}
                <p>商品仕様を全角で入力してください</p>
            </div>
        </div>
    );
}
