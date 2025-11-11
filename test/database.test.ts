import { afterEach, describe, it } from "vitest";
import {
  cleanupSmokeDirectory,
  expectSuccess,
  expectSuccessWithProjectDir,
  runTest,
  validatePackageJson,
} from "./test-utils.js";

describe("Database Configuration", () => {
  afterEach(async () => {
    await cleanupSmokeDirectory("postgres-app");
    await cleanupSmokeDirectory("mysql-app");
    await cleanupSmokeDirectory("sqlite-app");
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
    // TODO: Add database config validation when drizzle config is implemented
    // await validateDatabaseConfig(projectDir, "postgres");
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
    // TODO: Add database config validation when drizzle config is implemented
    // await validateDatabaseConfig(projectDir, "mysql");
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
    // TODO: Add database config validation when drizzle config is implemented
    // await validateDatabaseConfig(projectDir, "sqlite");
  });
});
