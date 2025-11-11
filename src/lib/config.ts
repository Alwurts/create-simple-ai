import path from "node:path";
import { fileURLToPath } from "node:url";
import type { PackageManager, ProjectConfig } from "../types";

const __filename = fileURLToPath(import.meta.url);
const currentDir = path.dirname(__filename);

// For development (src/), go up one level
// For production (dist/), go up two levels
const isInDist = currentDir.includes("/dist/") || currentDir.endsWith("/dist");
export const PKG_ROOT = path.resolve(currentDir, isInDist ? "../../" : "../");

export const DEFAULT_CLI_CONFIG_BASE: Omit<ProjectConfig, "projectDir"> = {
  projectName: "my-app",
  framework: "nextjs",
  packageManager: "npm",
  database: "postgres",
  auth: "better-auth",
  examples: [],
  git: true,
  install: true,
};

export const CLI_NAME = "create-simple-ai";
export const CLI_DESCRIPTION = "Create simple AI-powered full-stack applications";

export const CLI_VERSION = "0.1.0";

export const TEMPLATES_DIR = "templates";
export const BASE_TEMPLATES_DIR = "templates/base";
export const FRAMEWORK_TEMPLATES_DIR = "templates/frameworks";
export const LIBRARY_TEMPLATES_DIR = "templates/libraries";

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

export const LIBRARY_DEPENDENCIES = {
  nextjs: {
    deps: {
      next: "15.0.0",
      react: "18.0.0",
      "react-dom": "18.0.0",
    },
    devDeps: {
      "@types/react": "18.0.0",
      "@types/react-dom": "18.0.0",
      "@types/node": "24.10.0",
      typescript: "5.9.3",
    },
  },
  shadcn: {
    deps: {
      "class-variance-authority": "0.7.0",
      clsx: "2.0.0",
      "lucide-react": "0.294.0",
      "tailwind-merge": "2.0.0",
      "tailwindcss-animate": "1.0.7",
    },
    devDeps: {
      tailwindcss: "3.4.0",
      autoprefixer: "10.4.16",
      postcss: "8.4.32",
    },
  },
  drizzle: {
    deps: {
      drizzle: "0.29.0",
      "drizzle-kit": "0.20.0",
    },
    devDeps: {},
  },
  "better-auth": {
    deps: {
      "better-auth": "0.2.0",
    },
    devDeps: {},
  },
  hono: {
    deps: {
      hono: "4.0.0",
    },
    devDeps: {},
  },
  biome: {
    devDeps: {
      "@biomejs/biome": "2.3.4",
    },
  },
} as const;
