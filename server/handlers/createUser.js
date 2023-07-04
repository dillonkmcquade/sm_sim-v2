const { MongoClient } = require("mongodb");
require("dotenv").config();
const { MONGO_URI, DB_NAME } = process.env;

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const createUser = async (req, res) => {
  const { user } = req.body;
  const client = new MongoClient(MONGO_URI, options);
  if (!user) {
    return res
      .status(400)
      .json({ status: 400, message: "No query string given" });
  }
  try {
    await client.connect();
    const database = client.db(DB_NAME);
    const users = database.collection("users");
    const duplicate = await users.findOne({ _id: user.sub });
    if (duplicate) {
      res.status(200).json({ status: 200, message: "User exists" });
    }
    await users.insertOne({
      _id: user.sub,
      balance: 1000000,
      holdings: [],
      ...user,
    });
    return res.status(201).json({
      status: 201,
      message: "User created",
      data: user,
    });
  } catch (error) {
    res.status(500).json({ status: 500, message: "Server error" });
    console.error(error.message);
  } finally {
    client.close();
  }
};

module.exports = { createUser };
