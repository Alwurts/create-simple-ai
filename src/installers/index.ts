import type { Installer } from "../types.js";
import { betterAuthInstaller } from "./better-auth.js";
import { biomeInstaller } from "./biome.js";
import { drizzleInstaller } from "./drizzle.js";
import { honoInstaller } from "./hono.js";
// Import all installers
import { nextjsInstaller } from "./nextjs.js";
import { shadcnInstaller } from "./shadcn.js";
import { tailwindInstaller } from "./tailwind.js";

// Registry of all available installers
export const installers: Record<string, Installer> = {
  nextjs: nextjsInstaller,
  shadcn: shadcnInstaller,
  drizzle: drizzleInstaller,
  "better-auth": betterAuthInstaller,
  hono: honoInstaller,
  biome: biomeInstaller,
  tailwind: tailwindInstaller,
};
