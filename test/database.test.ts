import { afterAll, beforeAll, describe, it } from "vitest";
import {
  cleanupSmokeDirectory,
  expectSuccess,
  expectSuccessWithProjectDir,
  runTest,
  validateDatabaseConfig,
  validatePackageJson,
} from "./test-utils.js";

describe("Database Configuration", () => {
  beforeAll(async () => {
    await cleanupSmokeDirectory();
  });

  afterAll(async () => {
    await cleanupSmokeDirectory();
  });

  it("should create a project with PostgreSQL", async () => {
    const result = await runTest({
      projectName: "postgres-app",
      database: "postgres",
      yes: true,
      install: false,
      git: false,
    });

    expectSuccess(result);
    const projectDir = expectSuccessWithProjectDir(result);

    await validatePackageJson(projectDir, "postgres-app", "postgres");
    await validateDatabaseConfig(projectDir, "postgres");
  });

  it("should create a project with MySQL", async () => {
    const result = await runTest({
      projectName: "mysql-app",
      database: "mysql",
      yes: true,
      install: false,
      git: false,
    });

    expectSuccess(result);
    const projectDir = expectSuccessWithProjectDir(result);

    await validatePackageJson(projectDir, "mysql-app", "mysql");
    await validateDatabaseConfig(projectDir, "mysql");
  });

  it("should create a project with SQLite", async () => {
    const result = await runTest({
      projectName: "sqlite-app",
      database: "sqlite",
      yes: true,
      install: false,
      git: false,
    });

    expectSuccess(result);
    const projectDir = expectSuccessWithProjectDir(result);

    await validatePackageJson(projectDir, "sqlite-app", "sqlite");
    await validateDatabaseConfig(projectDir, "sqlite");
  });
});
