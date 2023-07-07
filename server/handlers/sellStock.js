const { MongoClient } = require("mongodb");
require("dotenv").config();
const { MONGO_URI, DB_NAME } = process.env;

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const sellStock = async (req, res) => {
  const { id } = req.params;
  const { _id, quantity, currentPrice } = req.body;
  const client = new MongoClient(MONGO_URI, options);
  if (!id || !currentPrice || !_id || !id) {
    return res.status(400).json({
      status: 400,
      data: req.body,
      params: id,
      message: "missing data",
    });
  }
  try {
    await client.connect();
    const database = client.db(DB_NAME);
    const users = database.collection("users");
    const user = await users.findOne({ _id });
    if (!user) {
      return res.status(404).json({ status: 200, message: "user not found" });
    }

    const newTransaction = {
      ticker: id,
      quantity: -quantity,
      price: currentPrice,
    };
    const amountToSubtract = Number(currentPrice) * quantity;
    const update = await users.updateOne(
      { _id },
      {
        $inc: { balance: amountToSubtract },
        $push: { holdings: newTransaction },
      }
    );

    if (update.matchedCount === 0 || update.modifiedCount === 0) {
      return res
        .status(400)
        .json({ status: 400, message: "Could not update user holdings" });
    }
    return res.status(200).json({
      status: 200,
      message: "Stock successfully sold",
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ status: 500, message: "Server error" });
  } finally {
    client.close();
  }
};

module.exports = { sellStock };
