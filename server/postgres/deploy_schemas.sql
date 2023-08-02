\i '/docker-entrypoint-initdb.d/tables/users.sql'
\i '/docker-entrypoint-initdb.d/tables/transactions.sql'
\i '/docker-entrypoint-initdb.d/tables/tickers.sql'
\copy tickers FROM '/docker-entrypoint-initdb.d/sm_sim.tickers.csv' DELIMITER ',' CSV HEADER;
