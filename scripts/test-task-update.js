const { createClient } = require("@supabase/supabase-js");
require("dotenv").config();

const supabase = createClient(
  process.env.EXPO_PUBLIC_SUPABASE_URL,
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY
);

async function testTaskUpdate() {
  console.log("Testing task update performance...\n");

  // First, get a task
  const { data: tasks, error: fetchError } = await supabase
    .from("tasks")
    .select("*")
    .limit(1);

  if (fetchError) {
    console.error("Error fetching task:", fetchError);
    return;
  }

  if (!tasks || tasks.length === 0) {
    console.log("No tasks found to test with");
    return;
  }

  const task = tasks[0];
  console.log("Testing with task:", task.id, task.title);
  console.log("Current state:", { is_completed: task.is_completed });

  // Time the update
  const startTime = Date.now();
  const { error: updateError } = await supabase
    .from("tasks")
    .update({
      is_completed: !task.is_completed,
      completed_at: !task.is_completed ? new Date().toISOString() : null,
    })
    .eq("id", task.id);

  const endTime = Date.now();
  const duration = endTime - startTime;

  if (updateError) {
    console.error("Error updating task:", updateError);
    return;
  }

  console.log(`\n✅ Update completed in ${duration}ms`);

  if (duration > 1000) {
    console.log("⚠️  Warning: Update took longer than 1 second!");
    console.log("This could indicate:");
    console.log("  - Network latency");
    console.log("  - Slow RLS policies");
    console.log("  - Database triggers taking too long");
  } else if (duration > 500) {
    console.log("⚠️  Update is somewhat slow (>500ms)");
  } else {
    console.log("✨ Update speed is good!");
  }

  // Verify the update
  const { data: verifyData } = await supabase
    .from("tasks")
    .select("*")
    .eq("id", task.id)
    .single();

  console.log("\nVerified state:", { is_completed: verifyData.is_completed });
}

testTaskUpdate();
