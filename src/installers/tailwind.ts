import path from "node:path";
import { PACKAGE_VERSIONS, PKG_ROOT } from "../lib/config.js";
import { processTemplate } from "../lib/template-processor.js";
import type { Installer, TemplateContext } from "../types.js";

/**
 * Tailwind installer - processes Tailwind and PostCSS config templates
 * All file content is defined in templates/config/
 */
export const tailwindInstaller: Installer = async config => {
  const configTemplateDir = path.join(PKG_ROOT, "templates/config");
  const context: TemplateContext = {
    ...config,
    packageManagerCommand: config.packageManager,
    versions: PACKAGE_VERSIONS as Record<string, string>,
  };

  // Process tailwind.config.js template
  await processTemplate(
    path.join(configTemplateDir, "tailwind.config.js.hbs"),
    path.join(config.projectDir, "tailwind.config.js"),
    context,
  );

  // Process postcss.config.js template
  await processTemplate(
    path.join(configTemplateDir, "postcss.config.js.hbs"),
    path.join(config.projectDir, "postcss.config.js"),
    context,
  );
};
