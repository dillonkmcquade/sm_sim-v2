\i '/docker-entrypoint-initdb.d/tables/tables.sql'
\copy tickers FROM '/docker-entrypoint-initdb.d/sm_sim.tickers.csv' DELIMITER ',' CSV HEADER;
