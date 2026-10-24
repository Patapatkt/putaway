"use client"
// 商品入庫画面
import { createProduct } from "@/actions/createProduct";
import { checkProduct } from "@/actions/checkProduct";
import ProductCheckForm from "@/app/components/ProductCheckForm";
import Link from "next/link";
import { useActionState, useState } from "react";
import NewProductRegistrationForm from "@/app/components/NewProductRegistrationForm";
import ExistingProductRestockForm from "@/app/components/ExistingProductRestockForm";
import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod/v4";
import { checkProductSchema, createProductSchema } from "@/app/model/product";

// import ProductQrScanner from "@/components/ProductQrScanner"; //QRコード実装しコメントアウトを解除する
// import NewProductRegistrationForm
//     from "@/components/NewProductRegistrationForm";

type CheckResult =
    Awaited<ReturnType<typeof checkProduct>>;

export default function NewProductPage() {
    const [state, formAction, isPending] = useActionState(
        createProduct,
        null
    );
    // 商品確認に使う入力値を保持する
    const [productName, setProductName] = useState("");
    const [shelf, setShelf] = useState("");
    const [inquiry, setInquiry] = useState("");
    const [checkResult, setCheckResult] =
        useState<CheckResult | null>(null);
    const [isChecking, setIsChecking] = useState(false);
    const [checkError, setCheckError] = useState("");
    const [checkForm, checkFields] = useForm({
        id: "product-check-form",
        // 入力欄からフォーカスが外れたら検証
        shouldValidate: "onBlur",
        // 一度検証した項目は、入力するたびに再検証
        shouldRevalidate: "onInput",
        onValidate({ formData }) {
            return parseWithZod(formData, {
                schema: checkProductSchema,
            });
        },
        onSubmit(event) {
        // ブラウザ標準の送信を止める
        event.preventDefault();

        console.log("商品確認を実行", {
            shelf,
            productName,
            inquiry,
        });

        void handleProductCheck();
    },
    });
    const [newProductForm, newProductFields] = useForm({
        id: "new-product-registration-form",
        // 入力欄からフォーカスが外れたら検証
        shouldValidate: "onBlur",
        // 一度検証した項目は、入力するたびに再検証
        shouldRevalidate: "onInput",
        onValidate({ formData }) {
            return parseWithZod(formData, {
                schema: createProductSchema,
            });
        },
    });
    // 入力内容を変更したら、以前の確認結果を消す
    function resetCheckResult() {
        setCheckResult(null);
        setCheckError("");
    }

    // // QR結果を入力欄へ反映する
    // function handleQrRead(product: ScannedProduct) {
    //     setShelf(product.shelf);
    //     setName(product.name);
    //     setInquiry(product.inquiry);
    //     resetCheckResult();
    // }

    // 棚番・商品名・仕様を確認する
    async function handleProductCheck() {
        setIsChecking(true);
        setCheckError("");
        setCheckResult(null);

        try {
            const result = await checkProduct(
                shelf,
                productName,
                inquiry
            );

            // バックエンドが返した検証エラーを画面へ表示する
            if ("error" in result) {
                setCheckError(result.error ?? "商品の確認に失敗しました。");
                return;
            }

            setCheckResult(result);
        } catch (error) {
            console.error(
                "商品確認エラー:",
                error
            );

            setCheckError(
                error instanceof Error
                    ? error.message
                    : "商品の確認中にエラーが発生しました。"
            );
        } finally {
            setIsChecking(false);
        }

    }
    return (
        <main className="page-container" >
            <h1 className="page-title">
                商品入庫
            </h1>
            <div className="qr-input-area">
                <h2 className="qr-method-title">
                    QRコードを読み取る
                </h2>

                {/* <ProductQrScanner
                    onRead={handleQrRead}
                /> */}

                <p className="qr-form-help">
                    読み取らない場合は、下の入力欄に手動入力
                </p>
            </div>

            <div className="input-method-divider">
                <span>または手入力</span>
            </div>

            <form
                id={checkForm.id}
                onSubmit={checkForm.onSubmit}
                noValidate
            >
                <ProductCheckForm
                    shelf={shelf}
                    setShelf={setShelf}
                    productName={productName}
                    setProductName={setProductName}
                    inquiry={inquiry}
                    setInquiry={setInquiry}
                    resetCheckResult={resetCheckResult}
                    errors={{
                        shelf: checkFields.shelf.errors,
                        productName: checkFields.productName.errors,
                        inquiry: checkFields.inquiry.errors,
                    }}
                />

                <button
                    type="submit"
                    className="button button-success"
                    disabled={isChecking}
                >
                    {isChecking ? "確認中..." : "商品を確認"}
                </button>

            </form>

            <div className="product-actions">

                {checkError && (
                    <p className="error-message">
                        {checkError}
                    </p>
                )}

                {checkResult?.status === "found" && (
                    <ExistingProductRestockForm
                        key={checkResult.product.id}
                        product ={checkResult.product}
                    />
                )}

                {checkResult?.status ===
                    "notFound" && (
                        <NewProductRegistrationForm
                            inputValues={checkResult.inputValues}
                            error={state?.error}
                            errors={{
                                shelf: newProductFields.shelf.errors,
                                productName: newProductFields.productName.errors,
                                inquiry: newProductFields.inquiry.errors,
                                quantity: newProductFields.quantity.errors,
                            }
                            }
                            formId={newProductForm.id}
                            onSubmit={newProductForm.onSubmit}
                            formAction={formAction}
                            isPending={isPending}
                        />
                    )}

                <Link
                    href="/"
                    className={
                        "button button-secondary"
                    }
                >
                    在庫一覧
                </Link>
            </div>
        </main >
    );
}