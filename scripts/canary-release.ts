#!/usr/bin/env node

import { join } from "node:path";
import { confirm, isCancel } from "@clack/prompts";
import { execa } from "execa";
import fs from "fs-extra";
import pc from "picocolors";

const PACKAGE_JSON_PATH = join(process.cwd(), "package.json");

async function getCurrentVersion(): Promise<string> {
	const packageJson = JSON.parse(await fs.readFile(PACKAGE_JSON_PATH, "utf-8"));
	return packageJson.version;
}

async function getCommitHash(): Promise<string> {
	const { stdout } = await execa("git", ["rev-parse", "--short", "HEAD"], {
		stdio: "pipe",
	});
	return stdout.trim();
}

function createCanaryVersion(baseVersion: string, commitHash: string): string {
	// Extract base version (remove any pre-release tags)
	const base = baseVersion.match(/^(\d+\.\d+\.\d+)/)?.[1] || baseVersion;
	return `${base}-canary.${commitHash}`;
}

async function checkVersionExists(version: string): Promise<boolean> {
	try {
		await execa("npm", ["view", `create-simple-ai@${version}`, "version"], {
			stdio: "pipe",
		});
		return true;
	} catch {
		return false;
	}
}

async function main(): Promise<void> {
	const args = process.argv.slice(2);
	const isDryRun = args.includes("--dry-run");
	const autoYes = args.includes("--yes");

	if (isDryRun) {
		console.log(pc.yellow("\n🔍 DRY RUN MODE - No changes will be made\n"));
	}

	try {
		const currentVersion = await getCurrentVersion();
		const commitHash = await getCommitHash();
		const canaryVersion = createCanaryVersion(currentVersion, commitHash);

		console.log(pc.blue(`Current version: ${pc.bold(currentVersion)}`));
		console.log(pc.blue(`Commit hash: ${pc.bold(commitHash)}`));
		console.log(pc.green(`Canary version: ${pc.bold(canaryVersion)}\n`));

		// Check if version already exists
		const versionExists = await checkVersionExists(canaryVersion);
		if (versionExists) {
			console.log(
				pc.red(
					`❌ Version ${canaryVersion} already exists on npm. Make a new commit and try again.`,
				),
			);
			process.exit(1);
		}

		if (isDryRun) {
			console.log(pc.yellow("DRY RUN - Summary of what would happen:\n"));
			console.log(`  1. Update package.json version to ${canaryVersion}`);
			console.log("  2. Build project");
			console.log(`  3. Publish to npm with tag "canary"`);
			console.log("  4. Restore original version in package.json");
			console.log(pc.green("\n✅ Dry-run completed successfully"));
			return;
		}

		if (!autoYes) {
			const proceed = await confirm({
				message: `Publish canary version ${canaryVersion} to npm?`,
				initialValue: true,
			});

			if (isCancel(proceed) || !proceed) {
				console.log(pc.yellow("Canary release cancelled"));
				return;
			}
		}

		// Store original package.json
		const originalPackageJson = await fs.readFile(PACKAGE_JSON_PATH, "utf-8");
		const packageJson = JSON.parse(originalPackageJson);

		try {
			// Update version
			packageJson.version = canaryVersion;
			await fs.writeFile(PACKAGE_JSON_PATH, `${JSON.stringify(packageJson, null, 2)}\n`);

			console.log(pc.blue("\n🔨 Building project...\n"));
			await execa("npm", ["run", "build"], { stdio: "inherit" });

			console.log(pc.blue("\n📤 Publishing to npm (canary tag)...\n"));
			await execa("npm", ["publish", "--access", "public", "--tag", "canary"], {
				stdio: "inherit",
			});

			console.log(pc.green(`\n✅ Successfully published canary version ${canaryVersion}!`));
			console.log(
				pc.blue(
					`\n📦 Published: https://www.npmjs.com/package/create-simple-ai/v/${canaryVersion}`,
				),
			);
			console.log(pc.yellow(`\n💡 Install with: npx create-simple-ai@canary my-app`));
		} finally {
			// Always restore original version
			await fs.writeFile(PACKAGE_JSON_PATH, originalPackageJson);
			console.log(pc.gray("\n✓ Restored original version in package.json"));
		}
	} catch (error) {
		console.error(pc.red("\n❌ Canary release failed:"), error);
		process.exit(1);
	}
}

main().catch(error => {
	console.error(pc.red("Fatal error:"), error);
	process.exit(1);
});
