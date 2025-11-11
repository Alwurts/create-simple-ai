import path from "node:path";
import fs from "fs-extra";
import type { Installer } from "../types.js";

export const drizzleInstaller: Installer = async config => {
  // Create drizzle.config.ts
  let configContent = "";

  switch (config.database) {
    case "postgres":
      configContent = `import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './lib/db/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
`;
      break;
  }

  await fs.writeFile(path.join(config.projectDir, "drizzle.config.ts"), configContent);

  // Create basic lib/db directory structure
  const dbDir = path.join(config.projectDir, "lib/db");
  await fs.ensureDir(dbDir);

  // Create a basic schema file based on database type
  let schemaContent = "";

  switch (config.database) {
    case "postgres":
      schemaContent = `import { pgTable, text, serial, timestamp } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull(),
});

// Auth tables for better-auth
export const sessions = pgTable('sessions', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull(),
  expiresAt: timestamp('expires_at').notNull(),
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
});

export const accounts = pgTable('accounts', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull(),
  accountId: text('account_id').notNull(),
  providerId: text('provider_id').notNull(),
  accessToken: text('access_token'),
  refreshToken: text('refresh_token'),
  accessTokenExpiresAt: timestamp('access_token_expires_at'),
  refreshTokenExpiresAt: timestamp('refresh_token_expires_at'),
  scope: text('scope'),
  idToken: text('id_token'),
  password: text('password'),
});

export const verifications = pgTable('verifications', {
  id: text('id').primaryKey(),
  identifier: text('identifier').notNull(),
  value: text('value').notNull(),
  expiresAt: timestamp('expires_at').notNull(),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
`;
      break;
  }

  await fs.writeFile(path.join(dbDir, "schema.ts"), schemaContent);
};
