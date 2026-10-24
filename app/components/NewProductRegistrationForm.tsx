import React from "react";
import type { FormEvent, FormEventHandler } from "react";
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

    formId: string;
    onSubmit: FormEventHandler<HTMLFormElement>;

    errors: {
        shelf?: string[];
        productName?: string[];
        inquiry?: string[];
        quantity?: string[];
    }
};

export default function NewProductRegistrationForm({
    inputValues,
    error,
    errors,
    formAction,
    isPending,
    formId,
    onSubmit,
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
            {/* 登録処理全体のエラー */}
            {error && (
                <p className="error-message">
                    {error}
                </p>
            )}

            <form
                id={formId}
                onSubmit={onSubmit}
                action={formAction}
                className="form-action"
                noValidate
            >
                <input
                    type="hidden"
                    name="shelf"
                    value={inputValues.shelf}
                />
                {errors.shelf && (
                    <p className="error-message">
                        {errors.shelf.join("/")}
                    </p>
                )}

                <input
                    type="hidden"
                    name="productName"
                    value={inputValues.productName}
                />
                {errors.productName && (
                    <p className="error-message">
                        {errors.productName.join("/")}
                    </p>
                )}

                <input
                    type="hidden"
                    name="inquiry"
                    value={inputValues.inquiry}
                />
                {errors.inquiry && (
                    <p className="error-message">
                        {errors.inquiry?.join("/")}
                    </p>
                )}

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
                    {errors.quantity && (
                        <p className="error-message">
                            {errors.quantity.join("/")}
                        </p>
                    )}
                    <p>入庫数量は１以上を入力してください</p>
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