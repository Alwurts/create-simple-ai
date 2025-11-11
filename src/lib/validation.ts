import fs from "fs-extra";
import type { ProjectConfig } from "../types.js";
import { CLIError } from "./error-handler.js";

export async function validateProjectDirectory(config: ProjectConfig): Promise<void> {
  // Check if project directory already exists and is not empty
  if (await fs.pathExists(config.projectDir)) {
    const contents = await fs.readdir(config.projectDir);
    if (contents.length > 0) {
      throw new CLIError(
        `Directory "${config.projectName}" already exists and is not empty. Please choose a different name or remove the directory.`,
      );
    }
  }
}
