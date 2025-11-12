import { afterEach, describe, it } from "vitest";
import {
  cleanupSmokeDirectory,
  expectSuccessWithProjectDir,
  runTest,
  expectProjectCompiles,
} from "./test-utils.js";

describe("Project Compilation", () => {
  afterEach(async () => {
    await cleanupSmokeDirectory("compilable-app");
    await cleanupSmokeDirectory("compilable-postgres-app");
    await cleanupSmokeDirectory("compilable-sqlite-app");
  });

  it("should create a compilable project with default options", async () => {
    const result = await runTest({
      projectName: "compilable-app",
      yes: true,
      install: true, // Actually install dependencies
      git: false,
    });

    const projectDir = expectSuccessWithProjectDir(result);
    await expectProjectCompiles(projectDir, "postgres");
  }, 120000); // 2 minute timeout

  it("should create compilable projects with all databases", async () => {
    const databases = ["postgres", "sqlite"] as const;

    for (const db of databases) {
      const result = await runTest({
        projectName: `compilable-${db}-app`,
        database: db,
        yes: true,
        install: true,
        git: false,
      });

      const projectDir = expectSuccessWithProjectDir(result);
      await expectProjectCompiles(projectDir, db);
    }
  }, 240000); // 4 minute timeout for the entire test
});
