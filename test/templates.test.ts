import { afterEach, describe, it } from "vitest";
import {
  cleanupSmokeDirectory,
  expectSuccess,
  expectSuccessWithProjectDir,
  runTest,
  validateAuthSetup,
  validatePackageJsonDependencies,
} from "./test-utils.js";

describe("Template Generation", () => {
  afterEach(async () => {
    await cleanupSmokeDirectory("template-test-app");
  });

  it("should generate templates with correct structure", async () => {
    const result = await runTest({
      projectName: "template-test-app",
      yes: true,
      install: false,
      git: false,
    });

    expectSuccess(result);
    const projectDir = expectSuccessWithProjectDir(result);

    // Validate auth setup (files exist)
    await validateAuthSetup(projectDir);

    // Validate package.json has expected dependency categories
    await validatePackageJsonDependencies(projectDir, "postgres");
  });
});
