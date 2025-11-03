## 🛠️ Technology Stack

### Core Framework

- **React Native**: `0.76.x` (latest stable as of Nov 2024)
- **Expo SDK**: `52.x` (with New Architecture enabled)
- **TypeScript**: `5.6.x`
- **Node.js**: `20.x LTS`

### Navigation & Routing

- **Expo Router**: `4.x` (file-based routing)
- **Navigation Pattern**: `Hybrid (Tab-based main navigation with Stack navigation for task details and settings)`
- **Deep Linking**: `Enabled (for task notifications and shared tasks)`

### State Management

- **Zustand**: `5.x`
- **State Pattern**: `Feature-based (separate stores for tasks, lists, auth, and settings)`
- **Persistence**: `@react-native-async-storage/async-storage (for offline task caching)`

### Backend & Database

- **Supabase**: Latest (PostgreSQL + Realtime + Auth + Storage)
- **Database**: PostgreSQL `15.x`
- **Authentication**: `Email/Password + OAuth (Apple Sign In for iOS)`
- **Real-time Features**: `Enabled (real-time task sync across devices)`

### UI & Design System

- **Design Language**: iOS-native with glassmorphism
- **UI Library**: `Custom components (Glass* components with expo-blur)`
- **Blur Effects**: `expo-blur` (BlurView)
- **Icons**: `@expo/vector-icons` (SF Symbols style)
- **Typography**: `SF Pro (iOS system font)`

### Animations

- **React Native Reanimated**: `3.16.x`
- **Gesture Handler**: `2.20.x`
- **Animation Types**: `Spring (for natural iOS-feeling interactions)`

### Performance Optimization

- **Lists**: `@shopify/flash-list` `1.7.x`
- **Image Optimization**: `expo-image` with caching
- **Code Splitting**: Expo Router automatic splitting
- **Memoization Strategy**: `React.memo for list items, useMemo for expensive computations, useCallback for event handlers`

### External APIs & Services

- **ElevenLabs API**: `Disabled (not required for MVP)`
- **OpenAI DALL-E**: `Disabled (not required for MVP)`
- **Push Notifications**: `Expo Push Notifications` - For task reminders and alerts
- **Other APIs**: `None (may add third-party integrations in future versions)`

### Testing & Automation

- **E2E Testing**: Playwright `1.48.x`
- **Unit Testing**: Jest `29.x` + React Native Testing Library
- **Visual Testing**: `Enabled with Playwright (for critical user flows)`
- **Test Coverage Target**: `80%+ for business logic, 60%+ overall`

## 🎨 Design System Standards

### Glassmorphism Guidelines

- **Background Blur**: `intensity: 40-60 for light mode, 80-100 for dark mode, tint: light/dark`
- **Glass Opacity**: `0.7-0.85 (semi-transparent)`
- **Border**: `1px solid rgba(255,255,255,0.18) for light, rgba(255,255,255,0.12) for dark`
- **Shadow**: `shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 12`
- **Corner Radius**: `12px (small elements), 16px (cards), 20px (modals), 24px (large containers)`

### Color Palette

```typescript
// iOS System Colors (Light Mode)
// Primary: #007AFF (iOS Blue)
// Secondary: #5856D6 (iOS Purple)
// Accent: #FF9500 (iOS Orange)
// Background: #F2F2F7 (iOS System Background)
// Surface: #FFFFFF (iOS Grouped Background)
// Error: #FF3B30 (iOS Red)
// Success: #34C759 (iOS Green)
// Warning: #FF9500 (iOS Orange)
// Text Primary: #000000 (iOS Label)
// Text Secondary: #3C3C43 (iOS Secondary Label)

// Glass/Glassmorphism
// Glass Light: rgba(255, 255, 255, 0.7)
// Glass Medium: rgba(255, 255, 255, 0.5)
// Glass Dark: rgba(0, 0, 0, 0.3)
```

### Typography Scale (SF Pro - iOS System Font)

- **Large Title**: `34px / 700 (Bold) / 41px`
- **Title 1**: `28px / 700 (Bold) / 34px`
- **Title 2**: `22px / 700 (Bold) / 28px`
- **Title 3**: `20px / 600 (Semibold) / 24px`
- **Headline**: `17px / 600 (Semibold) / 22px`
- **Body**: `17px / 400 (Regular) / 22px`
- **Callout**: `16px / 400 (Regular) / 21px`
- **Subheadline**: `15px / 400 (Regular) / 20px`
- **Footnote**: `13px / 400 (Regular) / 18px`
- **Caption 1**: `12px / 400 (Regular) / 16px`
- **Caption 2**: `11px / 400 (Regular) / 13px`

