\i '/docker-entrypoint-initdb.d/tables/tables.sql'
\copy tickers (description, symbol) FROM '/docker-entrypoint-initdb.d/sm_sim.tickers.csv' DELIMITER ',' CSV HEADER;
