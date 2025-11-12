import path from "node:path";
import { fileURLToPath } from "node:url";
import type { PackageManager, ProjectConfig } from "../types";

const __filename = fileURLToPath(import.meta.url);
const currentDir = path.dirname(__filename);

// tsup bundles everything into dist/cli.js, so we need to detect that
// For development (packages/cli/src/lib/), go up four levels to monorepo root
// For production (packages/cli/dist/cli.js bundled), go up two levels to monorepo root
const isBundled = __filename.includes("/dist/cli.js") || currentDir.includes("/dist/cli.js");
// Calculate PKG_ROOT based on where we're running from
export const PKG_ROOT = isBundled
  ? path.resolve(currentDir, "../..") // When bundled in packages/cli/dist/cli.js, go up two levels
  : path.resolve(currentDir, "../../../.."); // When in packages/cli/src/lib/, go up four levels

export const TEMPLATES_DIR = isBundled
  ? path.join(PKG_ROOT, "templates") // Looks for dist/templates
  : path.resolve(PKG_ROOT, "packages/templates"); // Looks for root packages/templates in dev

export const DEFAULT_CLI_CONFIG_BASE: Omit<ProjectConfig, "projectDir"> = {
  projectName: "my-app",
  framework: "nextjs",
  packageManager: "npm",
  git: true,
  install: true,
};

export const CLI_NAME = "create-simple-ai";
export const CLI_DESCRIPTION = "Create simple AI-powered full-stack applications";

export const CLI_VERSION = "0.1.0";

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

