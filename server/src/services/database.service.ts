import { MongoClient, Collection, Db } from "mongodb";
import dotenv from "dotenv";

export const collections: {
  users?: Collection;
  tickers?: Collection;
} = {};

export async function connectToDatabase() {
  dotenv.config();

  const client: MongoClient = new MongoClient(process.env.DB_CONN_STRING!);

  await client.connect();

  const db: Db = client.db(process.env.DB_NAME);

  const userCollection: Collection = db.collection("users");

  const tickerCollection: Collection = db.collection("tickers");

  collections.users = userCollection;
  collections.tickers = tickerCollection;
  console.log(`Successfully connected to database: ${db.databaseName}`);
}
