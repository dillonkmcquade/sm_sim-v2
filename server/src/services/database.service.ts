import { Pool } from "pg";
import dotenv from "dotenv";

export let db: Pool;
export async function connectToDatabase() {
  dotenv.config();

  const client = new Pool({
    host: "127.0.0.1",
    port: 5432,
    database: "marketsim",
    user: "postgres",
    password: process.env.POSTGRES_PASSWORD,
  });

  await client.connect();
  db = client;

  console.log(`Successfully connected to database: marketsim`);
}
