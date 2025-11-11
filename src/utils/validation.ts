import fs from 'fs-extra';
import { CLIError } from './error-handler.js';
import type { ProjectConfig } from '../types.js';

export async function validateConfig(config: ProjectConfig): Promise<void> {
  // Check if project directory already exists and is not empty
  if (await fs.pathExists(config.projectDir)) {
    const contents = await fs.readdir(config.projectDir);
    if (contents.length > 0) {
      throw new CLIError(
        `Directory "${config.projectName}" already exists and is not empty. Please choose a different name or remove the directory.`
      );
    }
  }

  // Validate project name
  if (!config.projectName || config.projectName.trim().length === 0) {
    throw new CLIError('Project name cannot be empty');
  }

  // Basic validation for now - can be expanded in Phase 2
  const validDatabases = ['sqlite', 'postgres', 'mysql'];
  if (!validDatabases.includes(config.database)) {
    throw new CLIError(`Invalid database: ${config.database}. Must be one of: ${validDatabases.join(', ')}`);
  }

  const validAuth = ['better-auth', 'none'];
  if (!validAuth.includes(config.auth)) {
    throw new CLIError(`Invalid auth provider: ${config.auth}. Must be one of: ${validAuth.join(', ')}`);
  }
}
