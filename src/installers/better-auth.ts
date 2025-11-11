import path from "node:path";
import fs from "fs-extra";
import { PACKAGE_VERSIONS, PKG_ROOT } from "../lib/config.js";
import { processTemplate } from "../lib/template-processor.js";
import type { Installer, TemplateContext } from "../types.js";

/**
 * Better Auth installer - processes auth config and API route templates
 * All file content is defined in templates/lib/auth/ and templates/app/api/
 */
export const betterAuthInstaller: Installer = async config => {
  const libTemplateDir = path.join(PKG_ROOT, "templates/lib");
  const appTemplateDir = path.join(PKG_ROOT, "templates/app");
  const context: TemplateContext = {
    ...config,
    packageManagerCommand: config.packageManager,
    versions: PACKAGE_VERSIONS as Record<string, string>,
  };

  // Ensure lib/auth directory exists
  const authDir = path.join(config.projectDir, "lib/auth");
  await fs.ensureDir(authDir);

  // Process lib/auth/config.ts template
  await processTemplate(
    path.join(libTemplateDir, "auth/config.ts.hbs"),
    path.join(authDir, "config.ts"),
    context,
  );

  // Process lib/auth/client.ts template
  await processTemplate(
    path.join(libTemplateDir, "auth/client.ts.hbs"),
    path.join(authDir, "client.ts"),
    context,
  );

  // Ensure app/api/auth/[...all] directory exists
  const apiDir = path.join(config.projectDir, "app/api/auth/[...all]");
  await fs.ensureDir(apiDir);

  // Process app/api/auth/[...all]/route.ts template
  await processTemplate(
    path.join(appTemplateDir, "api/auth/[...all]/route.ts.hbs"),
    path.join(apiDir, "route.ts"),
    context,
  );
};
