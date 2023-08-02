import * as dotenv from "dotenv";
import { Client } from "pg";

const batchImport = async () => {
  dotenv.config();
  const client = new Client({
    host: "localhost",
    port: 5432,
    database: "marketsim",
    user: "postgres",
    password: process.env.POSTGRES_PASSWORD,
  });

  let data;
  try {
    const fetchTickers = await fetch(
      `https://finnhub.io/api/v1/stock/symbol?exchange=US&token=${process.env.FINNHUB_KEY}`,
    );
    data = await fetchTickers.json();
    if (!data) {
      return;
    }
  } catch (err) {
    if (err instanceof Error) {
      console.error(err.message);
    }
  }
};

batchImport();
