#!/usr/bin/env node

import { Command } from "commander";
import { createCommand } from "./commands/create.js";
import { CLI_DESCRIPTION, CLI_NAME, CLI_VERSION } from "./lib/config.js";
import { handleError } from "./lib/error-handler.js";

const program = new Command();

program.name(CLI_NAME).description(CLI_DESCRIPTION).version(CLI_VERSION);

program
  .command("create [project-name]")
  .description("Create a new application")
  .option("-y, --yes", "Skip prompts and use default options", false)
  .option("-d, --database <type>", "Database type (sqlite|postgres|mysql)", "sqlite")
  .option("-a, --auth <provider>", "Authentication provider (better-auth|none)", "better-auth")
  .option("--no-git", "Skip Git initialization", false)
  .option("--no-install", "Skip dependency installation", false)
  .option("-p, --package-manager <manager>", "Package manager (npm|pnpm|bun)", "npm")
  .action(async (projectName, options) => {
    try {
      await createCommand(projectName, options);
    } catch (error) {
      handleError(error);
      process.exit(1);
    }
  });

// Handle unhandled promise rejections
process.on("unhandledRejection", error => {
  handleError(error);
  process.exit(1);
});

// Handle uncaught exceptions
process.on("uncaughtException", error => {
  handleError(error);
  process.exit(1);
});

program.parse();
