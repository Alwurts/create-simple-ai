import { afterEach, describe, it } from "vitest";
import { cleanupSmokeDirectory, expectSuccess, runTest } from "./test-utils.js";

describe("Integration Tests", () => {
  afterEach(async () => {
    await cleanupSmokeDirectory("npm-test-app");
    await cleanupSmokeDirectory("pnpm-test-app");
    await cleanupSmokeDirectory("bun-test-app");
    await cleanupSmokeDirectory("git-test-app");
    await cleanupSmokeDirectory("no-git-test-app");
  });

  it("should work with different package managers", async () => {
    const packageManagers = ["npm", "pnpm", "bun"] as const;

    for (const packageManager of packageManagers) {
      const result = await runTest({
        projectName: `${packageManager}-test-app`,
        packageManager,
        yes: true,
        install: false,
        git: false,
      });

      expectSuccess(result);
    }
  });

  it("should handle git initialization", async () => {
    const result = await runTest({
      projectName: "git-test-app",
      yes: true,
      install: false,
      git: true,
    });

    expectSuccess(result);
  });

  it("should handle no git initialization", async () => {
    const result = await runTest({
      projectName: "no-git-test-app",
      yes: true,
      install: false,
      git: false,
    });

    expectSuccess(result);
  });
});
