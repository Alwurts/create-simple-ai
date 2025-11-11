import path from "node:path";
import pc from "picocolors";
import { setupProject } from "../core/project-setup.js";
import { logger } from "../lib/logger.js";
import { detectPackageManager } from "../lib/package-manager.js";
import { validateProjectDirectory } from "../lib/validation.js";
import { getAuthChoice } from "../prompts/auth.js";
import { getDatabaseChoice } from "../prompts/database.js";
import { getExampleChoices } from "../prompts/examples.js";
import { getProjectName } from "../prompts/project-name.js";
import type { CLIOptions, ProjectConfig } from "../types.js";
import { ProjectConfigSchema } from "../types.js";

export async function createCommand(projectName?: string, options: CLIOptions = {}) {
  logger.info(pc.magenta("🚀 Creating a new application"));

  try {
    const config = await gatherConfiguration(projectName, options);

    const validatedConfig = ProjectConfigSchema.parse(config);

    await validateProjectDirectory(validatedConfig);

    await setupProject(validatedConfig);

    logger.success(pc.green("✅ Project created successfully!"));

    showNextSteps(validatedConfig);
  } catch (error) {
    logger.error("Failed to create project");
    throw error;
  }
}

async function gatherConfiguration(
  projectName?: string,
  options: CLIOptions = {},
): Promise<ProjectConfig> {
  const finalProjectName =
    options.yes && projectName ? projectName : await getProjectName(projectName);

  const projectDir = path.resolve(process.cwd(), finalProjectName);

  const framework = "nextjs";
  const packageManager = options.packageManager || (await detectPackageManager());

  const database = options.database || (options.yes ? "postgres" : await getDatabaseChoice());

  const auth = options.auth || (options.yes ? "better-auth" : await getAuthChoice());

  const examples = options.examples || (options.yes ? [] : await getExampleChoices());

  const git = options.git ?? true;

  const install = options.install ?? true;

  const config: ProjectConfig = {
    projectName: finalProjectName,
    projectDir,
    framework,
    database,
    auth,
    examples,
    git,
    install,
    packageManager,
  };

  return config;
}

function showNextSteps(config: ProjectConfig): void {
  console.log(`\n${pc.blue("📝 Next steps:")}`);
  console.log(`  cd ${config.projectName}`);

  if (!config.install) {
    console.log(`  ${config.packageManager} install`);
  }

  console.log("  npm run dev  # or your preferred start command");
  console.log(`\n${pc.green("🎉 Happy coding!")}`);
}
