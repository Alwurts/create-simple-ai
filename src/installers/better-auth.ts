import path from "node:path";
import fs from "fs-extra";
import type { Installer } from "../types.js";

export const betterAuthInstaller: Installer = async config => {
  // Create basic auth configuration
  const authDir = path.join(config.projectDir, "lib/auth");
  await fs.ensureDir(authDir);

  const authConfig = `import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/lib/db";
import { users, sessions, accounts, verifications } from "@/lib/db/schema";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "${config.database}",
    schema: {
      user: users,
      session: sessions,
      account: accounts,
      verification: verifications,
    },
  }),
  emailAndPassword: {
    enabled: true,
  },
});
`;

  await fs.writeFile(path.join(authDir, "config.ts"), authConfig);

  // Create API route for auth
  const apiDir = path.join(config.projectDir, "app/api/auth/[...all]");
  await fs.ensureDir(apiDir);

  const routeContent = `import { auth } from "@/lib/auth/config";

export const { GET, POST } = auth.handlers;
`;

  await fs.writeFile(path.join(apiDir, "route.ts"), routeContent);
};
