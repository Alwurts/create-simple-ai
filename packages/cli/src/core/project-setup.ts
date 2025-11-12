import fs from "fs-extra";
import path from "node:path";
import { TEMPLATES_DIR } from "../lib/config.js";
import { installDependencies } from "../lib/dependency-installer.js";
import { initializeGit } from "../lib/git.js";
import { logger } from "../lib/logger.js";
import type { ProjectConfig } from "../types.js";

export async function setupProject(config: ProjectConfig): Promise<void> {
  logger.info(`Setting up project: ${config.projectName}`);

  try {
    // 1. Create project directory
    await fs.ensureDir(config.projectDir);

    // 2. Define source and destination
    const templateName = "template-vercel"; // Hardcoded for now
    const templateDir = path.join(TEMPLATES_DIR, templateName);

    // 3. Copy the template project
    logger.info(`Copying starter template from ${templateName}...`);
    await fs.copy(templateDir, config.projectDir);

    // 4. Post-process: Update package.json
    const packageJsonPath = path.join(config.projectDir, "package.json");
    const packageJson = await fs.readJSON(packageJsonPath);
    packageJson.name = config.projectName;
    await fs.writeJSON(packageJsonPath, packageJson, { spaces: 2 });

    // 5. Install dependencies
    if (config.install) {
      await installDependencies(config);
    }

    // 6. Initialize Git repository
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
