const { MongoClient } = require("mongodb");
require("dotenv").config();
const { MONGO_URI, DB_NAME, FINNHUB_KEY } = process.env;

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const batchImport = async () => {
  const client = new MongoClient(MONGO_URI, options);
  let data;
  try {
    await client.connect();
    const database = client.db(DB_NAME);
    const tickers = database.collection("tickers");
    const fetchTickers = await fetch(
      `https://finnhub.io/api/v1/stock/symbol?exchange=US&token=${FINNHUB_KEY}`
    );
    data = await fetchTickers.json();
    if (!data) {
      client.close();
      return;
    }
    const insertTickers = await tickers.insertMany(data);
    if (insertTickers.insertedCount === 0) {
      console.error(insertTickers);
      return;
    }
  } catch (error) {
    console.error(error.message);
  }
  client.close();
};

batchImport();
