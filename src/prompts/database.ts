import * as p from '@clack/prompts';
import type { Database } from '../types.js';

export async function getDatabaseChoice(): Promise<Database> {
  const database = await p.select({
    message: 'What database would you like to use?',
    options: [
      { value: 'sqlite', label: 'SQLite (recommended for development)' },
      { value: 'postgres', label: 'PostgreSQL' },
      { value: 'mysql', label: 'MySQL' },
    ],
    initialValue: 'sqlite',
  });

  if (p.isCancel(database)) {
    throw new Error('Operation cancelled');
  }

  return database as Database;
}
