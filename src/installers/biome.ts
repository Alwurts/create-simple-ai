import path from "node:path";
import fs from "fs-extra";
import type { Installer } from "../types.js";

export const biomeInstaller: Installer = async config => {
  // Create biome.json configuration
  const biomeConfig = {
    $schema: "https://biomejs.dev/schemas/2.3.4/schema.json",
    formatter: {
      enabled: true,
      indentStyle: "space",
      indentWidth: 2,
      lineWidth: 100,
    },
    linter: {
      enabled: true,
      rules: {
        recommended: true,
        correctness: {
          noUnusedVariables: "warn",
          noUnusedImports: "warn",
        },
      },
    },
    javascript: {
      formatter: {
        quoteStyle: "single",
        semicolons: "asNeeded",
        trailingCommas: "es5",
      },
    },
  };

  await fs.writeFile(
    path.join(config.projectDir, "biome.json"),
    JSON.stringify(biomeConfig, null, 2),
  );
};
