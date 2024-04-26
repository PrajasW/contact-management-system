const mongoose = require("mongoose");

const connectDB = async () => {
  return mongoose
    .connect("mongodb+srv://user:userpass@cluster0.6ekge94.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
    .then(() => console.log(`connection to database established...`))
    .catch((err) => console.log(err));
};

module.exports = connectDB;
