import path from "node:path";
import fs from "fs-extra";
import { PACKAGE_VERSIONS, PKG_ROOT } from "../lib/config.js";
import { processTemplate } from "../lib/template-processor.js";
import type { Installer, TemplateContext } from "../types.js";

/**
 * Drizzle installer - processes Drizzle config and database schema templates
 * All file content is defined in templates/config/ and templates/lib/db/
 * Uses database conditionals to generate database-specific code
 */
export const drizzleInstaller: Installer = async config => {
  const configTemplateDir = path.join(PKG_ROOT, "templates/config");
  const libTemplateDir = path.join(PKG_ROOT, "templates/lib");
  const context: TemplateContext = {
    ...config,
    packageManagerCommand: config.packageManager,
    versions: PACKAGE_VERSIONS as Record<string, string>,
  };

  // Process drizzle.config.ts template (database-specific)
  await processTemplate(
    path.join(configTemplateDir, "drizzle.config.ts.hbs"),
    path.join(config.projectDir, "drizzle.config.ts"),
    context,
  );

  // Ensure lib/db directory exists
  const dbDir = path.join(config.projectDir, "lib/db");
  await fs.ensureDir(dbDir);

  // Process lib/db/schema.ts template (database-specific)
  await processTemplate(
    path.join(libTemplateDir, "db/schema.ts.hbs"),
    path.join(dbDir, "schema.ts"),
    context,
  );

  // Process lib/db/index.ts template (database-specific)
  await processTemplate(
    path.join(libTemplateDir, "db/index.ts.hbs"),
    path.join(dbDir, "index.ts"),
    context,
  );
};
