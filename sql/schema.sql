CREATE TABLE products (
    id INTEGER PRIMARY KEY,
    productName TEXT NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 0 CHECK (quantity >= 0),
    shelf TEXT NOT NULL,
    inquiry TEXT NOT NULL,
    memo TEXT NOT NULL DEFAULT ''
);