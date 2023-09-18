BEGIN TRANSACTION;

CREATE TABLE tickers (
  description TEXT,
  symbol TEXT NOT NULL,
  PRIMARY KEY (symbol)
);

CREATE TABLE transactions (
  id INTEGER PRIMARY KEY,
  user_id VARCHAR(30) NOT NULL,
  symbol VARCHAR(10) NOT NULL,
  price FLOAT NOT NULL,
  quantity INT NOT NULL,
  FOREIGN KEY (user_id)
  REFERENCES users(auth0_id)
);

CREATE TABLE users (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  auth0_id VARCHAR(30) NOT NULL,
  address VARCHAR(80),
  telephone VARCHAR(15),
  name VARCHAR(40),
  nickname VARCHAR(40),
  balance FLOAT NOT NULL,
  created_at TIMESTAMP NOT NULL,
  picture TEXT,
  email VARCHAR(40),
  watch_list TEXT[],
  UNIQUE(auth0_id)
);

COMMIT;
