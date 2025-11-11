import path from "node:path";
import { fileURLToPath } from "node:url";
import type { PackageManager, ProjectConfig } from "../types";

const __filename = fileURLToPath(import.meta.url);
const currentDir = path.dirname(__filename);

// tsup bundles everything into dist/cli.js, so we need to detect that
// For development (src/lib/), go up two levels to project root
// For production (dist/cli.js bundled), go up one level to project root
const isBundled = __filename.includes("/dist/cli.js") || currentDir.includes("/dist/cli.js");
// Calculate PKG_ROOT based on where we're running from
export const PKG_ROOT = isBundled
  ? path.resolve(currentDir, "..") // When bundled in dist/cli.js, go up one level
  : path.resolve(currentDir, "../.."); // When in src/lib/ or dist/lib/, go up two levels

export const DEFAULT_CLI_CONFIG_BASE: Omit<ProjectConfig, "projectDir"> = {
  projectName: "my-app",
  framework: "nextjs",
  packageManager: "npm",
  database: "postgres",
  git: true,
  install: true,
};

export const CLI_NAME = "create-simple-ai";
export const CLI_DESCRIPTION = "Create simple AI-powered full-stack applications";

export const CLI_VERSION = "0.1.0";

export const TEMPLATES_DIR = "templates";
export const BASE_TEMPLATES_DIR = "templates/base";
export const FRAMEWORK_TEMPLATES_DIR = "templates/frameworks";

export const PACKAGE_MANAGER_COMMANDS: Record<
  PackageManager,
  {
    install: [string, string[]];
    add: (deps: string[], dev: boolean) => [string, string[]];
    run: (script: string) => [string, string[]];
  }
> = {
  npm: {
    install: ["npm", ["install"]],
    add: (deps, dev = false) => ["npm", ["install", ...(dev ? ["-D"] : []), ...deps]],
    run: script => ["npm", ["run", script]],
  },
  pnpm: {
    install: ["pnpm", ["install"]],
    add: (deps, dev = false) => ["pnpm", ["add", ...(dev ? ["-D"] : []), ...deps]],
    run: script => ["pnpm", ["run", script]],
  },
  bun: {
    install: ["bun", ["install"]],
    add: (deps, dev = false) => ["bun", ["add", ...(dev ? ["-D"] : []), ...deps]],
    run: script => ["bun", ["run", script]],
  },
} as const;

/**
 * Centralized package versions - single source of truth
 * Update versions here to keep all templates in sync
 */
export const PACKAGE_VERSIONS = {
  // Core Next.js
  next: "^15.0.0",
  react: "^18.3.0",
  "react-dom": "^18.3.0",
  "@types/react": "^18.3.0",
  "@types/react-dom": "^18.3.0",
  "@types/node": "^24.10.0",
  typescript: "^5.9.3",

  // UI Components (Shadcn)
  "@radix-ui/react-slot": "^1.0.0",
  "class-variance-authority": "^0.7.0",
  clsx: "^2.0.0",
  "lucide-react": "^0.294.0",
  "tailwind-merge": "^2.0.0",
  "tailwindcss-animate": "^1.0.7",

  // Styling
  tailwindcss: "^3.4.0",
  autoprefixer: "^10.4.16",
  postcss: "^8.4.32",

  // Database (Drizzle)
  "drizzle-orm": "^0.29.0",
  "drizzle-kit": "^0.20.0",
  // Database drivers
  pg: "^8.14.1",
  "@types/pg": "^8.11.11",
  mysql2: "^3.11.0",
  "@libsql/client": "^0.14.0",

  // Auth
  "better-auth": "^0.2.0",

  // API Framework
  hono: "^4.0.0",

  // Tooling
  "@biomejs/biome": "^2.3.4",
} as const;

export type AvailableDependencies = keyof typeof PACKAGE_VERSIONS;
