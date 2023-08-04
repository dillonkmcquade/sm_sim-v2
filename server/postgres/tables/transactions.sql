BEGIN TRANSACTION;
CREATE TABLE transactions (
  transaction_id TEXT primary key,
  symbol VARCHAR(10),
  price FLOAT,
  quantity INT
);
COMMIT;
