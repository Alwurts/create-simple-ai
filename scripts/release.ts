#!/usr/bin/env node

import { join } from "node:path";
import { confirm, isCancel, select, text } from "@clack/prompts";
import { execa } from "execa";
import fs from "fs-extra";
import pc from "picocolors";

const PACKAGE_JSON_PATH = join(process.cwd(), "package.json");

interface ReleaseOptions {
  dryRun: boolean;
  skipValidation: boolean;
  version?: string;
}

async function getCurrentVersion(): Promise<string> {
  const packageJson = JSON.parse(await fs.readFile(PACKAGE_JSON_PATH, "utf-8"));
  return packageJson.version;
}

async function getNewVersion(currentVersion: string, options: ReleaseOptions): Promise<string> {
  if (options.version) {
    if (!/^\d+\.\d+\.\d+$/.test(options.version)) {
      throw new Error("Version must be in x.y.z format (e.g., 1.2.3)");
    }
    return options.version;
  }

  const bumpType = await select({
    message: "What type of release do you want to create?",
    options: [
      {
        value: "patch",
        label: `Patch (bug fixes) - ${currentVersion} → ${incrementVersion(currentVersion, "patch")}`,
      },
      {
        value: "minor",
        label: `Minor (new features) - ${currentVersion} → ${incrementVersion(currentVersion, "minor")}`,
      },
      {
        value: "major",
        label: `Major (breaking changes) - ${currentVersion} → ${incrementVersion(currentVersion, "major")}`,
      },
      { value: "custom", label: "Custom version" },
    ],
  });

  if (isCancel(bumpType)) {
    throw new Error("Release cancelled");
  }

  if (bumpType === "custom") {
    const customVersion = await text({
      message: "Enter the version (e.g., 1.2.3):",
      placeholder: "1.2.3",
      validate: value => {
        if (!/^\d+\.\d+\.\d+$/.test(value)) {
          return "Version must be in x.y.z format";
        }
      },
    });

    if (isCancel(customVersion) || typeof customVersion !== "string") {
      throw new Error("Release cancelled");
    }

    return customVersion;
  }

  return incrementVersion(currentVersion, bumpType as "patch" | "minor" | "major");
}

function incrementVersion(version: string, type: "patch" | "minor" | "major"): string {
  const [major, minor, patch] = version.split(".").map(Number);

  switch (type) {
    case "major":
      return `${major + 1}.0.0`;
    case "minor":
      return `${major}.${minor + 1}.0`;
    case "patch":
      return `${major}.${minor}.${patch + 1}`;
  }
}

async function checkPendingChangesets(): Promise<boolean> {
  try {
    const { stdout } = await execa("npx", ["changeset", "status"], {
      stdio: "pipe",
    });
    // If there are pending changesets, status will mention them
    return stdout.includes("No changesets present") === false;
  } catch {
    return false;
  }
}

async function addChangesetIfNeeded(dryRun: boolean): Promise<void> {
  const hasChangesets = await checkPendingChangesets();

  if (!hasChangesets) {
    console.log(pc.yellow("\n⚠ No changesets found. You should add a changeset before releasing."));
    const shouldAdd = await confirm({
      message: "Would you like to add a changeset now?",
      initialValue: true,
    });

    if (isCancel(shouldAdd) || !shouldAdd) {
      throw new Error("Cannot release without changesets. Add one with 'npm run changeset'");
    }

    if (!dryRun) {
      await execa("npx", ["changeset"], { stdio: "inherit" });
    } else {
      console.log(pc.gray("(DRY RUN) Would run: npx changeset"));
    }
  }
}

async function runPreReleaseChecks(dryRun: boolean, skipValidation: boolean): Promise<void> {
  if (skipValidation) {
    console.log(pc.yellow("⚠ Skipping pre-release validation"));
    return;
  }

  console.log(pc.blue("\n🔍 Running pre-release validation...\n"));

  if (dryRun) {
    // In dry-run, we still run checks but don't fail
    try {
      await execa("tsx", ["scripts/pre-release-check.ts", "--dry-run"], {
        stdio: "inherit",
      });
    } catch {
      // Ignore errors in dry-run mode
    }
  } else {
    await execa("tsx", ["scripts/pre-release-check.ts"], {
      stdio: "inherit",
    });
  }
}

async function versionBump(dryRun: boolean): Promise<string> {
  console.log(pc.blue("\n📦 Bumping version with changesets...\n"));

  if (dryRun) {
    console.log(pc.gray("(DRY RUN) Would run: npx changeset version"));
    const currentVersion = await getCurrentVersion();
    console.log(pc.gray(`Current version: ${currentVersion}`));
    return currentVersion;
  }

  await execa("npx", ["changeset", "version"], { stdio: "inherit" });
  return await getCurrentVersion();
}

