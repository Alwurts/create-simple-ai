import fs from "fs-extra";
import { installDependencies } from "../lib/dependency-installer.js";
import { initializeGit } from "../lib/git.js";
import { logger } from "../lib/logger.js";
import type { ProjectConfig } from "../types.js";
import { runInstallers } from "./installer-runner.js";
import { setupBaseTemplates } from "./template-setup.js";

export async function setupProject(config: ProjectConfig): Promise<void> {
  logger.info(`Setting up project: ${config.projectName}`);

  try {
    // 1. Create project directory
    await fs.ensureDir(config.projectDir);

    // 2. Setup base templates (package.json, tsconfig, etc.)
    await setupBaseTemplates(config);

    // 3. Run library installers (shadcn, drizzle, etc.)
    await runInstallers(config);

    // 4. Install dependencies
    if (config.install) {
      await installDependencies(config);
    }

    // 5. Initialize Git repository
    if (config.git) {
      await initializeGit(config.projectDir);
    }
  } catch (error) {
    // Clean up on failure
    try {
      await fs.remove(config.projectDir);
    } catch {
      // Ignore cleanup errors
    }
    throw error;
  }
}
