import path from "node:path";
import { PKG_ROOT } from "../constants.js";
import type { ProjectConfig, TemplateContext } from "../types.js";
import { processTemplates } from "../utils/template-processor.js";

export async function setupBaseTemplates(config: ProjectConfig): Promise<void> {
	// Process base templates (package.json, tsconfig, etc.)
	const baseTemplateDir = path.join(PKG_ROOT, "templates/base");
	const context: TemplateContext = {
		...config,
		packageManagerCommand: config.packageManager,
		databaseUrl: getDatabaseUrl(config),
	};

	await processTemplates(baseTemplateDir, config.projectDir, context);
}

function getDatabaseUrl(config: ProjectConfig): string {
	switch (config.database) {
		case "sqlite":
			return "file:./dev.db";
		case "postgres":
			return "postgresql://user:password@localhost:5432/dbname";
		case "mysql":
			return "mysql://user:password@localhost:3306/dbname";
		default:
			return "";
	}
}
