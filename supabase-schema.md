# TaskFlow Database Schema

## Tables

### users

Auto-created by Supabase Auth. Contains:

- id (uuid, primary key)
- email (text)
- created_at (timestamp)
- updated_at (timestamp)

### lists

Custom lists for organizing tasks

```sql
CREATE TABLE lists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  color TEXT DEFAULT '#007AFF',
  icon TEXT DEFAULT 'list.bullet',
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE lists ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view own lists"
  ON lists FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own lists"
  ON lists FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own lists"
  ON lists FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own lists"
  ON lists FOR DELETE
  USING (auth.uid() = user_id);

-- Indexes
CREATE INDEX lists_user_id_idx ON lists(user_id);
CREATE INDEX lists_sort_order_idx ON lists(sort_order);
```

### tasks

Main tasks table

```sql
CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  list_id UUID REFERENCES lists(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  notes TEXT,
  due_date TIMESTAMP WITH TIME ZONE,
  is_completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMP WITH TIME ZONE,
  is_flagged BOOLEAN DEFAULT FALSE,

  -- Recurring task fields
  is_recurring BOOLEAN DEFAULT FALSE,
  recurrence_rule TEXT, -- 'daily', 'weekly', 'monthly', 'custom'
  recurrence_interval INTEGER DEFAULT 1,
  recurrence_end_date TIMESTAMP WITH TIME ZONE,
  parent_task_id UUID REFERENCES tasks(id) ON DELETE SET NULL,

  -- Metadata
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view own tasks"
  ON tasks FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own tasks"
  ON tasks FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own tasks"
  ON tasks FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own tasks"
  ON tasks FOR DELETE
  USING (auth.uid() = user_id);

-- Indexes
CREATE INDEX tasks_user_id_idx ON tasks(user_id);
CREATE INDEX tasks_list_id_idx ON tasks(list_id);
CREATE INDEX tasks_due_date_idx ON tasks(due_date);
CREATE INDEX tasks_is_completed_idx ON tasks(is_completed);
CREATE INDEX tasks_is_flagged_idx ON tasks(is_flagged);
CREATE INDEX tasks_created_at_idx ON tasks(created_at DESC);
```

### user_settings

User preferences and settings

```sql
CREATE TABLE user_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Notification settings
  notifications_enabled BOOLEAN DEFAULT TRUE,
  notification_sound TEXT DEFAULT 'default',

  -- Display settings
  theme TEXT DEFAULT 'auto', -- 'light', 'dark', 'auto'
  default_list_id UUID REFERENCES lists(id),
  show_completed_tasks BOOLEAN DEFAULT TRUE,

  -- Sort preferences
  default_sort TEXT DEFAULT 'due_date', -- 'due_date', 'created_at', 'priority', 'alphabetical'
  default_sort_direction TEXT DEFAULT 'asc', -- 'asc', 'desc'

  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view own settings"
  ON user_settings FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own settings"
  ON user_settings FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own settings"
  ON user_settings FOR UPDATE
  USING (auth.uid() = user_id);

-- Indexes
CREATE INDEX user_settings_user_id_idx ON user_settings(user_id);
```

## Functions

### Auto-update timestamps

```sql
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers
CREATE TRIGGER update_lists_updated_at BEFORE UPDATE ON lists
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tasks_updated_at BEFORE UPDATE ON tasks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_settings_updated_at BEFORE UPDATE ON user_settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

### Auto-create default list for new users

```sql
CREATE OR REPLACE FUNCTION create_default_list()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO lists (user_id, name, color, icon, sort_order)
  VALUES (NEW.id, 'My Tasks', '#007AFF', 'list.bullet', 0);

  INSERT INTO user_settings (user_id)
  VALUES (NEW.id);

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION create_default_list();
```

## Real-time Subscriptions

Enable real-time for tables:

```sql
ALTER PUBLICATION supabase_realtime ADD TABLE lists;
ALTER PUBLICATION supabase_realtime ADD TABLE tasks;
ALTER PUBLICATION supabase_realtime ADD TABLE user_settings;
```

## Setup Instructions

1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Run each SQL block in order
4. Verify tables are created in Table Editor
5. Test RLS policies by inserting test data
6. Enable real-time subscriptions in Database > Replication settings
