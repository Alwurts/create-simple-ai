import { rm } from "node:fs/promises";
import { join } from "node:path";
import { pathExists, readFile, readJSON } from "fs-extra";
import { expect } from "vitest";
import { setupProject } from "../src/core/project-setup.js";
import type { CLIOptions } from "../src/types.js";

export interface TestResult {
  success: boolean;
  projectDir?: string;
  error?: string;
  config: TestConfig;
}

export interface TestConfig extends CLIOptions {
  projectName: string;
  expectError?: boolean;
  expectedErrorMessage?: string;
}

/**
 * Clean up the entire .smoke directory
 */
export async function cleanupSmokeDirectory(): Promise<void> {
  const smokeDir = join(process.cwd(), ".smoke");
  try {
    await rm(smokeDir, { recursive: true, force: true });
  } catch {
    // Ignore cleanup errors
  }
}

/**
 * Run a test by calling createCommand directly
 * This is simpler than subprocess execution and tests the actual code
 */
export async function runTest(config: TestConfig): Promise<TestResult> {
  const smokeDir = join(process.cwd(), ".smoke");
  const projectDir = join(smokeDir, config.projectName);

  try {
    // Ensure smoke directory exists
    const { ensureDir } = await import("fs-extra");
    await ensureDir(smokeDir);

    // Create a modified config that uses the smoke directory as the base
    const testConfig = {
      projectName: config.projectName,
      projectDir,
      framework: "nextjs" as const,
      database: config.database || "postgres",
      git: config.git ?? false,
      install: config.install ?? false,
      packageManager: config.packageManager || "npm",
    };

    await setupProject(testConfig);

    // Verify project was created
    const projectExists = await pathExists(projectDir);

    return {
      success: projectExists,
      projectDir: projectExists ? projectDir : undefined,
      config,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
      config,
    };
  }
}

/**
 * Assert that a test result was successful
 */
export function expectSuccess(result: TestResult): void {
  if (!result.success) {
    console.error("Test failed:");
    console.error("Error:", result.error);
  }
  expect(result.success).toBe(true);
  expect(result.projectDir).toBeDefined();
}

/**
 * Assert that a test result was successful and return the project directory
 */
export function expectSuccessWithProjectDir(result: TestResult): string {
  expectSuccess(result);
  expect(result.projectDir).toBeDefined();
  return result.projectDir as string;
}

/**
 * Validate that a file exists in the project
 */
export async function expectFileExists(projectDir: string, filePath: string): Promise<void> {
  const fullPath = join(projectDir, filePath);
  const exists = await pathExists(fullPath);
  expect(exists).toBe(true);
}

/**
 * Validate that a file contains expected content
 */
export async function expectFileContains(
  projectDir: string,
  filePath: string,
  expectedContent: string | RegExp,
): Promise<void> {
  const fullPath = join(projectDir, filePath);
  const content = await readFile(fullPath, "utf-8");

  if (typeof expectedContent === "string") {
    expect(content).toContain(expectedContent);
  } else {
    expect(content).toMatch(expectedContent);
  }
}

/**
 * Validate package.json structure and content
 */
export async function validatePackageJson(
  projectDir: string,
  expectedName: string,
  expectedDatabase?: string,
): Promise<void> {
  const packageJsonPath = join(projectDir, "package.json");
  await expectFileExists(projectDir, "package.json");

  const packageJson = await readJSON(packageJsonPath);

  expect(packageJson.name).toBe(expectedName);
  expect(packageJson.private).toBe(true);
  expect(packageJson.scripts).toBeDefined();
  expect(packageJson.scripts.dev).toBe("next dev");
  expect(packageJson.scripts.build).toBe("next build");

  // Check database-specific dependencies
  if (expectedDatabase === "postgres") {
    expect(packageJson.dependencies).toHaveProperty("pg");
    expect(packageJson.devDependencies).toHaveProperty("@types/pg");
  } else if (expectedDatabase === "mysql") {
    expect(packageJson.dependencies).toHaveProperty("mysql2");
  } else if (expectedDatabase === "sqlite") {
    expect(packageJson.dependencies).toHaveProperty("@libsql/client");
  }
}

/**
 * Validate database configuration files
 */
export async function validateDatabaseConfig(projectDir: string, database: string): Promise<void> {
  // Check drizzle.config.ts
  await expectFileExists(projectDir, "drizzle.config.ts");

  if (database === "postgres") {
    await expectFileContains(projectDir, "drizzle.config.ts", "postgresql");
    await expectFileContains(projectDir, "drizzle.config.ts", "DATABASE_URL");
  } else if (database === "mysql") {
    await expectFileContains(projectDir, "drizzle.config.ts", "mysql");
  } else if (database === "sqlite") {
    await expectFileContains(projectDir, "drizzle.config.ts", "sqlite");
  }

  // Check schema file
  await expectFileExists(projectDir, "lib/db/schema.ts");
  await expectFileExists(projectDir, "lib/db/index.ts");
}

/**
 * Validate auth setup
 */
export async function validateAuthSetup(projectDir: string): Promise<void> {
  await expectFileExists(projectDir, "lib/auth/config.ts");
  await expectFileExists(projectDir, "lib/auth/client.ts");
  await expectFileExists(projectDir, "app/api/auth/[...all]/route.ts");

  // Check auth config imports better-auth
  await expectFileContains(projectDir, "lib/auth/config.ts", "better-auth");
}

/**
 * Validate core project structure
 */
export async function validateProjectStructure(projectDir: string): Promise<void> {
  // Core files
  await expectFileExists(projectDir, "package.json");
  await expectFileExists(projectDir, "tsconfig.json");
  await expectFileExists(projectDir, "README.md");

  // Config files
  await expectFileExists(projectDir, "tailwind.config.js");
  await expectFileExists(projectDir, "postcss.config.js");
  await expectFileExists(projectDir, "biome.json");
  await expectFileExists(projectDir, "components.json");

  // Next.js files
  await expectFileExists(projectDir, "next.config.ts");
  await expectFileExists(projectDir, "app/layout.tsx");
  await expectFileExists(projectDir, "app/page.tsx");
  await expectFileExists(projectDir, "app/globals.css");

  // Library files
  await expectFileExists(projectDir, "lib/utils.ts");
  await expectFileExists(projectDir, "lib/api/index.ts");
}
