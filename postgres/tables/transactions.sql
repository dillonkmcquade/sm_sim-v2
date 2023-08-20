BEGIN TRANSACTION;
CREATE TABLE transactions (
  transaction_id TEXT,
  symbol VARCHAR(10),
  price FLOAT,
  quantity INT
);
COMMIT;
