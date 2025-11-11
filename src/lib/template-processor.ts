import path from "node:path";
import fs from "fs-extra";
import Handlebars from "handlebars";
import type { TemplateContext } from "../types.js";

// Register custom helpers
Handlebars.registerHelper("eq", (a, b) => a === b);
Handlebars.registerHelper("includes", (arr, item) => Array.isArray(arr) && arr.includes(item));

// Binary file extensions that shouldn't be processed
const BINARY_EXTENSIONS = new Set([".png", ".ico", ".svg", ".jpg", ".jpeg"]);

export async function processTemplates(
  templateDir: string,
  projectDir: string,
  context: TemplateContext,
): Promise<void> {
  // Check if template directory exists
  if (!(await fs.pathExists(templateDir))) {
    return; // Skip if no templates
  }

  // Get all files in template directory recursively
  const files = await fs.readdir(templateDir, { recursive: true });

  for (const file of files) {
    if (typeof file !== "string") {
      continue;
    }

    const sourcePath = path.join(templateDir, file);
    const stat = await fs.stat(sourcePath);

    if (!stat.isFile()) {
      continue;
    }

    // Calculate destination path
    const relativePath = path.relative(templateDir, sourcePath);
    let destPath = path.join(projectDir, relativePath);

    // Remove .hbs extension for template files
    if (destPath.endsWith(".hbs")) {
      destPath = destPath.slice(0, -4);
    }

    await processTemplate(sourcePath, destPath, context);
  }
}

export async function processTemplate(
  sourcePath: string,
  destPath: string,
  context: TemplateContext,
): Promise<void> {
  const ext = path.extname(sourcePath);

  // Handle binary files
  if (BINARY_EXTENSIONS.has(ext) || !sourcePath.endsWith(".hbs")) {
    await fs.ensureDir(path.dirname(destPath));
    await fs.copy(sourcePath, destPath);
    return;
  }

  // Handle Handlebars templates
  if (sourcePath.endsWith(".hbs")) {
    const templateContent = await fs.readFile(sourcePath, "utf-8");
    const template = Handlebars.compile(templateContent);
    const processedContent = template(context);

    await fs.ensureDir(path.dirname(destPath));
    await fs.writeFile(destPath, processedContent, "utf-8");
  }
}
