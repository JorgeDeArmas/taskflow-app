# 🚀 Quick Start Guide

## Prerequisites

- ✅ Node.js 20.x installed
- ✅ Expo CLI installed (`npm install -g expo-cli`)
- ✅ iOS Simulator (Mac) or Android Emulator
- ✅ Supabase account (free tier)

## 5-Minute Setup

### 1. Supabase Setup (2 minutes)

```bash
# Go to https://supabase.com
# Click "New Project"
# Name: taskflow
# Database Password: (generate strong password)
# Region: (choose closest)
# Click "Create Project" (wait ~2 minutes)
```

### 2. Database Setup (1 minute)

```bash
# In Supabase Dashboard:
# 1. Click "SQL Editor" in left sidebar
# 2. Open supabase-schema.md in this project
# 3. Copy ALL SQL code
# 4. Paste into Supabase SQL Editor
# 5. Click "Run" button
# 6. Verify: Go to "Table Editor" → Should see lists, tasks, user_settings tables
```

### 3. Environment Setup (30 seconds)

```bash
# In Supabase Dashboard:
# Click "Settings" → "API"
# Copy "Project URL" and "anon/public" key

# In your terminal:
cd /home/pixelab/taskflow
cp .env.example .env

# Edit .env file:
EXPO_PUBLIC_SUPABASE_URL=<paste Project URL>
EXPO_PUBLIC_SUPABASE_ANON_KEY=<paste anon key>
```

### 4. Run the App (1 minute)

```bash
# Install dependencies (already done, but just in case)
npm install

# Start Expo
npm start

# Press 'i' for iOS simulator
# OR
# Press 'a' for Android emulator
# OR
# Scan QR code with Expo Go app on your phone
```

## Test It Out

### Create Your First User

1. App opens → Shows "Welcome to TaskFlow"
2. Tap to navigate to Sign Up (or create auth screens route)
3. Enter email & password → Create Account
4. Check Supabase Dashboard:
   - Authentication → Users → Should see your new user
   - Table Editor → lists → Should see "My Tasks" default list
   - Table Editor → user_settings → Should see settings row

### View Tasks (Once authenticated)

1. Main screen shows "No Tasks Yet"
2. Floating + button (currently shows "coming soon")

### Manual Test (Real-time Sync)

```bash
# In Supabase Dashboard:
# 1. Go to Table Editor → tasks
# 2. Click "Insert" → "Insert row"
# 3. Fill in:
#    user_id: <copy from users table>
#    list_id: <copy from lists table>
#    title: "My First Task"
#    is_completed: false
# 4. Click "Save"

# In your app:
# → Task should appear instantly (real-time sync!)
# → Tap checkbox to complete it
# → Changes sync back to Supabase
```

## What Works Right Now

✅ **Authentication**

- Sign up with email/password
- Sign in with email/password
- Apple Sign In (iOS only)
- Session persistence

✅ **Task List**

- View all tasks in a list
- Task items show:
  - Title
  - Due date (Today, Tomorrow, or date)
  - Completion status
  - Priority flag
  - Notes indicator
- Pull-to-refresh
- Real-time sync
- Toggle complete/incomplete

✅ **Glassmorphism UI**

- Beautiful blur effects
- iOS-inspired design
- Dark mode support
- Smooth animations

## What's Coming Soon

🚧 **Add Task** (Next)

- Tap + button to create new task
- Quick entry modal

🚧 **Task Details** (After Add)

- Tap task to edit all fields
- Set due date/time
- Add notes
- Change list
- Set recurring

🚧 **Lists Management**

- Create custom lists
- Organize tasks by list
- Reorder lists

🚧 **Notifications**

- Push reminders
- Due date alerts

## Troubleshooting

### "Cannot connect to Supabase"

→ Check .env file exists and has correct values
→ Restart expo: Ctrl+C, then `npm start`

### "Blur effect not showing"

→ Run: `npx expo prebuild`
→ Then: `npm run ios` (or android)

### "Tasks not syncing"

→ Check Supabase Dashboard → Database → Replication
→ Make sure real-time is enabled for tasks, lists tables

### "TypeScript errors"

→ VS Code: Cmd+Shift+P → "TypeScript: Restart TS Server"

### "App crashes on startup"

→ Clear cache: `npm start -- --clear`
→ Reinstall: `rm -rf node_modules && npm install`

## Next Steps

1. ✅ You have a working foundation!
2. 🎯 Next: Implement `app/_layout.tsx` for auth protection
3. 🎯 Then: Build add task modal
4. 🎯 Then: Build task detail screen

## Resources

- [SETUP.md](./SETUP.md) - Detailed setup guide
- [IMPLEMENTATION-SUMMARY.md](./IMPLEMENTATION-SUMMARY.md) - What's built
- [supabase-schema.md](./supabase-schema.md) - Database structure
- [github/copilot-instructions.md](./github/copilot-instructions.md) - Coding standards

---

**Ready to code?** Start with implementing the root layout to protect routes! 🚀
