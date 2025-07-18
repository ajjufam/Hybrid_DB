const { Pool } = require("pg");
const dotenv = require("dotenv");

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DB_URI,
});

module.exports = pool;
