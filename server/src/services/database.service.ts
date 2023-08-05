import { Pool } from "pg";
import dotenv from "dotenv";

export let pool: Pool;
export async function connectToDatabase() {
  dotenv.config();

  const client = new Pool({
    host: process.env.POSTGRES_HOST,
    port: 5432,
    database: "marketsim",
    user: "postgres",
    password: process.env.POSTGRES_PASSWORD,
  });

  await client.connect();
  client.on("error", (err) => {
    console.log(err);
  });
  pool = client;

  console.log(`Successfully connected to database: marketsim`);
}
