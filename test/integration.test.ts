import { afterEach, describe, it } from "vitest";
import { cleanupSmokeDirectory, expectSuccess, runTest } from "./test-utils.js";

describe("Integration Tests", () => {
  afterEach(async () => {
    await cleanupSmokeDirectory("test-app");
    await cleanupSmokeDirectory("git-test-app");
    await cleanupSmokeDirectory("no-git-test-app");
  });

  it("should create a basic project", async () => {
    const result = await runTest({
      projectName: "test-app",
      yes: true,
      install: false,
      git: false,
    });

    expectSuccess(result);
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
