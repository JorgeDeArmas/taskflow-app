# TaskFlow - Setup & Development Guide

## ✅ Completed Components

### 1. **Dependencies & Configuration**

- ✅ Installed: Supabase, Zustand, AsyncStorage, FlashList, expo-blur, expo-notifications, date-fns
- ✅ Configured `app.json` with iOS settings, notifications, and deep linking
- ✅ Created `.env.example` for environment variables

### 2. **Database Schema**

- ✅ Created comprehensive schema in `supabase-schema.md`
- ✅ Tables: `lists`, `tasks`, `user_settings`
- ✅ Row Level Security policies
- ✅ Real-time subscriptions enabled
- ✅ Automatic timestamp updates
- ✅ Default list creation trigger

### 3. **Type Definitions**

- ✅ Complete TypeScript types in `types/index.ts`
- ✅ Database types in `lib/supabase.ts`
- ✅ Interfaces for Task, List, UserSettings, Recurrence, etc.

### 4. **State Management (Zustand)**

- ✅ `stores/auth-store.ts` - Authentication with persistence
- ✅ `stores/task-store.ts` - Task CRUD, filtering, sorting, recurring tasks
- ✅ `stores/list-store.ts` - List management and reordering
- ✅ Real-time subscriptions for all stores

### 5. **Glassmorphism UI Components**

- ✅ `components/glass/glass-card.tsx` - Blur card container
- ✅ `components/glass/glass-button.tsx` - Interactive button with haptics
- ✅ `components/glass/glass-input.tsx` - Text input with blur effect
- ✅ Updated `constants/theme.ts` with iOS colors, typography, spacing

### 6. **Authentication Screens**

- ✅ `app/auth/login.tsx` - Email/password + Apple Sign In
- ✅ `app/auth/signup.tsx` - Account creation

## 🚧 Next Steps to Complete

### Critical Files Needed:

1. **Main Task List Screen** (`app/(tabs)/index.tsx`)

   - FlashList for performance
   - Task items with swipe gestures
   - Add task button
   - Filter/sort controls
   - Complete/uncomplete toggle
   - Pull-to-refresh

2. **Task Detail Screen** (`app/task-detail/[id].tsx`)

   - Editable title and notes
   - Due date/time picker
   - Priority toggle
   - Recurring task settings
   - List selector
   - Delete button

3. **Lists Management** (`app/(tabs)/explore.tsx` or create new)

   - Display all custom lists
   - Create new list
   - Edit list (name, color, icon)
   - Delete list
   - Reorder lists

4. **Notifications Service** (`lib/notifications.ts`)

   - Request permissions
   - Schedule notifications for tasks
   - Cancel notifications
   - Handle notification taps

5. **Root Layout** (`app/_layout.tsx`)

   - Initialize auth on app start
   - Protected route logic
   - Subscribe to real-time changes
   - Handle deep links

6. **Settings Screen** (optional but recommended)
   - User preferences
   - Theme selection
   - Notification settings
   - Sign out button

## 📋 Setup Instructions

### 1. Supabase Configuration

```bash
# 1. Create a Supabase project at https://supabase.com
# 2. Copy your project URL and anon key
# 3. Create .env file
cp .env.example .env

# 4. Update .env with your Supabase credentials
EXPO_PUBLIC_SUPABASE_URL=your_project_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

### 2. Database Setup

1. Go to Supabase SQL Editor
2. Run all SQL commands from `supabase-schema.md` in order:
   - Create tables
   - Enable RLS
   - Create policies
   - Add triggers
   - Enable real-time

### 3. Install & Run

```bash
# Install dependencies (already done)
npm install

# Start development server
npm start

# Run on iOS simulator
npm run ios

# Run on Android emulator
npm run android
```

### 4. Testing Database

```bash
# Test in Supabase Dashboard:
# 1. Create a test user in Authentication
# 2. Verify default list was created
# 3. Add test tasks manually
# 4. Check real-time sync in multiple browsers
```

## 🎯 Implementation Priority

### Phase 1: Core Functionality (Week 1)

1. ✅ Project setup & dependencies
2. ✅ Database schema
3. ✅ State management stores
4. ✅ Glass UI components
5. ✅ Auth screens
6. 🔲 Main task list screen
7. 🔲 Task detail screen
8. 🔲 Root layout with auth protection

### Phase 2: Advanced Features (Week 2)

9. 🔲 Lists management
10. 🔲 Push notifications
11. 🔲 Recurring tasks (already in store logic)
12. 🔲 Real-time sync (subscriptions ready)
13. 🔲 Offline support with sync queue

### Phase 3: Polish (Week 3)

14. 🔲 Animations & transitions
15. 🔲 Settings screen
16. 🔲 Error handling
17. 🔲 Loading states
18. 🔲 Empty states
19. 🔲 Testing (E2E with Playwright)

## 🎨 Design Guidelines

### Colors (from copilot-instructions.md)

- Primary: `#007AFF` (iOS Blue)
- Background: `#F2F2F7` (Light) / `#000000` (Dark)
- Glass opacity: `0.7-0.85`
- Border: `rgba(255,255,255,0.18)`

### Typography

- Use `Typography` constants from theme
- SF Pro font (iOS system font)
- Scale: largeTitle (34px) → caption2 (11px)

### Spacing

- Base unit: `4px`
- Use `Spacing` constants: xs, sm, md, lg, xl, xxl

### Interactions

- Use `expo-haptics` for feedback
- Spring animations (Reanimated 3)
- 60fps target for all animations

## 🔧 Useful Commands

```bash
# Clear cache
npm start -- --clear

# Type check
npx tsc --noEmit

# Lint
npm run lint

# Reset project
npm run reset-project

# Update dependencies
npx expo install --fix
```

## 🐛 Common Issues

### Issue: Supabase connection fails

**Solution**: Check .env file exists and has correct values

### Issue: Real-time not working

**Solution**: Enable real-time in Supabase Dashboard → Database → Replication

### Issue: Blur effect not showing

**Solution**: Run `npx expo prebuild` for native modules

### Issue: TypeScript errors

**Solution**: Restart TypeScript server in VS Code

## 📚 Resources

- [Expo Docs](https://docs.expo.dev)
- [Supabase Docs](https://supabase.com/docs)
- [Zustand Guide](https://docs.pmnd.rs/zustand)
- [React Native Reanimated](https://docs.swmansion.com/react-native-reanimated/)
- [FlashList](https://shopify.github.io/flash-list/)

## 🤝 Need Help?

1. Check copilot-instructions.md for project standards
2. Review supabase-schema.md for database structure
3. Look at existing stores for patterns
4. Test auth flow first before building task screens
5. Use GitHub Copilot agent mode for implementation help

---

**Status**: ✅ Foundation Complete - Ready for Screen Implementation
**Next**: Build main task list screen with FlashList
