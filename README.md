# TaskFlow

<div align="center">
  <h3>iOS-inspired Task Management App</h3>
  <p>Built with React Native, Expo, and Supabase</p>
</div>

## 🚀 Features

- ✅ **Complete CRUD Operations** - Create, Read, Update, and Delete tasks
- 🎨 **Glassmorphism UI** - Beautiful iOS-inspired design with glassmorphism effects
- ⚡ **Real-time Sync** - Instant updates across all devices using Supabase Realtime
- 🔐 **Authentication** - Secure signup and login with Supabase Auth
- 📅 **Due Dates** - Set and edit due dates with native date picker
- 🚩 **Priority Flags** - Mark important tasks with flags
- ✨ **Optimistic Updates** - Instant UI feedback with background database sync
- 🎯 **Hide Completed Tasks** - iOS Reminders behavior - completed tasks disappear automatically
- 📱 **Native Feel** - Smooth animations and iOS-style interactions

## 🛠️ Tech Stack

- **Frontend**: React Native + Expo SDK 54
- **Backend**: Supabase (PostgreSQL + Auth + Realtime)
- **State Management**: Zustand with persistence
- **Navigation**: Expo Router (file-based routing)
- **UI Components**: Custom glassmorphism components
- **TypeScript**: Full type safety

## 📦 Installation

### Prerequisites

- Node.js 20.x or later
- Expo Go app (for testing on device)
- Supabase account

### Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/JorgeDeArmas/taskflow-app.git
   cd taskflow-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Supabase**
   
   Create a `.env` file in the root directory:
   ```env
   EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
   EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   ```

4. **Set up database**
   
   Run the SQL scripts in your Supabase SQL editor:
   - `create-tables.sql`
   - `add-user-settings-trigger.sql`

5. **Disable email confirmation** (for development)
   
   In Supabase Dashboard:
   - Go to Authentication → Settings
   - Disable "Enable email confirmations"

6. **Start the app**
   ```bash
   npm start
   ```

## 📱 Usage

### Running the App

```bash
# Start Expo development server
npm start

# Scan QR code with Expo Go app (iOS/Android)
# Or press 'a' for Android emulator
# Or press 'i' for iOS simulator
```

### Key Features

#### Task Management
- **Create**: Tap the blue + button to add a new task
- **Edit**: Tap any task to edit its details
- **Complete**: Tap the checkbox to mark as done (auto-hides)
- **Delete**: Open task detail → Delete Task button

#### Task Properties
- Title (required)
- Notes (optional)
- Due Date with inline calendar picker
- Priority Flag for important tasks

#### Show/Hide Completed
- Tap "Show Completed" / "Hide Completed" button in header
- Completed tasks are hidden by default (iOS behavior)

## 🏗️ Project Structure

```
taskflow/
├── app/
│   ├── (tabs)/           # Tab navigation screens
│   │   ├── index.tsx     # Main task list
│   │   └── explore.tsx   # Explore/settings screen
│   ├── auth/             # Authentication screens
│   │   ├── login.tsx
│   │   └── signup.tsx
│   ├── task-detail/      # Task editing screen
│   │   └── [id].tsx
│   ├── modal.tsx         # Add task modal
│   └── _layout.tsx       # Root layout with auth
├── components/
│   ├── glass/            # Glassmorphism components
│   └── ui/               # Reusable UI components
├── stores/
│   ├── auth-store.ts     # Authentication state
│   ├── task-store.ts     # Task state & operations
│   └── list-store.ts     # List management
├── lib/
│   └── supabase.ts       # Supabase client config
├── types/
│   └── index.ts          # TypeScript types
└── constants/
    └── theme.ts          # Colors, spacing, typography
```

## 🔑 Key Implementation Details

### Optimistic Updates
Tasks update instantly in the UI while syncing with the database in the background. If an error occurs, changes are automatically reverted.

### Real-time Sync
All task changes are broadcast via Supabase Realtime, keeping multiple clients in sync without polling.

### Performance Optimizations
- `React.memo` for TaskItem components
- `useCallback` for event handlers
- FlashList for efficient list rendering
- Tasks not persisted to AsyncStorage (reduces write overhead)

### Database Schema
- **tasks** - Task data with RLS policies
- **lists** - Custom list organization
- **user_settings** - User preferences
- All tables have `updated_at` triggers

## 🚧 Roadmap

- [ ] List management (create custom lists)
- [ ] Recurring tasks
- [ ] Task search and filtering
- [ ] Subtasks/checklists
- [ ] Task attachments
- [ ] Collaboration features
- [ ] Dark mode improvements
- [ ] Web version

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

## 👤 Author

**Jorge De Armas**
- GitHub: [@JorgeDeArmas](https://github.com/JorgeDeArmas)
- Email: jorgedearmas86@gmail.com

## 🙏 Acknowledgments

- Inspired by iOS Reminders app
- Built with [Expo](https://expo.dev)
- Powered by [Supabase](https://supabase.com)

---

<div align="center">
  Made with ❤️ by Jorge De Armas
</div>
