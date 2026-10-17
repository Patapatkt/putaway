### sqlite操作方法

### SQLファイルを保存しただけでは、DBへの実行はされない

### ファイルの開き方(ターミナルに入力)
### practice.db部分を指定の名前に変える
& "$env:USERPROFILE\tools\sqlite\sqlite3.exe" practice.db 

SELECT 1;
SELECT はデータを取得する命令です。今回は動作確認として、数字の 1 を取得
最後の **;（セミコロン）**まで入力

### 例:テーブル作成方法
```sql
    CREATE TABLE products (
    id INTEGER PRIMARY KEY,
    productName TEXT NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 0 CHECK (quantity >= 0),
    shelf TEXT NOT NULL,
    inquiry TEXT NOT NULL,
    memo TEXT NOT NULL DEFAULT ''
);
```
|指定|意味|
|---|---|
|id INTEGER PRIMARY KEY|商品を識別する整数のID|
|TEXT|文字列|
|INTEGER|整数|
|NOT NULL|NULL（値がない状態）を禁止|
|DEFAULT 0|省略した場合は 0|
|CHECK (quantity >= 0)|数量がマイナスになることを禁止|
|DEFAULT ''	|省略した場合は空文字|
id は、同じ商品名のデータでも区別できるように追加しています。NOT NULL は空文字までは禁止しない

### 命令文
| 命令 | 役割 |
|---|---|
| .tables | テーブル一覧を表示 |
| .schema products | productsの定義を表示 |
| .quit | SQLiteを終了 |

### 登録方法
```
INSERT INTO products (
    productName,
    quantity,
    shelf,
    inquiry,
    memo
)
VALUES (
    '練習用ボルト',
    10,
    '000001',
    '通常品',
    'SQL練習用の架空データ'
);
```

### 全ての列の確認方法

SELECT * FROM products;
`*` は **「すべての列」**

### 行の削除方法
DELETE FROM products WHERE id = 2;

### 数量の変更方法
UPDATE products
SET quantity = 15
WHERE id = 1;

### 基本操作
| SQL | 役割 |
|---|---|
|INSERT INTO|追加|
|SELECT|取得|
|UPDATE|更新|
|DELETE|削除|