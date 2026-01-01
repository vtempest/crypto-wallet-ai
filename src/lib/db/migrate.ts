import { createClient } from '@libsql/client';
import path from 'path';
import fs from 'fs';

const DATA_DIR = process.env.DATA_DIR || process.cwd();

const client = createClient({
  url: process.env.TURSO_DATABASE_URL || 'file:./data/db.sqlite',
  authToken: process.env.TURSO_AUTH_TOKEN,
});

const migrationsFolder = path.join(DATA_DIR, 'drizzle');

await client.execute(`
  CREATE TABLE IF NOT EXISTS ran_migrations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    run_on DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

function sanitizeSql(content: string) {
  return content
    .split(/\r?\n/)
    .filter(
      (l) => !l.trim().startsWith('-->') && !l.includes('statement-breakpoint'),
    )
    .join('\n');
}

const files = fs.readdirSync(migrationsFolder)
  .filter((f) => f.endsWith('.sql'))
  .sort();

for (const file of files) {
  const filePath = path.join(migrationsFolder, file);
  let content = fs.readFileSync(filePath, 'utf-8');
  content = sanitizeSql(content);

  const migrationName = file.split('_')[0] || file;

  const already = await client.execute({
    sql: 'SELECT 1 FROM ran_migrations WHERE name = ?',
    args: [migrationName],
  });
  if (already.rows.length > 0) {
    console.log(`Skipping already-applied migration: ${file}`);
    continue;
  }

  try {
    if (migrationName === '0001') {
      // Check if messages table has the old structure with metadata column
      const tableInfo = await client.execute(
        "PRAGMA table_info(messages)"
      );
      const hasMetadata = tableInfo.rows.some((col: any) => col.name === 'metadata');

      if (!hasMetadata) {
        console.log(`Skipping migration ${file}: messages table already in new format`);
        await client.execute({
          sql: 'INSERT OR IGNORE INTO ran_migrations (name) VALUES (?)',
          args: [migrationName],
        });
        continue;
      }

      const messagesResult = await client.execute(
        'SELECT id, type, metadata, content, chatId, messageId FROM messages',
      );
      const messages = messagesResult.rows;

      await client.execute(`
        CREATE TABLE IF NOT EXISTS messages_with_sources (
          id INTEGER PRIMARY KEY,
          type TEXT NOT NULL,
          chatId TEXT NOT NULL,
          createdAt TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
          messageId TEXT NOT NULL,
          content TEXT,
          sources TEXT DEFAULT '[]'
        );
      `);

      for (const msg of messages) {
        let metadata = msg.metadata;
        while (typeof metadata === 'string') {
          metadata = JSON.parse(metadata || '{}');
        }
        if (msg.type === 'user') {
          await client.execute({
            sql: `INSERT INTO messages_with_sources (type, chatId, createdAt, messageId, content, sources)
                  VALUES (?, ?, ?, ?, ?, ?)`,
            args: [
              'user',
              msg.chatId,
              metadata['createdAt'],
              msg.messageId,
              msg.content,
              '[]',
            ],
          });
        } else if (msg.type === 'assistant') {
          await client.execute({
            sql: `INSERT INTO messages_with_sources (type, chatId, createdAt, messageId, content, sources)
                  VALUES (?, ?, ?, ?, ?, ?)`,
            args: [
              'assistant',
              msg.chatId,
              metadata['createdAt'],
              msg.messageId,
              msg.content,
              '[]',
            ],
          });
          const sources = metadata['sources'] || '[]';
          if (sources && sources.length > 0) {
            await client.execute({
              sql: `INSERT INTO messages_with_sources (type, chatId, createdAt, messageId, content, sources)
                    VALUES (?, ?, ?, ?, ?, ?)`,
              args: [
                'source',
                msg.chatId,
                metadata['createdAt'],
                `${msg.messageId}-source`,
                '',
                JSON.stringify(sources),
              ],
            });
          }
        }
      }

      await client.execute('DROP TABLE messages;');
      await client.execute('ALTER TABLE messages_with_sources RENAME TO messages;');
    } else {
      const statements = content.split(';');
      for (const statement of statements) {
        if (statement.trim().length > 0) {
          await client.execute(statement);
        }
      }
    }

    await client.execute({
      sql: 'INSERT OR IGNORE INTO ran_migrations (name) VALUES (?)',
      args: [migrationName],
    });
    console.log(`Applied migration: ${file}`);
  } catch (err) {
    console.error(`Failed to apply migration ${file}:`, err);
    throw err;
  }
}
