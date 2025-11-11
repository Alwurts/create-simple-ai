import path from "node:path";
import fs from "fs-extra";
import { PKG_ROOT } from "../lib/config.js";
import type { Installer } from "../types.js";

export const tailwindInstaller: Installer = async config => {
  // Create tailwind.config.js
  const tailwindConfig = `/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
`;

  await fs.writeFile(path.join(config.projectDir, "tailwind.config.js"), tailwindConfig);

  // Create postcss.config.js
  const postcssConfig = `module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
`;

  await fs.writeFile(path.join(config.projectDir, "postcss.config.js"), postcssConfig);

  // Copy globals.css to src/app if it doesn't exist
  const globalsCssSrc = path.join(PKG_ROOT, "templates/frameworks/nextjs/app/globals.css.hbs");
  const globalsCssDest = path.join(config.projectDir, "app/globals.css");

  if (await fs.pathExists(globalsCssSrc)) {
    // The template processor will handle this, but we need to ensure it exists
    // For now, just create a basic globals.css
    const basicGlobalsCss = `@tailwind base;
@tailwind components;
@tailwind utilities;`;

    await fs.ensureDir(path.dirname(globalsCssDest));
    await fs.writeFile(globalsCssDest, basicGlobalsCss);
  }
};
