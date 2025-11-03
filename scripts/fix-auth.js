#!/usr/bin/env node

const { createClient } = require("@supabase/supabase-js");
require("dotenv").config();

const supabase = createClient(
  process.env.EXPO_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function fixAuth() {
  console.log("🔧 FIXING SUPABASE AUTHENTICATION\n");

  // Test current signup behavior
  const testEmail = `test${Date.now()}@test.com`;
  console.log(`Testing signup with: ${testEmail}`);

  const { data, error } = await supabase.auth.signUp({
    email: testEmail,
    password: "Test123456!",
  });

  if (error) {
    console.log("❌ Signup error:", error.message);
    return;
  }

  console.log("\n📊 Signup Result:");
  console.log(`   User created: ${!!data.user}`);
  console.log(`   User ID: ${data.user?.id}`);
  console.log(`   Session created: ${!!data.session}`);
  console.log(`   Email confirmed: ${!!data.user?.email_confirmed_at}`);

  if (!data.session) {
    console.log("\n⚠️  EMAIL CONFIRMATION IS STILL REQUIRED!");
    console.log("\n📝 TO FIX:");
    console.log(
      "   1. Go to: https://supabase.com/dashboard/project/skvpumtrpbkoozdeboic/auth/providers"
    );
    console.log('   2. Find "Email" provider');
    console.log("   3. Click to edit");
    console.log('   4. Toggle OFF "Confirm email"');
    console.log("   5. SAVE");
    console.log("\n   After this, users will get instant sessions!");

    // Clean up test user
    if (data.user?.id) {
      await supabase.auth.admin.deleteUser(data.user.id);
      console.log("\n   (Test user cleaned up)");
    }
  } else {
    console.log(
      "\n✅ Email confirmation is DISABLED - users get instant sessions!"
    );

    // Check if user_settings was created
    await new Promise((resolve) => setTimeout(resolve, 2000));
    const { data: settings } = await supabase
      .from("user_settings")
      .select("*")
      .eq("user_id", data.user?.id)
      .single();

    if (settings) {
      console.log("✅ user_settings auto-created by trigger!");
    } else {
      console.log("❌ user_settings NOT created - trigger may not be working");
    }

    // Clean up
    await supabase.auth.admin.deleteUser(data.user.id);
  }
}

fixAuth();
