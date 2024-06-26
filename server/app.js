require("dotenv").config({ path: "./config/config.env" });
const express = require("express");

const connectDB = require("./config/db");

const auth = require("./middlewares/auth");

const app = express();

app.use(express.json());
app.use(require("cors")());

app.use("/api", require("./routes/auth"));
app.use("/api", require("./routes/contact"));

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  connectDB();
  console.log(`server listening on port: ${PORT}`);
});
