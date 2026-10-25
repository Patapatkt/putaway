① productList：親から受け取る商品データ
type InventoryTableProps = {
    productList: Product[];
};

Product[] は「商品データの配列」です。親ページから、表示したい商品一覧を受け取ります。

② columns：どの項目を、どの見出しで表示するか
{
    accessorKey: "shelf",
    header: "棚番",
},

これは「商品の shelf の値を、見出し『棚番』の列に表示する」という指定です。

③ useReactTable：データと列の定義を組み合わせる
const table = useReactTable({
    data: productList,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getRowId: (product) => String(product.id),
});