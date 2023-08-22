import { Pool } from "pg";
import "dotenv/config";

export const pool = new Pool({
  host: process.env.POSTGRES_HOST,
  port: 5432,
  database: "marketsim",
  user: "postgres",
  password: process.env.POSTGRES_PASSWORD,
});

export async function connectToDatabase() {
  await pool.connect();
  pool.on("error", (err) => {
    console.log(err);
  });

  console.log(`Successfully connected to database: marketsim`);
}
