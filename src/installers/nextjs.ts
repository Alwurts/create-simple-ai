import path from "node:path";
import { LIBRARY_DEPENDENCIES, PKG_ROOT } from "../lib/config.js";
import { addDependencies } from "../lib/dependency-installer.js";
import { processTemplates } from "../lib/template-processor.js";
import type { Installer } from "../types.js";

export const nextjsInstaller: Installer = async config => {
  // Add Next.js dependencies
  await addDependencies(config.projectDir, config.packageManager, LIBRARY_DEPENDENCIES.nextjs.deps);

  await addDependencies(
    config.projectDir,
    config.packageManager,
    LIBRARY_DEPENDENCIES.nextjs.devDeps,
    true, // dev dependencies
  );

  // Process Next.js templates
  const templateDir = path.join(PKG_ROOT, "templates/frameworks/nextjs");
  await processTemplates(templateDir, config.projectDir, {
    ...config,
    packageManagerCommand: config.packageManager,
  });
};
