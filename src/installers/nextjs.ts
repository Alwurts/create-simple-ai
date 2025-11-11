import path from "node:path";
import { PACKAGE_VERSIONS, PKG_ROOT } from "../lib/config.js";
import { processTemplates } from "../lib/template-processor.js";
import type { Installer, TemplateContext } from "../types.js";

/**
 * Next.js installer - processes the entire application structure
 * This installer handles the complete application scaffolding including:
 * - Complete src directory structure with components, API routes, database schemas
 * - Authentication pages and protected routes
 * - UI components and providers
 * - Hono API routes and middleware
 * - Database services and types
 */
export const nextjsInstaller: Installer = async config => {
  // Process the complete src directory templates
  const srcTemplateDir = path.join(PKG_ROOT, "templates/src");
  const context: TemplateContext = {
    ...config,
    packageManagerCommand: config.packageManager,
    versions: PACKAGE_VERSIONS as Record<string, string>,
  };
  await processTemplates(srcTemplateDir, config.projectDir, context);
};
