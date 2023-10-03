FROM postgres:15.4

ADD /tables/ /docker-entrypoint-initdb.d/tables/
COPY sm_sim.tickers.csv /docker-entrypoint-initdb.d/
ADD deploy_schemas.sql /docker-entrypoint-initdb.d/
