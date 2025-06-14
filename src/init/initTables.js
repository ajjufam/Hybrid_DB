const fs = require("fs"); // ✅ This line was missing
const path = require("path");
const pool = require("../config/db.config");

const tableDir = path.join(__dirname, "../tableSchemas");

const initTables = async () => {
  try {
    const files = fs.readdirSync(tableDir);

    for (const file of files) {
      const tableName = path.basename(file, ".sql");
      const checkQuery = `
        SELECT EXISTS (
          SELECT 1
          FROM information_schema.tables 
          WHERE table_schema = 'public' AND table_name = $1
        );
      `;

      const checkRes = await pool.query(checkQuery, [tableName]);
      const exists = checkRes.rows[0].exists;

      if (exists) {
        console.log(
          `⚠️ Table "${tableName}" already exists. Skipping creation.`
        );
        continue; // skip executing schema
      }

      const sql = fs.readFileSync(path.join(tableDir, file), "utf-8");
      await pool.query(sql);
      console.log(`✅ Table "${tableName}" created from ${file}`);
    }

    console.log("✅ Table init complete");
  } catch (error) {
    console.error("❌ Error initializing tables:", error.message);
    process.exit(1);
  }
};

module.exports = initTables;
