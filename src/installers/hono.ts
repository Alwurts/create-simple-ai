import path from "node:path";
import fs from "fs-extra";
import { PACKAGE_VERSIONS, PKG_ROOT } from "../lib/config.js";
import { processTemplate } from "../lib/template-processor.js";
import type { Installer, TemplateContext } from "../types.js";

/**
 * Hono installer - processes Hono API route and utility templates
 * All file content is defined in templates/app/api/ and templates/lib/api/
 */
export const honoInstaller: Installer = async config => {
  const appTemplateDir = path.join(PKG_ROOT, "templates/app");
  const libTemplateDir = path.join(PKG_ROOT, "templates/lib");
  const context: TemplateContext = {
    ...config,
    packageManagerCommand: config.packageManager,
    versions: PACKAGE_VERSIONS as Record<string, string>,
  };

  // Ensure app/api directory exists
  const apiDir = path.join(config.projectDir, "app/api");
  await fs.ensureDir(apiDir);

  // Ensure app/api/hello directory exists
  const helloRouteDir = path.join(apiDir, "hello");
  await fs.ensureDir(helloRouteDir);

  // Process app/api/hello/route.ts template
  await processTemplate(
    path.join(appTemplateDir, "api/hello/route.ts.hbs"),
    path.join(helloRouteDir, "route.ts"),
    context,
  );

  // Ensure lib/api directory exists
  const libApiDir = path.join(config.projectDir, "lib/api");
  await fs.ensureDir(libApiDir);

  // Process lib/api/index.ts template
  await processTemplate(
    path.join(libTemplateDir, "api/index.ts.hbs"),
    path.join(libApiDir, "index.ts"),
    context,
  );
};
