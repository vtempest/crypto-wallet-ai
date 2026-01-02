# Database Setup & Migration Guide

## Quick Fix for walletAddress Error

If you're seeing this error when trying to sign in with MetaMask:

```
Failed query: select "id", "userId", "address", "chainId", "isPrimary", "createdAt"
from "walletAddress" where ("walletAddress"."address" = ? and "walletAddress"."chainId" = ?)
```

**The issue**: The `walletAddress` table migration hasn't been applied to your database yet.

**The solution**: Run the database migration (see below).

---

## Initial Setup

### 1. Install Dependencies

```bash
npm install --legacy-peer-deps
```

### 2. Configure Database

This project uses **Turso** (cloud SQLite) for production and local SQLite for development.

#### Option A: Local Development (SQLite)

No configuration needed! The database will be created automatically at `./data/db.sqlite`.

#### Option B: Production (Turso)

1. Create a Turso database:
   ```bash
   turso db create crypto-wallet-ai
   ```

2. Get your database URL:
   ```bash
   turso db show crypto-wallet-ai --url
   ```

3. Create an auth token:
   ```bash
   turso db tokens create crypto-wallet-ai
   ```

4. Create a `.env` file with your credentials:
   ```env
   TURSO_DATABASE_URL=libsql://your-database.turso.io
   TURSO_AUTH_TOKEN=your-auth-token
   ```

### 3. Apply Database Migrations

**IMPORTANT**: This step creates all required tables including the `walletAddress` table needed for Web3 authentication.

```bash
# Method 1: Push schema to database (recommended for initial setup)
npm run db:push

# Method 2: Generate and run migrations (for production)
npm run db:migrate
```

### 4. Verify Setup

After running migrations, verify the walletAddress table exists:

```bash
# For local database
sqlite3 data/db.sqlite ".schema walletAddress"

# For Turso database
turso db shell crypto-wallet-ai --command ".schema walletAddress"
```

You should see:
```sql
CREATE TABLE `walletAddress` (
  `id` text PRIMARY KEY NOT NULL,
  `userId` text NOT NULL,
  `address` text NOT NULL,
  `chainId` integer NOT NULL,
  `isPrimary` integer DEFAULT 0,
  `createdAt` integer NOT NULL,
  FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
```

---

## Database Schema

The application uses the following main tables:

- **user** - User accounts (email/password or OAuth)
- **walletAddress** - Ethereum wallet addresses linked to users (for SIWE/Web3 auth)
- **session** - User sessions
- **account** - OAuth provider accounts
- **messages** - Chat messages
- **chats** - Chat conversations
- **favorites** - Saved articles
- **articleCache** - Cached article content

---

## Troubleshooting

### Error: "walletAddress table doesn't exist"

**Cause**: Migrations haven't been applied to your database.

**Solution**: Run `npm run db:push` or `npm run db:migrate`

### Error: "Unable to open connection to local database"

**Cause**: The `data/` directory doesn't exist.

**Solution**:
```bash
mkdir -p data
npm run db:push
```

### Error: Connection failed to Turso

**Cause**: Missing or invalid `TURSO_DATABASE_URL` or `TURSO_AUTH_TOKEN` in `.env`

**Solution**:
1. Check your `.env` file has both variables set
2. Verify the URL and token are correct
3. Test connection: `turso db shell crypto-wallet-ai`

### Migration conflicts

If you see migration number conflicts (e.g., two `0006_*.sql` files), the latest migration takes precedence. Running `npm run db:push` will sync your database with the current schema regardless of migration order.

---

## Migration Commands Reference

| Command | Description | When to Use |
|---------|-------------|-------------|
| `npm run db:generate` | Generate a new migration file from schema changes | After modifying `src/lib/db/schema.ts` |
| `npm run db:push` | Push current schema to database (destructive) | Development, initial setup |
| `npm run db:migrate` | Apply pending migrations to database | Production deployments |

---

## Development Workflow

### Making Schema Changes

1. Edit `src/lib/db/schema.ts`
2. Generate migration:
   ```bash
   npm run db:generate
   ```
3. Apply migration:
   ```bash
   npm run db:push  # Local dev
   # OR
   npm run db:migrate  # Production
   ```

### Deploying to Production

1. Ensure all migrations are committed to git
2. Deploy your code
3. Run migrations on production database:
   ```bash
   # Set production env vars first
   export TURSO_DATABASE_URL="your-production-url"
   export TURSO_AUTH_TOKEN="your-production-token"

   # Apply migrations
   npm run db:migrate
   ```

---

## Next Steps

After setting up the database:

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Open http://localhost:3000

3. Try signing in with MetaMask - the walletAddress error should be fixed!

For more information about Web3 authentication, see the [better-auth SIWE plugin docs](https://www.better-auth.com/docs/plugins/siwe).