### Spacing System

- **Base Unit**: `4px`
- **Scale**: `xs: 4px, sm: 8px, md: 16px, lg: 24px, xl: 32px, xxl: 48px`
- **Common Uses**: `Padding (md), Margins (md-lg), Section gaps (xl), Screen padding (md-lg)`

---

## 🔐 Environment Variables

```bash
# Supabase
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# Push Notifications (Expo)
EXPO_PUSH_TOKEN=obtained_at_runtime

# App Configuration
EXPO_PUBLIC_APP_ENV=development
EXPO_PUBLIC_API_BASE_URL=https://your-project.supabase.co

# Optional: Future integrations
# ELEVEN_LABS_API_KEY=for_audio_features
# OPENAI_API_KEY=for_ai_features
```

---

## 📝 Code Style Conventions

### TypeScript

- **Strict Mode**: Enabled
- **Naming Conventions**:
  - Components: `PascalCase`
  - Hooks: `camelCase` with `use` prefix
  - Types/Interfaces: `PascalCase` with `Type` or `Interface` suffix
  - Constants: `UPPER_SNAKE_CASE`
  - Files: `kebab-case.tsx` or `PascalCase.tsx` for components

### Commit Convention

- `feat:` New features
- `fix:` Bug fixes
- `refactor:` Code refactoring
- `style:` UI/UX changes
- `test:` Testing
- `docs:` Documentation
- `chore:` Maintenance

---

## 🚀 Supabase Integration Patterns

### Authentication Flow

```typescript
// Pattern: Session-based with JWT tokens, Apple Sign In for iOS
// Redirect URLs:
//   - taskflow://auth/callback (deep link for OAuth)
//   - https://your-project.supabase.co/auth/v1/callback
// Protected Routes: All routes under (tabs)/ require authentication
```

### Row Level Security (RLS)

- **Default Policy**: `Enable RLS on all tables (tasks, lists, user_settings)`
- **User Isolation**: `auth.uid() matching user_id column - users can only access their own data`

### Real-time Subscriptions

```typescript
// Channels:
//   - tasks:user_id=eq.{userId} (real-time task updates)
//   - lists:user_id=eq.{userId} (real-time list updates)
// Events: INSERT, UPDATE, DELETE (subscribe to all changes for sync)
```

### Edge Functions Pattern

- **Runtime**: Deno
- **Naming**: `send-reminder, process-recurring-task, sync-tasks`
- **Error Handling**: `Standard JSON responses with status codes (200 success, 400 bad request, 401 unauthorized, 500 server error)`

---

## 📊 Performance Targets

- **Time to Interactive**: `< 2000ms` (from app launch to usable)
- **First Contentful Paint**: `< 1000ms` (initial screen render)
- **Bundle Size**: `< 15MB` (for iOS app bundle)
- **FPS Target**: `60fps` for animations (smooth scrolling and transitions)
- **Memory Usage**: `< 150MB max` (typical usage, excludes large datasets)

## 📱 Platform-Specific Considerations

### iOS

- **Minimum Version**: `iOS 15.0` (for optimal glassmorphism effects and SF Symbols)
- **Permissions Required**:
  - **Notifications**: Required for task reminders and alerts
  - **Calendar** (optional): For syncing tasks with iOS Calendar
- **App Store Requirements**:
  - Privacy policy URL required (for data collection)
  - App Store Connect screenshots showing main features
  - Proper handling of push notifications
  - Sign in with Apple (if offering social login)
  - Dark mode support (iOS standard)

### Android

- **Minimum SDK**: `API 26 (Android 8.0)` - Planned for future releases
- **Permissions Required**: Same as iOS (Notifications, Calendar)
- **Google Play Requirements**: Privacy policy, notification channels properly configured

---

## 🔗 Useful Resources

- Expo Docs: https://docs.expo.dev
- React Native: https://reactnative.dev
- Supabase Docs: https://supabase.com/docs
- Zustand: https://docs.pmnd.rs/zustand
- Playwright: https://playwright.dev
