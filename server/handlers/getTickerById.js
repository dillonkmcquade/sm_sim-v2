const { MongoClient } = require("mongodb");
require("dotenv").config();
const { MONGO_URI, DB_NAME } = process.env;

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const getTickerById = async (req, res) => {
  const { id } = req.params;
  const client = new MongoClient(MONGO_URI, options);
  try {
    await client.connect();
    const database = client.db(DB_NAME);
    const tickers = database.collection("tickers");
    const data = await tickers.findOne({ ticker: id });
    if (!data) {
      return res.status(400).json({ status: 400, message: "Ticker not found" });
    }
    res.status(200).json({
      status: 200,
      results: data,
    });
  } catch (error) {
    res.status(500).json({ status: 500, message: "Server error" });
    console.error(error.message);
  }
  client.close();
};

module.exports = { getTickerById };
