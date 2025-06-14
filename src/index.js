const express = require("express");
const connectMongo = require("./config/mongo");
const orderRoutes = require("./routes/order.routes");

const initDb = require("./init/initDb");
const initTables = require("./init/initTables");

const app = express();
app.use(express.json());
app.use("/api", orderRoutes);

const start = async () => {
  // Step 1: Connect Mongo
  await connectMongo();

  // Step 2: Create DB and Tables if missing
  await initDb();
  await initTables();

  // Step 3: Start Server
  app.listen(3000, () => console.log("🚀 Server running on port 3000"));
};

start();
