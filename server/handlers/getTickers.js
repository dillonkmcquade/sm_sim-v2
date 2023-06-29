const { MongoClient } = require("mongodb");
require("dotenv").config();
const { MONGO_URI, DB_NAME } = process.env;

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};
const cache = {};
const getTickers = async (_req, res) => {
  const client = new MongoClient(MONGO_URI, options);
  try {
    await client.connect();
    const database = client.db(DB_NAME);
    const tickers = database.collection("tickers");
    const data = await tickers.find({ currency_name: "usd" }).toArray();
    const firstHundredItems = data.slice(0, 100);
    res.status(200).json({
      status: 200,
      count: firstHundredItems.length,
      results: firstHundredItems,
    });
  } catch (error) {
    console.error(error.message);
  }
  client.close();
};

module.exports = { getTickers };
