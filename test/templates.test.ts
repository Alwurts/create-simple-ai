import { afterAll, beforeAll, describe, it } from "vitest";
import {
  cleanupSmokeDirectory,
  expectFileContains,
  expectSuccess,
  expectSuccessWithProjectDir,
  runTest,
  validateAuthSetup,
} from "./test-utils.js";

describe("Template Generation", () => {
  beforeAll(async () => {
    await cleanupSmokeDirectory();
  });

  afterAll(async () => {
    await cleanupSmokeDirectory();
  });

  it("should generate all required templates", async () => {
    const result = await runTest({
      projectName: "template-test-app",
      yes: true,
      install: false,
      git: false,
    });

    expectSuccess(result);
    const projectDir = expectSuccessWithProjectDir(result);

    // Validate auth templates
    await validateAuthSetup(projectDir);

    // Validate package.json uses dynamic versions
    await expectFileContains(projectDir, "package.json", '"next":');
    await expectFileContains(projectDir, "package.json", '"react":');
    await expectFileContains(projectDir, "package.json", '"better-auth":');

    // Validate tailwind config
    await expectFileContains(projectDir, "tailwind.config.js", "tailwindcss");

    // Validate biome config
    await expectFileContains(projectDir, "biome.json", "biomejs.dev");

    // Validate components.json
    await expectFileContains(projectDir, "components.json", "shadcn.com");
  });
});
