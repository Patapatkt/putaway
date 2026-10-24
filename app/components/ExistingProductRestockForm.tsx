"use client";

// 入庫画面（登録済商品）
import type { checkProduct } from "@/actions/checkProduct";
import { FormEventHandler, useActionState } from "react";
import { restockProduct } from "@/actions/restockProduct";
import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod/v4";
import { restockProductSchema } from "@/app/model/product";

type CheckResult =
    Awaited<ReturnType<typeof checkProduct>>;

type FoundResult = Extract<
    CheckResult,
    { status: "found" }
>;

type Product = FoundResult["product"];

type ExistingProductRestockFormProps = {
    product: Product;
};

export default function ExistingProductRestockForm({
    product,
}: ExistingProductRestockFormProps) {
    const [
        restockState,
        restockAction,
        isRestocking,
    ] = useActionState(restockProduct, null);

    const [restockForm, restockFields] = useForm({
        id: `restock-form-${product.id}`,

        shouldValidate: "onBlur",
        shouldRevalidate: "onInput",

        onValidate({ formData }) {
            return parseWithZod(formData, {
                schema: restockProductSchema,
            });
        },
    });

    return (
        <div className="existing-product-restock">
            <p style={{ color: "green" }}>
                登録済みの商品です。
            </p>

            <p>棚番：{product.shelf}</p>
            <p>商品名：{product.productName}</p>
            <p>商品仕様：{product.inquiry}</p>
            <p>現在庫：{product.quantity}</p>

            {restockState?.error && (
                <p className="error-message">
                    {restockState.error}
                </p>
            )}

            <form
                id={restockForm.id}
                onSubmit={restockForm.onSubmit}
                action={restockAction}
                className="restock-form"
                noValidate
            >
                <input
                    type="hidden"
                    name="productId"
                    value={product.id}
                />

                {restockFields.productId.errors && (
                    <p className="error-message">
                        {restockFields.productId.errors.join(" / ")}
                    </p>
                )}

                <div className="form-group">
                    <label htmlFor="restock-quantity">
                        入庫数量
                    </label>

                    <input
                        id="restock-quantity"
                        type="number"
                        name="quantity"
                        placeholder="入庫数量を入力"
                        className="form-input"
                        min={1}
                        max={Number.MAX_SAFE_INTEGER}
                        step={1}
                        required
                    />

                    {restockFields.quantity.errors && (
                        <p className="error-message">
                            {restockFields.quantity.errors.join(" / ")}
                        </p>
                    )}

                    <p>1以上の整数を入力してください</p>
                </div>

                <button
                    type="submit"
                    className="button button-success"
                    disabled={isRestocking}
                >
                    {isRestocking ? "入庫中..." : "入庫する"}
                </button>
            </form>
        </div>
    );
}