async function showChangelogPreview(dryRun: boolean): Promise<void> {
  if (dryRun) {
    console.log(pc.gray("\n(DRY RUN) Would show changelog preview"));
    return;
  }

  try {
    const changelogPath = join(process.cwd(), "CHANGELOG.md");
    const changelog = await fs.readFile(changelogPath, "utf-8");
    const firstEntry = changelog.split("\n---\n")[0];

    console.log(pc.blue("\n📝 Changelog preview:\n"));
    console.log(firstEntry);
  } catch {
    console.log(pc.yellow("⚠ Could not read CHANGELOG.md"));
  }
}

async function gitCommitAndTag(version: string, dryRun: boolean): Promise<void> {
  console.log(pc.blue("\n🏷️  Creating git commit and tag...\n"));

  const tag = `v${version}`;
  const commitMessage = `chore(release): ${version}`;

  if (dryRun) {
    console.log(pc.gray(`(DRY RUN) Would run: git add .`));
    console.log(pc.gray(`(DRY RUN) Would run: git commit -m "${commitMessage}"`));
    console.log(pc.gray(`(DRY RUN) Would run: git tag ${tag}`));
    return;
  }

  await execa("git", ["add", "."], { stdio: "inherit" });
  await execa("git", ["commit", "-m", commitMessage], { stdio: "inherit" });
  await execa("git", ["tag", tag], { stdio: "inherit" });
}

async function npmPublish(dryRun: boolean): Promise<void> {
  console.log(pc.blue("\n📤 Publishing to npm...\n"));

  if (dryRun) {
    console.log(pc.gray("(DRY RUN) Would run: npm publish --access public"));
    return;
  }

  const shouldPublish = await confirm({
    message: "Publish to npm?",
    initialValue: true,
  });

  if (isCancel(shouldPublish) || !shouldPublish) {
    console.log(pc.yellow("Skipping npm publish"));
    return;
  }

  await execa("npm", ["publish", "--access", "public"], { stdio: "inherit" });
}

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  const options: ReleaseOptions = {
    dryRun: args.includes("--dry-run"),
    skipValidation: args.includes("--no-validate"),
    version: args.find(arg => !arg.startsWith("--") && /^\d+\.\d+\.\d+$/.test(arg)),
  };

  if (options.dryRun) {
    console.log(pc.yellow("\n🔍 DRY RUN MODE - No changes will be made\n"));
  }

  try {
    const currentVersion = await getCurrentVersion();
    console.log(pc.blue(`Current version: ${pc.bold(currentVersion)}\n`));

    // Check for pending changesets
    await addChangesetIfNeeded(options.dryRun);

    // Run pre-release checks
    await runPreReleaseChecks(options.dryRun, options.skipValidation);

    // Get new version
    const newVersion = await getNewVersion(currentVersion, options);
    console.log(pc.green(`\n✨ Will release version: ${pc.bold(newVersion)}\n`));

    if (options.dryRun) {
      console.log(pc.yellow("DRY RUN - Summary of what would happen:\n"));
      console.log(`  1. Version bump: ${currentVersion} → ${newVersion}`);
      console.log("  2. Generate changelog");
      console.log(`  3. Git commit: "chore(release): ${newVersion}"`);
      console.log(`  4. Git tag: v${newVersion}`);
      console.log("  5. npm publish --access public");
      console.log(pc.green("\n✅ Dry-run completed successfully"));
      return;
    }

    // Confirm release
    const proceed = await confirm({
      message: `Proceed with release ${newVersion}?`,
      initialValue: true,
    });

    if (isCancel(proceed) || !proceed) {
      console.log(pc.yellow("Release cancelled"));
      return;
    }

    // Version bump
    const finalVersion = await versionBump(options.dryRun);

    // Show changelog
    await showChangelogPreview(options.dryRun);

    // Git operations
    await gitCommitAndTag(finalVersion, options.dryRun);

    // Publish to npm
    await npmPublish(options.dryRun);

    console.log(pc.green(`\n✅ Successfully released version ${finalVersion}!`));
    console.log(
      pc.blue(`\n📦 Published: https://www.npmjs.com/package/create-simple-ai/v/${finalVersion}`),
    );
  } catch (error) {
    console.error(pc.red("\n❌ Release failed:"), error);
    process.exit(1);
  }
}

main().catch(error => {
  console.error(pc.red("Fatal error:"), error);
  process.exit(1);
});
