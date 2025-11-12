import { afterEach, describe, it } from "vitest";
import {
  cleanupSmokeDirectory,
  expectFileExists,
  expectSuccess,
  expectSuccessWithProjectDir,
  runTest,
  validatePackageJson,
  validateProjectStructure,
} from "./test-utils.js";
import { readJSON } from "fs-extra";
import path from "node:path";

describe("Basic Project Creation", () => {
  afterEach(async () => {
    await cleanupSmokeDirectory("copied-app");
    await cleanupSmokeDirectory("my-explicit-app");
  });

  it("should copy the vercel template and rename the project in package.json", async () => {
    const result = await runTest({
      projectName: "copied-app",
      yes: true,
      install: false,
      git: false,
    });

    expectSuccess(result);
    const projectDir = expectSuccessWithProjectDir(result);

    // Check if a known file from the template exists
    await expectFileExists(projectDir, "next.config.js");

    // Check if package.json name was updated
    const packageJson = await readJSON(path.join(projectDir, "package.json"));
    expect(packageJson.name).toBe("copied-app");
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
