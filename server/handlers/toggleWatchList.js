const { MongoClient } = require("mongodb");
//require("dotenv").config();
const { MONGO_URI, DB_NAME } = process.env;

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const toggleWatchList = async (req, res) => {
  const { _id, ticker, isWatched } = req.body;
  const client = new MongoClient(MONGO_URI, options);
  if (!ticker || !_id || isWatched === undefined) {
    return res.status(400).json({
      status: 400,
      data: req.body,
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
    let update;
    if (
      (isWatched && user.watchList.includes(ticker)) ||
      (!isWatched && !user.watchList.includes(ticker))
    ) {
      //do nothing
      return res.status(204);
    } else if (isWatched && !user.watchList.includes(ticker)) {
      //Add
      update = await users.updateOne({ _id }, { $push: { watchList: ticker } });
    } else if (!isWatched && user.watchList.includes(ticker)) {
      //Remove
      update = await users.updateOne({ _id }, { $pull: { watchList: ticker } });
    }

    if (update.matchedCount === 0 || update.modifiedCount === 0) {
      return res
        .status(400)
        .json({ status: 400, message: "Could not update user watch list" });
    }
    const { watchList } = await users.findOne({ _id });
    return res.status(200).json({
      status: 200,
      message: "Watch list updated successfully",
      data: watchList,
    });
  } catch (error) {
    res.status(500).json({ status: 500, message: "Server error" });
  } finally {
    client.close();
  }
};

module.exports = { toggleWatchList };
