const { MongoClient } = require("mongodb");
require("dotenv").config();
const { MONGO_URI, DB_NAME, POLYGON_KEY } = process.env;

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const batchImport = async (url) => {
  const client = new MongoClient(MONGO_URI, options);
  let data;
  try {
    await client.connect();
    const database = client.db(DB_NAME);
    const tickers = database.collection("tickers");
    const fetchTickers = await fetch(url);
    data = await fetchTickers.json();
    if (!data.results) {
      client.close();
      return;
    }
    const insertTickers = await tickers.insertMany(data.results);
    if (insertTickers.insertedCount === 0) {
      console.error(insertTickers);
      return;
    }
    console.log(data.next_url);
  } catch (error) {
    console.error(error.message);
  }
  client.close();
  if (data.next_url) {
    return batchImport(data.next_url + `&apiKey=${POLYGON_KEY}`);
  }
};

batchImport(
  `https://api.polygon.io/v3/reference/tickers?cursor=YWN0aXZlPXRydWUmYXA9RlRBSU8lN0M3OThjYTg5YjUzYzQ2Y2Q5NjUyNDFhNWQzNDYwYTE2NWUxZTQ3ZDYwOWYwOTY4ZDJhN2M4YzU1MTNiODdjMWZjJmFzPSZkYXRlPTIwMjMtMDYtMTUmbGltaXQ9MTAwMCZvcmRlcj1hc2Mmc29ydD10aWNrZXI&apiKey=${POLYGON_KEY}`
);
