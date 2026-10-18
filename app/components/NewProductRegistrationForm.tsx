// 新規商品、入庫時のコンポーネント
type ProductInputValues = {
    shelf: string;
    productName: string;
    inquiry: string;
}

type NewProductRegistrationFormProps = {
    inputValues: ProductInputValues;
    error?: string;
    formAction: (formData: FormData) => void;
    isPending: boolean;
};

export default function NewProductRegistrationForm({
    inputValues,
    error,
    formAction,
    isPending,
}: NewProductRegistrationFormProps) {
    return (
        <>
            <p style={{ color: "blue" }}>
                一致する商品は未登録です。<br />
                入力内容を確認し新商品なら
                初回入庫数量と<br />
                必要に応じてメモを入力してください。
            </p>

            <p>棚番：{inputValues.shelf}</p>
            <p> 商品名： {inputValues.productName}</p>
            <p>
                商品仕様：
                {inputValues.inquiry}
            </p>

            {error && (
                <p className="error-message">
                    {error}
                </p>
            )}

            <form
                action={formAction}
                className="form-action"
            >
                <input
                    type="hidden"
                    name="shelf"
                    value={inputValues.shelf}
                />

                <input
                    type="hidden"
                    name="productName"
                    value={inputValues.productName}
                />

                <input
                    type="hidden"
                    name="inquiry"
                    value={inputValues.inquiry}
                />

                <div className="form-group">
                    <label>
                        初回入庫数量
                    </label>
                    <input
                        type="number"
                        name="quantity"
                        className="form-input"
                        min={1}
                        step={1}
                        required
                    />
                </div>

                <label htmlFor="new-product-memo">
                    メモ（任意）
                </label>
                <textarea
                    id="new-product-memo"
                    name="memo"
                    className="form-input"
                    placeholder="例：練習用"
                />

                <button
                    type="submit"
                    className={
                        "button button-success"
                    }
                    disabled={isPending}
                >
                    {isPending
                        ? "入庫中..."
                        : "新商品を登録して入庫"}
                </button>
            </form>
        </>
    )
}