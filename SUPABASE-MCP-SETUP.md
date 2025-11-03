# Supabase MCP Configuration for TaskFlow

## What is Supabase MCP?

The Supabase MCP (Model Context Protocol) server allows GitHub Copilot and AI assistants to interact directly with your Supabase project - viewing tables, running queries, managing data, etc.

## Setup Instructions

### 1. Get Your Supabase Credentials

You need these from your `.env` file:

- **Project URL**: `EXPO_PUBLIC_SUPABASE_URL`
- **Anon Key**: `EXPO_PUBLIC_SUPABASE_ANON_KEY`
- **Service Role Key** (optional, for admin operations): `SUPABASE_SERVICE_ROLE_KEY`

### 2. Configure VS Code Settings

Add this to your VS Code **User Settings** (JSON):

**Location**:

- Mac/Linux: `~/.config/Code/User/settings.json`
- Windows: `%APPDATA%\Code\User\settings.json`

Or open via: `Cmd/Ctrl + Shift + P` → "Preferences: Open User Settings (JSON)"

```json
{
  "github.copilot.chat.mcp.enabled": true,
  "github.copilot.chat.mcp.servers": {
    "supabase": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-supabase"],
      "env": {
        "SUPABASE_URL": "YOUR_PROJECT_URL_HERE",
        "SUPABASE_SERVICE_ROLE_KEY": "YOUR_SERVICE_ROLE_KEY_HERE"
      }
    }
  }
}
```

### 3. Replace the Placeholders

Replace `YOUR_PROJECT_URL_HERE` and `YOUR_SERVICE_ROLE_KEY_HERE` with your actual credentials from `.env`.

**Example**:

```json
{
  "github.copilot.chat.mcp.enabled": true,
  "github.copilot.chat.mcp.servers": {
    "supabase": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-supabase"],
      "env": {
        "SUPABASE_URL": "https://abcdefgh.supabase.co",
        "SUPABASE_SERVICE_ROLE_KEY": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
      }
    }
  }
}
```

### 4. Restart VS Code

After adding the configuration:

1. Save the settings file
2. Restart VS Code completely
3. The Supabase MCP will be available in Copilot Chat

### 5. Verify It Works

In VS Code:

1. Open GitHub Copilot Chat (`Cmd/Ctrl + I`)
2. Ask: "Can you list all tables in my Supabase database?"
3. If configured correctly, Copilot will use the MCP to query your database

## What Can You Do With Supabase MCP?

Once configured, you can ask Copilot to:

✅ **View Database Structure**

- "Show me all tables in the database"
- "What columns does the tasks table have?"
- "Show me the schema for user_settings"

✅ **Query Data**

- "Show me all tasks in the database"
- "How many users are registered?"
- "List all lists with their task counts"

✅ **Modify Data** (with service role key)

- "Create a test task for user X"
- "Update the task with id Y"
- "Delete all completed tasks"

✅ **Manage Schema** (with service role key)

- "Add a new column to the tasks table"
- "Create an index on due_date"
- "Show me all RLS policies"

✅ **Debug Issues**

- "Why isn't real-time working on the tasks table?"
- "Check if RLS policies are blocking my query"
- "Show me recent database logs"

## Security Notes

⚠️ **Service Role Key**: This key has **admin access** to your database. Only use it in development environments.

⚠️ **Never commit**: Don't commit your VS Code settings with credentials to Git. Keep them in your local settings only.

⚠️ **Production**: For production, use the anon key and rely on RLS policies for security.

## Alternative: Project-Specific Configuration

If you want the MCP only for this project, create `.vscode/settings.json` in the project root:

```json
{
  "github.copilot.chat.mcp.enabled": true,
  "github.copilot.chat.mcp.servers": {
    "supabase": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-supabase"],
      "env": {
        "SUPABASE_URL": "${workspaceFolder}/.env:EXPO_PUBLIC_SUPABASE_URL",
        "SUPABASE_SERVICE_ROLE_KEY": "${workspaceFolder}/.env:SUPABASE_SERVICE_ROLE_KEY"
      }
    }
  }
}
```

This reads from your `.env` file automatically!

## Troubleshooting

### "MCP server not found"

→ Make sure `@modelcontextprotocol/server-supabase` package exists
→ Try: `npx -y @modelcontextprotocol/server-supabase --version`

### "Connection refused"

→ Check your Supabase URL is correct (no trailing slash)
→ Verify service role key is valid

### "Permission denied"

→ Use service role key, not anon key
→ Check RLS policies aren't blocking the query

## Example Usage

After setup, try these in Copilot Chat:

```
@workspace Show me the structure of the tasks table

@workspace How many tasks are in the database?

@workspace Create a test task with title "Test Task" for the first user

@workspace Show me all lists and their task counts

@workspace What RLS policies are enabled on the tasks table?
```

---

**Ready?** Follow the steps above to enable Supabase MCP! 🚀
