const { MongoClient } = require("mongodb");
require("dotenv").config();
const { MONGO_URI, DB_NAME } = process.env;

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const getUser = async (req, res) => {
  const { _id } = req.params;
  const client = new MongoClient(MONGO_URI, options);
  if (!_id) {
    return res
      .status(400)
      .json({ status: 400, message: "No query string given" });
  }
  try {
    await client.connect();
    const database = client.db(DB_NAME);
    const users = database.collection("users");
    const user = await users.findOne({ _id });
    if (!user) {
      return res.status(404).json({ status: 404, message: "User not found" });
    }
    return res.status(200).json({
      status: 201,
      data: user,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ status: 500, message: "Server error" });
  } finally {
    client.close();
  }
};

module.exports = { getUser };
