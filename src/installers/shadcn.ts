import path from "node:path";
import fs from "fs-extra";
import type { Installer } from "../types.js";

export const shadcnInstaller: Installer = async config => {
  // Create components.json for Shadcn/ui
  const componentsJson = {
    $schema: "https://ui.shadcn.com/schema.json",
    style: "default",
    rsc: true,
    tsx: true,
    tailwind: {
      config: "tailwind.config.js",
      css: "app/globals.css",
      baseColor: "slate",
      cssVariables: true,
      prefix: "",
    },
    aliases: {
      components: "@/components",
      utils: "@/lib/utils",
    },
  };

  await fs.writeFile(
    path.join(config.projectDir, "components.json"),
    JSON.stringify(componentsJson, null, 2),
  );

  // Create basic lib/utils.ts
  const utilsDir = path.join(config.projectDir, "lib");
  await fs.ensureDir(utilsDir);

  const utilsContent = `import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
`;

  await fs.writeFile(path.join(utilsDir, "utils.ts"), utilsContent);

  // Create components directory
  await fs.ensureDir(path.join(config.projectDir, "components"));
};
