const { MongoClient } = require("mongodb");
require("dotenv").config();
const { MONGO_URI, DB_NAME } = process.env;

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const deleteUser = async (req, res) => {
  const { _id } = req.body;
  const client = new MongoClient(MONGO_URI, options);
  if (!_id) {
    return res.status(400).json({ status: 400, message: "Missing client ID" });
  }

  try {
    await client.connect();
    const database = client.db(DB_NAME);
    const users = database.collection("users");

    const update = await users.updateOne(
      { _id },
      { $set: { isActive: false } }
    );
    if (update.matchedCount === 0 || update.modifiedCount === 0) {
      return res.status(404).json({
        status: 404,
        message: "Invalid data given",
      });
    }

    return res.status(204);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ status: 500, message: "Server error" });
  } finally {
    client.close();
  }
};

module.exports = { deleteUser };
