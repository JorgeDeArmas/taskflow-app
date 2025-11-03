const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.EXPO_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function getTables() {
  const { data, error } = await supabase.rpc('exec_sql', {
    query: `
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name;
    `
  });
  
  if (error) {
    // Try alternative method
    console.log('Checking tables in schema...\n');
    const tables = ['lists', 'tasks', 'user_settings'];
    for (const table of tables) {
      const { data, error, count } = await supabase
        .from(table)
        .select('*', { count: 'exact', head: true });
      
      if (!error) {
        console.log(`✅ ${table} (${count || 0} rows)`);
      } else {
        console.log(`❌ ${table} - ${error.message}`);
      }
    }
  } else {
    console.log('Tables in database:');
    data.forEach(row => console.log(`  - ${row.table_name}`));
  }
}

getTables().then(() => process.exit(0)).catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});
