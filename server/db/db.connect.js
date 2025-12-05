const mongoose = require("mongoose");
require("dotenv").config();

const url = process.env.MONGO_URL;
const initializeDatabase = async () => {
  try {
    const connection = await mongoose.connect(url);
    if (connection) {
      console.log("DB Connection Successful!");
    }
  } catch (error) {
    console.log("DB Connection Failed!", error.message);
    process.exit(1)
  }
};
module.exports = { initializeDatabase };
