const { createClient } = require("@supabase/supabase-js");
const fs = require("fs");
require("dotenv").config();

const supabase = createClient(
  process.env.EXPO_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function createTables() {
  console.log("🚀 Creating TaskFlow database tables...\n");

  const sql = fs.readFileSync("./create-tables.sql", "utf8");

  // Split by semicolons and execute each statement
  const statements = sql
    .split(";")
    .map((s) => s.trim())
    .filter((s) => s.length > 0 && !s.startsWith("--"));

  for (let i = 0; i < statements.length; i++) {
    const statement = statements[i];
    if (statement.length < 10) continue;

    console.log(`Executing statement ${i + 1}/${statements.length}...`);

    try {
      const { data, error } = await supabase.rpc("exec_sql", {
        query: statement + ";",
      });

      if (error) {
        // RPC might not exist, try REST API
        console.log("⚠️  exec_sql RPC not available");
        console.log("Please run the SQL manually in Supabase Dashboard");
        console.log(
          "\n📍 Go to: https://supabase.com/dashboard/project/skvpumtrpbkoozdeboic/sql"
        );
        console.log("\nCopy and paste the contents of create-tables.sql\n");
        return;
      }

      console.log("✅ Success");
    } catch (err) {
      console.error("❌ Error:", err.message);
    }
  }

  console.log("\n✅ Database setup complete!");
}

createTables().catch((err) => {
  console.error("Error:", err.message);
  console.log("\n📍 Manual Setup Required:");
  console.log(
    "1. Go to: https://supabase.com/dashboard/project/skvpumtrpbkoozdeboic/sql"
  );
  console.log("2. Copy and paste the contents of create-tables.sql");
  console.log('3. Click "Run" to create all tables');
  process.exit(1);
});
