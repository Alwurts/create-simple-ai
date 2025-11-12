import * as p from "@clack/prompts";
import type { Database } from "../types.js";

export async function getDatabaseChoice(): Promise<Database> {
  const database = await p.select({
    message: "What database would you like to use?",
    options: [
      { value: "postgres", label: "PostgreSQL" },
      { value: "sqlite", label: "SQLite" },
    ],
    initialValue: "postgres",
  });

  if (p.isCancel(database)) {
    throw new Error("Operation cancelled");
  }

  return database as Database;
}
