import { installers } from "../installers/index.js";
import { logger } from "../lib/logger.js";
import type { ProjectConfig } from "../types.js";

export async function runInstallers(config: ProjectConfig): Promise<void> {
  // Run the comprehensive Next.js installer which now handles everything
  // The Next.js installer has been expanded to scaffold the complete application
  logger.info("Setting up Next.js application with full-stack features...");
  await installers.nextjs(config);
}
