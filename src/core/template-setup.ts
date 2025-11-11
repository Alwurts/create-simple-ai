import path from "node:path";
import { PACKAGE_VERSIONS, PKG_ROOT } from "../lib/config.js";
import { processTemplates } from "../lib/template-processor.js";
import type { ProjectConfig, TemplateContext } from "../types.js";

export async function setupBaseTemplates(config: ProjectConfig): Promise<void> {
  // Process base templates (package.json, tsconfig, etc.)
  const baseTemplateDir = path.join(PKG_ROOT, "templates/base");
  const context: TemplateContext = {
    ...config,
    packageManagerCommand: config.packageManager,
    versions: PACKAGE_VERSIONS as Record<string, string>,
  };

  await processTemplates(baseTemplateDir, config.projectDir, context);
}
