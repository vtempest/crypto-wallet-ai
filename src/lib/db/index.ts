import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import * as schema from './schema';
import { existsSync, mkdirSync } from 'fs';
import { dirname } from 'path';

// Ensure the data directory exists for local SQLite database
const dbUrl = process.env.TURSO_DATABASE_URL || 'file:./data/db.sqlite';
if (dbUrl.startsWith('file:')) {
  const dbPath = dbUrl.replace('file:', '');
  const dbDir = dirname(dbPath);
  if (!existsSync(dbDir)) {
    mkdirSync(dbDir, { recursive: true });
  }
}

const client = createClient({
  url: dbUrl,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

const db = drizzle(client, {
  schema: schema,
});

export { db };
