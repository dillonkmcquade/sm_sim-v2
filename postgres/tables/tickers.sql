BEGIN TRANSACTION;
CREATE TABLE tickers (
  description TEXT,
  symbol VARCHAR(10)
);
COMMIT;
