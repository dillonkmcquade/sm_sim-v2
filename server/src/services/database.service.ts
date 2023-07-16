import * as mongoDB from "mongodb";
import * as dotenv from "dotenv";

export const collections: {
  users?: mongoDB.Collection;
  tickers?: mongoDB.Collection;
} = {};

export async function connectToDatabase() {
  dotenv.config();

  const client: mongoDB.MongoClient = new mongoDB.MongoClient(
    process.env.DB_CONN_STRING
  );

  try {
    await client.connect();

    const db: mongoDB.Db = client.db(process.env.DB_NAME);

    const userCollection: mongoDB.Collection = db.collection("users");

    const tickerCollection: mongoDB.Collection = db.collection("tickers");

    collections.users = userCollection;
    collections.tickers = tickerCollection;
    console.log(`Successfully connected to database: ${db.databaseName}`);
  } catch (error) {
    console.error(error);
    client.close();
  }
}
