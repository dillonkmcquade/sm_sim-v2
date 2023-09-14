BEGIN TRANSACTION;
CREATE TABLE tickers (
  description TEXT,
  symbol TEXT NOT NULL,
  PRIMARY KEY (symbol)
);
COMMIT;
