const mongoose = require("mongoose");

const connectDB = async () => {
  return mongoose
    .connect("mongodb://localhost:27017/contact-list")
    .then(() => console.log(`connection to database established...`))
    .catch((err) => console.log(err));
};

module.exports = connectDB;
