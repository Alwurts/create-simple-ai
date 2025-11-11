import path from "node:path";
import fs from "fs-extra";
import { PACKAGE_VERSIONS, PKG_ROOT } from "../lib/config.js";
import { processTemplate } from "../lib/template-processor.js";
import type { Installer, TemplateContext } from "../types.js";

/**
 * Shadcn installer - processes Shadcn config and utils templates
 * All file content is defined in templates/config/ and templates/lib/
 */
export const shadcnInstaller: Installer = async config => {
  const configTemplateDir = path.join(PKG_ROOT, "templates/config");
  const libTemplateDir = path.join(PKG_ROOT, "templates/lib");
  const context: TemplateContext = {
    ...config,
    packageManagerCommand: config.packageManager,
    versions: PACKAGE_VERSIONS as Record<string, string>,
  };

  // Process components.json template
  await processTemplate(
    path.join(configTemplateDir, "components.json.hbs"),
    path.join(config.projectDir, "components.json"),
    context,
  );

  // Process lib/utils.ts template
  await processTemplate(
    path.join(libTemplateDir, "utils.ts.hbs"),
    path.join(config.projectDir, "lib/utils.ts"),
    context,
  );

  // Create components directory
  await fs.ensureDir(path.join(config.projectDir, "components"));
};
