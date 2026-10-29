// 検索のコンポーネント
"use client";

import { useState } from "react";

// 親ページから受け取るpropsの型
type InventorySearchFormProps = {

    shelf?: string | string[];
    productName?: string | string[];
    inquiry?: string | string[];

};
// inventorySearchFormコンポーネントを定義
export default function InventorySearchForm({//⇐この行のasyncを削除
    shelf,
    productName,
    inquiry,
}: InventorySearchFormProps) {
    // スマホ専用、アコーディオンメニューの設定(スマホ表示は基本的に閉じた状態)
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    return (

        <form
            action="/"
            method="get" //入力内容をURLの検索条件として送る
            noValidate //検証結果がエラーでもボタンが押せる
            className="searcharea max-[480px]:flex-col max-[480px]:items-stretch"
        >

            <button
                type="button"
                onClick={() => {
                    setIsSearchOpen((prev) => !prev);//ボタンを押すたびにprev(更新前と反転させる)
                }}
                aria-controls="inventory-search-fields"
                aria-expanded={isSearchOpen}
                className="hidden max-[480px]:block"
            >
                {isSearchOpen ? "検索条件を閉じる" : "検索条件を開く"}
            </button>
            {/* 以下をスマホ表示480px以下の場合はアコーディオンメニューで表示 */}
            <div
                id="inventory-search-fields"
                className={`flex flex-col ${isSearchOpen ? "" : "max-[480px]:hidden"
                    }`}
            >
                <div className="search-field grid w-full min-w-0 grid-cols-[80px_minmax(0,1fr)_minmax(0,1fr)] items-center gap-x-4 gap-y-2 border-b border-slate-200 py-3.5 max-[480px]:grid-cols-[2rem_minmax(0,1fr)] max-[480px]:gap-x-0">
                    <label
                        htmlFor="shelf"
                        className="max-[480px]:w-auto max-[480px]:min-w-0 max-[480px]:m-0 max-[480px]:p-0"
                    >
                        <span className="max-[480px]:sr-only">棚番</span>
                        <span className="hidden max-[480px]:inline max-[480px]:text-2xl" aria-hidden="true">
                            🗺️
                        </span>
                    </label>
                    <input
                        id="shelf"
                        type="text"
                        name="shelf"
                        placeholder="例:A1"
                        maxLength={6}
                        className="search-input max-[480px]:min-w-0 max-[480px]:w-full"
                        defaultValue={shelf}
                    />
                    <p className="form-help max-[480px]:col-start-2">
                        半角英数字6文字以内・前方一致
                    </p>
                </div>

                <div className="search-field grid w-full min-w-0 grid-cols-[80px_minmax(0,1fr)_minmax(0,1fr)] items-center gap-x-4 gap-y-2 border-b border-slate-200 py-3.5 max-[480px]:grid-cols-[2rem_minmax(0,1fr)] max-[480px]:gap-x-0">
                    <label htmlFor="productName">
                        <span className="max-[480px]:sr-only">商品名</span>
                        <span className="hidden max-[480px]:inline max-[480px]:text-2xl" aria-hidden="true">
                            🍎
                        </span>
                    </label>
                    <input
                        id="productName"
                        type="text"
                        name="productName"
                        placeholder="例:りんご"
                        defaultValue={productName}
                        className="search-input max-[480px]:min-w-0 max-[480px]:w-full"
                    />
                    <p className="form-help max-[480px]:col-start-2">
                        商品名の一部を入力・前方一致
                    </p>
                </div>

                <div className="search-field grid w-full min-w-0 grid-cols-[80px_minmax(0,1fr)_minmax(0,1fr)] items-center gap-x-4 gap-y-2 border-b border-slate-200 py-3.5 max-[480px]:grid-cols-[2rem_minmax(0,1fr)] max-[480px]:gap-x-0">
                    <label htmlFor="inquiry">
                        <span className="max-[480px]:sr-only">仕様</span>
                        <span
                            className="hidden max-[480px]:inline max-[480px]:text-2xl"
                            aria-hidden="true"
                        >
                            📋
                        </span>
                    </label>
                    <input
                        id="inquiry"
                        type="text"
                        name="inquiry"
                        placeholder="例:国産"
                        defaultValue={inquiry}
                        className="search-input max-[480px]:min-w-0 max-[480px]:w-full"
                    />
                    <p className="form-help max-[480px]:col-start-2">
                        仕様の一部を入力・前方一致
                    </p>
                </div>

                <button type="submit"
                    className="button button-success search-button"
                >
                    <span className="max-[480px]:sr-only">検索</span>
                    <span className="hidden max-[480px]:inline max-[480px]:text-2xl" aria-hidden="true">
                        検索🔍
                    </span>
                </button>
            </div>
        </form>
    );
}