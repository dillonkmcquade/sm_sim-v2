import { MongoClient, Collection, Db } from "mongodb";
import dotenv from "dotenv";
import { User } from "../types";

export const collections: {
  users?: Collection<User>;
  tickers?: Collection;
} = {};

export async function connectToDatabase() {
  dotenv.config();

  //Mongo client url cannot be undefined, check before using
  let DB_STRING: string;
  if (process.env.DB_CONN_STRING) {
    DB_STRING = process.env.DB_CONN_STRING;
  } else {
    throw new Error("DB_CONN_STRING does not exist");
  }

  const client: MongoClient = new MongoClient(DB_STRING);

  await client.connect();

  const db: Db = client.db(process.env.DB_NAME);

  const userCollection: Collection<User> = db.collection("users");

  const tickerCollection: Collection = db.collection("tickers");

  collections.users = userCollection;
  collections.tickers = tickerCollection;
  console.log(`Successfully connected to database: ${db.databaseName}`);
}
