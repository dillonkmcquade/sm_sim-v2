BEGIN TRANSACTION;
CREATE TABLE users (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  auth0_id VARCHAR(30) NOT NULL,
  address VARCHAR(80),
  telephone VARCHAR(15),
  name VARCHAR(40),
  nickname VARCHAR(40),
  balance INTEGER,
  created_at TIMESTAMP,
  picture VARCHAR(100),
  email VARCHAR(40),
  watch_list TEXT[],
  transaction_id VARCHAR(80)
);
COMMIT;
