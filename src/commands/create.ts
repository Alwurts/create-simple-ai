import path from "node:path";
import pc from "picocolors";
import { setupProject } from "../core/project-setup.js";
import { getAuthChoice } from "../prompts/auth.js";
import { getDatabaseChoice } from "../prompts/database.js";
import { getExampleChoices } from "../prompts/examples.js";
import { getProjectName } from "../prompts/project-name.js";
import type { CLIOptions, ProjectConfig } from "../types.js";
import { logger } from "../utils/logger.js";
import { detectPackageManager } from "../utils/package-manager.js";
import { validateConfig } from "../utils/validation.js";

export async function createCommand(
	projectName?: string,
	options: CLIOptions = {},
) {
	logger.info(pc.magenta("🚀 Creating a new application"));

	try {
		// Gather configuration (interactive or from flags)
		const config = await gatherConfiguration(projectName, options);

		// Validate configuration
		validateConfig(config);

		// Setup project
		await setupProject(config);

		logger.success(pc.green("✅ Project created successfully!"));

		// Show next steps
		showNextSteps(config);
	} catch (error) {
		logger.error("Failed to create project");
		throw error;
	}
}

async function gatherConfiguration(
	projectName?: string,
	options: CLIOptions,
): Promise<ProjectConfig> {
	// Use provided options or get interactively
	const finalProjectName =
		options.yes && projectName
			? projectName
			: await getProjectName(projectName);
	const packageManager =
		options.packageManager || (await detectPackageManager());

	const config: ProjectConfig = {
		projectName: finalProjectName,
		projectDir: path.resolve(process.cwd(), finalProjectName),
		framework: "nextjs", // Fixed for Phase 1
		database:
			options.database || (options.yes ? "sqlite" : await getDatabaseChoice()),
		auth: options.auth || (options.yes ? "better-auth" : await getAuthChoice()),
		examples:
			options.examples || (options.yes ? [] : await getExampleChoices()),
		git: options.git ?? true,
		install: options.install ?? true,
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
