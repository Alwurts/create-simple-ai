import { describe, it, vi, expect } from "vitest";
import { isInteractive } from "../src/lib/validation.js";

// Mock dependencies
vi.mock("../src/lib/validation.js", () => ({
  isInteractive: vi.fn(),
  validateProjectDirectory: vi.fn(),
}));

vi.mock("../src/core/project-setup.js", () => ({
  setupProject: vi.fn(),
}));

vi.mock("../src/prompts/database.js", () => ({
  getDatabaseChoice: vi.fn(),
}));

vi.mock("../src/prompts/git.js", () => ({
  getGitChoice: vi.fn(),
}));

vi.mock("../src/prompts/project-name.js", () => ({
  getProjectName: vi.fn(),
}));

vi.mock("../src/prompts/install.js", () => ({
  getInstallChoice: vi.fn(),
}));

vi.mock("../src/lib/package-manager.js", () => ({
  detectPackageManager: vi.fn(),
  getPackageManagerCommand: vi.fn(),
}));

import { createCommand } from "../src/commands/create.js";
import { setupProject } from "../src/core/project-setup.js";
import { getDatabaseChoice } from "../src/prompts/database.js";
import { getGitChoice } from "../src/prompts/git.js";
import { getInstallChoice } from "../src/prompts/install.js";
import { getProjectName } from "../src/prompts/project-name.js";
import { detectPackageManager, getPackageManagerCommand } from "../src/lib/package-manager.js";

describe("Create Command", () => {
  const mockSetupProject = vi.mocked(setupProject);
  const mockGetDatabaseChoice = vi.mocked(getDatabaseChoice);
  const mockGetGitChoice = vi.mocked(getGitChoice);
  const mockGetInstallChoice = vi.mocked(getInstallChoice);
  const mockGetProjectName = vi.mocked(getProjectName);
  const mockDetectPackageManager = vi.mocked(detectPackageManager);
  const mockGetPackageManagerCommand = vi.mocked(getPackageManagerCommand);
  const mockIsInteractive = vi.mocked(isInteractive);

  beforeEach(() => {
    vi.clearAllMocks();
    mockSetupProject.mockResolvedValue();
    mockDetectPackageManager.mockResolvedValue("npm");
    mockGetProjectName.mockResolvedValue("test-app");
    mockGetDatabaseChoice.mockResolvedValue("postgres");
    mockGetGitChoice.mockResolvedValue(true);
    mockGetInstallChoice.mockResolvedValue(true);
    mockGetPackageManagerCommand.mockResolvedValue(["npm", "run", "dev"]);
  });

  it("should initialize git by default with --yes", async () => {
    mockIsInteractive.mockReturnValue(true);

    await createCommand("test-app", { yes: true });

    expect(mockSetupProject).toHaveBeenCalledWith(
      expect.objectContaining({
        git: true,
        database: "postgres",
        packageManager: "npm",
      })
    );
  });

  it("should initialize git when explicitly requested", async () => {
    mockIsInteractive.mockReturnValue(true);

    await createCommand("test-app", { git: true });

    expect(mockSetupProject).toHaveBeenCalledWith(
      expect.objectContaining({
        git: true,
      })
    );
  });

  it("should skip git when explicitly disabled", async () => {
    mockIsInteractive.mockReturnValue(true);

    await createCommand("test-app", { git: false });

    expect(mockSetupProject).toHaveBeenCalledWith(
      expect.objectContaining({
        git: false,
      })
    );
  });

  it("should prompt for git in interactive mode when no git option provided", async () => {
    mockIsInteractive.mockReturnValue(true);

    await createCommand("test-app", {});

    expect(mockGetGitChoice).toHaveBeenCalled();
    expect(mockSetupProject).toHaveBeenCalledWith(
      expect.objectContaining({
        git: true, // from mocked getGitChoice
      })
    );
  });

  it("should throw error in non-interactive mode when no git option provided", async () => {
    mockIsInteractive.mockReturnValue(false);

    await expect(createCommand("test-app", { database: "postgres" })).rejects.toThrow(
      "Git initialization must be specified with --git or --no-git when not in interactive mode. Use --yes to use default settings."
    );
  });

  it("should not prompt for git when --yes is provided in non-interactive mode", async () => {
    mockIsInteractive.mockReturnValue(false);

    await createCommand("test-app", { yes: true });

    expect(mockGetGitChoice).not.toHaveBeenCalled();
    expect(mockSetupProject).toHaveBeenCalledWith(
      expect.objectContaining({
        git: true,
        install: true,
      })
    );
  });

  it("should install dependencies by default with --yes", async () => {
    mockIsInteractive.mockReturnValue(true);

    await createCommand("test-app", { yes: true });

    expect(mockSetupProject).toHaveBeenCalledWith(
      expect.objectContaining({
        install: true,
      })
    );
  });

  it("should install dependencies when explicitly requested", async () => {
    mockIsInteractive.mockReturnValue(true);

    await createCommand("test-app", { install: true });

    expect(mockSetupProject).toHaveBeenCalledWith(
      expect.objectContaining({
        install: true,
      })
    );
  });

  it("should skip dependency installation when explicitly disabled", async () => {
    mockIsInteractive.mockReturnValue(true);

    await createCommand("test-app", { install: false });

    expect(mockSetupProject).toHaveBeenCalledWith(
      expect.objectContaining({
        install: false,
      })
    );
  });

  it("should prompt for dependency installation in interactive mode when no install option provided", async () => {
    mockIsInteractive.mockReturnValue(true);

    await createCommand("test-app", {});

    expect(mockGetInstallChoice).toHaveBeenCalled();
    expect(mockSetupProject).toHaveBeenCalledWith(
      expect.objectContaining({
        install: true, // from mocked getInstallChoice
      })
    );
  });

  it("should throw error in non-interactive mode when no install option provided", async () => {
    mockIsInteractive.mockReturnValue(false);

    await expect(createCommand("test-app", { database: "postgres", git: true })).rejects.toThrow(
      "Dependency installation must be specified with --install or --no-install when not in interactive mode. Use --yes to use default settings."
    );
  });

  it("should not prompt for install when --yes is provided in non-interactive mode", async () => {
    mockIsInteractive.mockReturnValue(false);

    await createCommand("test-app", { yes: true });

    expect(mockGetInstallChoice).not.toHaveBeenCalled();
    expect(mockSetupProject).toHaveBeenCalledWith(
      expect.objectContaining({
        install: true,
      })
    );
  });
});
