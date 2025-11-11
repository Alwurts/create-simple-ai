import { afterEach, describe, it } from "vitest";
import {
  cleanupSmokeDirectory,
  expectSuccess,
  expectSuccessWithProjectDir,
  runTest,
  validatePackageJson,
  validateProjectStructure,
} from "./test-utils.js";

describe("Basic Project Creation", () => {
  afterEach(async () => {
    await cleanupSmokeDirectory("default-app");
    await cleanupSmokeDirectory("my-explicit-app");
  });

  it("should create a project with default options", async () => {
    const result = await runTest({
      projectName: "default-app",
      yes: true,
      install: false,
      git: false,
    });

    expectSuccess(result);
    const projectDir = expectSuccessWithProjectDir(result);

    // Validate project structure
    await validateProjectStructure(projectDir);
    await validatePackageJson(projectDir, "default-app", "postgres");
  });

  it("should create a project with explicit name", async () => {
    const result = await runTest({
      projectName: "my-explicit-app",
      yes: true,
      install: false,
      git: false,
    });

    expectSuccess(result);
    const projectDir = expectSuccessWithProjectDir(result);
    await validatePackageJson(projectDir, "my-explicit-app");
  });
});
