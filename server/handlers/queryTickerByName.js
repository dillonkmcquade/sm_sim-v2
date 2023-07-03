const { MongoClient } = require("mongodb");
require("dotenv").config();
const { MONGO_URI, DB_NAME } = process.env;

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const queryTickerByName = async (req, res) => {
  const { name } = req.query;
  const client = new MongoClient(MONGO_URI, options);
  if (!name) {
    return res
      .status(400)
      .json({ status: 400, message: "No query string given" });
  }
  try {
    await client.connect();
    const database = client.db(DB_NAME);
    const tickers = database.collection("tickers");
    const agg = [
      {
        $search: {
          index: "ticker-names",
          autocomplete: {
            query: name,
            path: "name",
          },
        },
      },
      { $limit: 10 },
      { $project: { ticker: 1, name: 1 } },
    ];
    const data = await tickers.aggregate(agg).toArray();
    if (data.length === 0) {
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

module.exports = { queryTickerByName };
