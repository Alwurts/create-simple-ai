import { installers } from "../installers/index.js";
import { logger } from "../lib/logger.js";
import type { ProjectConfig } from "../types.js";

export async function runInstallers(config: ProjectConfig): Promise<void> {
  // Always run all installers - we're opinionated, everything is included
  const installerNames = [
    "nextjs", // Framework
    "shadcn", // UI components
    "tailwind", // Styling
    "biome", // Linting/formatting
    "hono", // API framework
    "drizzle", // Database ORM
    "better-auth", // Authentication
  ];

  // Run all installers
  for (const installerName of installerNames) {
    if (installers[installerName]) {
      logger.info(`Setting up ${installerName}...`);
      await installers[installerName](config);
    }
  }
}
