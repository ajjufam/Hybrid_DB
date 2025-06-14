const { Pool } = require("pg");
const dotenv = require("dotenv");
dotenv.config();

const dbUri = process.env.DB_URI;
const dbName = dbUri.split("/").pop();

if (!dbName) {
  console.error("❌ Database name not found in DB_URI.");
  process.exit(1);
}

// Connect to 'postgres' default DB to check if target DB exists
const adminPool = new Pool({
  connectionString: dbUri.replace(/\/[^/]+$/, "/postgres"),
});

const initDb = async () => {
  try {
    const result = await adminPool.query(
      `SELECT 1 FROM pg_database WHERE datname = $1`,
      [dbName]
    );

    if (result.rowCount === 0) {
      await adminPool.query(`CREATE DATABASE "${dbName}"`);
      console.log(`✅ Database "${dbName}" created`);
    } else {
      console.log(`✅ Database "${dbName}" already exists`);
    }
  } catch (err) {
    console.error("❌ Error creating DB:", err.message);
    process.exit(1);
  } finally {
    adminPool.end();
  }
};

module.exports = initDb;
