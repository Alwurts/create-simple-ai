import path from "node:path";
import { PACKAGE_VERSIONS, PKG_ROOT } from "../lib/config.js";
import { processTemplate } from "../lib/template-processor.js";
import type { Installer, TemplateContext } from "../types.js";

/**
 * Biome installer - processes Biome config template
 * All file content is defined in templates/config/
 */
export const biomeInstaller: Installer = async config => {
  const configTemplateDir = path.join(PKG_ROOT, "templates/config");
  const context: TemplateContext = {
    ...config,
    packageManagerCommand: config.packageManager,
    versions: PACKAGE_VERSIONS as Record<string, string>,
  };

  // Process biome.json template
  await processTemplate(
    path.join(configTemplateDir, "biome.json.hbs"),
    path.join(config.projectDir, "biome.json"),
    context,
  );
};
