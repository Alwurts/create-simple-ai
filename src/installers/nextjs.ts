import path from "node:path";
import { PACKAGE_VERSIONS, PKG_ROOT } from "../lib/config.js";
import { processTemplates } from "../lib/template-processor.js";
import type { Installer, TemplateContext } from "../types.js";

/**
 * Next.js installer - processes Next.js framework templates
 * Dependencies are managed via package.json template, no need to add them here
 * All file content is defined in templates/frameworks/nextjs/
 */
export const nextjsInstaller: Installer = async config => {
  // Process Next.js templates
  const templateDir = path.join(PKG_ROOT, "templates/frameworks/nextjs");
  const context: TemplateContext = {
    ...config,
    packageManagerCommand: config.packageManager,
    versions: PACKAGE_VERSIONS as Record<string, string>,
  };
  await processTemplates(templateDir, config.projectDir, context);
};
