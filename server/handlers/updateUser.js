const { MongoClient } = require("mongodb");
//require("dotenv").config();
const { MONGO_URI, DB_NAME } = process.env;

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const updateUser = async (req, res) => {
  const { _id } = req.params;
  const client = new MongoClient(MONGO_URI, options);
  if (!_id) {
    return res.status(400).json({ status: 400, message: "Missing client ID" });
  }
  if (Object.keys(req.body).length === 0) {
    return res.status(400).json({
      status: 400,
      message: "No update paramaters given.",
      data: req.body,
    });
  }

  try {
    await client.connect();
    const database = client.db(DB_NAME);
    const users = database.collection("users");

    const update = await users.updateOne({ _id }, { $set: req.body });
    if (update.matchedCount === 0 || update.modifiedCount === 0) {
      return res.status(404).json({
        status: 404,
        message: "Invalid data given. Check variable names in request body",
      });
    }

    const newUser = await users.findOne({ _id });

    return res.status(200).json({
      status: 200,
      message: "User updated successfully.",
      data: newUser,
    });
  } catch (error) {
    res.status(500).json({ status: 500, message: "Server error" });
  } finally {
    client.close();
  }
};

module.exports = { updateUser };
