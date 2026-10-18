type ProductCheckFormProps = {
    shelf: string;
    setShelf: (shelf: string) => void;

    productName: string;
    setProductName: (productName: string) => void;

    inquiry: string;
    setInquiry: (inquiry: string) => void;

    resetCheckResult: () => void;
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
}: ProductCheckFormProps){
    return (

            <div className="product-form">
                <div className="form-group">
                    <label>棚番</label>
                    <input
                        type="text"
                        value={shelf}
                        onChange={(event) => {
                            setShelf(event.target.value);
                            resetCheckResult();
                        }}
                        placeholder="例: A12345"
                        className="form-input"
                        minLength={6}
                        maxLength={6}
                        required
                    />
                    <p>6文字の棚番を半角英数字で入力してください</p>
                </div>

                <div className="form-group">
                    <label>商品名</label>
                    <input
                        type="text"
                        value={productName}
                        onChange={(event) => {
                            setProductName(event.target.value);
                            resetCheckResult();
                        }}
                        placeholder="例: りんご"
                        className="form-input"
                        required
                    />
                    <p>商品名を全角で入力してください</p>
                </div>

                <div className="form-group">
                    <label>商品仕様</label>
                    <input
                        type="text"
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
                    <p>商品仕様を全角で入力してください</p>
                </div>
            </div>
    );
}
