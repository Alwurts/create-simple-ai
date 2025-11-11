import { installers } from "../installers/index.js";
import { logger } from "../lib/logger.js";
import type { ProjectConfig } from "../types.js";

export async function runInstallers(config: ProjectConfig): Promise<void> {
  // Always run these core installers
  const coreInstallers = [
    "nextjs", // Framework
    "shadcn", // UI components
    "tailwind", // Styling
    "biome", // Linting/formatting
    "hono", // API framework
  ];

  // Add conditional installers
  coreInstallers.push("drizzle"); // Always install since database is always selected

  if (config.auth !== "none") {
    coreInstallers.push("better-auth");
  }

  // Run all installers
  for (const installerName of coreInstallers) {
    if (installers[installerName]) {
      logger.info(`Setting up ${installerName}...`);
      await installers[installerName](config);
    }
  }
}
