// 検索のコンポーネント
"use client";

import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod/v4";
import { InventorySearchSchema } from "../model/product";

// 親ページから受け取るpropsの型
type InventorySearchFormProps = {
    action: string;
    productName?: string;
    shelf?: string;
    inquiry?: string;
};
// inventorySearchFormコンポーネントを定義
export default function InventorySearchForm({
    action,
    productName = "",
    shelf = "",
    inquiry = "",
}: InventorySearchFormProps) {

    const [searchForm, searchFormFields] = useForm({
        defaultValue: {
            productName,
            shelf,
            inquiry,
        },

        shouldValidate: "onBlur",
        shouldRevalidate: "onInput",

        onValidate({ formData }) {
            return parseWithZod(formData, {
                schema: InventorySearchSchema,
                disableAutoCoercion: true,
            });
        },
    })

    return (
        <form
            id={searchForm.id}
            onSubmit={searchForm.onSubmit}
            action={action}
            method="get" //入力内容をURLの検索条件として送る
            noValidate
            className="searcharea"
        >
            <div className="search-field">
                <label htmlFor={searchFormFields.shelf.id}>
                    棚番
                </label>
                <input
                    id={searchFormFields.shelf.id}
                    type="text"
                    name={searchFormFields.shelf.name}
                    defaultValue={searchFormFields.shelf.initialValue}
                    placeholder="例:A1"
                    maxLength={6}
                    className="search-input"
                />
                <p className="form-help">
                    半角英数字6文字以内・前方一致
                </p>
                <p className="form-error">
                    {searchFormFields.shelf.errors}
                </p>
            </div>

            <div className="search-field">
                <label htmlFor={searchFormFields.productName.id}>
                    商品名
                </label>
                <input
                    id={searchFormFields.productName.id}
                    type="text"
                    name={searchFormFields.productName.name}
                    placeholder="例:りんご"
                    defaultValue={searchFormFields.productName.initialValue}
                    className="search-input"
                />
                <p className="form-help">
                    商品名の一部を入力・前方一致
                </p>
                <p className="form-error">
                    {searchFormFields.productName.errors}
                </p>
            </div>

            <div className="search-field">
                <label htmlFor={searchFormFields.productName.id}>
                    仕様
                </label>
                <input
                    id={searchFormFields.inquiry.id}
                    type="text"
                    name={searchFormFields.inquiry.name}
                    placeholder="例:国産"
                    defaultValue={searchFormFields.inquiry.initialValue}
                    className="search-input"
                />
                <p className="form-help">
                    仕様の一部を入力・前方一致
                </p>
                <p className="form-error">
                    {searchFormFields.inquiry.errors}
                </p>
            </div>

            {/* 全項目が空欄の場合など、フォーム全体のエラー */}
            <p className="form-error">
                {searchForm.errors}
            </p>


            <button type="submit"
                className="button button-success search-button"
            >
                検索
            </button>
        </form>
    );
}