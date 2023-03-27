const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
dotenv.config();
const app = express();
const userRoutes = require("./user.routes");
app.use(express.json());
app.use("/api/v1/user", userRoutes);

const uri = `mongodb+srv://${process.env.mongoose_user}:${process.env.mongoose_pass}@practice.mfua1va.mongodb.net/codinova-db`;
const conn = mongoose.connect(uri);

app.get("/", async (req, res) => {
  try {
    res.status(200).send({ message: "welcome to apis" });
  } catch (error) {
    console.log("error", error);
    res.status(202).send({ message: "We will catch you soon" });
  }
});

app.listen(8080, () => {
  console.log("backend is running on ", `http://localhost:${8080}`);
  console.log("database connection established");
});

module.exports = { conn };
